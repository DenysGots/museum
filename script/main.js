"use strict";

(function() {
	if (
		document.readyState === "complete" 
		||
		(document.readyState !== "loading" 
		&& !document.documentElement.doScroll
		)
	) {
		main();
	} else {
		document.addEventListener("DOMContentLoaded", main, false);
	}; 

	function main() {
		const buttons = document.querySelectorAll('[data-type="button"]');
		const outerWrapper = document.getElementsByClassName("main")[0]; 
		const mainPage = document.getElementsByClassName("main-page")[0];
		const secondaryPages = document.querySelectorAll('[data-type="interactive-block"]');

		const attachListeners = function(arrayLikeObject, callBackFunction) {
			return Array.prototype.slice.call(arrayLikeObject).forEach(function(obj) {
				obj.addEventListener("click", callBackFunction, false); 
			}); 
		}; 

		const handlePseudoArray = function(arrayLikeObject, callBackFunction) {
			if (callBackFunction) {
				return Array.prototype.slice.call(arrayLikeObject).forEach(callBackFunction); 
			} else {
				return Array.prototype.slice.call(arrayLikeObject); 
			}; 
		}; 

/* Buttons onclick handler */

		const handleRelocations = function(e) {
			const triggerNode = e.target;
			
			switch (triggerNode.getAttribute("data-function")) {
				case "nav-button":
					const targetName = triggerNode.getAttribute("data-target");
					const targetNodes = document.querySelectorAll('[data-name="'+targetName+'"]'); 
					const targetNode = targetNodes[0];
					const targetType = targetNode.getAttribute("data-type");
					const sameNodeTypes = document.querySelectorAll('[data-type="'+targetType+'"]');
					let triggerName; 

					if (triggerNode.getAttribute("data-name")) {
						triggerName = triggerNode.getAttribute("data-name");
					}; 
					
					switch (targetType) {
						case "interactive-block":
							handlePseudoArray(sameNodeTypes, function(obj) {
								if (!obj.classList.contains("display-hidden")) {
									obj.classList.add("display-hidden"); 
								};
							});

							targetNode.classList.remove("display-hidden"); 

							if (targetName === "main-page") {
								outerWrapper.scrollIntoView({block: "start", behavior: "smooth"});
							} else {
								targetNode.scrollIntoView({block: "start", behavior: "smooth"});
							}; 

							break; 

						case "interactive-section": 
							if (triggerName === targetName && targetNode.classList.contains("section-visible")) {
								targetNode.classList.remove("section-visible");
								outerWrapper.scrollIntoView({block: "start", behavior: "smooth"});
							} else {
								handlePseudoArray(sameNodeTypes, function(obj) {
									if (obj.classList.contains("section-visible")) {
										obj.classList.remove("section-visible"); 
									};
								}); 

								handlePseudoArray(secondaryPages, function(obj) {
									if (!obj.classList.contains("display-hidden")) {
										obj.classList.add("display-hidden"); 
									};
								});

								if (mainPage.classList.contains("display-hidden")) {
									mainPage.classList.remove("display-hidden")
								}; 

								targetNode.classList.add("section-visible");
								targetNode.scrollIntoView({block: "start", behavior: "smooth"}); 
							}; 

							break; 

						case "interactive-header-section":
							if (targetNode.classList.contains("display-hidden")) {
								handlePseudoArray(targetNodes, function(obj) {
									obj.classList.remove("display-hidden");
								}); 

								targetNode.parentNode.classList.add("header_nav-submenu-container-expand"); 
							} else {
								handlePseudoArray(targetNodes, function(obj) {
									obj.classList.add("display-hidden");
								}); 

								targetNode.parentNode.classList.remove("header_nav-submenu-container-expand"); 
							}; 
							break; 
					};

					break;

				case "search-button":

					break;

				case "purchase-button":

					break;  
			};
			e.preventDefault(); 
			e.stopPropagation(); 
		}; 
		 
/* Landing page slide show */

		function landingPageSlideShow() {
			const slides = document.getElementsByClassName("landing-page_slide"); 
			const backgroundSlides = document.getElementsByClassName("landing-page_background");
			const landingPageButton = document.getElementsByClassName("landing-page-button")[0]; 
			let currentSlide = 0; 
			let currentBackgroundSlide = 0;

			const generatePosition = function() {
				let randX = Math.round(Math.random() * 100);
				let randY = Math.round(Math.random() * 100);
				return ("background-position: " + randX + "% " + randY + "%")
			};

			slides[currentSlide].setAttribute("style", generatePosition());
			 
			const goToSlide = function(n) {
				slides[currentSlide].classList.remove("landing-page_slide-visible");
				backgroundSlides[currentSlide].classList.remove("landing-page_background-visible");
				currentSlide = (n + slides.length) % slides.length;
				slides[currentSlide].classList.add("landing-page_slide-visible");
				slides[currentSlide].setAttribute("style", generatePosition()); 
				backgroundSlides[currentSlide].classList.add("landing-page_background-visible");
			};
			
			const nextSlide = function() {
				goToSlide(currentSlide + 1); 
			}; 

			const slideInterval = setInterval(nextSlide, 3000);

			landingPageButton.addEventListener("click", function() {
				clearInterval(slideInterval); 
			}, false); 
		}; 

/* Main and secondary pages sliders */

		function handleSliders() {
			const sliders = document.querySelectorAll('[data-name="slider"]');

			handlePseudoArray(sliders, function(obj) {
				const leftButton = obj.querySelector('[data-name="left-slide-arrow"]'); 
				const rightButton = obj.querySelector('[data-name="right-slide-arrow"]'); 
				let slides = obj.querySelectorAll('[data-name="slide"]');
				let currentSlide = 0; 

				slides = handlePseudoArray(slides); 

				const goToSlide = function(n) {
					slides[currentSlide].classList.remove("slide-current");
					slides[currentSlide].classList.add("slide-hidden");
					currentSlide = (n + slides.length) % slides.length;
					slides[currentSlide].classList.remove("slide-hidden", "slide-prev", "slide-next");
					slides[currentSlide].classList.add("slide-current");
					slides[currentSlide - 1].classList.remove("slide-hidden", "slide-prev", "slide-next");
					slides[currentSlide - 1].classList.add("slide-prev");
					slides[currentSlide + 1].classList.remove("slide-hidden", "slide-prev", "slide-next");
					slides[currentSlide + 1].classList.add("slide-next");
				};

				const nextSlide = function() {
					goToSlide(currentSlide + 1);
				}; 

				const previousSlide = function() {
					goToSlide(currentSlide - 1);
				}; 

				rightButton.addEventListener("click", nextSlide); 
				leftButton.addEventListener("click", previousSlide); 
			}); 
		}; 

		attachListeners(buttons, handleRelocations);
		landingPageSlideShow(); 
		handleSliders(); // 
	}; 
})(); 