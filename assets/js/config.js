// Configuration loader and content populator
class WebsiteConfig {
    constructor() {
        this.config = {
            site: null,
            personal: null,
            research: null,
            papers: null,
            talks: null,
            social: null
        };
        this.init();
    }

    async init() {
        // Add loading state to prevent flash of unstyled content
        this.addLoadingState();
        
        try {
            // Load all configuration files in parallel
            const [siteConfig, personalConfig, researchConfig, papersConfig, talksConfig, socialConfig] = await Promise.all([
                this.loadConfig('config/site.json'),
                this.loadConfig('config/personal.json'),
                this.loadConfig('config/research.json'),
                this.loadConfig('config/papers.json'),
                this.loadConfig('config/talks.json'),
                this.loadConfig('config/social.json')
            ]);

            this.config.site = siteConfig;
            this.config.personal = personalConfig;
            this.config.research = researchConfig;
            this.config.papers = papersConfig;
            this.config.talks = talksConfig;
            this.config.social = socialConfig;

            this.populateContent();
            this.removeLoadingState();
        } catch (error) {
            console.error('Error loading configuration:', error);
            this.removeLoadingState();
            this.showErrorState();
        }
    }

    addLoadingState() {
        // Add a subtle loading indicator
        const style = document.createElement('style');
        style.id = 'loading-style';
        style.textContent = `
            .loading-content {
                opacity: 0.3;
                transition: opacity 0.3s ease;
            }
            .loading-content.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        // Add loading class to main content areas
        const contentAreas = document.querySelectorAll('.hero-section, .research-areas, .papers-section, .about-section, .modern-footer, .talks-section');
        contentAreas.forEach(area => {
            area.classList.add('loading-content');
        });
    }

    removeLoadingState() {
        // Remove loading styles
        const loadingStyle = document.getElementById('loading-style');
        if (loadingStyle) {
            loadingStyle.remove();
        }

        // Add loaded class to content areas
        const contentAreas = document.querySelectorAll('.loading-content');
        contentAreas.forEach(area => {
            area.classList.add('loaded');
        });
    }

    showErrorState() {
        // Show error message if config loading fails
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fee;
            border: 1px solid #fcc;
            padding: 1rem;
            border-radius: 0.5rem;
            color: #c33;
            z-index: 1000;
        `;
        errorDiv.textContent = 'Failed to load site content. Please refresh the page.';
        document.body.appendChild(errorDiv);
    }

