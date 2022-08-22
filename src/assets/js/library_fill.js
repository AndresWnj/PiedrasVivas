/**
 * @preserve  textfill
 * @name      jquery.textfill.js
 * @author    Russ Painter (GeekyMonkey)
 * @author    Yu-Jie Lin
 * @author    Alexandre Dantas
 * @version   0.6.2
 * @date      2018-02-24
 * @copyright (c) 2009
 * @license   MIT License
 * @homepage  https://github.com/jquery-textfill/jquery-textfill
 * @example   http://jquery-textfill.github.io/jquery-textfill/index.html
 */
; (function($) {

	/**
	 * Resizes an inner element's font so that the
	 * inner element completely fills the outer element.
	 *
	 * @param {Object} options User options that take
	 *                         higher precedence when
	 *                         merging with the default ones.
	 *
	 * @return All outer elements processed
	 */
	$.fn.textfill = function(options) {

		// ______  _______ _______ _______ _     _        _______ _______
		// |     \ |______ |______ |_____| |     | |         |    |______
		// |_____/ |______ |       |     | |_____| |_____    |    ______|
		//
		// Merging user options with the default values

		var defaults = {
			debug            : false,
			maxFontPixels    : 40,
			minFontPixels    : 4,
			innerTag         : 'span',
			widthOnly        : false,
			success          : null, // callback when a resizing is done
			fail             : null, // callback when a resizing is failed
			complete         : null, // callback when all is done
			explicitWidth    : null,
			explicitHeight   : null,
			changeLineHeight : false,
			truncateOnFail   : false,
			allowOverflow    : false // If true, text will stay at minFontPixels but overflow container w/out failing 
		};

		var Opts = $.extend(defaults, options);

		// _______ _     _ __   _ _______ _______ _____  _____  __   _ _______
		// |______ |     | | \  | |          |      |   |     | | \  | |______
		// |       |_____| |  \_| |_____     |    __|__ |_____| |  \_| ______|
		//
		// Predefining the awesomeness

		// Output arguments to the Debug console
		// if "Debug Mode" is enabled
		function _debug() {
			if (!Opts.debug
				||  typeof console       == 'undefined'
				||  typeof console.debug == 'undefined') {
				return;
			}
			console.debug.apply(console, arguments);
		}

		// Output arguments to the Warning console
		function _warn() {
			if (typeof console      == 'undefined' ||
				typeof console.warn == 'undefined') {
				return;
			}
			console.warn.apply(console, arguments);
		}

		// Outputs all information on the current sizing
		// of the font.
		function _debug_sizing(prefix, ourText, maxHeight, maxWidth, minFontPixels, maxFontPixels) {

			function _m(v1, v2) {

				var marker = ' / ';

				if (v1 > v2) {
					marker = ' > ';
				}
				else if (v1 == v2) {
					marker = ' = ';
				}
				return marker;
			}

			_debug(
				'[TextFill] '  + prefix + ' { ' +
				'font-size: ' + ourText.css('font-size') + ',' +
				'Height: '    + ourText.height() + 'px ' + _m(ourText.height(), maxHeight) + maxHeight + 'px,' +
				'Width: '     + ourText.width()  + _m(ourText.width() , maxWidth)  + maxWidth + ',' +
				'minFontPixels: ' + minFontPixels + 'px, ' +
				'maxFontPixels: ' + maxFontPixels + 'px }'
			);
		}

		/**
		 * Calculates which size the font can get resized,
		 * according to constrains.
		 *
		 * @param {String} prefix Gets shown on the console before
		 *                        all the arguments, if debug mode is on.
		 * @param {Object} ourText The DOM element to resize,
		 *                         that contains the text.
		 * @param {function} func Function called on `ourText` that's
		 *                        used to compare with `max`.
		 * @param {number} max Maximum value, that gets compared with
		 *                     `func` called on `ourText`.
		 * @param {number} minFontPixels Minimum value the font can
		 *                               get resized to (in pixels).
		 * @param {number} maxFontPixels Maximum value the font can
		 *                               get resized to (in pixels).
		 *
		 * @return Size (in pixels) that the font can be resized.
		 */
		function _sizing(prefix, ourText, func, max, maxHeight, maxWidth, minFontPixels, maxFontPixels) {

			_debug_sizing(
				prefix, ourText,
				maxHeight, maxWidth,
				minFontPixels, maxFontPixels
			);

			// The kernel of the whole plugin, take most attention
			// on this part.
			//
			// This is a loop that keeps increasing the `font-size`
			// until it fits the parent element.
			//
			// - Start from the minimal allowed value (`minFontPixels`)
			// - Guesses an average font size (in pixels) for the font,
			// - Resizes the text and sees if its size is within the
			//   boundaries (`minFontPixels` and `maxFontPixels`).
			//   - If so, keep guessing until we break.
			//   - If not, return the last calculated size.
			//
			// I understand this is not optimized and we should
			// consider implementing something akin to
			// Daniel Hoffmann's answer here:
			//
			//     http://stackoverflow.com/a/17433451/1094964
			//
			
			while (minFontPixels < (Math.floor(maxFontPixels) - 1)) {

				var fontSize = Math.floor((minFontPixels + maxFontPixels) / 2);
				ourText.css('font-size', fontSize);
				var curSize = func.call(ourText);

				if (curSize <= max) {
					minFontPixels = fontSize;

					if (curSize == max) {
						break;
					}
				}
				else {
					maxFontPixels = fontSize;
				}

				_debug_sizing(
					prefix, ourText,
					maxHeight, maxWidth,
					minFontPixels, maxFontPixels
				);
			}

			ourText.css('font-size', maxFontPixels);

			if (func.call(ourText) <= max) {
				minFontPixels = maxFontPixels;

				_debug_sizing(
					prefix + '* ', ourText,
					maxHeight, maxWidth,
					minFontPixels, maxFontPixels
				);
			}
			return minFontPixels;
		}

		// _______ _______ _______  ______ _______
		// |______    |    |_____| |_____/    |
		// ______|    |    |     | |    \_    |
        //
		// Let's get it started (yeah)!

		_debug('[TextFill] Start Debug');

		this.each(function() {

			// Contains the child element we will resize.
			// $(this) means the parent container
			var ourText = $(Opts.innerTag + ':first', this);

			_debug('[TextFill] Inner text: ' + ourText.text());
			_debug('[TextFill] All options: ', Opts);
			_debug('[TextFill] Maximum sizes: { ' +
				   'Height: ' + maxHeight + 'px, ' +
				   'Width: '  + maxWidth  + 'px' + ' }'
				  );

			if (!ourText.is(':visible')) {
				// Failure callback
				if (Opts.fail)
					Opts.fail(this);

				_debug(
					'[TextFill] Failure { ' +
					'Current Width: '  + ourText.width()  + ', ' +
					'Maximum Width: '  + maxWidth         + ', ' +
					'Current Height: ' + ourText.height() + ', ' +
					'Maximum Height: ' + maxHeight        + ' }'
				);

				return;
			}

			// Will resize to this dimensions.
			// Use explicit dimensions when specified
			var maxHeight = Opts.explicitHeight || $(this).height();
			var maxWidth  = Opts.explicitWidth  || $(this).width();

			var oldFontSize = ourText.css('font-size');

			var lineHeight  = parseFloat(ourText.css('line-height')) / parseFloat(oldFontSize);

			var minFontPixels = Opts.minFontPixels;

			// Remember, if this `maxFontPixels` is negative,
			// the text will resize to as long as the container
			// can accomodate
			var maxFontPixels = (Opts.maxFontPixels <= 0 ?
								 maxHeight :
								 Opts.maxFontPixels);

			// Let's start it all!

			// 1. Calculate which `font-size` would
			//    be best for the Height
			var fontSizeHeight = undefined;

			if (Opts.widthOnly) {
				// We need to measure with nowrap otherwise wrapping occurs and the measurement is wrong
      			ourText.css('white-space', 'nowrap' );
			} else {
				fontSizeHeight = _sizing(
					'Height', ourText,
					$.fn.height, maxHeight,
					maxHeight, maxWidth,
					minFontPixels, maxFontPixels
				);
			}

			// 2. Calculate which `font-size` would
			//    be best for the Width
			var fontSizeWidth = undefined;

			fontSizeWidth = _sizing(
				'Width', ourText,
				$.fn.width, maxWidth,
				maxHeight, maxWidth,
				minFontPixels, maxFontPixels
			);

			// 3. Actually resize the text!

			if (Opts.widthOnly) {
				ourText.css({
					'font-size'  : fontSizeWidth
				});

				if (Opts.changeLineHeight) {
					ourText.parent().css(
						'line-height',
						(lineHeight * fontSizeWidth + 'px')
					);
				}
			}
			else {
				var fontSizeFinal = Math.min(fontSizeHeight, fontSizeWidth);

				ourText.css('font-size', fontSizeFinal);

				if (Opts.changeLineHeight) {
					ourText.parent().css(
						'line-height',
						(lineHeight * fontSizeFinal) + 'px'
					);
				}
			}

			_debug(
				'[TextFill] Finished { ' +
				'Old font-size: ' + oldFontSize              + ', ' +
				'New font-size: ' + ourText.css('font-size') + ' }'
			);

			// Oops, something wrong happened!
			// If font-size increasing, we weren't supposed to exceed the original size 
			// If font-size decreasing, we hit minFontPixels, and still won't fit 
			if ((ourText.width()  > maxWidth && !Opts.allowOverflow) ||
				(ourText.height() > maxHeight && !Opts.widthOnly && !Opts.allowOverflow)) { 

				ourText.css('font-size', oldFontSize);

				// Failure callback
				if (Opts.fail) {
					Opts.fail(this);
				}

				_debug(
					'[TextFill] Failure { ' +
					'Current Width: '  + ourText.width()  + ', ' +
					'Maximum Width: '  + maxWidth         + ', ' +
					'Current Height: ' + ourText.height() + ', ' +
					'Maximum Height: ' + maxHeight        + ' }'
				);
			}
			else if (Opts.success) {
				Opts.success(this);
			}
		});

		// Complete callback
		if (Opts.complete) {
			Opts.complete(this);
		}

		_debug('[TextFill] End Debug');
		return this;
	};

})(function() {
	if (typeof module !== 'undefined' && module.exports) {
		return require('jquery');
	}
	return window.jQuery;
}());

