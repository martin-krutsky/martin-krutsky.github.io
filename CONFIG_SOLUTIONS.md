# Configuration Solutions and Best Practices

This document outlines the solutions implemented to address content management challenges and improve maintainability of the academic website.

## Problem Statement

The website initially had several issues:
1. **Content Duplication**: Information was duplicated between hardcoded HTML and JSON configuration files
2. **Flash of Unstyled Content (FOUC)**: Content would appear before styling was applied
3. **Maintenance Burden**: Updates required changes in multiple places
4. **Inconsistent Data**: Personal information was scattered across multiple config files

## Solutions Implemented

### 1. Dynamic Content Loading

**Problem**: Content was hardcoded in HTML files, causing maintenance issues and FOUC.

**Solution**: 
- Removed all hardcoded content from HTML files (`index.html`, `talks.html`, `preview.html`, `publications.html`)
- Enhanced JavaScript (`config.js` and `config-hybrid.js`) to load all content dynamically from JSON configs
- Added loading states and error handling to prevent FOUC
- Implemented fallback content for hybrid mode

**Files Modified**:
- `index.html`, `talks.html`, `preview.html`, `publications.html` - Removed hardcoded content
- `assets/js/config.js` - Enhanced with dynamic loading and error handling
- `assets/js/config-hybrid.js` - Added fallback content support

### 2. Centralized Personal Data Management

**Problem**: Personal information (name, email, social links, URLs) was duplicated across multiple config files.

**Solution**:
- Created centralized `config/personal.json` containing all personal info, social links, and navigation links
- Updated `config/site.json` and `config/social.json` to remove duplicated data
- Modified JavaScript files to load and use `personal.json` as the single source of truth

**Benefits**:
- Single point of maintenance for personal information
- Consistent data across all pages
- Reduced risk of inconsistencies

### 3. Enhanced Navigation Structure

**Problem**: Navigation links were hardcoded and not easily maintainable.

**Solution**:
- Added navigation configuration to `config/personal.json`
- Implemented dynamic navigation generation in JavaScript
- Added "Publications" page to navigation alongside existing CV and Talks links

**Navigation Structure**:
```json
{
  "navigation": {
    "links": [
      {
        "text": "CV",
        "url": "assets/files/cv.pdf"
      },
      {
        "text": "Publications", 
        "url": "publications.html"
      },
      {
        "text": "Talks",
        "url": "talks.html"
      }
    ]
  }
}
```

### 4. Publications Page Implementation

**Problem**: Publications were only available on the main page, limiting discoverability.

**Solution**:
- Created dedicated `publications.html` page with modern, responsive design
- Added "Publications" link to navigation
- Maintained publications on main page for visibility
- Implemented consistent styling with talks page

**Features**:
- Responsive publication cards with hover effects
- Publication type badges (Preprint, Thesis, etc.)
- External links with icons (arXiv, thesis files)
- Empty state handling
- Consistent navigation and footer

### 5. Research Area Link Integration

**Problem**: Research areas lacked external links to related resources.

**Solution**:
- Added link configuration to research areas in `config/research.json`
- Implemented JavaScript to dynamically inject links into research area descriptions
- Added "Visit our RAI page" button to hero section
- Made link injection case-insensitive for robustness

**Example Configuration**:
```json
{
  "title": "Responsible AI",
  "description": "Researching more responsible approaches to AI development...",
  "link": {
    "text": "with my colleagues",
    "url": "https://rai.fel.cvut.cz/"
  }
}
```

## Configuration File Structure

### `config/personal.json` (Centralized Personal Data)
```json
{
  "name": "Martin Krutský",
  "title": "AI Researcher",
  "email": "martin.krutsky@fel.cvut.cz",
  "url": "https://martin-krutsky.github.io",
  "social": {
    "github": "https://github.com/martin-krutsky",
    "linkedin": "https://linkedin.com/in/martin-krutsky",
    "scholar": "https://scholar.google.com/citations?user=...",
    "rai": "https://rai.fel.cvut.cz/"
  },
  "navigation": {
    "links": [
      {"text": "CV", "url": "assets/files/cv.pdf"},
      {"text": "Publications", "url": "publications.html"},
      {"text": "Talks", "url": "talks.html"}
    ]
  }
}
```

### `config/site.json` (Site Configuration)
```json
{
  "title": "Martin Krutský - AI Researcher",
  "description": "AI researcher focusing on responsible AI development...",
  "keywords": ["AI", "Machine Learning", "Responsible AI", "Research"]
}
```

### `config/social.json` (Social Media Configuration)
```json
{
  "platforms": [
    {
      "name": "GitHub",
      "url": "https://github.com/martin-krutsky",
      "icon": "fab fa-github"
    }
  ]
}
```

## JavaScript Architecture

### Dynamic Content Loading
- `loadConfig()`: Loads all JSON configuration files
- `populateContent()`: Orchestrates content population across all sections
- Individual update methods for each page section

### Error Handling
- Graceful fallbacks when config files fail to load
- Loading states to prevent FOUC
- Console logging for debugging

### Page-Specific Handling
- `updateTalksPage()`: Handles talks page content
- `updatePublicationsPage()`: Handles publications page content
- Conditional execution based on current page

## Best Practices

### 1. Single Source of Truth
- Personal data centralized in `personal.json`
- No duplication across config files
- Consistent data structure

### 2. Progressive Enhancement
- Fallback content for hybrid mode
- Graceful degradation when JavaScript fails
- Loading states for better UX

### 3. Maintainability
- Clear separation of concerns
- Modular JavaScript architecture
- Well-documented configuration structure

### 4. Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support

## Maintenance Guidelines

### Adding New Publications
1. Edit `config/papers.json`
2. Add publication object with required fields
3. Include appropriate links and metadata

### Updating Personal Information
1. Edit `config/personal.json`
2. All pages will automatically reflect changes
3. No need to update multiple files

### Adding New Pages
1. Create HTML file with empty content sections
2. Add navigation link to `config/personal.json`
3. Implement corresponding update method in JavaScript

### Styling Changes
1. Update `assets/css/style.css` for global styles
2. Add page-specific styles in HTML `<style>` tags
3. Maintain responsive design principles

## Future Enhancements

### Potential Improvements
- Search functionality for publications and talks
- Filtering by year, type, or topic
- Integration with external APIs (Google Scholar, arXiv)
- Blog section for research updates
- Multi-language support

### Performance Optimizations
- Lazy loading for images
- Service worker for offline support
- Image optimization and compression
- CDN integration for static assets

## Conclusion

The implemented solution successfully eliminates content duplication and provides a smooth user experience. The clean HTML approach combined with centralized personal information is recommended for the current GitHub Pages setup, while server-side rendering would be ideal for a production environment.

The new `config/personal.json` file provides a single source of truth for all personal information, making maintenance much easier and reducing the risk of inconsistencies across the website. 