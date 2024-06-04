<?php 

/**
 * Share Links
 * Example: ShareLinks::get_tumblr_share_link("/abc", "abc", "abc")
*/

class ShareLinks {
    public static function get_facebook_share_link($url) {
        return "https://www.facebook.com/sharer/sharer.php?u=" . $url;
    }

    public static function get_twitter_share_link($url, $text) {
        return "https://twitter.com/intent/tweet?url=" . $url . "&text=" . $text;
    }

    public static function get_linkedin_share_link($url, $title, $summary, $source) {
        return "https://www.linkedin.com/shareArticle?url=" . $url . "&title=" . $title . "&summary=" . $summary . "&source=" . $source;
    }

    public static function get_pinterest_share_link($url, $media, $description) {
        return "https://pinterest.com/pin/create/button/?url=" . $url . "&media=" . $media . "&description=" . $description;
    }

    public static function get_reddit_share_link($url, $title) {
        return "https://www.reddit.com/submit?url=" . $url . "&title=" . $title;
    }

    public static function get_tumblr_share_link($url, $name, $description) {
        return "https://www.tumblr.com/widgets/share/tool?canonicalUrl=" . $url . "&title=" . $name . "&caption=" . $description;
    }

    public static function get_whatsapp_share_link($url, $text) {
        return "https://api.whatsapp.com/send?text=" . $text . " " . $url;
    }

    public static function get_telegram_share_link($url, $text) {
        return "https://t.me/share/url?url=" . $url . "&text=" . $text;
    }

    public static function get_email_share_link($url, $subject, $body) {
        return "mailto:?subject=" . $subject . "&body=" . $body . " " . $url;
    }

    public static function get_wechat_mobile_share_link($url, $text) {
       return "weixin://dl/chat?url=" . $url;
    }
    
    public static function get_weibo_share_link($url, $title) {
        return "http://service.weibo.com/share/share.php?url=" . $url . "&title=" . $title;
    }
}