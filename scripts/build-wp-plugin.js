import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import archiver from 'archiver'
import { createWriteStream } from 'fs'

const PLUGIN_NAME = 'energy-label-calculator'
const PLUGIN_DISPLAY_NAME = 'Energy Label Calculator'
const PLUGIN_VERSION = '1.1.0'
const PLUGIN_DESCRIPTION = 'Een React-gebaseerde energielabel calculator voor WordPress met admin dashboard'
const PLUGIN_AUTHOR = 'JPWebCreation - Joris Paardekooper'
const PLUGIN_URI = 'https://jpwebcreation.nl/energy-label-calculator'
const PLUGIN_AUTHOR_URI = 'https://jpwebcreation.nl'

// WordPress plugin header
const pluginHeader = `<?php
/*
Plugin Name: ${PLUGIN_DISPLAY_NAME}
Plugin URI: ${PLUGIN_URI}
Description: ${PLUGIN_DESCRIPTION}
Version: ${PLUGIN_VERSION}
Author: ${PLUGIN_AUTHOR}
Author URI: ${PLUGIN_AUTHOR_URI}
*/

// Prevent direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

// Admin menu setup
function ${PLUGIN_NAME.replace(/-/g, '_')}_admin_menu() {
    add_menu_page(
        'Energielabel Calculator',
        'Energielabel',
        'manage_options',
        '${PLUGIN_NAME}',
        '${PLUGIN_NAME.replace(/-/g, '_')}_admin_page',
        'dashicons-chart-area',
        30
    );
}
add_action('admin_menu', '${PLUGIN_NAME.replace(/-/g, '_')}_admin_menu');

// Admin page content
function ${PLUGIN_NAME.replace(/-/g, '_')}_admin_page() {
    echo '<div class="wrap">';
    echo '<div id="admin-dashboard-container"></div>';
    echo '</div>';
}

// Enqueue admin scripts and styles
function ${PLUGIN_NAME.replace(/-/g, '_')}_admin_enqueue_scripts($hook) {
    if ($hook !== 'toplevel_page_${PLUGIN_NAME}') {
        return;
    }
    
    // Enqueue Google Fonts
    wp_enqueue_style(
        '${PLUGIN_NAME}-google-fonts',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
        [],
        null
    );
    
    // Enqueue production React and ReactDOM
    wp_enqueue_script(
        'react',
        "https://unpkg.com/react@18/umd/react.production.min.js",
        [],
        '18.0.0',
        true
    );
    wp_enqueue_script(
        'react-dom',
        "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        ['react'],
        '18.0.0',
        true
    );
    
    // Enqueue our built files
    wp_enqueue_style(
        '${PLUGIN_NAME}',
        plugins_url('dist/${PLUGIN_NAME}.css', __FILE__),
        ['${PLUGIN_NAME}-google-fonts'],
        '${PLUGIN_VERSION}'
    );
    
    wp_enqueue_style(
        '${PLUGIN_NAME}-admin',
        plugins_url('dist/${PLUGIN_NAME}-admin.css', __FILE__),
        ['${PLUGIN_NAME}-google-fonts'],
        '${PLUGIN_VERSION}'
    );
    
    wp_enqueue_script(
        '${PLUGIN_NAME}-admin',
        plugins_url('dist/${PLUGIN_NAME}-admin.js', __FILE__),
        ['react', 'react-dom'],
        '${PLUGIN_VERSION}',
        true
    );
}
add_action('admin_enqueue_scripts', '${PLUGIN_NAME.replace(/-/g, '_')}_admin_enqueue_scripts');

// Frontend scripts and styles
function ${PLUGIN_NAME.replace(/-/g, '_')}_enqueue_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style(
        '${PLUGIN_NAME}-google-fonts',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
        [],
        null
    );
    
    // Enqueue production React and ReactDOM
    wp_enqueue_script(
        'react',
        "https://unpkg.com/react@18/umd/react.production.min.js",
        [],
        '18.0.0',
        true
    );
    wp_enqueue_script(
        'react-dom',
        "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        ['react'],
        '18.0.0',
        true
    );
    
    // Enqueue our built files
    wp_enqueue_style(
        '${PLUGIN_NAME}',
        plugins_url('dist/${PLUGIN_NAME}.css', __FILE__),
        ['${PLUGIN_NAME}-google-fonts'],
        '${PLUGIN_VERSION}'
    );
    
    wp_enqueue_script(
        '${PLUGIN_NAME}',
        plugins_url('dist/${PLUGIN_NAME}.js', __FILE__),
        ['react', 'react-dom'],
        '${PLUGIN_VERSION}',
        true
    );
}
add_action('wp_enqueue_scripts', '${PLUGIN_NAME.replace(/-/g, '_')}_enqueue_scripts');

// Shortcode for frontend
function ${PLUGIN_NAME.replace(/-/g, '_')}_shortcode($atts = []) {
    $attributes = shortcode_atts([
        'form-data' => ''
    ], $atts);
    
    return sprintf(
        '<div class="${PLUGIN_NAME}-wp-container" data-form-data="%s"></div>',
        esc_attr($attributes['form-data'])
    );
}
add_shortcode('${PLUGIN_NAME}', '${PLUGIN_NAME.replace(/-/g, '_')}_shortcode');

// Create database table on plugin activation
function ${PLUGIN_NAME.replace(/-/g, '_')}_create_tables() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . '${PLUGIN_NAME.replace(/-/g, '_')}_submissions';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        submission_date datetime DEFAULT CURRENT_TIMESTAMP,
        user_ip varchar(45) NOT NULL,
        user_agent text,
        form_data longtext NOT NULL,
        calculated_label varchar(10) NOT NULL,
        calculated_score int(11) NOT NULL,
        PRIMARY KEY (id),
        KEY submission_date (submission_date),
        KEY calculated_label (calculated_label)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, '${PLUGIN_NAME.replace(/-/g, '_')}_create_tables');

// Track form submissions
function ${PLUGIN_NAME.replace(/-/g, '_')}_track_submission() {
    // Verify nonce for security
    if (!wp_verify_nonce($_POST['nonce'], '${PLUGIN_NAME.replace(/-/g, '_')}_form_nonce')) {
        wp_send_json_error(['message' => 'Security check failed']);
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . '${PLUGIN_NAME.replace(/-/g, '_')}_submissions';
    
    // Sanitize and prepare data
    $form_data = wp_kses_post($_POST['form_data']);
    $calculated_label = sanitize_text_field($_POST['calculated_label']);
    $calculated_score = intval($_POST['calculated_score']);
    $user_ip = sanitize_text_field($_SERVER['REMOTE_ADDR']);
    $user_agent = sanitize_text_field($_SERVER['HTTP_USER_AGENT']);
    
    // Insert submission into database
    $result = $wpdb->insert(
        $table_name,
        array(
            'form_data' => $form_data,
            'calculated_label' => $calculated_label,
            'calculated_score' => $calculated_score,
            'user_ip' => $user_ip,
            'user_agent' => $user_agent
        ),
        array('%s', '%s', '%d', '%s', '%s')
    );
    
    if ($result === false) {
        wp_send_json_error(['message' => 'Failed to save submission']);
    }
    
    wp_send_json_success(['message' => 'Submission tracked successfully']);
}
add_action('wp_ajax_${PLUGIN_NAME.replace(/-/g, '_')}_track_submission', '${PLUGIN_NAME.replace(/-/g, '_')}_track_submission');
add_action('wp_ajax_nopriv_${PLUGIN_NAME.replace(/-/g, '_')}_track_submission', '${PLUGIN_NAME.replace(/-/g, '_')}_track_submission');

// Get dashboard statistics
function ${PLUGIN_NAME.replace(/-/g, '_')}_get_dashboard_stats() {
    // Verify user can manage options (admin only)
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Insufficient permissions']);
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . '${PLUGIN_NAME.replace(/-/g, '_')}_submissions';
    
    // Get last week submissions
    $last_week = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    ));
    
    // Get last month submissions
    $last_month = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    ));
    
    // Get last year submissions
    $last_year = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 365 DAY)"
    ));
    
    // Get weekly data for charts
    $weekly_data = $wpdb->get_results($wpdb->prepare(
        "SELECT DATE(submission_date) as date, COUNT(*) as count 
         FROM $table_name 
         WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(submission_date)
         ORDER BY date ASC"
    ));
    
    // Get monthly data for charts
    $monthly_data = $wpdb->get_results($wpdb->prepare(
        "SELECT DATE(submission_date) as date, COUNT(*) as count 
         FROM $table_name 
         WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY DATE(submission_date)
         ORDER BY date ASC"
    ));
    
    wp_send_json_success([
        'stats' => [
            'lastWeek' => intval($last_week),
            'lastMonth' => intval($last_month),
            'lastYear' => intval($last_year)
        ],
        'weeklyData' => $weekly_data,
        'monthlyData' => $monthly_data
    ]);
}
add_action('wp_ajax_${PLUGIN_NAME.replace(/-/g, '_')}_get_dashboard_stats', '${PLUGIN_NAME.replace(/-/g, '_')}_get_dashboard_stats');

// Add nonce to frontend
function ${PLUGIN_NAME.replace(/-/g, '_')}_add_nonce() {
    wp_localize_script('${PLUGIN_NAME}', 'energy_label_calculator_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('${PLUGIN_NAME.replace(/-/g, '_')}_form_nonce')
    ));
}
add_action('wp_enqueue_scripts', '${PLUGIN_NAME.replace(/-/g, '_')}_add_nonce');

// Also localize the admin script with the same object
add_action('admin_enqueue_scripts', function() {
    wp_localize_script('${PLUGIN_NAME}-admin', 'energy_label_calculator_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('${PLUGIN_NAME.replace(/-/g, '_')}_form_nonce')
    ));
});
`

