<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php wp_head(); ?>
</head>

<body <?php body_class( 'bg-white' ); ?>>

<?php do_action( 'tailpress_site_before' ); ?>

<div id="page" class="min-h-screen flex flex-col <?= is_front_page() ? 'main-home' : '' ?>">

	<?php do_action( 'tailpress_header' ); ?>

	<?php do_action('vo_header'); ?>

	<div id="content" class="site-content <?= !is_front_page() ? '' : '' ?>">

		<?php if ( is_front_page() ) { ?>
			<!-- Start introduction -->
			
			<!-- End introduction -->
		<?php } ?>

		<?php do_action( 'tailpress_content_start' ); ?>

		<main>	