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

// Booking form handler (example — replace with real endpoint)
function handleBooking(e){
  e.preventDefault();
  const f = e.target;
  const data = Object.fromEntries(new FormData(f).entries());
  
  // Here you would typically send the data to your server
  // For now, we'll just show a confirmation message
  alert('Thanks '+(data.name||'traveller')+" — booking request sent. We'll contact you shortly.");
  f.reset();
}

// Email form handler
function handleEmailForm(e) {
  e.preventDefault();
  const f = e.target;
  const data = Object.fromEntries(new FormData(f).entries());
  
  // Here you would typically send the data to your server/email service
  // For now, we'll just show a confirmation message
  alert('Thank you for your message, ' + (data.name || 'traveller') + '! We will get back to you soon.');
  f.reset();
}

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