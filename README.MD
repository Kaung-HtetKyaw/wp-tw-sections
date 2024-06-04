# Installation

- Install the wordpress in [LocalWP](https://localwp.com/) by downloading [this blue print](https://drive.google.com/drive/folders/1yBcV8aBw4QXZFc_x7LEvuW0ANoUlQ5Rc?usp=sharing) and copy it to `~/Library/Application Support/Local/blueprints` (mac) or `%AppData%/Roaming/Local/blueprints` (window). Then, setup the new wordpress website using blueprint. These plugins are included.
  - Advanced Custom Fields PRO - Licensed
  - Advanced Editor Tools 
  - Search & Filter Pro
  - Rank Math SEO with AI Best SEO Tools
  - SVG Support
  - Wordfence Security
  - WP All Import - ACF Add-On
  - WP All Import Pro
  - WP Mail SMTP
  - WP Migrate - Licensed
  - WP Rocket
  - WPForms - Licensed
  - WPForms Multilingual
  - WPML Multilingual CMS
  - WPML String Translation
  - Yoast Duplicate Post

# Development 

1. Fork this Git (use the fork icon under gitlab and create new project).
2. Clone the Git.
3. Start the website in LocalWP
4. Copy `env.sample` to `.env` and replace `WP_URL` 
5. Run `npm install`
6. Run `npm watch`

## Get updates from the `wordpress-tailwind-base-theme` 
1. Follow [this guide](https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html#from-the-command-line) from Gitlab to get update from the fork

## Fix the syntax highlighting in css
1. Place the below code into .vscode/settings.json
```json
{
    "files.associations": {
        "*.css": "tailwindcss"
      }
}
```

# Resusable 

## Libraries
- [SwiperJS](https://swiperjs.com/) for the slider function.
- [AlpineJS@3.13.8](https://alpinejs.dev/) for the reactivity and reusable javascript state & components. 
- [AlpineJS Morph@3.13.8](https://alpinejs.dev/plugins/morph) - morphdom plugin to morph the genereated dom from php, use it in listing pages and other pages.
- [TailwindCSS](tailwindcss.com) 


## PHP 
- `resources/php/generate-breadcrumb.php` to generate the breadcrumbs, it will cover most of the cases.
- `resources/php/disable-wpform-confirmation.php` to disable WPForm confirmation page replacing the form in AJAX.
- `resources/php/share-links.php` to get share link for social media platforms. 
- `resources/php/get-reading-time.php` to get the reading time of the content.
- `resources/php/update-dashboard-logo.php` to update the backend login page's logo.

## Javascript
- `resources/js/directives/header-base.js` register the new directive `x-header` and add `--header-height` css variable to body style and global `header` state. 

# Development 

## Guideline

- [x] All fonts need to use `fluid font style` to ensure the responsive.
- [x] All containers need to calculate using maximum and padding calcuation flow. 
- [x] All styles need to import under app.css in order to work.
- [x] All common styles must be placed in common.css.
- [x] All common script must be placed in common.js.
- [x] All component related css and javascript must be same with component name, for example, if you're writing for header-base.php block, then it should be header-base.js or header-base.css
- [x] All Alpine JS directives must be imported in directives.js to work. 
- [x] All JS except Alpine JS must be imported in app.js to work.
- [x] All vector images should be used .svg extension such as Logo

## Checklist 

- [ ] Update the favicon (ask from designer).
- [ ] Confirm the WPML - language slug with client through PM (Malaysia). 
- [ ] Ready all content before two weeks of deadline by client through PM (Malaysia) including multi language.
- [ ] SEO Meta Title, Description mush be ready before two weeks of deadline.

# Deployment 

## These steps only need to do in first time deployment

1. Setup the wordpress default in the server and configure the database.
2. Install WP Migrate with license key and allow push from it 
3. Push it directly from the most updated LocalWP setup. Please select like below.
   - [x] Database and keep as default
   - [x] Media Folder
   - [ ] Theme (Don't select it, as we will git pull from the server)
   - [x] Plugins
4. After that, please go to `<WODPRESS_DIRECTORY>/wp-content/themes` and git pull your projects
5. Build the CSS and Javascript in your computer and upload to `<WODPRESS_DIRECTORY>/wp-content/themes/<THEME>` 

## Follow these steps for continous updates and deployment 

1. Git pull from `<WODPRESS_DIRECTORY>/wp-content/themes/<THEME>` 
2. Build the CSS and Javascript in your computer and upload to `<WODPRESS_DIRECTORY>/wp-content/themes/<THEME>` 

# Live Checklist

- [ ] All payments must be linked with client accounts. This is the most important step.
- [ ] Under `Settings > Reading` and uncheck `Discourage search engines from indexing this site` 
- [ ] Enable Rank MATH SEO.
- [ ] Update the theme name to be client website name.
- [ ] Update the theme folder client to be client name and reactivate it Dashboard.
- [ ] Replace the screenshot with client logo.
- [ ] Enable `WP Rocket` if there is optimization in Project Quotation.
- [ ] Disable WP Cron Job and enable CPANEL Cron JOB to optimize the website. See [this link](https://support.cpanel.net/hc/en-us/articles/10687844130199-How-to-replace-wp-cron-with-cron-job-without-WP-Toolkit). 
- [ ] Enable `Wordfence` and configure it. 
- [ ] Update the backend login url to be `letadminin`. Can use `WPS Hide Login`. 
- [ ] Update the backend login logo to client logo. Use `resources/php/update-dashboard-logo.php` and change the `background-image`.
- [ ] Configure SMTP to use client email with `WP Mail SMTP` # wp-tw-sections
