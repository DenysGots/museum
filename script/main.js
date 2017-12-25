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
			const triggerNodeFunction = triggerNode.getAttribute("data-function"); 
			const targetName = triggerNode.getAttribute("data-target");
			const targetNodes = document.querySelectorAll('[data-name="'+targetName+'"]'); 
			const targetNode = targetNodes[0];

			let targetType;
			let triggerName; 
			let triggerNodeSubfunction; 

			if (targetNode && targetNode.hasAttribute("data-type")) {
				targetType = targetNode.getAttribute("data-type");
			}; 
			
			if (triggerNode && triggerNode.hasAttribute("data-name")) {
				triggerName = triggerNode.getAttribute("data-name");
			}; 

			if (triggerNode && triggerNode.hasAttribute("data-subfunction")) {
				triggerNodeSubfunction = triggerNode.getAttribute("data-subfunction");
			}; 

			const sameNodeTypes = document.querySelectorAll('[data-type="'+targetType+'"]');
			
			switch (triggerNodeFunction) { 
				case "nav-button": {
					switch (targetType) {
						case "interactive-block": {
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
						}

						case "interactive-section": {
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
									mainPage.classList.remove("display-hidden");
								}; 

								targetNode.classList.add("section-visible");
								targetNode.scrollIntoView({block: "start", behavior: "smooth"}); 
							}; 

							break; 
						}

						case "interactive-header-section": {
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
						}
					};

					break;
				}

				case "search-button": {

					break;
				}

				case "slide-arrow": {
					const slides = handlePseudoArray(targetNode.querySelectorAll('[data-name="slide"]')); 
					const slidesLength = slides.length; 

					let currentSlide = slides.indexOf(slides.filter(function(elem) {
						if (elem.classList.contains("slide-current")) {
							return elem; 
						};
					})[0]);

					const goToSlide = function(n) {
						return (slidesLength + currentSlide + n) % slides.length;
					}; 

					switch(triggerNodeSubfunction) {
						case "left-slide-arrow": {
							slides[currentSlide].classList.add("slide-next");
							slides[currentSlide].classList.remove("slide-current");

							slides[goToSlide(1)].classList.add("slide-hidden");
							slides[goToSlide(1)].classList.remove("slide-next");
							
							slides[goToSlide(-1)].classList.add("slide-current");
							slides[goToSlide(-1)].classList.remove("slide-prev");

							slides[goToSlide(-2)].classList.add("slide-prev");
							slides[goToSlide(-2)].classList.remove("slide-hidden");

							break;
						}

						case "right-slide-arrow": {
							slides[currentSlide].classList.remove("slide-current");
							slides[currentSlide].classList.add("slide-prev");
												
							slides[goToSlide(1)].classList.remove("slide-next");
							slides[goToSlide(1)].classList.add("slide-current");
							
							slides[goToSlide(2)].classList.remove("slide-hidden");
							slides[goToSlide(2)].classList.add("slide-next"); 
							
							slides[goToSlide(-1)].classList.remove("slide-prev");
							slides[goToSlide(-1)].classList.add("slide-hidden");

							break;
						}
					};

					break;
				}

				case "interactive-tours-section": {
					let triggerNodeParrent;
					let triggerNodeParrentWrapper;
					let triggerNodeNextSibling;
					let visitType;
					let visitTypeValue;
					let visitLength;
					let visitLengthValue; 
					let visitDate;
					let visitTime;
					let visitTimeValue;
					let visitTimeOfTheDay; 
					let visitTimeOfTheDayValue; 
					let visitorsAge;
					let visitorsAgeValue;
					let visitorsAgeSection;
					let selectedProgram;
					let selectedExhibits; 
					let programsSection;
					let fullDayProgramsSection;
					let adultsProgramsSection;
					let youngerChildrenProgramsSection;
					let olderChildrenProgramsSection;
					let halfDayProgramsSection;
					let numberOfAdults;
					let numberOfYoungerChildren;
					let numberOfOlderChildren;
					let numberOfBeneficiaries;
					let numberOfVisitors; 
					let totalCost; 
					let totalTicketsCost = 0;
					let totalNumberOfVisitors = 0;

					for (
						triggerNodeParrent = triggerNode.parentNode; 
						!triggerNodeParrent.classList.contains("main-page_subsection-block"); 
						triggerNodeParrent = triggerNodeParrent.parentNode
					) {};

					triggerNodeParrentWrapper = triggerNodeParrent.parentNode;
					triggerNodeNextSibling = triggerNodeParrent.nextElementSibling;

					if (triggerNodeNextSibling.classList.contains("main-page_subsection-block-hidden")) {
						triggerNodeNextSibling.classList.remove("main-page_subsection-block-hidden");
					}; 

					if (triggerNodeNextSibling.classList.contains("main-page_subsection-block-removed")) {
						triggerNodeNextSibling.nextElementSibling.classList.remove("main-page_subsection-block-hidden");
					}

					visitType = triggerNodeParrentWrapper.querySelector('[name="admission"]:checked');
					visitLength = triggerNodeParrentWrapper.querySelector('[name="days"]:checked'); 
					visitDate = triggerNodeParrentWrapper.querySelector('[name="date"]'); 
					visitTime = triggerNodeParrentWrapper.querySelector('[name="part-of-the-day"]:checked'); 
					visitTimeOfTheDay = triggerNodeParrentWrapper.querySelector('[name="time"]:checked'); 
					visitorsAge = triggerNodeParrentWrapper.querySelector('[name="age"]:checked');
					selectedProgram = triggerNodeParrentWrapper.querySelector('[name="program"]:checked');
					selectedExhibits = triggerNodeParrentWrapper.querySelectorAll('[name="exhibit"]:checked');
					numberOfAdults = triggerNodeParrentWrapper.querySelector('[name="adults"]');
					numberOfYoungerChildren = triggerNodeParrentWrapper.querySelector('[name="younger-children"]');
					numberOfOlderChildren = triggerNodeParrentWrapper.querySelector('[name="older-children"]');
					numberOfBeneficiaries = triggerNodeParrentWrapper.querySelector('[name="beneficiaries"]');
					programsSection = triggerNodeParrentWrapper.querySelector(".programs-section");				
					visitorsAgeSection = triggerNodeParrentWrapper.querySelectorAll(".visitors-age-section");
					fullDayProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".full-day-programs-section");
					halfDayProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".half-day-programs-section");
					adultsProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".adults-programs-section");
					youngerChildrenProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".younger-children-programs-section");
					olderChildrenProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".older-children-programs-section");
					numberOfVisitors = triggerNodeParrentWrapper.querySelector(".visitors-number");
					totalCost = triggerNodeParrentWrapper.querySelector(".total-cost");
					visitTypeValue = (visitType) ? visitType.value : "none";
					visitLengthValue = (visitLength) ? visitLength.value : "none";
					visitTimeValue = (visitTime) ? visitTime.value : "none";
					visitorsAgeValue = (visitorsAge) ? visitorsAge.value : "none";
					visitTimeOfTheDayValue = (visitTimeOfTheDay) ? visitTimeOfTheDay.value : "none";
					
					totalNumberOfVisitors = function() {
						let result = (
							parseInt(numberOfAdults.value) + 
							parseInt(numberOfYoungerChildren.value) + 
							parseInt(numberOfOlderChildren.value) + 
							parseInt(numberOfBeneficiaries.value)
						); 

						if (result === 1) {
							result += " person"; 
						} else {
							result += " people"; 
						};

						return result;
					};

					totalTicketsCost = function() {
						let constructProgram = (targetName === "construct-program") ? 1 : 0;
						let freeAdmission = (visitTypeValue === "free-admission") ? 1 : 0;
						let programAdmission = (visitTypeValue === "program") ? 1 : 0;
						let oneDayAdmission = (visitLengthValue === "one-day") ? 1 : 0;
						let twoDaysAdmission = (visitLengthValue === "two-days") ? 1.5 : 0;
						let fullDayAdmission = (visitTimeValue === "full-day") ? 1 : 0;
						let halfDayAdmission = (visitTimeValue === "half-day") ? 0.5 : 0;
						let timeOfVisit = (visitTimeOfTheDayValue === "full-day") ? 1 : 0.5;
						let numberOfSelectedExhibits = (selectedExhibits) ? handlePseudoArray(selectedExhibits).length : 0; 

						console.log(numberOfSelectedExhibits);

						let relativeVisitorsQuantity = (
							parseInt(numberOfAdults.value) + 
							0.3 * parseInt(numberOfYoungerChildren.value) + 
							0.7 * parseInt(numberOfOlderChildren.value) + 
							0 * parseInt(numberOfBeneficiaries.value)
						);

						let result = (
							100 * constructProgram + 
							(50 * programAdmission + 20 * freeAdmission + 10 * numberOfSelectedExhibits) * 
							(oneDayAdmission + twoDaysAdmission + constructProgram) * 
							(fullDayAdmission + halfDayAdmission + timeOfVisit) * 
							relativeVisitorsQuantity
						);

						return result;
					};

					numberOfVisitors.innerHTML = totalNumberOfVisitors(); 
					totalCost.innerHTML = totalTicketsCost(); 

					switch (visitTypeValue) {
						case "free-admission": {
							programsSection.classList.remove("main-page_subsection-block-hidden"); 
							programsSection.classList.add("main-page_subsection-block-removed"); 

							handlePseudoArray(visitorsAgeSection, (function(obj) {
								obj.setAttribute("disabled", "disabled"); 
							})); 

							break;
						}

						case "program": {
							programsSection.classList.remove("main-page_subsection-block-removed");

							handlePseudoArray(visitorsAgeSection, (function(obj) {
								obj.removeAttribute("disabled"); 
							})); 

							handlePseudoArray(programsSection, (function(obj) {
								obj.removeAttribute("disabled"); 
							})); 

							switch (visitTimeValue) {
								case "full-day": {
									handlePseudoArray(fullDayProgramsSection, (function(obj) {
										obj.removeAttribute("disabled"); 
									})); 

									handlePseudoArray(halfDayProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									break; 
								}

								case "half-day": {
									handlePseudoArray(fullDayProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									handlePseudoArray(halfDayProgramsSection, (function(obj) {
										obj.removeAttribute("disabled"); 
									})); 

									break; 
								}
							};

							switch (visitorsAgeValue) {
								case "younger-children":{
									handlePseudoArray(adultsProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									handlePseudoArray(olderChildrenProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									break;
								}

								case "older-children": {
									handlePseudoArray(adultsProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									handlePseudoArray(youngerChildrenProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									break; 
								}

								case "adults": {
									handlePseudoArray(youngerChildrenProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									handlePseudoArray(olderChildrenProgramsSection, (function(obj) {
										obj.setAttribute("disabled", "disabled"); 
									})); 

									break; 
								}
							};

							break; 
						}
					};

					if (triggerNodeFunction === "purchase-button") {

					
						if (triggerNodeNextSibling.classList.contains("main-page_subsection-block-hidden")) {
							triggerNodeNextSibling.classList.remove("main-page_subsection-block-hidden");
						}; 
					}; 

					break; 
				}
			};

			e.preventDefault(); 
			e.stopPropagation(); 
		}; 

		attachListeners(buttons, handleRelocations);
		 
		/* Landing page slideshow */

		const landingPageSlideShow = (function() {
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

			const slideInterval = setInterval(nextSlide, 4000);

			landingPageButton.addEventListener("click", function() {
				clearInterval(slideInterval); 
			}, false); 
		})();

		const adjustSectionsHeight = (function() {

		})(); 
	}; 
})();