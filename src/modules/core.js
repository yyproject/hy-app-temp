var UI = {};
//var $win = $(window);
//var $html = $('html');
var doc = window.document;


UI.VERSION = '1.0.0';

UI.support = {};


UI.support.transition = (function() {

  	var transitionEnd = (function() {
    	// https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
	    var element = doc.body || doc.documentElement;
	    var transEndEventNames = {
	      WebkitTransition: 'webkitTransitionEnd',
	      MozTransition: 'transitionend',
	      OTransition: 'oTransitionEnd otransitionend',
	      transition: 'transitionend'
	    };

	    for (var name in transEndEventNames) {
	      if (element.style[name] !== undefined) {
	        return transEndEventNames[name];
	      }
	    }
  	})();

  return transitionEnd && {end: transitionEnd};
})();


UI.support.animation = (function() {
  	var animationEnd = (function() {
	    var element = doc.body || doc.documentElement;
	    var animEndEventNames = {
	      WebkitAnimation: 'webkitAnimationEnd',
	      MozAnimation: 'animationend',
	      OAnimation: 'oAnimationEnd oanimationend',
	      animation: 'animationend'
	    };

	    for (var name in animEndEventNames) {
	      	if (element.style[name] !== undefined) {
	       	 	return animEndEventNames[name];
	      	}
	    }
  	})();

  	return animationEnd && {end: animationEnd};
})()


/* jshint -W069 */
UI.support.touch = (
('ontouchstart' in window &&
navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
(window.DocumentTouch && document instanceof window.DocumentTouch) ||
(window.navigator['msPointerEnabled'] &&
window.navigator['msMaxTouchPoints'] > 0) || //IE 10
(window.navigator['pointerEnabled'] &&
window.navigator['maxTouchPoints'] > 0) || //IE >=11
false);


// https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
UI.support.mutationobserver = (window.MutationObserver ||
window.WebKitMutationObserver || null);


// https://github.com/Modernizr/Modernizr/blob/924c7611c170ef2dc502582e5079507aff61e388/feature-detects/forms/validation.js#L20
UI.support.formValidation = (typeof document.createElement('form').
  checkValidity === 'function');





UI.utils = {};

/* jshint -W054 */
UI.utils.parseOptions = UI.utils.options = function(string) {
	if ($.isPlainObject(string)) {
    	return string;
  	}

  	var start = (string ? string.indexOf('{') : -1);
  	var options = {};

  	if (start != -1) {
    	try {
      		options = (new Function('',
        		'var json = ' + string.substr(start) +
        		'; return JSON.parse(JSON.stringify(json));'))();
    	} catch (e) {
    	}
  	}
  return options;
};

// handle multiple browsers for requestAnimationFrame()
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://github.com/gnarf/jquery-requestAnimationFrame
// http://www.cnblogs.com/2050/p/3871517.html
// http://www.cnblogs.com/Wayou/p/requestAnimationFrame.html
UI.utils.rAF = (function() {
    var timeLast = 0;

    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
        var timeCurrent = (new Date()).getTime(),
            timeDelta;

        /* Dynamically set delay on a per-tick basis to match 60fps. */
        /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
        timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
        timeLast = timeCurrent + timeDelta;

        return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
    };
})()



// handle multiple browsers for cancelAnimationFrame()
UI.utils.cancelAF = (function() {
  	return window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    function(id) {
	      window.clearTimeout(id);
	    };
})();

// via http://davidwalsh.name/detect-scrollbar-width
UI.utils.measureScrollbar = function() {
	if (document.body.clientWidth >= window.innerWidth) {
		return 0;
	}

	// if ($html.width() >= window.innerWidth) return;
	// var scrollbarWidth = window.innerWidth - $html.width();
	var $measure = $('<div ' +
	'style="width: 100px;height: 100px;overflow: scroll;' +
	'position: absolute;top: -9999px;"></div>');

	$(document.body).append($measure);

	var scrollbarWidth = $measure[0].offsetWidth - $measure[0].clientWidth;

	$measure.remove();

	return scrollbarWidth;
};




/**
 * Plugin AMUI Component to jQuery
 *
 * @param {String} name - plugin name
 * @param {Function} Component - plugin constructor
 * @param {Object} [pluginOption]
 * @param {String} pluginOption.dataOptions
 * @param {Function} pluginOption.methodCall - custom method call
 * @param {Function} pluginOption.before
 * @param {Function} pluginOption.after
 * @since v2.4.1
 */
UI.plugin = function UIPlugin(name, Component, pluginOption) {
	var old = $.fn[name];
	pluginOption = pluginOption || {};

  	$.fn[name] = function(option) {
    
	    var allArgs = Array.prototype.slice.call(arguments, 0);
	    //参数的第2个起
	    var args = allArgs.slice(1);
	    var propReturn;
	    var $set = this.each(function() {
	    	var $this = $(this);
	    	var dataName = 'hyui.' + name;
	    	var dataOptionsName = pluginOption.dataOptions || ('data-hy-' + name);
	      	var instance = $this.data(dataName);
	      	var options = $.extend({},
	        	UI.utils.parseOptions($this.attr(dataOptionsName)),
	        typeof option === 'object' && option);

	      	if (!instance && option === 'destroy') {
	        	return;
	      	}

	      	if (!instance) {
	        	$this.data(dataName, (instance = new Component(this, options)));
	      	}

	      	// custom method call
	      	if (pluginOption.methodCall) {
	        	pluginOption.methodCall.call($this, allArgs, instance);
	      	} else {
	        // before method call
	        	pluginOption.before &&
	        	pluginOption.before.call($this, allArgs, instance);

	        	if (typeof option === 'string') {
	          		propReturn = typeof instance[option] === 'function' ?
	            	instance[option].apply(instance, args) : instance[option];
	        	}

	       	 	// after method call
	       		pluginOption.after && pluginOption.after.call($this, allArgs, instance);
	      	}
	    });

	    return (propReturn === undefined) ? $set : propReturn;
  	};

  	$.fn[name].Constructor = Component;

  	// no conflict
 	$.fn[name].noConflict = function() {
    	$.fn[name] = old;
    	return this;
  	};
  	UI[name] = Component;
};


// http://blog.alexmaccaw.com/css-transitions
// http://newhtml.net/behind-css3-transitions/
$.fn.emulateTransitionEnd = function(duration) {
	var called = false;
	var $el = this;

	$(this).one(UI.support.transition.end, function() {
		called = true;
	});

	var callback = function() {
		if (!called) {
			$($el).trigger(UI.support.transition.end);
		}
		$el.transitionEndTimmer = undefined;
	};

	this.transitionEndTimmer = setTimeout(callback, duration);

	return this;
};

$.fn.redraw = function() {
  	return this.each(function() {
    	/* jshint unused:false */
    	var redraw = this.offsetHeight;
  	});
};


$.fn.transitionEnd = function(callback) {
	var endEvent = UI.support.transition.end;
  	var dom = this;

  	function fireCallBack(e) {
    	callback.call(this, e);
   		endEvent && dom.off(endEvent, fireCallBack);
  	}

  	if (callback && endEvent) {
    	dom.on(endEvent, fireCallBack);
  	}

  	return this;
};



module.exports = UI;
