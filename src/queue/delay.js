define( [
	"../core",
	"../queue",
	"../effects" // Delay is optional because of this dependency
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery
	// require queue.js
	// require effects.js

// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
// jQuery.fn.delay 赋值 匿名函数
jQuery.fn.delay = function( time, type ) {

	// time 赋值 jQuery.fx ? jQuery.fx.speeds[ time ] 或者 time : time
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;

	// type 赋值 type || "fx"
	type = type || "fx";

	// 返回 this.queue( type, fn )
	return this.queue( type, function( next, hooks ) {

		// 声明 timeout 赋值 window.setTimeout( next, time )
		var timeout = window.setTimeout( next, time );

		// hooks.stop 赋值 匿名函数
		hooks.stop = function() {

			// 执行 window.clearTimeout( timeout )
			window.clearTimeout( timeout );
		};
	} );
};

// 返回 jQuery.fn.delay
return jQuery.fn.delay;
} );
