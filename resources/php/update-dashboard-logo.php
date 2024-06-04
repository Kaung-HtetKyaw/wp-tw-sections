<?php 

function update_dashboard_logo() { ?> 
    <style type="text/css"> 
        body.login div#login h1 a {
            background-image: url(<?= get_template_directory_uri(); ?>/public/images/dashboard-logo.webp);
            padding-bottom: 0px; 
            margin-bottom: 0px;
            height: auto;
            background-size: contain;
            width: 100%;
        } 
    </style>
<?php 
} 

add_action( 'login_enqueue_scripts', 'update_dashboard_logo' );