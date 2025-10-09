# Energy Label Calculator - WordPress Plugin

A modern React-based WordPress plugin for calculating energy labels (energielabels) for Dutch homes. Features a beautiful frontend calculator and comprehensive admin dashboard with submission statistics.

## 🏠 Features

### Frontend Calculator
- **Interactive Form**: Multi-step energy label calculation form
- **Smart Logic**: Conditional questions based on housing type
- **Real-time Results**: Instant energy label calculation with visual charts
- **Responsive Design**: Works perfectly on all devices
- **Dutch Language**: Fully localized for Dutch users

### Admin Dashboard
- **Submission Statistics**: Track form submissions over time
- **Visual Charts**: Weekly and monthly usage graphs
- **Performance Metrics**: Last week, month, and year statistics
- **WordPress Integration**: Seamless admin panel integration

## 🚀 Quick Start

### Prerequisites
- Node.js 14.16 or higher
- npm or yarn
- WordPress 5.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-label-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development mode**
   ```bash
   npm run dev
   ```
   Opens at: http://localhost:3000

4. **Build for production**
   ```bash
   npm run build:plugin
   ```

## 📦 Building the WordPress Plugin

### Automatic Build & Copy
```bash
# Build and automatically copy to Windows OneDrive folder
./build-and-copy.sh
```

### Manual Build Steps
```bash
# Build frontend and admin versions
npm run build:all

# Build WordPress plugin
npm run build:plugin

# Build admin dashboard only
npm run build:admin
```

### Build Output
The build process creates:
- `dist/energy-label-calculator.js` - Frontend calculator
- `dist/energy-label-calculator.css` - Frontend styles
- `dist/energy-label-calculator-admin.js` - Admin dashboard
- `dist/energy-label-calculator.zip` - WordPress plugin package

## 🔌 WordPress Installation

1. **Upload the plugin**
   - Upload `energy-label-calculator.zip` via WordPress admin
   - Or extract and upload via FTP to `/wp-content/plugins/`

2. **Activate the plugin**
   - Go to WordPress Admin → Plugins
   - Activate "Energy Label Calculator"

3. **Access the dashboard**
   - New "Energielabel" menu item appears in admin
   - View submission statistics and charts

4. **Use the shortcode**
   ```
   [energy-label-calculator]
   ```

## 🎨 Customization

### Form Questions
Edit `src/data/formquestions.json` to modify:
- Question text and order
- Answer options and scoring
- Conditional logic
- Metadata and categories

### Styling
- **Main styles**: `src/styles/main.scss`
- **Component styles**: `src/styles/components/`
- **Admin dashboard**: `src/styles/components/_admin-dashboard.scss`

### Components
- **Frontend**: `src/components/DynamicForm.jsx`
- **Admin**: `src/components/AdminDashboard.jsx`
- **Results**: `src/components/ResultDisplay.jsx`

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── styles/             # SCSS stylesheets
├── utils/              # Utility functions
├── data/               # Form configuration
├── wordpress-entry.jsx # Frontend entry point
└── wordpress-admin-entry.jsx # Admin entry point
```

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Build frontend
- `npm run build:admin` - Build admin dashboard
- `npm run build:all` - Build both versions
- `npm run build:plugin` - Build complete WordPress plugin
- `npm run preview` - Preview production build

### Technology Stack
- **Frontend**: React 18, Vite, SCSS
- **Build**: Vite, Rollup
- **WordPress**: PHP integration, REST API
- **Charts**: SVG-based custom charts

## 📊 Admin Dashboard Features

### Statistics Cards
- **Last Week**: Recent submission count
- **Last Month**: Monthly submission total
- **Last Year**: Annual submission summary

### Usage Charts
- **Weekly Chart**: Daily submissions for the past week
- **Monthly Chart**: Daily submissions for the past month
- **Interactive**: Hover effects and responsive design

### Data Management
- **Submission Tracking**: Automatic form submission logging
- **Performance Metrics**: Real-time statistics
- **Export Ready**: Data prepared for external analysis

## 🌐 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License
This project is proprietary software developed by JPWebCreation - Joris Paardekooper.

## 🤝 Support
For support and questions:
- **Developer**: Joris Paardekooper
- **Company**: JPWebCreation
- **Website**: [jpwebcreation.nl](https://jpwebcreation.nl)

## 🔄 Version History
- **v1.1.0** - Added admin dashboard, improved styling, updated branding
- **v1.0.0** - Initial release with basic calculator functionality

---

**Built with ❤️ by JPWebCreation - Joris Paardekooper**