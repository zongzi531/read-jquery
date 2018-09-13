define( [
	"../core",
	"../var/support",
	"../ajax"
], function( jQuery, support ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/support.js 获得 support 对象
	// require ajax.js

// jQuery.ajaxSettings.xhr 赋值 匿名函数
jQuery.ajaxSettings.xhr = function() {
	try {

		// 尝试 返回 new window.XMLHttpRequest() 若报错则忽略
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

// 声明 xhrSuccessStatus 赋值 对象
var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		// 文件协议总是产生状态代码0，假设200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		// 有时 IE 返回 1223，这应该是 204。
		1223: 204
	},

	// 声明 xhrSupported 赋值 jQuery.ajaxSettings.xhr()
	xhrSupported = jQuery.ajaxSettings.xhr();

// support.cors 赋值 !!xhrSupported && ( "withCredentials" in xhrSupported )
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );

// support.ajax 赋值 xhrSupported = !!xhrSupported
support.ajax = xhrSupported = !!xhrSupported;

// 执行 jQuery.ajaxTransport 方法
jQuery.ajaxTransport( function( options ) {

	// 初始化 callback, errorCallback
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	// 只有通过 XMLHttpRequest 支持才允许跨域。
	// 判断 support.cors 或者 xhrSupported 并且 !options.crossDomain
	if ( support.cors || xhrSupported && !options.crossDomain ) {

		// 返回 对象
		return {

			// send 方法
			send: function( headers, complete ) {

				// 这里开始就是 XMLHttpRequest 方法的实现，具体步骤可以参阅MDN
				// 初始化 i
				var i,

					// 声明 xhr 赋值 options.xhr()
					xhr = options.xhr();

				// 执行 xhr.open 方法
				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				// 如果提供自定义字段
				// 判断 options.xhrFields
				if ( options.xhrFields ) {

					// 遍历 options.xhrFields 属性
					for ( i in options.xhrFields ) {

						// xhr[ i ] 赋值 options.xhrFields[ i ]
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				// 如果需要，重写MIME类型
				// 判断 options.mimeType 并且 xhr.overrideMimeType
				if ( options.mimeType && xhr.overrideMimeType ) {

					// 执行 xhr.overrideMimeType( options.mimeType )
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// X-Requested-With 头部
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// 对于跨领域的请求，视为飞行前的条件类似于拼图游戏，我们根本不确定它是确定的。
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// （它总是可以按每个请求设置，甚至可以使用 ajaxSetup ）
				// For same-domain requests, won't change header if already provided.
				// 对于相同的域请求，如果已经提供，则不会更改头。
				// 判断 !options.crossDomain 并且 !headers[ "X-Requested-With" ]
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {

					// headers[ "X-Requested-With" ] 赋值 "XMLHttpRequest"
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				// 设置头部
				// 遍历 headers
				for ( i in headers ) {

					// 执行 xhr.setRequestHeader( i, headers[ i ] )
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				// 回调
				// callback 赋值匿名函数
				callback = function( type ) {

					// 返回 匿名函数
					return function() {

						// 判断 callback
						if ( callback ) {

							// callback 和 errorCallback 和 xhr.onload 和 xhr.onerror 和 xhr.onabort 和 xhr.ontimeout 和 xhr.onreadystatechange 赋值 null
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							// 判断 type === "abort"
							if ( type === "abort" ) {

								// 执行 xhr.abort()
								xhr.abort();

								// 判断 type === "error"
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								// 在手动本地中止中，IE9在不处于就绪状态的任何属性访问中引发错误。
								// 判断 typeof xhr.status !== "number"
								if ( typeof xhr.status !== "number" ) {

									// 执行 complete( 0, "error" )
									complete( 0, "error" );
								} else {

									// 执行 complete(xhr.status, xhr.statusText)
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										// 文件：协议总是产生状态0
										xhr.status,
										xhr.statusText
									);
								}
							} else {

								// 执行 complete 方法
								complete(

									// xhrSuccessStatus[ xhr.status ] 或 xhr.status,
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// IE9 没有 XHR2，但投掷二进制
									// For XHR2 non-text, let the caller handle it (gh-2498)
									// 对于 XHR2 非文本，让调用方处理它
									// 三元表达式判断 ( xhr.responseType || "text" ) !== "text" 或 typeof xhr.responseText !== "string"
									// 返回真 则 { binary: xhr.response } 否则 { text: xhr.responseText }
									// 第四参数 xhr.getAllResponseHeaders()
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				// 倾听事件
				// xhr.onload 赋值 callback()
				xhr.onload = callback();

				// errorCallback 和 xhr.onerror 和 xhr.ontimeout 赋值 callback( "error" )
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				// 用 onreadystatechange 代替 onabort 处理未中止的事件
				// 判断 xhr.onabort !== undefined
				if ( xhr.onabort !== undefined ) {

					// xhr.onabort 赋值 errorCallback
					xhr.onabort = errorCallback;
				} else {

					// xhr.onreadystatechange 赋值 匿名函数
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						// 在超时之前检查 readyState
						// 判断 xhr.readyState === 4
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// 允许首先调用 onerror ，但不能处理本机异常。
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							// 此外，将 errorCallback 保存到无法访问的 xhr.onerror 变量
							// 调用 window.setTimeout 方法
							window.setTimeout( function() {

								// 判断 callback
								if ( callback ) {

									// 执行 errorCallback()
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				// 创建中止回调
				// callback 赋值 callback( "abort" )
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					// 发送请求（这可能引发异常）
					// 尝试 执行 xhr.send( options.hasContent 并且 options.data 或者 null )
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					// 如果未被通知为错误，则仅重新抛出
					// 判断 callback
					if ( callback ) {

						// 抛出错误 e
						throw e;
					}
				}
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
