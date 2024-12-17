import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import archiver from 'archiver'
import { createWriteStream } from 'fs'

const PLUGIN_NAME = 'wordpress-widget'
const PLUGIN_DISPLAY_NAME = 'WordPress Widget'
const PLUGIN_VERSION = '1.0.0'
const PLUGIN_DESCRIPTION = 'A React-based widget for WordPress'
const PLUGIN_AUTHOR = 'Your Name'
const PLUGIN_URI = 'https://your-site.com/wordpress-widget'
const PLUGIN_AUTHOR_URI = 'https://your-site.com'

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

function ${PLUGIN_NAME.replace(/-/g, '_')}_enqueue_scripts() {
    $suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';
    
    // Enqueue production React and ReactDOM
    wp_enqueue_script(
        'react',
        "https://unpkg.com/react@18/umd/react.production{$suffix}.js",
        [],
        '18.0.0',
        true
    );
    wp_enqueue_script(
        'react-dom',
        "https://unpkg.com/react-dom@18/umd/react-dom.production{$suffix}.js",
        ['react'],
        '18.0.0',
        true
    );
    
    // Add production mode flag
    wp_script_add_data('react', 'data-react-mode', 'production');
    
    // Enqueue our built files
    wp_enqueue_style(
        '${PLUGIN_NAME}',
        plugins_url('dist/${PLUGIN_NAME}.css', __FILE__),
        [],
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

function ${PLUGIN_NAME.replace(/-/g, '_')}_shortcode($atts = []) {
    $attributes = shortcode_atts([
        'theme' => 'light'
    ], $atts);
    
    return sprintf(
        '<div class="${PLUGIN_NAME}-wp-container" data-theme="%s"></div>',
        esc_attr($attributes['theme'])
    );
}
add_shortcode('${PLUGIN_NAME.replace(/-/g, '_')}', '${PLUGIN_NAME.replace(/-/g, '_')}_shortcode');
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
            await fs.copyFile(
                path.join('dist', 'wordpress-widget.js'),
                path.join(distDir, 'wordpress-widget.js')
            )
            
            // Only copy CSS if it exists
            try {
                await fs.copyFile(
                    path.join('dist', 'wordpress-widget.css'),
                    path.join(distDir, 'wordpress-widget.css')
                )
            } catch (e) {
                console.log('No CSS file found, skipping...')
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