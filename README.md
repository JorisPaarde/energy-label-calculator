# Widget WordPress Plugin

A React-based widget that can be embedded into WordPress sites. This project uses Vite for development and builds a WordPress-compatible plugin.

## 🚀 Features

- React-based widget
- WordPress plugin integration
- Multiple instances per page
- Theme support (light/dark)
- Development environment with HMR
- Production-ready build system

## 📋 Prerequisites

- Node.js >= 14.16
- npm or yarn
- WordPress installation (for plugin deployment)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wordpress-widget.git
   cd wordpress-widget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 💻 Development

Start the development server:
```bash
npm run dev
```

This will:
- Start Vite development server
- Open the test environment at http://localhost:3000/wordpress-test/index.html
- Enable Hot Module Replacement (HMR)
- Show multiple calculator instances with different themes

## 🏗️ Building

Build the WordPress plugin:
```bash
npm run build:plugin
```

This creates:
- Production-ready JavaScript bundle
- WordPress plugin files
- ZIP file ready for WordPress installation in `dist/wordpress-widget.zip`

## 🔌 WordPress Integration

1. Install the plugin:
   - Go to WordPress admin panel
   - Navigate to Plugins > Add New > Upload Plugin
   - Upload `dist/wordpress-widget.zip`
   - Activate the plugin

2. Use the calculator:
   ```php
   [wordpress_widget theme="light"]
   ```

   Or with PHP:
   ```php
   <?php echo do_shortcode('[wordpress_widget theme="dark"]'); ?>
   ```

## 📁 Project Structure

```
wordpress-widget/
├── dist/                     # Build output
├── scripts/
│   └── build-wp-plugin.js    # WordPress plugin builder
├── src/
│   ├── components/           # React components
│   ├── App.jsx              # Main component
│   ├── main.jsx             # Dev entry point
│   └── wordpress-entry.jsx  # WordPress entry
├── wordpress-test/          # Test environment
└── vite.config.js           # Build configuration
```

## ⚙️ Configuration

- `vite.config.js`: Build and development settings
- `scripts/build-wp-plugin.js`: WordPress plugin configuration
- `wordpress-test/index.html`: Test environment setup

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run build:plugin`: Create WordPress plugin
- `npm run preview`: Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Joris Paardekooper - Initial work - [YourGithub](https://github.com/JorisPaarde)

## 🙏 Acknowledgments

- React team for the amazing framework
- WordPress community
- Vite team for the build tooling