/*
  textfill
 @name      jquery.textfill.js
 @author    Russ Painter (GeekyMonkey)
 @author    Yu-Jie Lin
 @author    Alexandre Dantas
 @version   0.6.2
 @date      2018-02-24
 @copyright (c) 2009
 @license   MIT License
 @homepage  https://github.com/jquery-textfill/jquery-textfill
 @example   http://jquery-textfill.github.io/jquery-textfill/index.html
*/
(function(k){k.fn.textfill=function(q){function e(){a.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.debug&&console.debug.apply(console,arguments)}function n(b,a,f,l,m,g){function c(a,b){var c=" / ";a>b?c=" > ":a==b&&(c=" = ");return c}e("[TextFill] "+b+" { font-size: "+a.css("font-size")+",Height: "+a.height()+"px "+c(a.height(),f)+f+"px,Width: "+a.width()+c(a.width(),l)+l+",minFontPixels: "+m+"px, maxFontPixels: "+g+"px }")}function p(a,c,f,l,e,g,h,d){for(n(a,c,e,g,h,d);h<Math.floor(d)-
    1;){var b=Math.floor((h+d)/2);c.css("font-size",b);var k=f.call(c);if(k<=l){if(h=b,k==l)break}else d=b;n(a,c,e,g,h,d)}c.css("font-size",d);f.call(c)<=l&&(h=d,n(a+"* ",c,e,g,h,d));return h}var a=k.extend({debug:!1,maxFontPixels:40,minFontPixels:4,innerTag:"span",widthOnly:!1,success:null,fail:null,complete:null,explicitWidth:null,explicitHeight:null,changeLineHeight:!1,truncateOnFail:!1,allowOverflow:!1},q);e("[TextFill] Start Debug");this.each(function(){var b=k(a.innerTag+":first",this);e("[TextFill] Inner text: "+
    b.text());e("[TextFill] All options: ",a);e("[TextFill] Maximum sizes: { Height: "+c+"px, Width: "+f+"px }");if(b.is(":visible")){var c=a.explicitHeight||k(this).height(),f=a.explicitWidth||k(this).width(),l=b.css("font-size"),m=parseFloat(b.css("line-height"))/parseFloat(l),g=a.minFontPixels,h=0>=a.maxFontPixels?c:a.maxFontPixels,d=void 0;a.widthOnly?b.css("white-space","nowrap"):d=p("Height",b,k.fn.height,c,c,f,g,h);g=p("Width",b,k.fn.width,f,c,f,g,h);a.widthOnly?(b.css({"font-size":g}),a.changeLineHeight&&
    b.parent().css("line-height",m*g+"px")):(d=Math.min(d,g),b.css("font-size",d),a.changeLineHeight&&b.parent().css("line-height",m*d+"px"));e("[TextFill] Finished { Old font-size: "+l+", New font-size: "+b.css("font-size")+" }");b.width()>f&&!a.allowOverflow||b.height()>c&&!a.widthOnly&&!a.allowOverflow?(b.css("font-size",l),a.fail&&a.fail(this),e("[TextFill] Failure { Current Width: "+b.width()+", Maximum Width: "+f+", Current Height: "+b.height()+", Maximum Height: "+c+" }")):a.success&&a.success(this)}else a.fail&&
    a.fail(this),e("[TextFill] Failure { Current Width: "+b.width()+", Maximum Width: "+f+", Current Height: "+b.height()+", Maximum Height: "+c+" }")});a.complete&&a.complete(this);e("[TextFill] End Debug");return this}})(function(){return"undefined"!==typeof module&&module.exports?require("jquery"):window.jQuery}());
    

    // $('.txtDescription').textfill({
	// 	maxFontPixels: 1700,
	// 	debug:true
    // });
    