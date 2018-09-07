define( [
	"../core",
	"../core/stripAndCollapse",
	"../var/isFunction",
	"../core/parseHTML",
	"../ajax",
	"../traversing",
	"../manipulation",
	"../selector"
], function( jQuery, stripAndCollapse, isFunction ) {

"use strict";
	// require core.js 获得 jQuery
	// require core/stripAndCollapse.js 获得 stripAndCollapse 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require core/parseHTML.js
	// require ajax.js
	// require traversing.js
	// require manipulation.js
	// require selector.js

/**
 * Load a url into a page
 * 将 url 加载到页面中
 */
// jQuery.fn.load 赋值 匿名函数
jQuery.fn.load = function( url, params, callback ) {
	// 初始化 selector, type, response
	var selector, type, response,
		// 声明 self 赋值 this
		self = this,
		// 声明 off 赋值 url.indexOf( " " )
		off = url.indexOf( " " );

	// 判断 off > -1
	if ( off > -1 ) {
		// selector 赋值 stripAndCollapse( url.slice( off ) )
		selector = stripAndCollapse( url.slice( off ) );
		// url 赋值 url.slice( 0, off )
		url = url.slice( 0, off );
	}

	// If it's a function
	// 如果它是一个函数
	// 判断 isFunction( params )
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		// 我们假设这是回调。
		// callback 赋值 params
		callback = params;
		// params 赋值 undefined
		params = undefined;

	// Otherwise, build a param string
	// 否则，生成参数字符串
	// 判断 params 并且 typeof params === "object"
	} else if ( params && typeof params === "object" ) {
		// type 赋值 "POST"
		type = "POST";
	}

	// If we have elements to modify, make the request
	// 如果有要修改的元素，请提出请求
	// 判断 self.length > 0
	if ( self.length > 0 ) {
		// 执行 jQuery.ajax
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// 如果 "type" 变量未定义，则将使用 "GET" 方法。
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			// 因为用户可以通过 ajaxSetup 方法重写该字段，所以使该字段的值显式
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			// 保存响应在完整回调中使用
			// response 赋值 arguments
			response = arguments;

			// 执行 self.html
			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// 如果指定了选择器，则在虚拟div中找到正确的元素。
				// Exclude scripts to avoid IE 'Permission Denied' errors
				// 排除脚本以避免IE“允许拒绝”错误
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				// 结果，否则使用全部结果
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// 如果请求成功，这个函数得到 "data", "status", "jqXHR" ，但是它们被忽略，因为上面设置了响应。
		// If it fails, this function gets "jqXHR", "status", "error"
		// 如果失败，这个函数会得到 "jqXHR", "status", "error" 。
		// 链式调用 always 方法 传入 callback 存在 传入 匿名函数
		} ).always( callback && function( jqXHR, status ) {
			// 执行 self.each 方法
			self.each( function() {
				// 执行 callback( response 或者 [ jqXHR.responseText, status, jqXHR ] )
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	// 返回 this
	return this;
};

} );
