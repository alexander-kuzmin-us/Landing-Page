/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * 
*/

// Get all sections and store in an array of sections
const sections = document.getElementsByTagName('section');
// Get length of sections array
const sectionLength = sections.length;
// Get nav parent element and store in a variable
const navParent = document.getElementById('navbar__list');

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

// Create a nav element
let navElement = (sectionID, sectionDataNav) => {
    const el = `<li><a class="menu__link" href="#${sectionID}">${sectionDataNav}</a></li>`;
    return el;
};

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/


// build the nav
const buildNav = () => {
    for (let i = 0; i < sectionLength; i++) {
        const sectionID = sections[i].id; // Get section ID from section array
        const sectionDataNav = sections[i].dataset.nav; // Get section data-nav from section array
        navParent.innerHTML += navElement(sectionID, sectionDataNav); // Add nav element to nav parent
    }
};

buildNav(); // Call buildNav function



// Add class 'active' to section when near top of viewport
const addActiveClass = () => {
    for (const section of sections) {
        const sectionTop = section.getBoundingClientRect().top; // Get section top
        const sectionBottom = section.getBoundingClientRect().bottom; // Get section bottom
        if (sectionTop < 100 && sectionBottom > 100) {
            section.classList.add('your-active-class');
        } else {
            section.classList.remove('your-active-class');
        }
    }
};

// Make sections active when scrolling
document.addEventListener('scroll', addActiveClass);

// Scroll to anchor ID using scrollTO event


/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 

// Scroll to section on link click

// Set sections as active
