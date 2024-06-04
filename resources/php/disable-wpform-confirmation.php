<?php

/**
 * Use this to disable the confirmation message in WPForms and stop the form to replace the form content with the confirmation message
 * @param None
 * @return None
 */

function disable_wpform_confirmation($result, $form_id, $form_data)
{
    if ( ! empty($result['confirmation']) ) {
      unset($result['confirmation']);
   }
   return $result;
}

add_filter('wpforms_ajax_submit_success_response', 'disable_wpform_confirmation', 10, 3);