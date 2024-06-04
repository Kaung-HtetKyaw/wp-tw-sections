<?php 

function register_footer_menus() {
	// Register the footer menu location
    register_nav_menu('footer', __('Footer Menu'));
}

add_action('init', 'register_footer_menus');


function register_widgets() {
	// Register footer widgets location example, we won't use this most of the time
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'project_name' ),
		'id'            => 'sidebar-1',
		'before_widget' => '',
		'after_widget'  => '',
		'before_title'  => '',
		'after_title'   => '',
	));
}

add_action( 'widgets_init', 'register_widgets' );