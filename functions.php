<?php

/** 
 * Custom Blocks setup.
*/
include get_template_directory() . '/blocks/register.php';
include get_template_directory() . '/template-parts/register.php';
include get_template_directory() . '/resources/php/generate-breadcrumb.php';
include get_template_directory() . '/resources/php/update-dashboard-logo.php';
include get_template_directory() . '/resources/php/share-links.php';

/**
 * Theme setup.
 */
function tailpress_setup() {
	add_theme_support( 'title-tag' );

	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		)
	);

	$logo_options = array(
		'flex-height'          => true,
		'flex-width'           => true,
	);

    add_theme_support( 'custom-logo', $logo_options);
	add_theme_support( 'post-thumbnails' );

	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );

	add_theme_support( 'editor-styles' );
	add_editor_style( 'css/editor-style.css' );
}

add_action( 'after_setup_theme', 'tailpress_setup' );

/**
 * Enqueue theme assets.
 */
function tailpress_enqueue_scripts() {
	$theme = wp_get_theme();

	// WP_ENVIRONMENT_TYPE == 'production'; 
	// if ( wp_get_environment_type() === 'production' ) {
	wp_enqueue_style( 'tailpress', tailpress_asset( 'css/app.css' ), array(), $theme->get( 'Version' ) );
	wp_enqueue_script( 'tailpress', tailpress_asset( 'js/app.js' ), array(), $theme->get( 'Version' ) );
	// } else {
	// 	// Suppport for live reload.
	// 	wp_enqueue_style( 'tailpress','http://localhost:8080/css/app.css', array(), $theme->get( 'Version' ) );
	// 	wp_enqueue_script( 'tailpress', 'http://localhost:8080/js/app.js', array(), $theme->get( 'Version' ));
	// }

}

add_action( 'wp_enqueue_scripts', 'tailpress_enqueue_scripts' );

/**
 * Get asset path.
 *
 * @param string  $path Path to asset.
 *
 * @return string
 */
function tailpress_asset( $path ) {
	if ( wp_get_environment_type() === 'production' ) {
		return get_stylesheet_directory_uri() . '/' . $path;
	}

	return add_query_arg( 'time', time(),  get_stylesheet_directory_uri() . '/' . $path );
}

/**
 * Adds option 'li_class' to 'wp_nav_menu'.
 *
 * @param string  $classes String of classes.
 * @param mixed   $item The current item.
 * @param WP_Term $args Holds the nav menu arguments.
 *
 * @return array
 */
function tailpress_nav_menu_add_li_class( $classes, $item, $args, $depth ) {
	if ( isset( $args->li_class ) ) {
		$classes[] = $args->li_class;
	}

	if ( isset( $args->{"li_class_$depth"} ) ) {
		$classes[] = $args->{"li_class_$depth"};
	}

	return $classes;
}

add_filter( 'nav_menu_css_class', 'tailpress_nav_menu_add_li_class', 10, 4 );

/**
 * Adds option 'submenu_class' to 'wp_nav_menu'.
 *
 * @param string  $classes String of classes.
 * @param mixed   $item The current item.
 * @param WP_Term $args Holds the nav menu arguments.
 *
 * @return array
 */
function tailpress_nav_menu_add_submenu_class( $classes, $args, $depth ) {
	if ( isset( $args->submenu_class ) ) {
		$classes[] = $args->submenu_class;
	}

	if ( isset( $args->{"submenu_class_$depth"} ) ) {
		$classes[] = $args->{"submenu_class_$depth"};
	}

	return $classes;
}

add_filter( 'nav_menu_submenu_css_class', 'tailpress_nav_menu_add_submenu_class', 10, 3 );

/**
 * Add script to header and defer.
 */
function theme_support_alpinejs() {
	wp_enqueue_script( 'alpinejs-directive', get_template_directory_uri() . '/js/directives.js', array(), null, array( 
        'strategy'  => 'defer',
        'in_footer' => false, // Note: This is the default value.
    ));
	wp_enqueue_script( 'alpinejs-morph', get_template_directory_uri() . '/public/js/_alpine-morph.min.js', array(), null, array( 
        'strategy'  => 'defer',
        'in_footer' => false, // Note: This is the default value.
    ));
	wp_enqueue_script( 'alpinejs', get_template_directory_uri() . '/public/js/_alpine.min.js', array(), null, array( 
        'strategy'  => 'defer',
        'in_footer' => false, // Note: This is the default value.
    ));;
}
add_action( 'wp_enqueue_scripts', 'theme_support_alpinejs' );

function theme_support_custom_blocks( $block_categories, $editor_context ) {
    if ( ! empty( $editor_context->post ) ) {
        array_unshift(
            $block_categories,
            array(
                'slug'  => 'vo-custom-blocks',
                'title' => __( 'VO Custom Blocks', 'vo-custom-blocks' ),
                'icon'  => null,
            )
        );
    }
    return $block_categories;
}

add_filter( 'block_categories_all', 'theme_support_custom_blocks', 10, 2 );