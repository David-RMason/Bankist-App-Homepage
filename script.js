'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
let btnSrollTo = document.querySelector(".btn--scroll-to");
let section1 = document.querySelector("#section--1");
let tabs = document.querySelectorAll(".operations__tab");
let tabsContainer = document.querySelector(".operations__tab-container");
let tabsContent = document.querySelectorAll(".operations__content");
let navBar = document.querySelector(".nav");
let header = document.querySelector(".header");
let navHeight = navBar.getBoundingClientRect().height;
let allSections = document.querySelectorAll(".section");
let imgTargets = document.querySelectorAll("img[data-src]");


///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


// Sticky Nav Bar: Intersection Observer API

let stickyNav = function (entries) {
    let [entry] = entries;
    if (!entry.isIntersecting) navBar.classList.add("sticky")
    else navBar.classList.remove("sticky");
};
let headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Button Scroller

btnSrollTo.addEventListener("click", () => section1.scrollIntoView({ behavior: "smooth" }));


// Page Navigation

document.querySelector(".nav__links").addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("nav__link")) {
        let id = e.target.getAttribute("href");
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
});

// Menu Fade Animation

const handleHover = function (e) {
    if (e.target.classList.contains("nav__link")) {
        let link = e.target;
        let siblings = link.closest(".nav").querySelectorAll(".nav__link");

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
    };
};

// Passing "argument" using handler
navBar.addEventListener("mouseover", handleHover.bind(0.5));
navBar.addEventListener("mouseout", handleHover.bind(1));

// Tabbed Component

tabsContainer.addEventListener("click", function (e) {
    e.preventDefault();
    let clicked = e.target.closest(".operations__tab");
    // Guard clause
    if (!clicked) return;

    // Sort active tabs
    // Remove active class and content area
    tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
    tabsContent.forEach(tab => tab.classList.remove("operations__content--active"));

    // Activate tab and content area
    clicked.classList.add("operations__tab--active");
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});


// Reveal Sections on Scroll

let revealSection = function (entries, observer) {
    let [entry] = entries;
    if (!entry.isIntersecting) return
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
};
let sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});
allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add("section--hidden")
});


// Lazy Loading Images

let loadImg = function (entries, observer) {
    let [entry] = entries;
    if (!entry.isIntersecting) return

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", function () {
        entry.target.classList.remove("lazy-img");
    })

    observer.unobserve(entry.target);
};
let imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: "200px"
});
imgTargets.forEach(img => imgObserver.observe(img));


// Slider

let slider = function () {
    let slides = document.querySelectorAll(".slide");
    let sliderBtnLeft = document.querySelector(".slider__btn--left");
    let sliderBtnRight = document.querySelector(".slider__btn--right");
    let dotContainer = document.querySelector(".dots");
    let curSlide = 0;
    let maxSlide = slides.length;


    // Functions
    let createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML("beforeend",
                `<button class = "dots__dot" data-slide="${i}"></button>`)
        });
    };

    let activateDot = function (curSlide) {
        document
            .querySelectorAll(".dots__dot")
            .forEach(dot => dot.classList.remove("dots__dot--active"));

        document
            .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
            .classList
            .add("dots__dot--active");
    };

    let goToSlide = function (curSlide) {
        slides.forEach((s, i) => s.style.transform = `translateX(${(i - curSlide) * 100}%)`);
    };

    let nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    let prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    let init = function () {
        createDots();
        activateDot(0);
        goToSlide(0);
    };
    init();

    // Event Handlers
    sliderBtnRight.addEventListener("click", nextSlide);
    sliderBtnLeft.addEventListener("click", prevSlide)

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
    });

    dotContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("dots__dot")) {
            let { slide } = e.target.dataset;
            curSlide = +slide;
            goToSlide(slide);
            activateDot(slide);
        };

    });
};
slider();

// Scroll to top on reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}