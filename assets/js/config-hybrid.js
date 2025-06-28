// Hybrid configuration loader with fallback content
class HybridWebsiteConfig {
    constructor() {
        this.config = {
            site: null,
            personal: null,
            research: null,
            papers: null,
            talks: null,
            social: null
        };
        
        // Fallback content in case config loading fails
        this.fallbackContent = {
            personal: {
                name: "Martin Krutský",
                email: "Martin.Krutsky@fel.cvut.cz",
                location: "Prague, Czech Republic",
                institution: "Czech Technical University in Prague",
                department: "Intelligent Data Analysis Lab",
                position: "PhD Student in Artificial Intelligence",
                urls: {
                    website: "martin-krutsky.github.io",
                    github: "https://github.com/martin-krutsky",
                    linkedin: "https://www.linkedin.com/in/martin-krutsky",
                    googleScholar: "https://scholar.google.com/citations?user=0oqgfqMAAAAJ",
                    orcid: "http://orcid.org/0009-0000-9710-1147",
                    cv: "assets/files/cv.pdf",
                    rai: "https://rai.fel.cvut.cz/"
                },
                social: {
                    github: {
                        platform: "GitHub",
                        url: "https://github.com/martin-krutsky",
                        icon: "fab fa-github"
                    },
                    linkedin: {
                        platform: "LinkedIn",
                        url: "https://www.linkedin.com/in/martin-krutsky",
                        icon: "fab fa-linkedin"
                    },
                    googleScholar: {
                        platform: "Google Scholar",
                        url: "https://scholar.google.com/citations?user=0oqgfqMAAAAJ",
                        icon: "ai ai-google-scholar"
                    },
                    orcid: {
                        platform: "ORCID",
                        url: "http://orcid.org/0009-0000-9710-1147",
                        icon: "ai ai-orcid"
                    },
                    email: {
                        platform: "Email",
                        url: "mailto:Martin.Krutsky@fel.cvut.cz",
                        icon: "fas fa-envelope"
                    }
                },
                navigation: {
                    links: [
                        {
                            text: "CV",
                            url: "assets/files/cv.pdf",
                            target: "_blank",
                            rel: "noopener noreferrer"
                        },
                        {
                            text: "Talks",
                            url: "talks.html"
                        }
                    ]
                },
                previouslyAt: {
                    title: "Previously Worked At",
                    companies: [
                        {
                            name: "Leeaf",
                            logo: "assets/images/logos/leeaf-logo.svg",
                            url: "https://leeaf.life/",
                            alt: "Leeaf logo"
                        },
                        {
                            name: "Microsoft",
                            logo: "assets/images/logos/microsoft-logo.png",
                            url: "https://www.microsoft.com/",
                            alt: "Microsoft logo"
                        },
                        {
                            name: "Blindspot Solutions",
                            logo: "assets/images/logos/blindspot-logo.png",
                            url: "https://blindspot.ai/",
                            alt: "Blindspot Solutions logo"
                        },
                        {
                            name: "Barclays",
                            logo: "assets/images/logos/barclays-logo.png",
                            url: "https://www.barclays.com/",
                            alt: "Barclays logo"
                        }
                    ]
                }
            },
            site: {
                title: "Martin Krutský — AI researcher",
                description: "PhD Student in AI Research focusing on interpretability, GNNs, and geometric deep learning",
                person: {
                    title: "PhD Student in Artificial Intelligence",
                    subtitle: "Focusing on neuro-symbolic interpretability, GNNs, and geometric deep learning",
                    description: "Exploring the intersection of deep learning, structured knowledge, and symbolic approaches to extraction of understandable concepts from AI systems.",
                    about: [
                        "I am a PhD student at the Intelligent Data Analysis Lab, Czech Technical University in Prague, where I research neuro-symbolic interpretability, graph neural networks, and geometric deep learning; all with the aim to create more trustworthy AI systems. I have experience in studying expressivity of neural networks, as well as symmetry-invariant deep learning.",
                        "I am passionate about developing AI in a more responsible way. At our department, we started an initiative organizing events and discussion about the topic of Responsible AI: from AI ethics and fairness to AI safety and alignment. Recently, we also started our own research agenda, tackling the problem of evaluation of explainable AI techniques from human and regulatory perspectives.",
                        "When I am not doing research, you can find me developing practical AI solutions based on LLMs (RAG, agents, evals...), as well as classical machine learning."
                    ]
                }
            },
            research: {
                title: "Areas of Expertise",
                areas: [
                    {
                        title: "Ne-Sy Interpretability",
                        description: "Bridging the gap between deep learning, symbolic reasoning, and mechanistic interpretability to create more trustworthy AI systems. My research focuses on reverse-engineering neural networks of well-defined expressivity into symbolic concepts.",
                        icon: "fas fa-network-wired",
                        tags: ["Neuro-Symbolic AI", "Mechanistic Interpretability", "Deep Learning"]
                    },
                    {
                        title: "Responsible AI",
                        description: "Researching more responsible approaches to AI development. With an interest in AI ethics, safety, and societal impact, we are currently working on evaluation of explainable AI techniques from the human and governance perspective.",
                        icon: "fas fa-shield-alt",
                        tags: ["AI Ethics", "AI Safety", "XAI", "AI Governance"]
                    },
                    {
                        title: "Custom AI Solutions",
                        description: "Developing custom AI solutions based on state-of-the-art LLM stack (with RAG, Agents, MCP...), as well as domain-specific machine learning solutions based on your data.",
                        icon: "fas fa-brain",
                        tags: ["LLMs", "NLP", "Computer Vision"]
                    }
                ]
            },
            talks: {
                title: "Talks & Presentations",
                subtitle: "Sharing insights and research findings",
                description: "A collection of my presentations, talks, and academic contributions in the field of AI research.",
                talks: []
            }
        };
        
        this.init();
    }

