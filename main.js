// Manages slide visibility, animations, and scroll progress.
class SlideManager {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.scrollProgress = document.querySelector('.scroll-progress');
    this.currentSlideElement = document.querySelector('.current-slide');
    this.currentSlide = 1;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        this.updateScrollProgress();
        this.updateCurrentSlide();
      });
    });
    // Initial check
    this.updateScrollProgress();
    this.updateCurrentSlide();
  }

  updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset;
    const progress = (scrollTop / documentHeight) * 100;
    if (this.scrollProgress) {
      this.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  updateCurrentSlide() {
    const scrollPosition = window.pageYOffset + window.innerHeight * 0.5;
    this.slides.forEach((slide, index) => {
      const slideTop = slide.offsetTop;
      const slideBottom = slideTop + slide.offsetHeight;
      if (scrollPosition >= slideTop && scrollPosition < slideBottom) {
        const newSlide = index + 1;
        if (newSlide !== this.currentSlide) {
          this.currentSlide = newSlide;
          this.updateSlideCounter();
        }
      }
    });
  }

  updateSlideCounter() {
    if (this.currentSlideElement) {
      this.currentSlideElement.textContent = this.currentSlide;
    }
  }

  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -25% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Staggered animation for child elements
          const children = entry.target.querySelectorAll('.slide-content > *');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, options);

    this.slides.forEach(slide => observer.observe(slide));
  }

  // Method to navigate to specific slide
  goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < this.slides.length) {
      this.slides[slideIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Get current slide index
  getCurrentSlideIndex() {
    const scrollPosition = window.pageYOffset + window.innerHeight * 0.5;
    let currentIndex = 0;
    this.slides.forEach((slide, index) => {
      const slideTop = slide.offsetTop;
      const slideBottom = slideTop + slide.offsetHeight;
      if (scrollPosition >= slideTop && scrollPosition < slideBottom) {
        currentIndex = index;
      }
    });
    return currentIndex;
  }
}

// Manages header behavior on scroll.
class HeaderManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    if (!this.header) return;
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      this.header.style.background = 'rgba(255, 255, 255, 0.98)';
      this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      this.header.style.background = 'rgba(255, 255, 255, 0.95)';
      this.header.style.boxShadow = 'none';
    }

    if (currentScroll > this.lastScroll && currentScroll > 200) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }
    this.lastScroll = currentScroll;
  }
}

// Manages the slide navigation buttons
class SlideNavigation {
  constructor(slideManager) {
    this.slideManager = slideManager;
    this.upButton = document.getElementById('slideUp');
    this.downButton = document.getElementById('slideDown');
    this.init();
  }

  init() {
    if (!this.upButton || !this.downButton) return;
    
    this.upButton.addEventListener('click', () => this.navigateUp());
    this.downButton.addEventListener('click', () => this.navigateDown());
    
    // Update button states on scroll
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.updateButtonStates());
    });
    
    // Initial state
    this.updateButtonStates();
  }

  navigateUp() {
    const currentIndex = this.slideManager.getCurrentSlideIndex();
    const targetIndex = Math.max(currentIndex - 1, 0);
    this.slideManager.goToSlide(targetIndex);
  }

  navigateDown() {
    const currentIndex = this.slideManager.getCurrentSlideIndex();
    const totalSlides = this.slideManager.slides.length;
    const targetIndex = Math.min(currentIndex + 1, totalSlides - 1);
    this.slideManager.goToSlide(targetIndex);
  }

  updateButtonStates() {
    const currentIndex = this.slideManager.getCurrentSlideIndex();
    const totalSlides = this.slideManager.slides.length;
    
    // Disable up button if at first slide
    this.upButton.disabled = currentIndex === 0;
    
    // Disable down button if at last slide
    this.downButton.disabled = currentIndex === totalSlides - 1;
  }
}

// Adds minor interactive enhancements like ripple effects.
class InteractiveEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.addClickEffects();
  }

  addClickEffects() {
    const buttons = document.querySelectorAll('.cta-button, .nav-links a, .nav-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Don't add ripple to disabled buttons
        if (this.disabled) return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
}

// Handles keyboard navigation.
class KeyboardNavigation {
  constructor(slideManager) {
    this.slideManager = slideManager;
    this.init();
  }

  init() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(e) {
    const currentIndex = this.slideManager.getCurrentSlideIndex();
    const totalSlides = this.slideManager.slides.length;
    let targetIndex = currentIndex;

    switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        targetIndex = Math.min(currentIndex + 1, totalSlides - 1);
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        targetIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = totalSlides - 1;
        break;
      default:
        return; // Exit if not a navigation key
    }

    this.slideManager.goToSlide(targetIndex);
  }
}

// Initialize all components when the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  const slideManager = new SlideManager();
  new HeaderManager();
  new SlideNavigation(slideManager);
  new InteractiveEnhancements();
  new KeyboardNavigation(slideManager);
  
  if (window.location.hostname === 'localhost') {
    console.log('ClickGasto Landing Page inicializada con navegación lateral. 🚀');
  }
});
