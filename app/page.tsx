'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  avatar: string | null;
}

export default function Home() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Splash Screen Logic
  useEffect(() => {
    const timer1 = setTimeout(() => {
      const splash = document.getElementById('splashScreen');
      if (splash) splash.classList.add('hidden');

      const timer2 = setTimeout(() => {
        setIsSplashVisible(false);
      }, 500);
      return () => clearTimeout(timer2);
    }, 3000);

    return () => clearTimeout(timer1);
  }, []);

  // Fetch Testimonials
  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch((err) => console.error('Error fetching testimonials:', err));
  }, []);

  // Scroll Logic (Nav, BackToTop, Parallax)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // Nav Scrolled State
      setScrolled(currentScroll > 100);

      // Back to Top Visibility
      setShowBackToTop(currentScroll > 300);

      // Parallax Effect
      const parallaxSections = document.querySelectorAll('.parallax-section');
      parallaxSections.forEach((section) => {
        const el = section as HTMLElement;
        const speed = 0.05;
        const sectionTop = el.offsetTop;
        const sectionHeight = el.offsetHeight;

        if (currentScroll + window.innerHeight > sectionTop && currentScroll < sectionTop + sectionHeight) {
          const yPos = (currentScroll - sectionTop) * speed;
          el.style.transform = `translateY(${yPos}px)`;
        }
      });

      // Watermark Parallax
      const watermarks = document.querySelectorAll('.section-watermark');
      watermarks.forEach((watermark) => {
        const el = watermark as HTMLElement;
        const parent = el.closest('section');
        if (parent) {
          const rect = parent.getBoundingClientRect();
          const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const translateY = scrollProgress * 100 - 50;
          el.style.transform = `translateY(${translateY}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.fade-up, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in'
    );
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Stats Counter Logic
  useEffect(() => {
    const animateCounter = (element: HTMLElement, target: number) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + (element.dataset.suffix || '');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
      }, 30);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const statNumber = entry.target.querySelector('.stat-number') as HTMLElement;
          if (statNumber) {
            const targetValue = parseInt(statNumber.dataset.target || '0');
            if (!isNaN(targetValue)) {
              statNumber.dataset.suffix = (statNumber.textContent || '').replace(/[0-9]/g, '');
              animateCounter(statNumber, targetValue);
            }
            entry.target.classList.add('counted');
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
      statsObserver.observe(card);
    });

    return () => statsObserver.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.querySelector(id) as HTMLElement;
    if (target) {
      const navHeight = document.querySelector('.nav')?.clientHeight || 0;
      const targetPosition = target.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Splash Screen */}
      {isSplashVisible && (
        <div className="splash-screen" id="splashScreen">
          <div className="splash-content">
            <h1 className="splash-title">Architects of Innovation</h1>
            <p className="splash-subtitle">Powered by Real-Time Automation & AI</p>
          </div>
          <div className="splash-radial"></div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link href="#" className="nav-logo" onClick={(e) => scrollToSection(e, 'body')}>
            <img src="/assets/images/escience-logo.png" alt="eScience - Architects of Innovation" className="nav-logo-img" />
            <span className="text-[10px] text-gray-500 ml-2 mt-1 self-start font-mono opacity-60">v1.1</span>
          </Link>
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <a href="#solutions" onClick={(e) => scrollToSection(e, '#solutions')}>Solutions</a>
            <a href="#why-us" onClick={(e) => scrollToSection(e, '#why-us')}>Why Us</a>
            <Link href="/blog">Resources</Link>
            <a href="#testimonials" onClick={(e) => scrollToSection(e, '#testimonials')}>Testimonials</a>
            <a href="#contact" className="nav-cta" onClick={(e) => scrollToSection(e, '#contact')}>Get Started</a>
          </div>
          <div className={`nav-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content fade-in">
          <h1 className="hero-title">Architects of Innovation</h1>
          <p className="hero-subtitle">Boost your productivity and efficiency using the right solutions tailored fit for your organization. Automate your business operations now.</p>
          <div className="hero-cta">
            <a href="#contact" className="btn-primary" onClick={(e) => scrollToSection(e, '#contact')}>Request a Demo</a>
            <a href="#solutions" className="btn-secondary" onClick={(e) => scrollToSection(e, '#solutions')}>Explore Solutions</a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card card fade-up">
              <div className="stat-number" data-target="24">0</div>
              <div className="stat-label">Years of Innovation Since 2000</div>
            </div>
            <div className="stat-card card fade-up">
              <div className="stat-number" data-target="100">0</div>
              <div className="stat-label">Clients Worldwide</div>
            </div>
            <div className="stat-card card fade-up">
              <div className="stat-number" data-target="100">0</div>
              <div className="stat-label">Uptime Since 2000</div>
            </div>
            <div className="stat-card card fade-up">
              <div className="stat-icon">☁️</div>
              <div className="stat-label">AWS Partner of the Year Nominee 2018</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-12 bg-black border-b border-white/5 overflow-hidden">
        <div className="container">
          <p className="text-center text-gray-500 text-sm mb-8 uppercase tracking-widest">Trusted by 100+ Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos - In production, replace with real SVGs/Images */}
            <div className="flex items-center gap-2 text-xl font-bold text-white"><span className="text-teal-400">PHARMA</span>CORP</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><span className="text-blue-500">RETAIL</span>GIANT</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><span className="text-purple-500">LOGISTICS</span>PRO</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><span className="text-green-500">FMCG</span>GLOBAL</div>
            <div className="flex items-center gap-2 text-xl font-bold text-white"><span className="text-red-500">HEALTH</span>PLUS</div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="problem-section parallax-section">
        <div className="container">
          <div className="content-split">
            <div className="content-left fade-in-left">
              <h2 className="section-title">Stop Making Reactive Decisions</h2>
              <p className="section-text">Delayed reports taking days or weeks? Missing opportunities due to lack of field data access? It's time to shift from reactive to proactive.</p>
              <div className="highlight-box">
                <div className="highlight-icon">⚡</div>
                <div>
                  <h3>The Solution</h3>
                  <p>Real-time data and automation that lead to efficient, productive processes</p>
                </div>
              </div>
            </div>
            <div className="content-right fade-in-right">
              <div className="visual-card">
                <div className="visual-content">
                  <div className="data-flow-animation">
                    <div className="flow-node node-1"></div>
                    <div className="flow-node node-2"></div>
                    <div className="flow-node node-3"></div>
                    <div className="flow-line line-1"></div>
                    <div className="flow-line line-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="solutions-section">
        <div className="section-watermark">
          <img src="/assets/images/logo/escience-icon.png" alt="" className="watermark-img" />
        </div>
        <div className="container">
          <h2 className="section-title-center fade-in">What We Do</h2>
          <p className="section-subtitle-center fade-in delay-1">Developing the right mobile solutions for your business</p>

          <div className="solutions-grid">
            <div className="solution-card fade-up">
              <div className="solution-icon">👥</div>
              <h3>CRM Tools for Salesforce</h3>
              <p>PocketWiSE SFE, PM App, and SOLE - Paperless customer engagements and transactions for large sales forces</p>
            </div>
            <div className="solution-card fade-up delay-1">
              <div className="solution-icon">📦</div>
              <h3>Inventory Management</h3>
              <p>SwiftPoint, IMS, PATS, BayaniBox - Real-time inventory monitoring and workforce trade activity tracking</p>
            </div>
            <div className="solution-card fade-up delay-2">
              <div className="solution-icon">📄</div>
              <h3>Paperless Operations</h3>
              <p>Swift-Forms - Eliminate waiting time and promote fast contactless transactions</p>
            </div>
            <div className="solution-card fade-up delay-3">
              <div className="solution-icon">💳</div>
              <h3>Mobile POS Solutions</h3>
              <p>PocketWiSE Retail & Pocket Venta - Monitor sales and transactions across all store locations</p>
            </div>
            <div className="solution-card fade-up delay-4">
              <div className="solution-icon">🎁</div>
              <h3>Brand Loyalty Systems</h3>
              <p>Swift Rewards & Swift Care - Automated coupon generation and discount approval</p>
            </div>
            <div className="solution-card fade-up delay-5">
              <div className="solution-icon">🎯</div>
              <h3>Custom Solutions</h3>
              <p>Tailored mobile solutions designed specifically for your industry and requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why eScience Section */}
      <section id="why-us" className="why-section parallax-section">
        <div className="container">
          <h2 className="section-title-center fade-in">Why eScience?</h2>

          <div className="why-grid">
            <div className="why-card fade-in-scale">
              <div className="why-number">01</div>
              <h3>Proven Track Record</h3>
              <p>Established in 2000, we bring over two decades of expertise in developing enterprise mobile solutions. Employee-owned with nearly 100 tech specialists.</p>
            </div>
            <div className="why-card fade-in-scale delay-1">
              <div className="why-number">02</div>
              <h3>Award-Winning Solutions</h3>
              <p>Recognized nationally and internationally. Nominated as AWS Partner of the Year in 2018 for our innovative cloud solutions.</p>
            </div>
            <div className="why-card fade-in-scale delay-2">
              <div className="why-number">03</div>
              <h3>Mobile Technology Pioneers</h3>
              <p>Providing mobile solutions since 2000 through wireless technology. Zero downtime or interruptions over 24+ years.</p>
            </div>
            <div className="why-card fade-in-scale delay-3">
              <div className="why-number">04</div>
              <h3>Trusted Worldwide</h3>
              <p>Preferred technology partner of 100+ companies across multiple industries and countries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-watermark">
          <img src="/assets/images/logo/escience-icon.png" alt="" className="watermark-img" />
        </div>
        <div className="container">
          <h2 className="section-title-center fade-in">What Our Customers Say</h2>

          <div className="testimonials-grid">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className={`testimonial-card fade-up ${index > 0 ? `delay-${index}` : ''}`}>
                  <div className="testimonial-content">
                    <p>&quot;{testimonial.quote}&quot;</p>
                  </div>
                  <div className="testimonial-author">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="author-avatar"
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="author-avatar">
                        {testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                    )}
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-title">{testimonial.title}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="testimonial-card fade-up">
                <div className="testimonial-content">
                  <p>Loading testimonials...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section">
        <div className="container">
          <div className="cta-content fade-in-scale">
            <h2>Ready to Transform Your Business?</h2>
            <p>Join 100+ companies worldwide who trust eScience for their mobile solutions</p>
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your interest! This is a demo form.'); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" placeholder="Company Name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" placeholder="Phone Number" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows={4} placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" className="btn-primary-large">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link href="#" className="footer-logo-link" onClick={(e) => scrollToSection(e, 'body')}>
                <img src="/assets/images/logo/escience-logo-white.png" alt="eScience" className="footer-logo-img" />
              </Link>
              <p className="footer-tagline">Architects of Innovation since 2000</p>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p>Email: <a href="mailto:sales@electronicscience.net" className="footer-link">sales@electronicscience.net</a></p>
              <p>Phone: <a href="tel:+63288501324" className="footer-link">02-8850-1324</a></p>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="#">Terms and Conditions</Link>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">NPC Seal</Link>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <div className="social-links">
                <Link href="#" aria-label="Facebook">Facebook</Link>
                <Link href="#" aria-label="LinkedIn">LinkedIn</Link>
                <Link href="#" aria-label="Twitter">Twitter</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 eScience. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <button
        id="backToTop"
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Back to Top"
        onClick={scrollToTop}
      >
        <img src="/assets/images/logo/escience-icon.png" alt="" className="back-to-top-img" />
      </button>

      <ChatWidget />
    </>
  );
}
