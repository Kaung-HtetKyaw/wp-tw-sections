<?php 

/**
 * Get Reading Time
 * 
 * @param string $post_content
 * @return string
 */

function get_reading_time($post_content) {
	$wordcount = str_word_count( strip_tags( $post_content ) ); 
	$time = ceil($wordcount / 200); 
	
	$label = "";

	// $label = " Minutes Reading Time"; 
		
	// if ($time == 1) { //grammar conversion
	//     $label = " minute";
	// } else {
	//     $label = " minutes";
	// }
	
	$totalString = $time . $label; 
	return $totalString;        
}
