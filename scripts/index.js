// Imports
import _Select from "./select.js";
import translations from "../data/translations.js";



const elmNavbarSelect = document.getElementById("elmNavbarSelect");
const countrySelect = new _Select(elmNavbarSelect);
countrySelect.onSelect = (value) => {
    document.querySelectorAll("[data-tid]").forEach(elm => {
        const id = elm.getAttribute("data-tid");
        const translation = translations[value][id];
        if (translation) {
            elm.textContent = translation;
        }
    });
}



const stickyElement = document.querySelector(".sticky-element");
const VH = window.innerHeight * 1.05;
const TOP = 70;
const WHITE = 255;

document.addEventListener("scroll", () => {
    // Get % of 100vh scrolled
    const scroll = window.scrollY;
    const scrollPercent = (scroll / VH) * 100;

    // reduce TOP to 0 as scrollPercent goes to 100
    const top = TOP - (TOP * (scrollPercent / 100));
    if (top >= 0) {
        stickyElement.style.top = `${top}%`;
    }

    // reduce whiteness to 230 as scrollPercent goes to 100
    const whiteness = WHITE - (WHITE * (scrollPercent / 800));
    if (whiteness >= 230) {
        document.documentElement.style.backgroundColor = `rgb(${whiteness}, ${whiteness}, 255)`;
    }
});

window.addEventListener("load", () => {
    const scroll = window.scrollY;
    const scrollPercent = (scroll / VH) * 100;
    const whiteness = Math.max(WHITE - (WHITE * (scrollPercent / 800)), 230);
    document.documentElement.style.backgroundColor = `rgb(${whiteness}, ${whiteness}, 255)`;
});



// Sticky navbar
// const navbar = document.querySelector(".navbar");
// const trigger = document.querySelector(".project-container");

// const observer = new IntersectionObserver(
//     (entries) => {
//         if (entries[0].isIntersecting) {
//             navbar.classList.add("solid");
//         } else {
//             navbar.classList.remove("solid");
//         }
//     },
//     { 
//         threshold: 0,
//         rootMargin: "0px 0px -5% 0px"
//     }
// );

// observer.observe(trigger);
const topGradient = document.querySelector(".top-gradient");
const trigger = document.querySelector(".project-container");
const observer = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
            topGradient.classList.add("hidden");
        } else {
            topGradient.classList.remove("hidden");
        }
    },
    { 
        threshold: 0,
        rootMargin: "0px 0px -5% 0px"
    }
);
observer.observe(trigger);



// Fade in elements
const fadeInOptions = {
    root: null,
    threshold: 0.5,
    rootMargin: "0px",
}
  
const fadeInObserver = new IntersectionObserver((entries, fadeInObserver) => {
    entries.forEach(entry => { 
        if (entry.isIntersecting) { 
            entry.target.classList.add("shown");
        }
        if (!entry.isIntersecting) {
            entry.target.classList.remove("shown");
        }
    });
}, fadeInOptions);

const fadeInElements = document.querySelectorAll(".project");

fadeInElements.forEach(section => {
    fadeInObserver.observe(section);
});