async function buildPlugin() {
    try {
        // 1. Build React app (frontend + admin)
        console.log('Building React application (frontend + admin)...')
        await new Promise((resolve, reject) => {
            exec('npm run build:all', (error, stdout, stderr) => {
                if (error) reject(error)
                else resolve(stdout)
            })
        })

        // 2. Create plugin directory structure
        const pluginDir = path.join('dist', PLUGIN_NAME)
        const distDir = path.join(pluginDir, 'dist')
        await fs.mkdir(distDir, { recursive: true })

        // 3. Write plugin main file
        await fs.writeFile(
            path.join(pluginDir, `${PLUGIN_NAME}.php`),
            pluginHeader
        )

        // 4. Copy build files
        try {
            // Copy main widget files
            await fs.copyFile(
                path.join('dist', 'energy-label-calculator.js'),
                path.join(distDir, 'energy-label-calculator.js')
            )
            
            // Copy CSS if it exists
            try {
                await fs.copyFile(
                    path.join('dist', 'energy-label-calculator.css'),
                    path.join(distDir, 'energy-label-calculator.css')
                )
            } catch (e) {
                console.log('No CSS file found, skipping...')
            }

            // Copy admin dashboard files
            try {
                await fs.copyFile(
                    path.join('dist/admin', 'energy-label-calculator-admin.js'),
                    path.join(distDir, 'energy-label-calculator-admin.js')
                )
                
                // Copy admin CSS if it exists
                try {
                    await fs.copyFile(
                        path.join('dist/admin', 'energy-label-calculator-admin.css'),
                        path.join(distDir, 'energy-label-calculator-admin.css')
                    )
                } catch (cssError) {
                    console.log('No admin CSS file found, skipping...')
                }
            } catch (e) {
                console.log('No admin JS file found, skipping...')
            }
        } catch (e) {
            console.error('Error copying build files:', e)
            throw e
        }

        // 5. Create ZIP file
        console.log('Creating ZIP file...')
        const output = createWriteStream(path.join('dist', `${PLUGIN_NAME}.zip`))
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', async () => {
            console.log('Plugin built successfully!')
            
            // 6. Copy to Windows OneDrive folder (WSL path)
            try {
                const wslWindowsPath = '/mnt/c/Users/Gebruiker/OneDrive/Documents/1_JPWebCreation/devprojects/label calculator'
                const zipSource = path.join('dist', `${PLUGIN_NAME}.zip`)
                const zipDest = path.join(wslWindowsPath, `${PLUGIN_NAME}.zip`)
                
                console.log(`Copying plugin to Windows folder via WSL: ${wslWindowsPath}`)
                
                // Ensure the Windows directory exists
                try {
                    await fs.mkdir(wslWindowsPath, { recursive: true })
                } catch (mkdirError) {
                    console.log('Windows directory already exists or cannot be created')
                }
                
                await fs.copyFile(zipSource, zipDest)
                console.log('Plugin copied to Windows OneDrive folder successfully!')
            } catch (copyError) {
                console.warn('Warning: Could not copy to Windows folder:', copyError.message)
                console.log('You may need to manually copy the plugin from dist/ folder')
                console.log('Windows path: C:\\Users\\Gebruiker\\OneDrive\\Documents\\1_JPWebCreation\\devprojects\\label calculator')
            }
        })

        archive.on('error', (err) => {
            throw err
        })

        archive.pipe(output)
        archive.directory(pluginDir, PLUGIN_NAME)
        await archive.finalize()

    } catch (error) {
        console.error('Build failed:', error)
        process.exit(1)
    }
}

buildPlugin() 