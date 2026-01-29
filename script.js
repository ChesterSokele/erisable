// ===========================================
// CORE UTILITIES
// ===========================================

/**
 * Initialize mobile navigation toggle
 */
function initMobileNavigation() {
  const navToggles = document.querySelectorAll('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links');
  
  navToggles.forEach((toggle, index) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const links = navLinks[index];
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    navLinks.forEach(links => {
      if (links.style.display === 'flex' && 
          !links.contains(e.target) && 
          !Array.from(navToggles).some(toggle => toggle.contains(e.target))) {
        links.style.display = 'none';
      }
    });
  });
}

/**
 * Update copyright year in footer
 */
function updateCopyrightYear() {
  const yearElements = document.querySelectorAll('[id*="year"]');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(el => {
    if (el.id.includes('year')) {
      el.textContent = currentYear;
    }
  });
}

/**
 * Initialize Web3Forms submission handlers
 */
function initWeb3Forms() {
  const forms = document.querySelectorAll('form[action*="web3forms.com"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const formStatus = this.querySelector('.form-status');
      const originalBtnText = submitBtn.textContent;
      
      // Show sending status
      if (formStatus) {
        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'form-status sending';
        formStatus.style.display = 'block';
      }
      
      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      this.classList.add('form-loading');
      
      try {
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          // Success
          if (formStatus) {
            formStatus.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
            formStatus.className = 'form-status success';
          }
          
          // Reset form
          this.reset();
          
          // Auto-hide success message after 8 seconds
          setTimeout(() => {
            if (formStatus) formStatus.style.display = 'none';
          }, 8000);
        } else {
          // Error
          if (formStatus) {
            formStatus.textContent = result.message || 'Sorry, there was an error sending your message. Please try again.';
            formStatus.className = 'form-status error';
          }
          console.error('Form submission error:', result);
        }
      } catch (error) {
        // Network error
        if (formStatus) {
          formStatus.textContent = 'Network error. Please check your connection and try again.';
          formStatus.className = 'form-status error';
        }
        console.error('Network error:', error);
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        this.classList.remove('form-loading');
      }
    });
  });
}

// ===========================================
// COMPONENT INITIALIZERS
// ===========================================

/**
 * Create and add WhatsApp floating button
 */
function initWhatsAppButton() {
  if (document.querySelector('.whatsapp-float')) return;
  
  const whatsappButton = document.createElement('a');
  whatsappButton.href = 'https://wa.me/+264814599505';
  whatsappButton.className = 'whatsapp-float';
  whatsappButton.target = '_blank';
  whatsappButton.setAttribute('aria-label', 'Chat on WhatsApp');
  whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i><span class="whatsapp-tooltip">Chat with us!</span>';
  document.body.appendChild(whatsappButton);
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.hero, .features, .tour-preview, .testimonials, ' +
    '.tour-list, .rental-grid, .masonry, .contact-grid, ' +
    '.booking-form, .page-hero, .about-grid, .icons-grid, ' +
    '.rental-info, .feature, .card, .tour-item, ' +
    '.rental-card, .contact-card, .gallery-item, .package-card'
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Add staggered animations
  document.querySelectorAll('.feature, .card, .tour-item, .rental-card, .contact-card, .gallery-item, .package-card').forEach((el, index) => {
    el.classList.add('scroll-animate');
    if (index % 3 === 1) el.classList.add('delay-1');
    if (index % 3 === 2) el.classList.add('delay-2');
  });
}

/**
 * Initialize slideshow functionality
 */
function initSlideshow() {
  const slideshow = document.getElementById('slideshow');
  if (!slideshow) return;
  
  const slides = Array.from(slideshow.children);
  let currentSlide = 0;
  let autoPlayInterval;
  
  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slideshow.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
  }
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 6000);
  }
  
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  
  // Event listeners
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  
  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
  
  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  slideshow.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  slideshow.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }
  
  // Initialize
  showSlide(0);
  startAutoPlay();
  
  // Pause on hover
  slideshow.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });
  
  slideshow.addEventListener('mouseleave', () => {
    startAutoPlay();
  });
}

/**
 * Initialize package filtering
 */
function initPackageFilter() {
  const filterButtons = document.querySelectorAll('.category-btn');
  const packageCards = document.querySelectorAll('.package-card');
  
  if (!filterButtons.length || !packageCards.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-category');
      
      // Filter packages
      packageCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ===========================================
// PAGE INITIALIZATION
// ===========================================

/**
 * Initialize all page functionality
 */
function initializePage() {
  // Core utilities
  initMobileNavigation();
  updateCopyrightYear();
  initWeb3Forms();
  initWhatsAppButton();
  initScrollAnimations();
  
  // Page-specific components
  initSlideshow();
  initPackageFilter();
  
  // Handle SPA-like navigation
  if (window.history.pushState) {
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(initializePage, 100);
    };
    
    window.addEventListener('popstate', () => {
      setTimeout(initializePage, 100);
    });
  }
}

// ===========================================
// DOCUMENT READY
// ===========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Fallback for legacy browsers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
