# Energy Label Calculator - Technical Documentation for AI Agents

## 🏗️ Architecture Overview

This is a React-based WordPress plugin that calculates energy labels for Dutch homes. The application uses a modern component-based architecture with Vite for building and WordPress PHP integration for deployment.

## 📁 Project Structure

```
energy-label-calculator/
├── dist/                           # Build output directory
├── scripts/                        # Build and deployment scripts
│   └── build-wp-plugin.js         # WordPress plugin builder
├── src/                           # Source code
│   ├── components/                # React components
│   │   ├── AdminDashboard.jsx     # WordPress admin dashboard
│   │   ├── DynamicForm.jsx        # Main calculator form
│   │   ├── EnergyLabelTester.js   # Development testing component
│   │   ├── FormFields.jsx         # Form input components
│   │   ├── FormHeader.jsx         # Form header component
│   │   ├── ResultDisplay.jsx      # Results visualization
│   │   └── WordPressAdmin.jsx     # Admin wrapper component
│   ├── data/                      # Static data and configuration
│   │   └── formquestions.json     # Form questions and scoring logic
│   ├── hooks/                     # Custom React hooks
│   ├── styles/                    # SCSS stylesheets
│   │   ├── abstracts/             # Variables, mixins, functions
│   │   ├── components/            # Component-specific styles
│   │   └── main.scss              # Main stylesheet entry point
│   ├── utils/                     # Utility functions
│   │   ├── colorUtils.js          # Color mapping utilities
│   │   ├── energyLabelCalculator.js # Core calculation logic
│   │   └── formUtils.js           # Form handling utilities
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Development entry point
│   ├── wordpress-entry.jsx        # WordPress frontend entry
│   └── wordpress-admin-entry.jsx  # WordPress admin entry
├── wordpress-test/                # Development test environment
├── build-and-copy.sh              # WSL build script
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Frontend build configuration
├── vite.admin.config.js           # Admin build configuration
└── README.md                      # Human-readable documentation
```

## 🔧 Build System

### Vite Configuration
- **Frontend**: `vite.config.js` - Builds main calculator widget
- **Admin**: `vite.admin.config.js` - Builds admin dashboard
- **Output**: IIFE format for WordPress compatibility
- **External Dependencies**: React and ReactDOM loaded from CDN

### Build Scripts
```json
{
  "scripts": {
    "dev": "vite --config vite.config.js",
    "build": "vite build",
    "build:admin": "vite build --config vite.admin.config.js",
    "build:all": "npm run build && npm run build:admin",
    "build:plugin": "npm run build:all && node scripts/build-wp-plugin.js"
  }
}
```

### WordPress Plugin Builder
- **Script**: `scripts/build-wp-plugin.js`
- **Function**: Creates WordPress plugin structure, copies build files, creates ZIP
- **Output**: `dist/energy-label-calculator.zip`
- **Auto-copy**: Automatically copies to Windows OneDrive folder via WSL

## 🧩 Component Architecture

### Core Components

#### DynamicForm.jsx
- **Purpose**: Main calculator form container
- **State Management**: Form responses, calculation state
- **Logic**: Conditional question rendering, form submission
- **Dependencies**: FormFields, ResultDisplay, EnergyLabelTester

#### AdminDashboard.jsx
- **Purpose**: WordPress admin dashboard with statistics
- **Features**: Submission tracking, chart visualization
- **Data**: Mock data (replaceable with WordPress REST API)
- **Charts**: SVG-based line charts with responsive design

#### FormFields.jsx
- **Purpose**: Dynamic form input rendering
- **Supported Types**: text, email, number, select, radio, checkbox
- **Conditional Logic**: Handles showIf dependencies
- **Validation**: Required field handling

#### ResultDisplay.jsx
- **Purpose**: Energy label results visualization
- **Features**: Animated bar charts, smooth transitions
- **Responsive**: Mobile-optimized chart sizing
- **Accessibility**: Color-coded energy labels

### Utility Modules

#### energyLabelCalculator.js
- **Purpose**: Core calculation engine
- **Algorithm**: Multi-factor scoring system
- **Categories**: Base score, insulation, installation, renewable
- **Output**: Energy label (A++++ to G) with detailed breakdown

#### formUtils.js
- **Purpose**: Form initialization and validation
- **Functions**: Default value generation, dependency checking
- **Logic**: Conditional question visibility rules

#### colorUtils.js
- **Purpose**: Consistent color mapping across components
- **Data**: Energy label color definitions
- **Export**: Color functions and label ordering

## 🎨 Styling System

