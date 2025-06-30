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
        
        // Star symbol options - change this to test different styles
        this.selectedIcon = {
            icon: 'fas fa-star', // Font Awesome icon class
            cssClass: 'selected-star-gradient' // CSS class for styling
        };
        
        // Available options (uncomment the one you prefer):
        // this.selectedIcon = { icon: 'far fa-star', cssClass: 'selected-star-outline' }; // Outlined star
        // this.selectedIcon = { icon: 'fas fa-star', cssClass: 'selected-star-gradient' }; // Gradient star
        // this.selectedIcon = { icon: 'fas fa-star', cssClass: 'selected-star-subtle' }; // Subtle gray
        // this.selectedIcon = { icon: 'fas fa-star', cssClass: 'selected-star-bold' }; // Bold with glow
        // this.selectedIcon = { icon: 'fas fa-circle', cssClass: 'selected-dot' }; // Minimal dot
        // this.selectedIcon = { icon: 'fas fa-trophy', cssClass: 'selected-trophy' }; // Trophy icon
        // this.selectedIcon = { icon: 'fas fa-award', cssClass: 'selected-award' }; // Award badge
        
        this.init();
    }

    async init() {
        this.showLoadingScreen();
        
        try {
            // Load all configuration files with timeout
            const configPromises = [
                this.loadConfigWithTimeout('config/site.json', 3000),
                this.loadConfigWithTimeout('config/personal.json', 3000),
                this.loadConfigWithTimeout('config/research.json', 3000),
                this.loadConfigWithTimeout('config/papers.json', 3000),
                this.loadConfigWithTimeout('config/talks.json', 3000),
                this.loadConfigWithTimeout('config/social.json', 3000),
                this.loadConfigWithTimeout('config/version.json', 3000)
            ];

            const results = await Promise.allSettled(configPromises);
            
            // Process results and build config object
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const configName = ['site', 'personal', 'research', 'papers', 'talks', 'social', 'version'][index];
                    this.config[configName] = result.value;
                } else {
                    console.warn(`Failed to load config ${index}:`, result.reason);
                }
            });

            // Use requestAnimationFrame for smooth rendering
            requestAnimationFrame(() => {
                this.populateContent();
                this.hideLoadingScreen();
            });

        } catch (error) {
            console.error('Error during initialization:', error);
            this.showErrorState();
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const contentWrapper = document.getElementById('contentWrapper');
        
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
        
        if (contentWrapper) {
            contentWrapper.classList.remove('loaded');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const contentWrapper = document.getElementById('contentWrapper');
        
        // Add loaded class to content wrapper
        if (contentWrapper) {
            contentWrapper.classList.add('loaded');
        }
        
        // Hide loading screen after a short delay to ensure content is ready
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 100);
    }

    async loadConfigWithTimeout(path, timeoutMs) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const response = await fetch(path, { 
                signal: controller.signal,
                cache: 'default' // Let the service worker handle caching
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                console.warn(`Timeout loading ${path}`);
            } else {
                console.error(`Error loading ${path}:`, error);
            }
            return null;
        }
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
            max-width: 400px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>Loading Error</h3>
            <p>Some content failed to load. Please refresh the page or try again later.</p>
            <button onclick="location.reload()" style="
                background: #c33;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                cursor: pointer;
                margin-top: 1rem;
            ">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
    }

    populateContent() {
        // Populate content in order of visual importance
        this.updatePageTitle();
        this.updateNavigation();
        this.updateSectionTitles();
        this.updateHeroSection();
        
        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            this.updateResearchAreas();
            this.updatePapersSection();
            this.updateTalksSection();
            this.updateAboutSection();
            this.updateFooter();
            this.updateTalksPage();
            this.updatePublicationsPage();
            this.updatePreviouslyAtSection();
        });
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

        // Update brand text with responsive structure
        const brandText = document.querySelector('.brand-text');
        if (brandText) {
            const fullTitle = this.config.site ? this.config.site.title : this.config.personal.name;
            
            // Create responsive brand text structure
            if (fullTitle.includes("—")) {
                // Split by the em dash and create responsive structure
                const parts = fullTitle.split("—");
                const name = parts[0].trim();
                const title = parts[1].trim();
                
                brandText.innerHTML = `
                    <span class="brand-name">${name}</span>
                    <span class="brand-separator">—</span>
                    <span class="brand-title">${title}</span>
                `;
            } else {
                // Fallback to original text if no em dash found
                brandText.textContent = fullTitle;
            }
        }

        // Update desktop navigation links
        const navLinks = document.querySelector('.visible-links');
        if (navLinks && this.config.personal.navigation) {
            navLinks.innerHTML = this.config.personal.navigation.links.map(link => {
                let linkHtml = `<li><a href="${link.url}" class="nav-link"`;
                
                // Add target and rel attributes if specified
                if (link.target) {
                    linkHtml += ` target="${link.target}"`;
                }
                if (link.rel) {
                    linkHtml += ` rel="${link.rel}"`;
                }
                
                linkHtml += `>${link.text}</a></li>`;
                return linkHtml;
            }).join('');
        }

        // Update mobile navigation links
        const mobileNavLinks = document.querySelector('.mobile-links');
        if (mobileNavLinks && this.config.personal.navigation) {
            mobileNavLinks.innerHTML = this.config.personal.navigation.links.map(link => {
                let linkHtml = `<li><a href="${link.url}" class="nav-link"`;
                
                // Add target and rel attributes if specified
                if (link.target) {
                    linkHtml += ` target="${link.target}"`;
                }
                if (link.rel) {
                    linkHtml += ` rel="${link.rel}"`;
                }
                
                linkHtml += `>${link.text}</a></li>`;
                return linkHtml;
            }).join('');
        }

        // Initialize mobile menu toggle
        this.initMobileMenu();
    }

    initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });
        }
    }

    updateSectionTitles() {
        if (!this.config.site || !this.config.site.sections) return;

        const sections = this.config.site.sections;

        // Update Areas of Expertise section title
        const areasTitle = document.querySelector('.research-areas .section-title');
        if (areasTitle && sections.areasOfExpertise) {
            areasTitle.textContent = sections.areasOfExpertise;
        }

        // Update Publications section title
        const publicationsTitle = document.querySelector('.papers-section .section-title');
        if (publicationsTitle && sections.publications) {
            publicationsTitle.textContent = sections.publications;
        }

        // Update Talks section title
        const talksTitle = document.querySelector('.talks-section .section-title');
        if (talksTitle && sections.talks) {
            talksTitle.textContent = sections.talks;
        }

        // Update About Me section title
        const aboutTitle = document.querySelector('.about-section h2');
        if (aboutTitle && sections.aboutMe) {
            aboutTitle.textContent = sections.aboutMe;
        }

        // Update Previously worked at section title
        const previouslyAtTitle = document.querySelector('.previously-at-section .section-title');
        if (previouslyAtTitle && this.config.personal && this.config.personal.previouslyAt && this.config.personal.previouslyAt.title) {
            previouslyAtTitle.textContent = this.config.personal.previouslyAt.title;
        }

        // Update footer section titles
        const footerAreasTitles = document.querySelectorAll('.footer-section h4');
        if (footerAreasTitles.length >= 1 && sections.areasOfExpertise) {
            footerAreasTitles[0].textContent = sections.areasOfExpertise;
        }

        if (footerAreasTitles.length >= 2 && sections.connect) {
            footerAreasTitles[1].textContent = sections.connect;
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

        // Update profile image alt text
        const profileImage = document.querySelector('.profile-image');
        if (profileImage && this.config.personal.name) {
            profileImage.alt = this.config.personal.name;
        }

        // Update hero buttons
        const heroLinks = document.querySelector('.hero-links');
        if (heroLinks && this.config.personal.buttons) {
            heroLinks.innerHTML = this.config.personal.buttons.map(button => {
                let buttonHtml = `<a href="${button.url}" class="${button.class}"`;
                
                // Add target and rel attributes if specified
                if (button.target) {
                    buttonHtml += ` target="${button.target}"`;
                }
                if (button.rel) {
                    buttonHtml += ` rel="${button.rel}"`;
                }
                
                buttonHtml += '>';
                if (button.icon) {
                    buttonHtml += `<i class="${button.icon}"></i> `;
                }
                buttonHtml += button.text;
                buttonHtml += '</a>';
                
                return buttonHtml;
            }).join('');
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
            // Get selected and non-selected publications
            const selectedPapers = this.config.papers.papers.filter(paper => paper.selected);
            const nonSelectedPapers = this.config.papers.papers.filter(paper => !paper.selected);
            
            // Show selected publications first, then fill remaining slots with non-selected
            const maxPublications = 4;
            const selectedCount = Math.min(selectedPapers.length, maxPublications);
            const remainingSlots = maxPublications - selectedCount;
            const recentNonSelected = nonSelectedPapers.slice(0, remainingSlots);
            
            // Combine selected and non-selected publications
            const displayPapers = [...selectedPapers.slice(0, selectedCount), ...recentNonSelected];
            
            papersGrid.innerHTML = displayPapers.map(paper => `
                <div class="paper-card">
                    <div class="paper-header">
                        <h3 class="paper-title">${paper.title}</h3>
                        <span class="paper-year">${paper.year}</span>
                    </div>
                    <div class="paper-authors">${paper.authors}</div>
                    <div class="paper-venue">
                        <span class="paper-type">${paper.type}</span> ${paper.venue}
                    </div>
                    <p class="paper-description">${paper.description}</p>
                    <div class="paper-links">
                        ${paper.links.map(link => `
                            <a href="${link.url}" class="paper-link" target="_blank" rel="noopener noreferrer">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `).join('')}
                        ${paper.selected ? `<i class="${this.selectedIcon.icon} ${this.selectedIcon.cssClass}" title="Selected Publication"></i>` : ''}
                    </div>
                </div>
            `).join('');
            
            // Add "View All Publications" button if there are more than 4 total publications
            if (this.config.papers.papers.length > 4) {
                papersGrid.insertAdjacentHTML('afterend', `
                    <div class="view-all-container">
                        <a href="publications.html" class="btn btn-secondary">
                            <i class="fas fa-external-link-alt"></i>
                            View All Publications
                        </a>
                    </div>
                `);
            }
        }
    }

    updateTalksSection() {
        const talksGrid = document.querySelector('.talks-grid');
        if (talksGrid && this.config.talks && this.config.talks.talks) {
            // Show only the most recent 3 talks on the main page
            const recentTalks = this.config.talks.talks.slice(0, 3);
            
            talksGrid.innerHTML = recentTalks.map(talk => `
                <div class="talk-card">
                    <div class="talk-header">
                        <h3 class="talk-title">${talk.title}</h3>
                        <span class="talk-date">${talk.date}</span>
                    </div>
                    ${talk.authors ? `<div class="talk-authors">${talk.authors}</div>` : ''}
                    <div class="talk-venue">
                        ${talk.tags ? talk.tags.map(tag => `<span class="talk-tag">${tag}</span>`).join('') : ''}
                        ${talk.venue}
                    </div>
                    <p class="talk-description">${talk.description}</p>
                    <div class="talk-links">
                        ${talk.links.map(link => `
                            <a href="${link.url}" class="talk-link" target="_blank" rel="noopener noreferrer">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('');
            
            // Add "View All Talks" button if there are more than 3 talks
            if (this.config.talks.talks.length > 3) {
                talksGrid.insertAdjacentHTML('afterend', `
                    <div class="view-all-container">
                        <a href="talks.html" class="btn btn-secondary">
                            <i class="fas fa-external-link-alt"></i>
                            View All Talks
                        </a>
                    </div>
                `);
            }
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
                <a href="${link.url}" title="${link.platform}" target="_blank" rel="noopener noreferrer">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
        }

        // Update copyright text
        const copyrightText = document.querySelector('.footer-bottom p:first-child');
        if (copyrightText && this.config.personal.copyright) {
            copyrightText.textContent = this.config.personal.copyright.text;
        }

        const poweredByText = document.querySelector('.footer-bottom p:last-child');
        if (poweredByText && this.config.personal.copyright) {
            poweredByText.textContent = this.config.personal.copyright.poweredBy;
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
                    ${talk.authors ? `<div class="talk-authors">${talk.authors}</div>` : ''}
                    <div class="talk-venue">
                        ${talk.tags ? talk.tags.map(tag => `<span class="talk-tag">${tag}</span>`).join('') : ''}
                        ${talk.venue}
                    </div>
                    <p class="talk-description">${talk.description}</p>
                    <div class="talk-links">
                        ${talk.links.map(link => `
                            <a href="${link.url}" class="talk-link" target="_blank" rel="noopener noreferrer">
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
                            <span class="publication-type">${paper.type}</span> ${paper.venue}
                        </div>
                        <p class="publication-description">${paper.description}</p>
                        <div class="publication-links">
                            ${paper.links.map(link => `
                                <a href="${link.url}" class="publication-link" target="_blank" rel="noopener noreferrer">
                                    <i class="${link.icon}"></i>
                                    ${link.text}
                                </a>
                            `).join('')}
                            ${paper.selected ? `<i class="${this.selectedIcon.icon} ${this.selectedIcon.cssClass}" title="Selected Publication"></i>` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    updatePreviouslyAtSection() {
        const companyLogos = document.querySelector('.company-logos');
        if (companyLogos && this.config.personal && this.config.personal.previouslyAt) {
            companyLogos.innerHTML = this.config.personal.previouslyAt.companies.map(company => `
                <a href="${company.url}" class="company-logo" target="_blank" rel="noopener noreferrer" title="${company.name}">
                    <img src="${company.logo}" alt="${company.alt}" onerror="this.style.display='none'">
                </a>
            `).join('');
        }
    }
}

// Initialize the configuration when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteConfig();
}); 