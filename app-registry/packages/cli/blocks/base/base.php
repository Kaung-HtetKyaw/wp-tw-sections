<?php
/**
 * Base Block template.
 *
 * @param array $block The block settings and attributes.
 */

$text = !empty(get_field('text')) ? get_field('text') : 'Your text here...';

?>

<div class="bg-black text-white">
    <?php echo esc_html($text); ?>

</div>

<?php include_once dirname(__FILE__) . "/test.php" ?>