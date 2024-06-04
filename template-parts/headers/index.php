<?php 

/**
 * Header Registration 
 * Replace with your own header registration functions
 */

 include_once(__DIR__ . '/header-base/register.php');

function render_header() {
    include_once(__DIR__ . '/header-base/header-base.php');
}

add_action('vo_header', 'render_header');