### SCSS Architecture
- **Methodology**: BEM (Block Element Modifier)
- **Structure**: Component-based with shared abstractions
- **Variables**: Centralized color and spacing definitions
- **Responsive**: Mobile-first approach with breakpoints

### Key Style Files
- `_admin-dashboard.scss`: Admin panel styling
- `_result.scss`: Results visualization styles
- `_form.scss`: Form layout and input styling
- `_animations.scss`: Transitions and micro-interactions

## 🔌 WordPress Integration

### Plugin Structure
```php
// Main plugin file: energy-label-calculator.php
- Admin menu integration
- Script and style enqueuing
- Shortcode registration
- AJAX endpoint for form tracking
```

### Entry Points
- **Frontend**: `wordpress-entry.jsx` → `energy-label-calculator.js`
- **Admin**: `wordpress-admin-entry.jsx` → `energy-label-calculator-admin.js`

### Shortcode Usage
```
[energy-label-calculator]
```

## 📊 Data Flow

### Form Submission Process
1. User fills out form → `DynamicForm.jsx`
2. Form data processed → `energyLabelCalculator.js`
3. Results displayed → `ResultDisplay.jsx`
4. Data tracked → WordPress AJAX endpoint

### Admin Dashboard Data
1. Mock data generation → `AdminDashboard.jsx`
2. Chart rendering → SVG-based visualization
3. Statistics display → Real-time metrics

## 🚀 Development Workflow

### Local Development
```bash
npm run dev          # Start development server
# Access at: http://localhost:3000
```

### Building
```bash
npm run build:all   # Build frontend + admin
npm run build:plugin # Build complete WordPress plugin
```

### Testing
- **Frontend**: `wordpress-test/index.html`
- **Components**: Individual component testing in development
- **Integration**: WordPress plugin testing

## 🔒 Security Considerations

### WordPress Integration
- **Nonce Verification**: Implement for AJAX endpoints
- **Capability Checks**: Admin-only dashboard access
- **Input Sanitization**: Form data validation
- **XSS Prevention**: React's built-in protection

### Build Security
- **External Dependencies**: React loaded from CDN
- **Code Minification**: Production builds
- **Source Maps**: Development only

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly form inputs
- Simplified chart layouts
- Optimized spacing and typography

## 🔄 State Management

### React Hooks Usage
- **useState**: Form data, UI state
- **useEffect**: Side effects, data fetching
- **useRef**: DOM references, scroll handling

### State Structure
```javascript
// Form state
const [formResponses, setFormResponses] = useState({})
const [calculationState, setCalculationState] = useState({
  isCalculating: false,
  result: null
})

// Admin state
const [stats, setStats] = useState({})
const [chartData, setChartData] = useState([])
```

## 🧪 Testing Strategy

### Component Testing
- **Unit Tests**: Individual component logic
- **Integration Tests**: Form submission flow
- **Visual Tests**: Chart rendering and animations

### WordPress Testing
- **Plugin Installation**: WordPress compatibility
- **Admin Integration**: Dashboard functionality
- **Frontend Display**: Shortcode rendering

## 🚀 Performance Optimizations

### Build Optimizations
- **Code Splitting**: Separate admin and frontend bundles
- **Tree Shaking**: Remove unused code
- **Minification**: Terser for JavaScript, CSS compression

### Runtime Optimizations
- **Lazy Loading**: Admin dashboard on demand
- **Memoization**: Expensive calculations cached
- **Debouncing**: Form input handling

## 🔧 Configuration

### Environment Variables
- **Development**: Hot reload, source maps
- **Production**: Minified builds, CDN resources

### Build Targets
- **Frontend**: WordPress frontend integration
- **Admin**: WordPress admin panel
- **Development**: Local development server

## 📚 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-transition-group": "^4.4.5"
}
```

### Development Dependencies
```json
{
  "vite": "^4.4.5",
  "@vitejs/plugin-react": "^4.0.3",
  "sass": "^1.83.0",
  "terser": "^5.37.0"
}
```

## 🎯 Future Enhancements

### Planned Features
- **Database Integration**: Real submission tracking
- **Analytics**: Advanced reporting and insights
- **Multi-language**: Internationalization support
- **API Endpoints**: REST API for external integrations

### Technical Improvements
- **TypeScript**: Type safety implementation
- **Testing Framework**: Jest/React Testing Library
- **CI/CD**: Automated deployment pipeline
- **Performance Monitoring**: Real user metrics

---

**Technical Documentation for AI Agents - Energy Label Calculator v1.1.0**
