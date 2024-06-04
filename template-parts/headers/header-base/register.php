<?php 

function register_header_menus() {
    // Register the header menu locations
    register_nav_menu('primary', __('Primary Menu'));
}

add_action('init', 'register_header_menus');