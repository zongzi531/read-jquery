define( [
	"../core"
], function( jQuery, noGlobal ) {

"use strict";

	// require core.js 获得 jQuery
	// noGlobal 赋值 undefined

var

	// Map over jQuery in case of overwrite
	// 在重写的情况下映射 jQuery
	// 声明 _jQuery 赋值 window.jQuery
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	// 在重写的情况下映射 $
	// 声明 _$ 赋值 window.$
	_$ = window.$;

// jQuery.noConflict 赋值 匿名函数
jQuery.noConflict = function( deep ) {

	// 判断 window.$ === jQuery
	if ( window.$ === jQuery ) {

		// window.$ 赋值 _$
		window.$ = _$;
	}

	// 判断 deep && window.jQuery === jQuery
	if ( deep && window.jQuery === jQuery ) {

		// window.jQuery 赋值 _jQuery
		window.jQuery = _jQuery;
	}

	// 返回 jQuery
	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
// 公开jQuery和$标识符，即使在AMD和公共浏览器中也适用于浏览器仿真器
// 判断 !noGlobal
if ( !noGlobal ) {

	// window.jQuery 和 window.$ 赋值 jQuery
	window.jQuery = window.$ = jQuery;
}

} );
