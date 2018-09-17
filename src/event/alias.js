define( [
	"../core",

	"../event",
	"./trigger"
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery
	// require event.js
	// require ./trigger.js

// 使用 jQuery.each 方法 遍历 第一参数 数组
jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	// 处理事件绑定
	// jQuery.fn[ name ] 赋值 匿名函数
	jQuery.fn[ name ] = function( data, fn ) {

		// 返回 arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name)
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// hover 方法
	hover: function( fnOver, fnOut ) {

		// 返回 this.mouseenter( fnOver ).mouseleave( fnOut || fnOver )
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

} );
