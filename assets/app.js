import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/animate.css';
import './styles/font-awesome.scss';
import './styles/bootstrap.scss';

const $ = require('jquery');
// this "modifies" the jquery module: adding behavior to it
// create global $ and jQuery variables
global.$ = global.jQuery = $;
const jQuery = $;
// the bootstrap module doesn't export/return anything
require('bootstrap');

// or you can include specific pieces
// require('bootstrap/js/dist/tooltip');
// require('bootstrap/js/dist/popover');

// import your vendor js files
import './js/jquery.flexslider-min.js';
import './js/jquery.fancybox.pack.js';

$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});

// this waits for Turbo Drive to load
document.addEventListener('turbo:load', function (e) {
    // this enables bootstrap tooltips globally
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl)
    });
});

// include the route.js file
require('./ReactRoute');


console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
