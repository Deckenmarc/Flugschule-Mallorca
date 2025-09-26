# Flugschule Mallorca Website

Static website for Flugschule Mallorca - Flight training and charter services on Mallorca.

## Project Structure

```
├── src/                    # Source files
│   ├── index.html         # Homepage
│   ├── flugschule/        # Flight training pages
│   ├── charter/           # Charter services pages
│   ├── flotte/            # Fleet information pages
│   └── assets/            # Static assets
│       ├── css/           # Stylesheets
│       ├── js/            # JavaScript files
│       └── images/        # Images and media
├── dist/                  # Built files (generated)
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   The site will be available at http://localhost:3000

### Build for Production
```bash
npm run build
```
Built files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Technology Stack
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Optimization**: PostCSS, Autoprefixer

## Features
- ✅ Static site generation
- ✅ Live reload development server
- ✅ Tailwind CSS integration
- ✅ Multi-page setup
- ✅ Asset optimization
- ✅ Mobile-first responsive design
- ✅ SEO-optimized structure

## Pages
- `/` - Homepage with main content
- `/flugschule/` - Flight training information
- `/charter/` - Charter services
- `/flotte/` - Aircraft fleet information