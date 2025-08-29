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
    echo '<div id="${PLUGIN_NAME}-admin-container"></div>';
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
    
    wp_enqueue_script(
        '${PLUGIN_NAME}-admin',
        plugins_url('dist/${PLUGIN_NAME}-admin.js', __FILE__),
        ['react', 'react-dom'],
        '${PLUGIN_NAME}-${PLUGIN_VERSION}',
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

// Track form submissions
function ${PLUGIN_NAME.replace(/-/g, '_')}_track_submission() {
    // In a real implementation, you would save this to the database
    // For now, we'll just log it
    error_log('Energy Label Calculator form submitted at ' . current_time('mysql'));
    
    wp_send_json_success(['message' => 'Submission tracked']);
}
add_action('wp_ajax_${PLUGIN_NAME}_track_submission', '${PLUGIN_NAME.replace(/-/g, '_')}_track_submission');
add_action('wp_ajax_nopriv_${PLUGIN_NAME}_track_submission', '${PLUGIN_NAME.replace(/-/g, '_')}_track_submission');
`

async function buildPlugin() {
    try {
        // 1. Build React app
        console.log('Building React application...')
        await new Promise((resolve, reject) => {
            exec('npm run build', (error, stdout, stderr) => {
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
                path.join('dist', 'wordpress-widget.js'),
                path.join(distDir, 'wordpress-widget.js')
            )
            
            // Copy CSS if it exists
            try {
                await fs.copyFile(
                    path.join('dist', 'wordpress-widget.css'),
                    path.join(distDir, 'wordpress-widget.css')
                )
            } catch (e) {
                console.log('No CSS file found, skipping...')
            }

            // Copy admin dashboard files
            try {
                await fs.copyFile(
                    path.join('dist', 'wordpress-widget-admin.js'),
                    path.join(distDir, 'wordpress-widget-admin.js')
                )
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

        output.on('close', () => {
            console.log('Plugin built successfully!')
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