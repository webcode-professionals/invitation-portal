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
	var $animatingElements = $('.carousel-caption').find("[data-animation ^= 'animated']");
	doAnimations($animatingElements);
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

	$('.language-switch').on("change", function(){
		window.location.href = window.env.APP_URL + $('.language-switch').val();
		// window.location.href = window.env.APP_URL + '?lang=' + $('.language-switch').val(); // on production
	});
});

/* start preloader */
$(document).ready(function() {
	// $('.preloader').fadeOut(1000); // set duration in brackets
    setTimeout(function () {
	    $('.preloader').hide();
    }, 1000);
});
/* end preloader */