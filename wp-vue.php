<?php

/**
 * Plugin Name: WordPress Vue Router
 * Description: A demo of using Vue and Vue Router in WordPress.
 */

// Add a new admin menu item
function func_wp_vue_admin_menu()
{
    add_menu_page(
        'Vue Page',                  // Page title
        'Vue Page',                  // Menu title
        'manage_options',            // Capability
        'wp-vue-admin',              // Menu slug
        'func_wp_vue_admin_page',    // Function to display the admin page
        'dashicons-admin-site',      // Icon
        6                            // Position
    );
}
add_action('admin_menu', 'func_wp_vue_admin_menu');

// Function to display the admin page
function func_wp_vue_admin_page()
{
    echo "<div id='divWpVue'>
            <nav>
                <router-link to='/'>Blog Titles</router-link> |
                <router-link to='/contents'>Blog Contents</router-link>
            </nav>
            <router-view></router-view>
          </div>";
}

// Enqueue Vue scripts
function func_load_vuescripts($hook)
{
    // Load scripts only on the Vue admin page
    if ($hook !== 'toplevel_page_wp-vue-admin') {
        return;
    }

    // Register Vue.js
    wp_register_script('wpvue_vuejs', 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js', [], null, true);

    // Register Vue Router
    wp_register_script('wpvue_router', 'https://unpkg.com/vue-router@3/dist/vue-router.js', ['wpvue_vuejs'], null, true);

    // Register custom Vue code
    wp_register_script('my_vuecode', plugin_dir_url(__FILE__) . 'vuecode.js', ['wpvue_vuejs', 'wpvue_router'], null, true);

    // Localize script to pass REST API details
    wp_localize_script('my_vuecode', 'wpApiSettings', [
        'root'  => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    ]);

    // Enqueue scripts
    wp_enqueue_script('wpvue_vuejs');
    wp_enqueue_script('wpvue_router');
    wp_enqueue_script('my_vuecode');
}
add_action('admin_enqueue_scripts', 'func_load_vuescripts');