    async init() {
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

            // Use loaded config or fallback
            this.config.site = siteConfig || this.fallbackContent.site;
            this.config.personal = personalConfig || this.fallbackContent.personal;
            this.config.research = researchConfig || this.fallbackContent.research;
            this.config.papers = papersConfig || this.fallbackContent.papers;
            this.config.talks = talksConfig || this.fallbackContent.talks;
            this.config.social = socialConfig || this.fallbackContent.social;

            this.populateContent();
        } catch (error) {
            console.error('Error loading configuration, using fallback content:', error);
            // Use fallback content
            this.config.site = this.fallbackContent.site;
            this.config.personal = this.fallbackContent.personal;
            this.config.research = this.fallbackContent.research;
            this.config.papers = this.fallbackContent.papers;
            this.config.talks = this.fallbackContent.talks;
            this.config.social = this.fallbackContent.social;
            this.populateContent();
        }
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
        this.updatePreviouslyAtSection();
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
                            <a href="${link.url}" class="paper-link" target="_blank" rel="noopener noreferrer">
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
                <a href="${link.url}" title="${link.platform}" target="_blank" rel="noopener noreferrer">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
        }
    }

    updateTalksPage() {
        // Only update if we're on the talks page
        if (!window.location.pathname.includes('talks.html')) return;

        // Update page header
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = this.config.talks?.title || 'Talks';
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = this.config.talks?.description || 'A collection of my presentations, talks, and speaking engagements at conferences, workshops, and academic events.';
        }

        // Update talks section
        const talksSection = document.querySelector('.talks-section');
        if (talksSection) {
            const talks = this.config.talks?.talks || [];
            
            if (talks.length === 0) {
                talksSection.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-microphone-slash"></i>
                        <h3>No talks available yet</h3>
                        <p>Check back soon for upcoming presentations and talks.</p>
                    </div>
                `;
            } else {
                talksSection.innerHTML = talks.map(talk => `
                    <div class="talk-card">
                        <div class="talk-header">
                            <h3 class="talk-title">${talk.title}</h3>
                            <span class="talk-date">${talk.date}</span>
                        </div>
                        <div class="talk-venue">${talk.venue}</div>
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
    }

    updatePublicationsPage() {
        // Only update if we're on the publications page
        if (!window.location.pathname.includes('publications.html')) return;

        // Update page header
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = this.config.papers?.title || 'Publications';
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = this.config.papers?.description || 'A collection of my published research papers, conference proceedings, and academic contributions in the field of AI research.';
        }

        // Update publications section
        const publicationsSection = document.querySelector('.publications-section');
        if (publicationsSection) {
            const papers = this.config.papers?.papers || [];
            
            if (papers.length === 0) {
                publicationsSection.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <h3>No publications available yet</h3>
                        <p>Check back soon for upcoming publications and research papers.</p>
                    </div>
                `;
            } else {
                publicationsSection.innerHTML = papers.map(paper => `
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
                                <a href="${link.url}" class="publication-link" target="_blank" rel="noopener noreferrer">
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
    new HybridWebsiteConfig();
}); 