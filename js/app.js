/**
 *
 * Landing Page Project
 *
 * Dependencies: None
 * JS Version: ES2015/ES6
 *
*/

/**
 * Define Global Variables
 */
const sections = document.querySelectorAll('section');
const navList = document.getElementById('navbar__list');
const header = document.querySelector('.page__header');
let lastScrollY = window.scrollY;
let isScrolling = false;

/**
 * Helper Functions
 */

// Debounce function to limit scroll event firing
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  // Determine if the element is in viewport with 40% visibility threshold
  return (
    rect.top <= windowHeight * 0.4 &&
    rect.bottom >= windowHeight * 0.4
  );
}

/**
 * Main Functions
 */

// Build the navigation menu
function buildNav() {
  const fragment = document.createDocumentFragment();

  sections.forEach((section) => {
    const sectionId = section.id;
    const sectionTitle = section.getAttribute('data-nav');

    const navItem = document.createElement('li');
    const navLink = document.createElement('a');

    navLink.textContent = sectionTitle;
    navLink.classList.add('menu__link');
    navLink.setAttribute('href', `#${sectionId}`);
    navLink.setAttribute('aria-label', `Scroll to ${sectionTitle}`);

    navItem.appendChild(navLink);
    fragment.appendChild(navItem);
  });

  navList.appendChild(fragment);
}

// Add active class to section and corresponding nav item
function setActiveSection() {
  sections.forEach((section) => {
    const sectionId = section.id;
    const navItem = document.querySelector(`.menu__link[href="#${sectionId}"]`);

    if (isInViewport(section)) {
      // Add active class to section
      section.classList.add('your-active-class');
      // Add active class to nav item
      navItem.classList.add('active-link');
    } else {
      // Remove active class from section
      section.classList.remove('your-active-class');
      // Remove active class from nav item
      navItem.classList.remove('active-link');
    }
  });
}

// Handle header visibility on scroll
function toggleHeaderVisibility() {
  const currentScrollY = window.scrollY;

  // Show header when scrolling up, hide when scrolling down
  if (currentScrollY > lastScrollY) {
    // Scrolling down
    header.classList.add('hide-header');
  } else {
    // Scrolling up
    header.classList.remove('hide-header');
  }

  lastScrollY = currentScrollY;
}

// Scroll to section on link click
function setupScrollToSection() {
  navList.addEventListener('click', function(event) {
    if (event.target.classList.contains('menu__link')) {
      event.preventDefault();

      const targetId = event.target.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      // Fallback for browsers that don't support smooth scrolling
      if ('scrollBehavior' in document.documentElement.style) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Polyfill smooth scrolling
        const targetPosition = targetSection.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          const easeInOutCubic = percentage < 0.5
            ? 4 * percentage * percentage * percentage
            : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

          window.scrollTo(0, startPosition + distance * easeInOutCubic);

          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }

        window.requestAnimationFrame(step);
      }
    }
  });
}

// Setup observer for handling mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.createElement('button');
  menuToggle.classList.add('menu-toggle');
  menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
  menuToggle.innerHTML = '<span></span><span></span><span></span>';

  header.insertBefore(menuToggle, navList);

  menuToggle.addEventListener('click', function() {
    navList.classList.toggle('menu-active');
    menuToggle.classList.toggle('active');

    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !isExpanded);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!header.contains(event.target) && navList.classList.contains('menu-active')) {
      navList.classList.remove('menu-active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Handle scroll events with debounce for better performance
const handleScroll = debounce(function() {
  if (!isScrolling) {
    window.requestAnimationFrame(function() {
      setActiveSection();
      toggleHeaderVisibility();
      isScrolling = false;
    });
  }
  isScrolling = true;
}, 20);

/**
 * Initialize all functions
 */
function init() {
  // Build the navigation
  buildNav();

  // Setup scroll to section functionality
  setupScrollToSection();

  // Setup mobile menu
  setupMobileMenu();

  // Set active section on initial load
  setActiveSection();

  // Set up event listeners
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', debounce(setActiveSection, 150));

  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-user');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-user');
  });
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
