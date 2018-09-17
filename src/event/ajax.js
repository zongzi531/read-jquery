define( [
	"../core",
	"../event"
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery
	// require event.js

// Attach a bunch of functions for handling common AJAX events
// 附加一组函数来处理常见的 AJAX 事件
// 使用 jQuery.each 方法 遍历 第一参数 数组
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {

	// jQuery.fn[ type ] 赋值 匿名函数
	jQuery.fn[ type ] = function( fn ) {

		// 返回 this.on( type, fn )
		return this.on( type, fn );
	};
} );

} );
