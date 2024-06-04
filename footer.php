  <?php
  $page_slug = null;
  if(is_page()) {
    global $post;
    $page_slug = $post->post_name;
  }

    if($page_slug && ($page_slug == "incoming-student")) {
  ?>
    </div>
  <?php } ?>
</main>

<?php do_action( 'tailpress_content_end' ); ?>

</div>

<?php do_action( 'tailpress_content_after' ); ?>

<?php do_action('vo_footer'); ?>

</div>

<?php wp_footer(); ?>

</body>
</html>
