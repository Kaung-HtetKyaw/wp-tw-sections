<?php 

/**
* Hide Draft Pages from the menu
*/

function filter_draft_pages_from_menu ($items, $args) {
    foreach ($items as $ix => $obj) {
     if (!is_user_logged_in () && 'draft' == get_post_status ($obj->object_id)) {
      unset ($items[$ix]);
     }
    }
    return $items;
}

add_filter ('wp_nav_menu_objects', 'filter_draft_pages_from_menu', 10, 2);