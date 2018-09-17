define( [
	"../var/support"
], function( support ) {

"use strict";

	// require var/support.js 获得 support 对象

// support.focusin 赋值 "onfocusin" in window
support.focusin = "onfocusin" in window;

// 返回 support
return support;

} );
