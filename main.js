/**
 * Foxontherun — Client-side Interactivity
 * Focus: High performance, absolute visual precision, accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Sticky Header Scroll Fallback
  // ==========================================================================
  const header = document.getElementById('site-header');
  
  // Verify if scroll-driven CSS animations are supported natively
  const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  
  if (!supportsScrollTimeline) {
    // Elegant JS scroll-event listener fallback for shrinking/scrolling header
    const checkScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    // Initial check
    checkScroll();
    
    // Listen to scroll events (passive: true for optimal scroll performance)
    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  // ==========================================================================
  // 2. Active Anchor Section Highlighting
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Pinpoint active items in center third of screen
    threshold: 0
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Find corresponding link
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Clear active markers if user scrolls completely to top (Hero section)
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      navLinks.forEach(link => link.classList.remove('active'));
    }
  }, { passive: true });

  // ==========================================================================
  // 3. Responsive Mobile Overlay Menu (WAI-ARIA Compliant)
  // ==========================================================================
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle ARIA attributes
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.setAttribute('aria-hidden', isExpanded);
    
    // Toggle active classes
    mobileNav.classList.toggle('open');
    
    // Toggle background scrolling to prevent double-scrollbar jumpiness
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Click handler
  menuToggle.addEventListener('click', toggleMenu);
  
  // Close menu and scroll smoothly when clicking link
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Toggle off mobile menu first
      toggleMenu();
      
      // Allow default smooth hash scrolling (progressive enhancement)
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Extra fine adjustment for scroll header offset height
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle ESC key to close mobile nav for screen readers and accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu();
    }
  });
});
