<?php 

/**
 * Generate breadcrumbs from a menu
 * Use `build_breadcrumbs_from_menu('breadcrumb_menu')` to generate breadcrumbs
 * @param string $menu_location The menu location to generate breadcrumbs from 
 * @param int $current_menu_id The page ID to generate breadcrumbs from
 * @return html the breadcrumbs 
 */

function get_current_page_menu_item_id($menu_location, $current_menu_id = null) {
    $locations = get_nav_menu_locations();
    $menu = wp_get_nav_menu_object($locations[$menu_location]);

    $get_object_id = $current_menu_id ? $current_menu_id : get_queried_object_id();
    
    if (!$menu) return false;

    $menu_items = wp_get_nav_menu_items($menu->term_id);

    foreach ($menu_items as $menu_item) {
        if ($menu_item->object_id == $get_object_id) {
            return $menu_item->ID;
        }
    }
    return false;
}

function build_breadcrumbs_from_menu($menu_location, $current_menu_id = null) {
    $current_menu_item_id = get_current_page_menu_item_id($menu_location, $current_menu_id);
    $currnet_url = get_permalink(get_the_ID());
    $home_id = get_option('page_on_front');
    $home_title = get_the_title($home_id);
    $home_url = get_home_url();

    $breadcrumbs = array();

    while ($current_menu_item_id) {
        $post = get_post($current_menu_item_id);
        $menu_item = wp_setup_nav_menu_item($post);
      

        if (!$menu_item) break;

        $class = $menu_item->url== $currnet_url ? 'active': 'unactive';

        // $breadcrumbs[] = '<a href="' . esc_url($menu_item->url) . '">' . esc_html($menu_item->title) . '</a>';
        array_push($breadcrumbs, '<li class="breadcrumb-list"><a class="page-link ' . $class . '" href="' . esc_url($menu_item->url) . '">' . esc_html($menu_item->title) . '</a></li>');

        $current_menu_item_id = $menu_item->menu_item_parent;
    }

    array_push($breadcrumbs, '<li class="breadcrumb-list"><a class="page-link" href="' . esc_url($home_url) . '">' . esc_html($home_title) . '</a></li>');

    $breadcrumbs = array_reverse($breadcrumbs); // Reverse the breadcrumbs to get the correct order
    // $breadcrumbs[] = '<span>' . get_the_title() . '</span>'; // Add current page title without a link
    // array_push($breadcrumbs, '<span>' . get_the_title() . '</span>');


    echo implode('', $breadcrumbs); // Output the breadcrumbs
}


function register_breadcrumbs_menu() {
    register_nav_menu('breadcrumb_menu', __('Breadcrumbs Menu'));
}

add_action('init', 'register_breadcrumbs_menu');
