<?php

/**
 * Plugin Name: WordPress Vue Router
 * Author: Shoive Hossain
 * Version: 1.0
 * Description: A demo of using Vue and Vue Router in WordPress.
 */

// Add a new admin menu item
add_action('admin_menu', 'wp_vue_add_admin_menu');

function wp_vue_add_admin_menu() {
    add_menu_page(
        'Vue Function Control', // Page title
        'Vue Control', // Menu title
        'manage_options', // Capability
        'wp-vue-admin', // Menu slug
        'wp_vue_render_app' // Function to display the Vue app
    );
    
    add_submenu_page(
        'wp-vue-admin', // Parent slug
        'Course Control', // Page title
        'Course Control', // Submenu title
        'manage_options', // Capability
        'admin.php?page=wp-vue-admin#/course-control', // Submenu slug with Vue route
        null // No need to define a function as Vue will handle this
    );
}

// Function to display the admin page
function wp_vue_render_app()
{
    echo "
    <div id='divWpVue' class='p-8 bg-gray-100 min-h-screen'>
        <div class='w-full'>
            <div class='relative right-0'>
                <ul class='relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100' data-tabs='tabs' role='list'>
                    <li class='z-30 flex-auto text-center'>
                        <router-link to='/' class='z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer text-slate-600 bg-inherit'
                         exact-active-class='bg-blue-500 text-white' role='tab' aria-selected='true'>
                            Blog Titles
                        </router-link>
                    </li>
                    <li class='z-30 flex-auto text-center'>
                        <router-link to='/contents' class='z-30 flex items-center justify-center w-full px-0 py-2 mb-0 text-sm transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-600 bg-inherit'
                        exact-active-class='bg-blue-500 text-white' role='tab' aria-selected='false'>
                            Blog Contents
                        </router-link>
                    </li>
                    <li class='z-30 flex-auto text-center'>
                        <router-link to='/offerForm' class='z-30 flex items-center justify-center w-full px-0 py-2 mb-0 text-sm transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-600 bg-inherit'
                        exact-active-class='bg-blue-500 text-white' role='tab' aria-selected='false'>
                            Offer Forms
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div class='bg-white shadow-lg rounded-lg p-6 mt-6'>
            <router-view></router-view>
        </div>
    </div>";
}

// Enqueue Vue scripts
function func_load_vuescripts($hook)
{
    // Load scripts only on the Vue admin page
    if ($hook !== 'toplevel_page_wp-vue-admin' && $hook !== 'wp-vue_page_wp-vue-course-control') {
        return;
    }

    // Register Vue.js
    wp_register_script('wpvue_vuejs', 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js', [], null, true);

    // Register Vue Router
    wp_register_script('wpvue_router', 'https://unpkg.com/vue-router@3/dist/vue-router.js', ['wpvue_vuejs'], null, true);

    // Register Tailwind CSS via CDN
    wp_register_style('tailwindcss', 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

    // Register custom Vue code
    wp_register_script('my_vuecode', plugin_dir_url(__FILE__) . 'vuecode.js', ['wpvue_vuejs', 'wpvue_router'], null, true);

    wp_enqueue_script('my-vue-app', plugin_dir_url(__FILE__) . 'vuecode.js', array('vue', 'wp-api', 'wp-media'), '1.0', true);

    // Enqueue the media uploader
    wp_enqueue_media();

    // Localize script to pass REST API details
    wp_localize_script('my_vuecode', 'wpApiSettings', [
        'root'  => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    ]);

    // Pass the nonce for REST API authentication
    wp_localize_script('my-vue-app', 'wpApiSettings', array(
        'root' => esc_url(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    ));

    // Enqueue styels & scripts
    wp_enqueue_style('tailwindcss');
    wp_enqueue_script('wpvue_vuejs');
    wp_enqueue_script('wpvue_router');
    wp_enqueue_script('my_vuecode');
}
add_action('admin_enqueue_scripts', 'func_load_vuescripts');





// Register the REST API endpoint to save options
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/my_options', array(
        'methods' => 'POST',
        'callback' => 'save_my_options',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
});

// Callback function to save options
function save_my_options(WP_REST_Request $request)
{
    $title = sanitize_text_field($request->get_param('title'));
    $image_url = esc_url_raw($request->get_param('image_url'));

    // Save the options based on which parameters are sent
    if ($title) {
        update_option('my_title_option', $title);
    }
    if ($image_url) {
        update_option('my_image_url_option', $image_url);
    }

    return new WP_REST_Response('Options saved successfully', 200);
}
