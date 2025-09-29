<?php
/**
 * Plugin Name: Mailercart
 * Description: Sends a reminder email to logged-in users who have abandoned their cart.
 * Version: 2.7
 * Author: Gemini
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Mailercart {

    private static $instance;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        add_action('rest_api_init', [$this, 'register_rest_endpoint']);
        add_action('wp_loaded', [$this, 'poor_mans_cron']);
        add_action('woocommerce_new_order', [$this, 'on_new_order'], 10, 1);
        add_action('phpmailer_init', [$this, 'configure_smtp']);

        if (is_admin()) {
            new Mailercart_Admin();
        }
    }

    public function activate() {
        $this->create_activity_log_table();
    }

    public function deactivate() {
        // No need to clear the cron event anymore
    }

    public function create_activity_log_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mailercart_activity';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            activity_time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            status varchar(20) DEFAULT 'active' NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public function register_rest_endpoint() {
        register_rest_route('mailercart/v1', '/activity', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_activity_ping'],
            'permission_callback' => 'is_user_logged_in',
        ]);
    }

    public function handle_activity_ping() {
        global $wpdb;
        $user_id = get_current_user_id();
        if ($user_id) {
            update_user_meta($user_id, '_last_cart_activity', time());
            delete_user_meta($user_id, '_mailercart_reminder_sent');

            $table_name = $wpdb->prefix . 'mailercart_activity';
            $wpdb->insert($table_name, [
                'user_id' => $user_id,
                'activity_time' => current_time('mysql'),
                'status' => 'active',
            ]);

            return new WP_REST_Response(['status' => 'success'], 200);
        }
        return new WP_REST_Response(['status' => 'error', 'message' => 'User not logged in'], 401);
    }

    public function poor_mans_cron() {
        $last_run = get_option('_mailercart_last_cron_run', 0);
        if ((time() - $last_run) > 60) { // 1 minute
            $this->check_abandoned_carts();
            update_option('_mailercart_last_cron_run', time());
        }
    }

    public function check_abandoned_carts() {
        $users = get_users([
            'meta_key' => '_last_cart_activity',
            'meta_compare' => 'EXISTS',
        ]);

        foreach ($users as $user) {
            $last_activity = get_user_meta($user->ID, '_last_cart_activity', true);
            $reminder_sent = get_user_meta($user->ID, '_mailercart_reminder_sent', true);

            if ($last_activity && !$reminder_sent && (time() - $last_activity > 120)) {
                $this->send_reminder_email($user);
            }
        }
    }

    public function send_reminder_email($user) {
        global $wpdb;
        $email_settings = get_option('mailercart_email_settings');
        $subject = $email_settings['subject'] ?? 'You left something in your cart!';
        $body = $email_settings['body'] ?? 'Hi {customer_name},<br><br>You left some items in your shopping cart. Click here to complete your purchase: <a href="{cart_link}">{cart_link}</a>';

        $cart_url = wc_get_page_permalink('cart');
        $body = str_replace('{customer_name}', $user->display_name, $body);
        $body = str_replace('{cart_link}', $cart_url, $body);

        $to = $user->user_email;
        $headers = ['Content-Type: text/html; charset=UTF-8'];

        $sent = wp_mail($to, $subject, $body, $headers);

        if ($sent) {
            update_user_meta($user->ID, '_mailercart_reminder_sent', true);
            $table_name = $wpdb->prefix . 'mailercart_activity';
            $wpdb->update($table_name, ['status' => 'reminder_sent'], ['user_id' => $user->ID, 'status' => 'active']);
        }
    }

    public function on_new_order($order_id) {
        global $wpdb;
        $order = wc_get_order($order_id);
        if (!$order) return;
        $user_id = $order->get_user_id();
        if ($user_id) {
            delete_user_meta($user_id, '_last_cart_activity');
            delete_user_meta($user_id, '_mailercart_reminder_sent');

            $table_name = $wpdb->prefix . 'mailercart_activity';
            $wpdb->update($table_name, ['status' => 'ordered'], ['user_id' => $user_id, 'status' => 'active']);
        }
    }

    public function configure_smtp($phpmailer) {
        $options = get_option('mailercart_smtp_settings');
        if (empty($options['smtp_host']) || empty($options['smtp_user'])) return;

        $phpmailer->isSMTP();
        $phpmailer->Host = $options['smtp_host'];
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = $options['smtp_port'] ?? 587;
        $phpmailer->Username = $options['smtp_user'];
        $phpmailer->Password = $options['smtp_pass'];
        $phpmailer->SMTPSecure = $options['smtp_encryption'] ?? 'tls';
        $phpmailer->From = $options['from_email'];
        $phpmailer->FromName = $options['from_name'];
    }
}

class Mailercart_Admin {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'settings_init']);
        add_action('admin_post_send_test_email', [$this, 'handle_send_test_email']);
        add_action('admin_post_manual_check', [$this, 'handle_manual_check']);
    }

    public function add_admin_menu() {
        add_menu_page('Mailercart', 'Mailercart', 'manage_options', 'mailercart', [$this, 'settings_page_html'], 'dashicons-cart');
    }

    public function settings_init() {
        register_setting('mailercart_smtp_settings', 'mailercart_smtp_settings');
        register_setting('mailercart_email_settings', 'mailercart_email_settings');

        add_settings_section('mailercart_smtp_section', 'SMTP Settings', null, 'mailercart_smtp_settings');
        add_settings_field('smtp_host', 'SMTP Host', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'smtp_host', 'type' => 'text', 'group' => 'mailercart_smtp_settings']);
        add_settings_field('smtp_port', 'SMTP Port', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'smtp_port', 'type' => 'number', 'group' => 'mailercart_smtp_settings']);
        add_settings_field('smtp_user', 'SMTP Username', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'smtp_user', 'type' => 'text', 'group' => 'mailercart_smtp_settings']);
        add_settings_field('smtp_pass', 'SMTP Password', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'smtp_pass', 'type' => 'password', 'group' => 'mailercart_smtp_settings']);
        add_settings_field('smtp_encryption', 'Encryption', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'smtp_encryption', 'type' => 'select', 'options' => ['none' => 'None', 'tls' => 'TLS', 'ssl' => 'SSL'], 'group' => 'mailercart_smtp_settings']);
        add_settings_field('from_email', 'From Email', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'from_email', 'type' => 'email', 'group' => 'mailercart_smtp_settings']);
        add_settings_field('from_name', 'From Name', [$this, 'render_settings_field'], 'mailercart_smtp_settings', 'mailercart_smtp_section', ['name' => 'from_name', 'type' => 'text', 'group' => 'mailercart_smtp_settings']);

        add_settings_section('mailercart_email_section', 'Email Template', null, 'mailercart_email_settings');
        add_settings_field('subject', 'Subject', [$this, 'render_settings_field'], 'mailercart_email_settings', 'mailercart_email_section', ['name' => 'subject', 'type' => 'text', 'group' => 'mailercart_email_settings']);
        add_settings_field('body', 'Body', [$this, 'render_settings_field'], 'mailercart_email_settings', 'mailercart_email_section', ['name' => 'body', 'type' => 'textarea', 'group' => 'mailercart_email_settings']);
    }

    public function render_settings_field($args) {
        $group = $args['group'];
        $options = get_option($group);
        $name = $args['name'];
        $type = $args['type'] ?? 'text';
        $value = $options[$name] ?? '';

        if ($type === 'textarea') {
            echo "<textarea id='$name' name='{$group}[$name]' rows='10' cols='50' class='large-text'>" . esc_textarea($value) . "</textarea>";
            echo "<p class='description'>You can use the following placeholders: <code>{customer_name}</code>, <code>{cart_link}</code></p>";
        } elseif ($type === 'select') {
            echo "<select id='$name' name='{$group}[$name]'>";
            foreach ($args['options'] as $val => $label) {
                echo "<option value='$val' " . selected($value, $val, false) . ">$label</option>";
            }
            echo "</select>";
        } else {
            echo "<input type='$type' id='$name' name='{$group}[$name]' value='" . esc_attr($value) . "' class='regular-text' />";
        }
    }

    public function settings_page_html() {
        if (!current_user_can('manage_options')) return;
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <?php settings_errors(); ?>
            <?php $active_tab = $_GET['tab'] ?? 'settings'; ?>
            <h2 class="nav-tab-wrapper">
                <a href="?page=mailercart&tab=settings" class="nav-tab <?php echo $active_tab == 'settings' ? 'nav-tab-active' : ''; ?>">Settings</a>
                <a href="?page=mailercart&tab=email" class="nav-tab <?php echo $active_tab == 'email' ? 'nav-tab-active' : ''; ?>">Email Template</a>
                <a href="?page=mailercart&tab=activity_log" class="nav-tab <?php echo $active_tab == 'activity_log' ? 'nav-tab-active' : ''; ?>">Activity Log</a>
            </h2>
            <form action="options.php" method="post">
                <?php
                if ($active_tab == 'email') {
                    settings_fields('mailercart_email_settings');
                    do_settings_sections('mailercart_email_settings');
                } else {
                    settings_fields('mailercart_smtp_settings');
                    do_settings_sections('mailercart_smtp_settings');
                }
                submit_button('Save Settings');
                ?>
            </form>
            <?php if ($active_tab == 'settings') : ?>
                <hr />
                <h2>Send a Test Email</h2>
                <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                    <input type="hidden" name="action" value="send_test_email">
                    <?php wp_nonce_field('send_test_email'); ?>
                    <?php submit_button('Send Test Email'); ?>
                </form>
                <hr />
                <h2>Manual Abandoned Cart Check</h2>
                <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                    <input type="hidden" name="action" value="manual_check">
                    <?php wp_nonce_field('manual_check'); ?>
                    <?php submit_button('Run Manual Check'); ?>
                </form>
            <?php endif; ?>
            <?php if ($active_tab == 'activity_log') : ?>
                <h2>Frontend Activity Log</h2>
                <?php $this->display_activity_log(); ?>
            <?php endif; ?>
        </div>
        <?php
    }

    public function handle_send_test_email() {
        if (!current_user_can('manage_options') || !check_admin_referer('send_test_email')) wp_die('Unauthorized user');
        $to = wp_get_current_user()->user_email;
        $subject = 'Test Email from Mailercart';
        $message = 'This is a test email to confirm your SMTP settings are correct.';
        $sent = wp_mail($to, $subject, $message);
        add_settings_error('mailercart_settings', 'test_email', $sent ? 'Test email sent successfully!' : 'Failed to send test email.', $sent ? 'success' : 'error');
        wp_redirect(admin_url('admin.php?page=mailercart&tab=settings'));
        exit;
    }

    public function handle_manual_check() {
        if (!current_user_can('manage_options') || !check_admin_referer('manual_check')) wp_die('Unauthorized user');
        Mailercart::get_instance()->check_abandoned_carts();
        add_settings_error('mailercart_settings', 'manual_check', 'Manual abandoned cart check has been run.', 'info');
        wp_redirect(admin_url('admin.php?page=mailercart&tab=settings'));
        exit;
    }

    public function display_activity_log() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'mailercart_activity';
        $activities = $wpdb->get_results("SELECT * FROM $table_name ORDER BY activity_time DESC LIMIT 100");

        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th>User</th><th>Email</th><th>Activity Time</th><th>Status</th></tr></thead>';
        echo '<tbody>';
        if ($activities) {
            foreach ($activities as $activity) {
                $user_info = get_userdata($activity->user_id);
                $display_name = $user_info ? $user_info->display_name : 'Unknown User';
                $email = $user_info ? $user_info->user_email : 'N/A';
                echo '<tr>';
                echo '<td>' . esc_html($display_name) . ' (' . esc_html($activity->user_id) . ')</td>';
                echo '<td>' . esc_html($email) . '</td>';
                echo '<td>' . esc_html($activity->activity_time) . '</td>';
                echo '<td>' . esc_html($activity->status) . '</td>';
                echo '</tr>';
            }
        } else {
            echo '<tr><td colspan="4">No activity logged yet.</td></tr>';
        }
        echo '</tbody>';
        echo '</table>';
    }
}

Mailercart::get_instance();
