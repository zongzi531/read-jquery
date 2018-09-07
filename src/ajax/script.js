define( [
	"../core",
	"../var/document",
	"../ajax"
], function( jQuery, document ) {

"use strict";
	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require ajax.js

// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
// 在没有显式数据类型的情况下防止脚本自动执行
// 执行 jQuery.ajaxPrefilter 方法
jQuery.ajaxPrefilter( function( s ) {
	// 判断 s.crossDomain
	if ( s.crossDomain ) {
		// s.contents.script 赋值 false
		s.contents.script = false;
	}
} );

// Install script dataType
// 安装脚本数据类型
// 执行 jQuery.ajaxSetup 方法
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			// 执行 jQuery.globalEval( text )
			jQuery.globalEval( text );
			// 返回 text
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
// 处理高速缓存的特殊情况和交叉域
// 执行 jQuery.ajaxPrefilter 方法
jQuery.ajaxPrefilter( "script", function( s ) {
	// 判断 s.cache === undefined
	if ( s.cache === undefined ) {
		// s.cache 赋值 false
		s.cache = false;
	}
	// 判断 s.crossDomain
	if ( s.crossDomain ) {
		// s.type 赋值 "GET"
		s.type = "GET";
	}
} );

// Bind script tag hack transport
// 绑定脚本标签黑客传输
// 执行 jQuery.ajaxTransport 方法
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	// 此传输仅处理跨域请求。
	// 判断 s.crossDomain
	if ( s.crossDomain ) {
		// 初始化 script, callback
		var script, callback;
		// 返回 对象
		return {
			// send 方法
			send: function( _, complete ) {
				// script 赋值
				// 设置 charset 和 src 属性
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
				 	// 监听 load 和 error
					"load error",
					callback = function( evt ) {
						// 执行 script.remove()
						script.remove();
						// callback 赋值 null
						callback = null;
						// 判断 evt
						if ( evt ) {
							// 执行 complete( evt.type === "error" ? 404 : 200, evt.type )
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				// 使用本地DOM操作避免我们的 domManip AJAX 欺骗
				// 执行 document.head.appendChild( script[ 0 ] )
				document.head.appendChild( script[ 0 ] );
			},
			// abort 方法
			abort: function() {
				// 判断 callback
				if ( callback ) {
					// 执行 callback()
					callback();
				}
			}
		};
	}
} );

} );
