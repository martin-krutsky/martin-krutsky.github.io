# Martin Krutský - AI Research Website

This is a personal academic website for Martin Krutský, a PhD student in AI at the Czech Technical University in Prague. The website is designed to be compatible with GitHub Pages and showcases research areas, publications, talks, and professional information.

## ✨ Key Features

- **Modular Configuration**: Each section has its own configuration file for easy management
- **Modern Design**: Clean, responsive design with gradient backgrounds and smooth animations
- **Research Focus**: Dedicated sections for AI research areas including:
  - Personal AI Projects
  - Neurosymbolic Interpretability
  - Responsible AI
- **Publications Section**: Showcase of research papers and academic publications
- **Talks & Presentations**: Collection of presentations and workshops
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **GitHub Pages Compatible**: Ready to deploy on GitHub Pages

## 📁 Website Structure

```
martin-krutsky.github.io/
├── index.html              # Main homepage
├── talks.html              # Talks and presentations page
├── config/                 # 🆕 Modular configuration files
│   ├── site.json          # Site settings and personal info
│   ├── research.json      # Research areas
│   ├── papers.json        # Publications and papers
│   ├── talks.json         # Talks and presentations
│   └── social.json        # Social media links
├── assets/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── config.js      # JavaScript for dynamic content
│   ├── files/
│   │   └── cv.pdf         # CV in PDF format
│   └── images/
│       └── profile-cropped.jpg  # Profile image placeholder
├── preview.html           # Original preview file
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## ⚙️ Modular Configuration System

The website now uses a **modular configuration approach**! Each section has its own configuration file, making it incredibly easy to manage and update specific content without affecting other sections.

### Configuration Files:

1. **`config/site.json`** - Site settings, personal information, and navigation
2. **`config/research.json`** - Research areas and descriptions
3. **`config/papers.json`** - Publications and academic papers
4. **`config/talks.json`** - Talks and presentations
5. **`config/social.json`** - Social media links

### Benefits of Modular Configuration:

✅ **Focused Editing**: Edit only the section you need to update  
✅ **Better Organization**: Each file has a specific purpose  
✅ **Easier Maintenance**: Smaller, focused files are easier to manage  
✅ **Version Control**: Track changes to specific sections separately  
✅ **Collaboration**: Multiple people can edit different sections simultaneously  

## 🎯 How to Customize

### 1. Update Personal Information
Edit `config/site.json`:
```json
{
  "title": "Your Name - Research Area",
  "description": "Your description",
  "email": "your.email@institution.edu",
  "person": {
    "name": "Your Name",
    "title": "Your Title",
    "description": "Your description"
  }
}
```

### 2. Add/Modify Research Areas
Edit `config/research.json`:
```json
{
  "areas": [
    {
      "title": "Your Research Area",
      "description": "Description of your research",
      "icon": "fas fa-brain",
      "tags": ["Tag1", "Tag2", "Tag3"]
    }
  ]
}
```

### 3. Update Publications
Edit `config/papers.json`:
```json
{
  "papers": [
    {
      "title": "Paper Title",
      "authors": "Author Names",
      "venue": "Conference/Journal Name",
      "year": "2024",
      "type": "Conference Paper",
      "description": "Paper description",
      "links": [
        {
          "text": "Paper",
          "icon": "fas fa-file-alt",
          "url": "https://example.com/paper"
        }
      ]
    }
  ]
}
```

### 4. Update Talks & Presentations
Edit `config/talks.json`:
```json
{
  "talks": [
    {
      "title": "Talk Title",
      "date": "December 2024",
      "venue": "Conference Name",
      "description": "Talk description",
      "links": [
        {
          "text": "Slides",
          "icon": "fas fa-file-pdf",
          "url": "https://example.com/slides"
        }
      ]
    }
  ]
}
```

### 5. Update Social Links
Edit `config/social.json`:
```json
{
  "links": [
    {
      "platform": "GitHub",
      "url": "https://github.com/yourusername",
      "icon": "fab fa-github"
    }
  ]
}
```

## 📄 Pages

### Homepage (`index.html`)
- Hero section with personal introduction
- Research areas overview (from `config/research.json`)
- Publications section (from `config/papers.json`)
- About section (from `config/site.json`)
- Contact information and social links (from `config/social.json`)

### Talks (`talks.html`)
- Collection of presentations and talks (from `config/talks.json`)
- Conference and workshop contributions
- Links to slides, recordings, and papers

### CV (`assets/files/cv.pdf`)
- Complete professional CV in PDF format
- You provide an up-to-date PDF file
- No HTML/CSS maintenance required

## 🖼️ Customization

### Profile Image
Replace `assets/images/profile-cropped.jpg` with an actual profile photo. The image should be:
- Square aspect ratio (recommended: 400x400px or larger)
- Professional headshot
- JPEG format

### CV Updates
Simply replace `assets/files/cv.pdf` with your updated CV file. No configuration changes needed!

### Styling
Modify `assets/css/style.css` to change:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

## 🚀 Deployment

This website is designed to work with GitHub Pages. To deploy:

1. Push all files to a GitHub repository named `martin-krutsky.github.io`
2. Enable GitHub Pages in the repository settings
3. The website will be available at `https://martin-krutsky.github.io`

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Dynamic content loading and configuration management
- **JSON**: Modular configuration file format
- **Font Awesome**: Icons for social links and UI elements
- **Academicons**: Academic-specific icons (Google Scholar, ORCID)
- **Responsive Design**: Mobile-first approach

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This website template is provided as-is for personal use. Feel free to modify and adapt for your own academic website.

## 📧 Contact

For questions about this website template or to report issues, please contact Martin Krutský at Martin.Krutsky@fel.cvut.cz.

## 🔄 Migration from Single Config File

If you're migrating from the previous single `config.json` approach:

1. **Backup your current content** from the single config file
2. **Distribute the content** into the appropriate modular files:
   - Site settings → `config/site.json`
   - Research areas → `config/research.json`
   - Publications → `config/papers.json`
   - Talks → `config/talks.json`
   - Social links → `config/social.json`
3. **Test the website** to ensure everything loads correctly

The modular system makes future updates much more organized and maintainable! 