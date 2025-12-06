# Changelog

All notable changes to the eScience Next.js platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-12-06

### Changed - AI-Driven Enterprise Content Transformation

#### Hero Section
- **Splash Screen H1**: "Architects of Innovation" → "Transforming the AI-Driven Enterprise"
- **Splash Screen Subtitle**: "Powered by Real-Time Automation & AI" → "Powered by Real-Time Data & Intelligent Automation"
- **Hero H1**: Updated to "Transforming the AI-Driven Enterprise" with brand gradient highlights on "AI-Driven"
- **Hero Subtitle**: Changed to "Powered by Real-Time Data & Intelligent Automation" with brand gradient on "Intelligent Automation"
- **Primary CTA**: "Request a Demo" → "Start Your Transformation"

#### Value Proposition Section
- **Header**: "Stop Making Reactive Decisions" → "Evolve from Reactive to AI-Proactive"
- **Body Text**: Updated to emphasize intelligent insights, prediction capabilities, and automated workflows
- **Solution Label**: "The Solution" → "The Intelligent Solution"

#### Why eScience Section (4 Columns)
- **Column 1**: "Proven Track Record" → "Decades of Digital Transformation" - Emphasizes evolution from traditional to automated enterprises
- **Column 2**: "Award-Winning Solutions" → "Award-Winning Innovation" - Highlights cloud and mobile excellence
- **Column 3**: "Mobile Technology Pioneers" → "Unified AI & Mobile Ecosystems" - Repositions as intelligent ecosystem builders
- **Column 4**: "Trusted Worldwide" → "Global Enterprise Partner" - Emphasizes industry leadership and precision

#### What We Do Section
- **Subtitle**: "Developing the right mobile solutions for your business" → "Deploying the data engines that power your business intelligence"

### Added
- **CSS Class**: `.text-highlight` - Applies brand gradient (teal-to-blue) to emphasized keywords
- Brand color highlights on key terms: "AI-Driven" and "Intelligent Automation"

### Fixed
- **Responsive Design**: Reduced hero title minimum font size from 3rem to 2.5rem for better mobile rendering
- **Line Height**: Increased hero title line-height from 1.1 to 1.15 to prevent awkward wrapping with longer headline

### Technical Details
- **Files Modified**:
  - `app/page.tsx` - All content updates
  - `app/globals.css` - Added `.text-highlight` class and responsive improvements
- **Design Impact**: Messaging now positions eScience as an AI-driven enterprise transformation partner rather than just a mobile solutions provider

---

## [1.1.0] - 2025-12-04

### Added
- Cloudinary file upload integration for blogs and knowledge base
- Admin portal for content management
- OpenAI chatbot integration
- Database-driven content (PostgreSQL + Prisma)

### Fixed
- Deployment build errors (missing dependencies, incorrect import paths)
- Burger menu functionality on mobile viewports

### Changed
- Integrated eScience branding (logo, Mont font)
- Implemented glassmorphic design elements
- Added animated splash screen

---

## [1.0.0] - 2025-12-03

### Added
- Initial Next.js 16 application setup
- Render deployment configuration
- Basic homepage structure
- GitHub repository integration

---

## Upgrade Notes

### From 1.1.0 to 1.2.0
No breaking changes. Content updates only. To deploy:
```bash
git pull origin main
npm run dev  # Test locally
git push     # Auto-deploys to Render
```

### Future Roadmap
- [ ] Homepage CMS (manage stats, features, testimonials via admin)
- [ ] Image upload (replace URL-based system)
- [ ] Email reports and analytics
- [ ] Multi-user admin accounts
