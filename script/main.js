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
		const outerWrapper = document.getElementsByClassName("main")[0];
		const mainPage = document.getElementsByClassName("main-page")[0];
		const secondaryPages = document.querySelectorAll('[data-type="interactive-block"]');
		const siteSections = document.getElementsByClassName("site-section");
		const userIssuesWindow = document.getElementsByClassName("user-issues-section")[0];
		const userIssuesMessage = document.getElementsByClassName("user-issues-message")[0];
		const blurryScreen = document.getElementsByClassName("blurry-screen")[0];

		let buttons;

		/* Transform array-like object to array and apply function for each element */

		const handlePseudoArray = function(arrayLikeObject, callBackFunction) {
			if (callBackFunction) {
				return Array.prototype.slice.call(arrayLikeObject).forEach(callBackFunction);
			} else {
				return Array.prototype.slice.call(arrayLikeObject);
			};
		};

		/* Attach listeners to elements */

		const attachListeners = function(arrayLikeObject, callBackFunction, eventType) {
			return handlePseudoArray(arrayLikeObject, function(obj) {
				obj.addEventListener(eventType, callBackFunction, false);
			});
		};

		/* Clear array from duplicate elements */

		const filterUniqueElements = function(array) {
			var seenElements = {};

			array.sort(function(a, b) {
				return (a - b);
			});
			
			return array.filter(function(x) {
				if (seenElements[x]) {
					return;
				};
				
				seenElements[x] = true;
				
				return x;
			});
		};

		/* Increase height of low-height pages */

		const adjustSectionsHeight = function(node) {
			const header = document.getElementsByClassName("header")[0];
			const footer = document.getElementsByClassName("footer")[0];

			let documentHeight;
			let sectionHeight;
		
			if (window.screen.availHeight) {
				documentHeight = window.screen.availHeight;
			} else {
				documentHeight = Math.max(
					document.body.scrollHeight, document.documentElement.scrollHeight,  
					document.body.offsetHeight, document.documentElement.offsetHeight,
					document.body.clientHeight, document.documentElement.clientHeight, 
					window.innerHeight
				);
			};
			
			sectionHeight = documentHeight - header.offsetHeight - header.style.marginBottom - footer.offsetHeight - footer.style.marginTop; 
			
			node.style.minHeight = sectionHeight + "px";
		};

		/* Handle gallery images layout and pagination */

		const handleGallery = function(currentPage, sortImages, handlePages) {
			const galleryImagesContainer = document.getElementsByClassName("gallery_images_preview")[0];
			const galleryPagesContainer = document.getElementsByClassName("gallery_images_pages-container")[0];
			const galleryImagesSrc = "../images/Gallery/";
			
			let galleryElements;
			let galleryElementsContainers;
			let documentFragment;
			let galleryPage;
			let visibleGalleryElements;
			let visibleGalleryElementsLength;
			let numberOfPages;

			currentPage = (currentPage !== undefined) ? currentPage : 1;
			sortImages = (sortImages !== undefined) ? sortImages : true;
			handlePages = (handlePages !== undefined) ? handlePages : true;

			galleryElements = handlePseudoArray(document.getElementsByClassName("gallery_image"));
			galleryElementsContainers = handlePseudoArray(document.getElementsByClassName("gallery_image-container"));

			/* Randomize images sequence */
			if (sortImages) {
				galleryElementsContainers.sort(function(a, b) {
					return (Math.random() * galleryElements.indexOf(a) - Math.random() * galleryElements.indexOf(b));
				});

				galleryImagesContainer.innerHTML = "";

				documentFragment = document.createDocumentFragment();

				galleryElementsContainers.forEach(function(obj) {
					documentFragment.appendChild(obj);
				});

				galleryImagesContainer.appendChild(documentFragment);
			};

			visibleGalleryElements = galleryElements.filter(function(obj) {
				if (obj.parentNode) {
					return (!obj.parentNode.classList.contains("display-image-removed"));
				};
			});

			visibleGalleryElementsLength = visibleGalleryElements.length;

			numberOfPages = Math.ceil(visibleGalleryElementsLength / 9);

			if (handlePages) {
				documentFragment = document.createDocumentFragment();
				galleryPagesContainer.innerHTML = "";

				for (let i = 1;i <= numberOfPages;i += 1) {
					galleryPage = document.createElement("p");
					galleryPage.classList.add("gallery_images_page");
					galleryPage.setAttribute("data-type", "button");
					galleryPage.setAttribute("data-target", "gallery-section");
					galleryPage.setAttribute("data-function", "gallery-pagination");
					galleryPage.setAttribute("data-page", i);
					galleryPage.innerHTML = i;
					documentFragment.appendChild(galleryPage);
				};

				galleryPagesContainer.appendChild(documentFragment);
			};

			visibleGalleryElements.forEach(function(obj) {
				obj.setAttribute("data-page", (Math.floor(visibleGalleryElements.indexOf(obj) / 9 + 1)));

				if (parseInt(obj.getAttribute("data-page")) !== currentPage) {
					obj.parentNode.classList.add("display-image-hidden");
				} else {
					if (!obj.getAttribute("src")) {
						const galleryElementGroup = obj.getAttribute("data-group");
						const galleryElementName = obj.getAttribute("data-name");
						const galleryElementSrc = galleryImagesSrc + galleryElementGroup + "/" + galleryElementName;

						obj.setAttribute("src", galleryElementSrc);
					};

					if (obj.parentNode.classList.contains("display-image-hidden")) {
						obj.parentNode.classList.remove("display-image-hidden");
					};
				};
			});
		};

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

				return ("background-position: " + randX + "% " + randY + "%");
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

		/* Buttons and active elements onclick-handler */

		const handleRelocations = function(e) {
			const triggerNode = e.target;
			const triggerNodeFunction = triggerNode.getAttribute("data-function");
			const targetName = triggerNode.getAttribute("data-target");
			const targetNodes = document.querySelectorAll('[data-name="'+targetName+'"]');
			const targetNode = targetNodes[0];

			let targetType;
			let sameNodeTypes;
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

			sameNodeTypes = document.querySelectorAll('[data-type="'+targetType+'"]');
			
			switch (triggerNodeFunction) { 
				case "nav-button": {
					switch (targetType) {
						case "interactive-block": {
							handlePseudoArray(sameNodeTypes, function(obj) {
								if (!obj.classList.contains("display-hidden")) {
									obj.classList.add("display-hidden");
									obj.style.minHeight = 0;
								};
							});

							targetNode.classList.remove("display-hidden");

							adjustSectionsHeight(targetNode);

							if (targetName === "main-page") {
								outerWrapper.scrollIntoView({block: "start", behavior: "smooth"});
							} else {
								targetNode.scrollIntoView({block: "start", behavior: "smooth"});
							};

							break;
						}

						case "interactive-section": {
							handlePseudoArray(siteSections, function(obj) {
								obj.style.minHeight = 0;
							});

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

					switch (triggerNodeSubfunction) {
						case "search-button": {
							const searchableContent = handlePseudoArray(document.querySelectorAll('[data-searchable]'));
							const searchResultsSection = targetNode.getElementsByClassName("search-results-list")[0];
							const searchInputTextfield = document.getElementsByClassName("input_textfield-search")[0];

							let searchQuery = document.getElementsByClassName("input_textfield-search")[0].value;
							let searchResults = [];
							let fragment;
							let searchResultBlock;
							let sitePage;
							let sitePageHeading;
							let sitePageDescription;

							targetNode.querySelector(".search-query").innerHTML = '"' + searchQuery + '"';

							searchQuery = searchQuery.toString().toLowerCase().trim();
							searchQuery = searchQuery + " " + searchQuery.replace(/[^\w]/g, ' ');
							searchQuery = searchQuery.split(' ');
							searchQuery.filter(function(elem) {
								return /\S/.test(elem);
							});

							searchQuery = filterUniqueElements(searchQuery);

							searchableContent.forEach(function(obj) {
								searchQuery.forEach(function(elem) {
									let regExp = new RegExp("\\s?" + elem + "\\s?", "gim");

									if (obj.innerHTML.toString().match(regExp)) {
										searchResults.push(obj.getAttribute("data-name") || obj.getAttribute("data-target"));
									};
								});
							});

							searchResults = filterUniqueElements(searchResults);

							searchResults.forEach(function(obj) {
								searchResultBlock = document.createElement("div");
								searchResultBlock.classList.add("main-page_section-exhibit-preview", "search-results-page_section");
								searchResultBlock.innerHTML = '<div class="search-results-page_subsection" data-type="button" data-target data-function="nav-button">' + 
																							'<h2 class="heading-h2" data-type="button" data-target data-function="nav-button"></h2>' + 
																				  		'<p class="text" data-type="button" data-target data-function="nav-button">' + 
																							'</p>'
																							'</div>';

								sitePage = document.querySelector('[data-name="'+obj+'"]');
								fragment = document.createDocumentFragment();

								sitePageHeading = sitePage.querySelector(".heading-h1").innerHTML || "";
								sitePageDescription = sitePage.querySelector(".text").innerHTML || "";

								searchResultBlock.setAttribute("data-target", obj);

								searchResultBlock.querySelector(".heading-h2").setAttribute("data-target", obj);
								searchResultBlock.querySelector(".text").setAttribute("data-target", obj);

								searchResultBlock.querySelector(".heading-h2").innerHTML = sitePageHeading;
								searchResultBlock.querySelector(".text").innerHTML = sitePageDescription;

								fragment.appendChild(searchResultBlock);
								searchResultsSection.appendChild(fragment);
							});

							buttons = document.querySelectorAll('[data-type="button"]');

							attachListeners(buttons, handleRelocations, "click");
						}

						break;
					};

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
					let visitDateValue;
					let visitTime;
					let visitTimeValue;
					let visitTimeOfTheDay;
					let visitTimeOfTheDayValue;
					let visitorsAge;
					let visitorsAgeValue;
					let visitorsAgeSection;
					let selectedProgram;
					let selectedExhibits;
					let numberOfSelectedExhibits;
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
					let personalData;
					let totalTicketsCost = 0;
					let totalNumberOfVisitors = 0;

					for (
						triggerNodeParrent = triggerNode.parentNode;
						!triggerNodeParrent.classList.contains("main-page_subsection-block");
						triggerNodeParrent = triggerNodeParrent.parentNode
					) {};

					triggerNodeParrentWrapper = triggerNodeParrent.parentNode;
					triggerNodeNextSibling = triggerNodeParrent.nextElementSibling;

					if (triggerNodeNextSibling.classList.contains("main-page_subsection-block-hidden") && 
						 !triggerNode.classList.contains("confirm-order-button")) {
						triggerNodeNextSibling.classList.remove("main-page_subsection-block-hidden");
					};

					if (triggerNodeNextSibling.classList.contains("main-page_subsection-block-removed")) {
						triggerNodeNextSibling.nextElementSibling.classList.remove("main-page_subsection-block-hidden");
					};

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
					numberOfVisitors = triggerNodeParrentWrapper.querySelector(".visitors-number");
					totalCost = triggerNodeParrentWrapper.querySelector(".total-cost");
					visitorsAgeSection = triggerNodeParrentWrapper.querySelectorAll(".visitors-age-section");
					fullDayProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".full-day-programs-section");
					halfDayProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".half-day-programs-section");
					adultsProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".adults-programs-section");
					youngerChildrenProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".younger-children-programs-section");
					olderChildrenProgramsSection = triggerNodeParrentWrapper.querySelectorAll(".older-children-programs-section");
					personalData = triggerNodeParrentWrapper.querySelectorAll(".personal-data");

					visitTypeValue = (visitType) ? visitType.value : "none";
					visitLengthValue = (visitLength) ? visitLength.value : "none";
					visitTimeValue = (visitTime) ? visitTime.value : "none";
					visitDateValue = (visitDate) ? visitDate.value : "none";
					visitorsAgeValue = (visitorsAge) ? visitorsAge.value : "none";
					visitTimeOfTheDayValue = (visitTimeOfTheDay) ? visitTimeOfTheDay.value : "none";
					numberOfSelectedExhibits = (selectedExhibits) ? handlePseudoArray(selectedExhibits).length : 0;
					
					totalNumberOfVisitors = (function() {
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
					})();

					totalTicketsCost = (function() {
						let constructProgram = (targetName === "construct-program") ? 1 : 0;
						let freeAdmission = (visitTypeValue === "free-admission") ? 1 : 0;
						let programAdmission = (visitTypeValue === "program") ? 1 : 0;
						let oneDayAdmission = (visitLengthValue === "one-day") ? 1 : 0;
						let twoDaysAdmission = (visitLengthValue === "two-days") ? 1.5 : 0;
						let fullDayAdmission = (visitTimeValue === "full-day") ? 1 : 0;
						let halfDayAdmission = (visitTimeValue === "half-day") ? 0.5 : 0;
						let timeOfVisit = (visitTimeOfTheDayValue === "full-day") ? 1 : 0.5;

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
					})();

					numberOfVisitors.innerHTML = totalNumberOfVisitors;
					totalCost.innerHTML = totalTicketsCost;

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

					if (triggerNodeSubfunction === "purchase-button") {
						const currentDate = new Date().getTime();
						const userSetDate = (visitDateValue) ? (new Date(visitDateValue).getTime()) : 0;
						const validName = /^[a-zA-Z0-9.'\-_\s]{1,20}$/;
						const validTelephone = /^380\d{9,9}$/;
						const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

						let formsValidity = false;

						const showUserIssuesMessage = function() {
							userIssuesWindow.classList.remove("display-hidden");
							userIssuesMessage.innerHTML = "Please fill out all the forms correctly and try again!";
						};

						/*Check froms validity*/
						const checkFormsValidation = (function() {
							if (!userSetDate || (userSetDate <= currentDate)) {
								formsValidity = false;
								return showUserIssuesMessage();
							} else {
								formsValidity = true;
							};

							if (totalNumberOfVisitors <= 0) {
								formsValidity = false;
								return showUserIssuesMessage();
							} else {
								formsValidity = true;
							};

							handlePseudoArray(personalData, function(obj) {
								if (obj.getAttribute("name")) {
									if (obj.getAttribute("name") === "first-name" || "last-name") {
										if (!obj.value || !validName.test(obj.value)) {
											formsValidity = false;
											return showUserIssuesMessage();
										} else {
											formsValidity = true;
										};
									} else if (obj.getAttribute("name") === "telephone-number") {
										if (!obj.value || !validTelephone.test(obj.value)) {
											formsValidity = false;
											return showUserIssuesMessage();
										} else {
											formsValidity = true;
										};

									} else if (obj.getAttribute("name") === "email") {
										if (!obj.value || !validEmail.test(obj.value)) {
											formsValidity = false;
											return showUserIssuesMessage();
										} else {
											formsValidity = true;
										};
									};
								};
							});

							/* If all forms are valid */
							if (formsValidity) {
								triggerNodeParrentWrapper.querySelector(".order-date").innerHTML = visitDateValue;/*Check here*/
								triggerNodeParrentWrapper.querySelector(".order-time").innerHTML = visitTimeValue;
								triggerNodeParrentWrapper.querySelector(".order-visitors").innerHTML = totalNumberOfVisitors;
								triggerNodeParrentWrapper.querySelector(".order-total-cost").innerHTML = totalTicketsCost;

								if (triggerNodeNextSibling.classList.contains("main-page_subsection-block-hidden")) {
									triggerNodeNextSibling.classList.remove("main-page_subsection-block-hidden");
								};

								return;
							} else {
								showUserIssuesMessage();
							};
						})();
					};

					break;
				}

				case "gallery-pagination": {
					const selectedPage = parseInt(triggerNode.getAttribute("data-page"));
					handleGallery(selectedPage, false, false);

					break;
				}

				case "gallery-options": {
					const galleryElements = handlePseudoArray(targetNode.getElementsByClassName("gallery_image"));
					
					triggerNode.addEventListener("change", function(e) {
						const selectedOption = triggerNode.options[triggerNode.selectedIndex];
						const targetImagesGroup = selectedOption.getAttribute("data-group");

						galleryElements.forEach(function(obj) {

							if (targetImagesGroup === "All") {
								if (obj.parentNode.classList.contains("display-image-removed")) {
									obj.parentNode.classList.remove("display-image-removed");
								};
								return;
							} else {
								if (obj.getAttribute("data-group") !== targetImagesGroup) {
									if (!obj.parentNode.classList.contains("display-image-removed")) {
										obj.parentNode.classList.add("display-image-removed");
									};
								};

								if (obj.getAttribute("data-group") === targetImagesGroup) {
									if (obj.parentNode.classList.contains("display-image-removed")) {
										obj.parentNode.classList.remove("display-image-removed");
									};
								};
							};
						});

						handleGallery(1, false, true);
						buttons = document.querySelectorAll('[data-type="button"]');
						attachListeners(buttons, handleRelocations, "click");
					}, false);

					break;
				}

				case "show-image": {
					if (
						!targetNode.hasAttribute("data-state") || 
						targetNode.getAttribute("data-state") !== "selected"
					) {
						targetNode.classList.add("gallery_image-select");
						targetNode.setAttribute("data-state", "selected");
					} else {
						targetNode.classList.remove("gallery_image-select");
						targetNode.removeAttribute("data-state");
					};

					if (!blurryScreen.classList.contains("display-hidden")) {
						blurryScreen.classList.add("display-hidden");
					} else {
						blurryScreen.classList.remove("display-hidden");
					};

					break;
				}

				case "unblur-screen": {
					let selectedImage = targetNode.querySelector('[data-state="selected"]');

					triggerNode.classList.add("display-hidden");
					selectedImage.classList.remove("gallery_image-select");
					selectedImage.removeAttribute("data-state");

					break;
				}

				case "user-issues-button": {
					targetNode.classList.add("display-hidden");

					break;
				}
			};

			e.preventDefault();
			e.stopPropagation();
		};

		handleGallery();

		buttons = document.querySelectorAll('[data-type="button"]');

		attachListeners(buttons, handleRelocations, "click");
	};
})();