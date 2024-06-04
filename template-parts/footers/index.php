<?php 

/**
 * Header Registration 
 */

 include_once(__DIR__ . '/footer-base/register.php');

function render_footer() {
    include_once(__DIR__ . '/footer-base/footer-base.php');
}

add_action('vo_footer', 'render_footer');