    async loadConfig(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${path}:`, error);
            return null;
        }
    }

    populateContent() {
        this.updatePageTitle();
        this.updateNavigation();
        this.updateHeroSection();
        this.updateResearchAreas();
        this.updatePapersSection();
        this.updateAboutSection();
        this.updateFooter();
        this.updateTalksPage();
        this.updatePublicationsPage();
    }

    updatePageTitle() {
        if (this.config.site) {
            document.title = this.config.site.title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.content = this.config.site.description;
            }
        }
    }

    updateNavigation() {
        if (!this.config.personal) return;

        // Update brand text
        const brandText = document.querySelector('.brand-text');
        if (brandText) {
            brandText.textContent = this.config.site ? this.config.site.title : this.config.personal.name;
        }

        // Update navigation links
        const navLinks = document.querySelector('.visible-links');
        if (navLinks && this.config.personal.navigation) {
            navLinks.innerHTML = this.config.personal.navigation.links.map(link => 
                `<li><a href="${link.url}" class="nav-link">${link.text}</a></li>`
            ).join('');
        }
    }

    updateHeroSection() {
        if (!this.config.personal || !this.config.site) return;

        // Update hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = this.config.personal.name;
        }

        // Update hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = this.config.site.person.title;
        }

        // Update hero description
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = this.config.site.person.description;
        }

        // Update email link
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.href = `mailto:${this.config.personal.email}`;
        }

        // Add RAI button
        const heroLinks = document.querySelector('.hero-links');
        if (heroLinks && this.config.personal.urls.rai) {
            // Check if RAI button already exists
            const existingRaiButton = heroLinks.querySelector('.btn-rai');
            if (!existingRaiButton) {
                const raiButton = document.createElement('a');
                raiButton.href = this.config.personal.urls.rai;
                raiButton.className = 'btn btn-tertiary btn-rai';
                raiButton.textContent = 'Visit our RAI page';
                raiButton.target = '_blank';
                raiButton.rel = 'noopener noreferrer';
                heroLinks.appendChild(raiButton);
            }
        }
    }

    updateResearchAreas() {
        const researchGrid = document.querySelector('.research-grid');
        if (researchGrid && this.config.research && this.config.research.areas) {
            researchGrid.innerHTML = this.config.research.areas.map(area => {
                let description = area.description;
                
                // Handle link in description if it exists
                if (area.link) {
                    const linkText = area.link.text;
                    const linkUrl = area.link.url;
                    
                    // Replace the specific text with a link (case-insensitive)
                    const regex = new RegExp(linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    description = description.replace(
                        regex,
                        `<a href="${linkUrl}" class="research-link" target="_blank" rel="noopener noreferrer">$&</a>`
                    );
                }
                
                return `
                    <div class="research-card">
                        <div class="card-icon">
                            <i class="${area.icon}"></i>
                        </div>
                        <h3>${area.title}</h3>
                        <p>${description}</p>
                        <div class="card-tags">
                            ${area.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    updatePapersSection() {
        const papersGrid = document.querySelector('.papers-grid');
        if (papersGrid && this.config.papers && this.config.papers.papers) {
            papersGrid.innerHTML = this.config.papers.papers.map(paper => `
                <div class="paper-card">
                    <div class="paper-header">
                        <h3 class="paper-title">${paper.title}</h3>
                        <span class="paper-year">${paper.year}</span>
                    </div>
                    <div class="paper-authors">${paper.authors}</div>
                    <div class="paper-venue">
                        <span class="paper-type">${paper.type}</span> • ${paper.venue}
                    </div>
                    <p class="paper-description">${paper.description}</p>
                    <div class="paper-links">
                        ${paper.links.map(link => `
                            <a href="${link.url}" class="paper-link">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    updateAboutSection() {
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent && this.config.site && this.config.site.person.about) {
            const aboutParagraphs = this.config.site.person.about.map(paragraph => 
                `<p>${paragraph}</p>`
            ).join('');
            
            // Find the h2 element and replace everything after it
            const h2Element = aboutContent.querySelector('h2');
            if (h2Element) {
                // Remove any existing content after h2
                let nextElement = h2Element.nextElementSibling;
                while (nextElement) {
                    const temp = nextElement.nextElementSibling;
                    nextElement.remove();
                    nextElement = temp;
                }
                // Add the new content
                h2Element.insertAdjacentHTML('afterend', aboutParagraphs);
            }
        }
    }

    updateFooter() {
        if (!this.config.personal || !this.config.site) return;

        // Update footer person info
        const footerPerson = document.querySelector('.footer-section h3');
        if (footerPerson) {
            footerPerson.textContent = this.config.personal.name;
        }

        const footerPersonDesc = document.querySelector('.footer-section p');
        if (footerPersonDesc) {
            footerPersonDesc.textContent = this.config.site.description;
        }

        // Update research areas in footer
        const footerResearchList = document.querySelector('.footer-section ul');
        if (footerResearchList && this.config.research && this.config.research.areas) {
            footerResearchList.innerHTML = this.config.research.areas.map(area => 
                `<li>${area.title}</li>`
            ).join('');
        }

        // Update social links
        const footerSocial = document.querySelector('.footer-social');
        if (footerSocial && this.config.personal.social) {
            const socialLinks = Object.values(this.config.personal.social);
            footerSocial.innerHTML = socialLinks.map(link => `
                <a href="${link.url}" title="${link.platform}">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
        }
    }

    updateTalksPage() {
        // Only update if we're on the talks page
        if (!window.location.pathname.includes('talks.html')) return;

        if (!this.config.talks) return;

        // Update page header
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = this.config.talks.title;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = this.config.talks.description;
        }

        // Update talks section
        const talksSection = document.querySelector('.talks-section');
        if (talksSection && this.config.talks.talks) {
            talksSection.innerHTML = this.config.talks.talks.map(talk => `
                <div class="talk-card">
                    <div class="talk-header">
                        <h3 class="talk-title">${talk.title}</h3>
                        <span class="talk-date">${talk.date}</span>
                    </div>
                    <div class="talk-venue">${talk.venue}</div>
                    <p class="talk-description">${talk.description}</p>
                    <div class="talk-links">
                        ${talk.links.map(link => `
                            <a href="${link.url}" class="talk-link">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    updatePublicationsPage() {
        // Only update if we're on the publications page
        if (!window.location.pathname.includes('publications.html')) return;

        if (!this.config.papers) return;

        // Update page header
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = this.config.papers.title;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = this.config.papers.description;
        }

        // Update publications section
        const publicationsSection = document.querySelector('.publications-section');
        if (publicationsSection && this.config.papers.papers) {
            if (this.config.papers.papers.length === 0) {
                publicationsSection.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <h3>No publications available yet</h3>
                        <p>Check back soon for upcoming publications and research papers.</p>
                    </div>
                `;
            } else {
                publicationsSection.innerHTML = this.config.papers.papers.map(paper => `
                    <div class="publication-card">
                        <div class="publication-header">
                            <h3 class="publication-title">${paper.title}</h3>
                            <span class="publication-year">${paper.year}</span>
                        </div>
                        <div class="publication-authors">${paper.authors}</div>
                        <div class="publication-venue">
                            <span class="publication-type">${paper.type}</span> • ${paper.venue}
                        </div>
                        <p class="publication-description">${paper.description}</p>
                        <div class="publication-links">
                            ${paper.links.map(link => `
                                <a href="${link.url}" class="publication-link">
                                    <i class="${link.icon}"></i>
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
            }
        }
    }
}

// Initialize the configuration when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteConfig();
}); 