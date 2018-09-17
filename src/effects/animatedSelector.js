define( [
	"../core",
	"../selector",
	"../effects"
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery
	// require selector.js
	// require effects.js

// jQuery.expr.pseudos.animated 赋值 匿名函数
jQuery.expr.pseudos.animated = function( elem ) {

	// 返回 jQuery.grep 方法 返回的 长度
	return jQuery.grep( jQuery.timers, function( fn ) {

		// 返回 elem === fn.elem
		return elem === fn.elem;
	} ).length;
};

} );
