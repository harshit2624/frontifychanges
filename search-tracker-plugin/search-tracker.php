<?php
/**
 * Plugin Name: Search Tracker
 * Description: Tracks user searches and clicks on search results.
 * Version: 1.0
 * Author: Gemini
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Create the custom database table on plugin activation
function st_create_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'search_tracker';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        search_query text NOT NULL,
        clicked_item_id mediumint(9) NULL,
        item_type VARCHAR(255) NULL,
        timestamp datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'st_create_table');

// Register the REST API endpoint
function st_register_rest_route() {
    register_rest_route('search-tracker/v1', '/track', array(
        'methods' => 'POST',
        'callback' => 'st_track_search',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'st_register_rest_route');

// Callback function to handle the tracking data
function st_track_search($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'search_tracker';

    $data = $request->get_json_params();

    $wpdb->insert($table_name, array(
        'search_query' => sanitize_text_field($data['search_query']),
        'clicked_item_id' => isset($data['clicked_item_id']) ? intval($data['clicked_item_id']) : null,
        'item_type' => isset($data['item_type']) ? sanitize_text_field($data['item_type']) : null,
        'timestamp' => current_time('mysql'),
    ));

    return new WP_REST_Response('Data tracked successfully', 200);
}

// Add the admin menu page
function st_add_admin_menu() {
    add_menu_page(
        'Search Tracker',
        'Search Tracker',
        'manage_options',
        'search-tracker',
        'st_admin_page_content',
        'dashicons-search',
        20
    );
}
add_action('admin_menu', 'st_add_admin_menu');

// Content for the admin page
function st_admin_page_content() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'search_tracker';
    $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY timestamp DESC");

    ?>
    <div class="wrap">
        <h1>Search Tracker Data</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Search Query</th>
                    <th>Clicked Item ID</th>
                    <th>Item Type</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($results) : ?>
                    <?php foreach ($results as $row) : ?>
                        <tr>
                            <td><?php echo esc_html($row->id); ?></td>
                            <td><?php echo esc_html($row->search_query); ?></td>
                            <td><?php echo esc_html($row->clicked_item_id); ?></td>
                            <td><?php echo esc_html($row->item_type); ?></td>
                            <td><?php echo esc_html($row->timestamp); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr>
                        <td colspan="5">No data found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}
