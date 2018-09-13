define( [
	"../core"
], function( jQuery ) {

"use strict";

  // require core.js 获得 jQuery

// 为 jQuery.readyException 设置函数
// 使用 setTimeout throw error
jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};

} );
