<!DOCTYPE html>
<html <?php language_attributes(); ?>>

	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta name="viewport" content="width=device-width">
		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

		<?php wp_head(); ?>
	</head>

	<body <?php body_class('bg-white'); ?>>

		<?php do_action('tailpress_site_before'); ?>

		<div id="page" class="">

			<?php do_action('tailpress_header'); ?>

			<?php do_action('vo_header'); ?>

			<div id="content" class="site-content mt-[var(--header-height)]">

				<?php do_action('tailpress_content_start'); ?>

				<main>
					404 not found
				</main>

				<?php do_action('tailpress_content_end'); ?>

			</div>

			<?php do_action('tailpress_content_after'); ?>

			<?php do_action('vo_footer'); ?>

		</div>

		<?php wp_footer(); ?>

	</body>

</html>