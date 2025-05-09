/* eslint-disable no-undef */
$(function(){
	// Header Scroll
	$(window).on('scroll', function() {
		var scroll = $(window).scrollTop();

		if (scroll >= 50) {
			$('#header').addClass('fixed');
			$(".topHome").show();
		} else {
			$('#header').removeClass('fixed');
			$(".topHome").hide();
		}
	});

	// Fancybox
	// $('.work-box').fancybox();

	// Flexslider
	$('.flexslider').flexslider({
		animation: "fade",
		directionNav: false,
	});

	// Page Scroll
	var sections = $('section')
		nav = $('nav[role="navigation"]');

	$(window).on('scroll', function () {
	  	var cur_pos = $(this).scrollTop();
	  	sections.each(function() {
	    	var top = $(this).offset().top - 76
	        	bottom = top + $(this).outerHeight();
	    	if (cur_pos >= top && cur_pos <= bottom) {
	      		nav.find('a').removeClass('active');
	      		nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
	    	}
	  	});
	});
	nav.find('a').off("click").on('click', function () {
	  	var $el = $(this)
		id = $el.attr('href');
		if(id !== '#') {
			$('html, body').animate({
				scrollTop: $(id).offset().top - 75
			}, 500);
		}
		else {
			if($(this).attr('data-login').length) {
				window.location.href = window.env.APP_URL +''+ login_path;
			}
		}
		$('.nav-toggle').toggleClass('close-nav');
		nav.toggleClass('open');
		return false;
	});

	// Mobile Navigation
	$('.nav-toggle').off("click").on('click', function() {
		$(this).toggleClass('close-nav');
		nav.toggleClass('open');
		return false;
	});	
   
	//Function to animate slider captions 
	function doAnimations( elems ) {
		//Cache the animationend event in a variable
		var animEndEv = 'webkitAnimationEnd animationend';
		elems.each(function () {
			var $this = $(this),
				$animationType = $this.data('animation');
			$this.addClass($animationType).one(animEndEv, function () {
				$this.removeClass($animationType);
			});
		});
	}
	const animatingElements = $('.carousel-caption').find("[data-animation ^= 'animated']");
	doAnimations(animatingElements);
	// const carousel = new bootstrap.Carousel('#carouselBanner')
	const myCarouselElement = $('#carouselBanner');
	myCarouselElement.on('slide.bs.carousel', function (e) {
		let animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
		doAnimations(animatingElems);
	});

	//Variables on page load 
	// var $myCarousel = $('#carousel-example-generic'),
		// $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
	//Initialize carousel 
	// $myCarousel.carousel();
	
	//Animate captions in first slide on page load 
	// doAnimations($firstAnimatingElems);
	
	//Pause carousel  
	// $myCarousel.carousel('pause');
	
	//Other slides to be animated on carousel slide event 
	// $myCarousel.on('slide.bs.carousel', function (e) {
	// 	var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
	// 	doAnimations($animatingElems);
	// });  
    // $('#carousel-example-generic').carousel({
    //     interval:3000,
    //     pause: "false"
    // });
});

/* start preloader */
$(document).ready(function() {
	// $('.preloader').fadeOut(1000); // set duration in brackets
    setTimeout(function () {
	    $('.preloader').hide();
    }, 1000);

	setTimeout(function () {
	    $('.advBanner').show();
    }, 20000);
	setTimeout(function () {
	    $('.advBanner').hide();
    }, 120000);
	$('.close-cross-btn').on('click', function() {
		$('.advBanner').hide();
	});
});
/* end preloader */