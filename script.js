// small helpers for nav toggles (each page uses a separate toggle id)
function wireNav(toggleId, linksId){
  const t = document.getElementById(toggleId);
  const l = document.getElementById(linksId);
  if(!t || !l) return;
  t.addEventListener('click', ()=>{
    l.style.display = l.style.display === 'flex' ? 'none' : 'flex';
  });
}
wireNav('nav-toggle','nav-links');
wireNav('nav-toggle-2','nav-links-2');
wireNav('nav-toggle-3','nav-links-3');
wireNav('nav-toggle-4','nav-links-4');
wireNav('nav-toggle-5','nav-links-5');
wireNav('nav-toggle-6','nav-links-6');

// Footer year fillers
const years = ['year','year2','year3','year4','year5','year6'];
years.forEach(id => { const el = document.getElementById(id); if(el) el.textContent = new Date().getFullYear(); });

// Slideshow logic for home page
(function(){
  const slideshow = document.getElementById('slideshow');
  if(!slideshow) return;
  const slides = Array.from(slideshow.children);
  let idx = 0;
  function show(i){
    slides.forEach((s,si)=>{
      s.style.transform = `translateX(${(si-i)*100}%)`;
    });
  }
  show(0);
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  nextBtn?.addEventListener('click', ()=>{ idx = (idx+1)%slides.length; show(idx); });
  prevBtn?.addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; show(idx); });
  // auto play every 6 seconds
  setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 6000);
})();


// Web3Forms Submission Handler
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
          headers: {
            'Accept': 'application/json'
          }
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
            if (formStatus) {
              formStatus.style.display = 'none';
            }
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initWeb3Forms();
  
  // Also re-initialize if navigating between pages
  if (window.history.pushState) {
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(initWeb3Forms, 100);
    };
  }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const navLinks = document.querySelectorAll('.nav-links');
  const navToggles = document.querySelectorAll('.nav-toggle');
  
  navLinks.forEach(links => {
    if (links.style.display === 'flex' && !links.contains(e.target) && 
        !Array.from(navToggles).some(toggle => toggle.contains(e.target))) {
      links.style.display = 'none';
    }
  });
});

// WhatsApp Button
const whatsappButton = document.createElement('a');
whatsappButton.href = 'https://wa.me/+264814599505';
whatsappButton.className = 'whatsapp-float';
whatsappButton.target = '_blank';
whatsappButton.setAttribute('aria-label', 'Chat on WhatsApp');
whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i><span class="whatsapp-tooltip">Chat with us!</span>';
document.body.appendChild(whatsappButton);

// Scroll Animation Observer
function initScrollAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.hero, .features, .tour-preview, .testimonials, ' +
    '.tour-list, .rental-grid, .masonry, .contact-grid, ' +
    '.booking-form, .page-hero, .about-grid, .icons-grid, ' +
    '.rental-info, .feature, .card, .tour-item, ' +
    '.rental-card, .contact-card, .gallery-item'
  );

  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '0px 0px -50px 0px' // Adjust trigger point
  });

  // Observe each element
  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Add scroll-animate class to specific elements for staggered animations
  document.querySelectorAll('.feature, .card, .tour-item, .rental-card, .contact-card, .gallery-item').forEach((el, index) => {
    el.classList.add('scroll-animate');
    if (index % 3 === 1) el.classList.add('delay-1');
    if (index % 3 === 2) el.classList.add('delay-2');
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Re-initialize on page navigation (for SPA-like behavior)
if (window.history.pushState) {
  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(initScrollAnimations, 100);
  };

  window.addEventListener('popstate', () => {
    setTimeout(initScrollAnimations, 100);
  });
}