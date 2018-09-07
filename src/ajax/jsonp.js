define( [
	"../core",
	"../var/isFunction",
	"./var/nonce",
	"./var/rquery",
	"../ajax"
], function( jQuery, isFunction, nonce, rquery ) {

"use strict";
	// require core.js 获得 jQuery
	// require var/isFunction.js 获得 isFunction 方法
	// require ./var/nonce.js 获得 Date.now()
	// require ./var/rquery.js 获得 正则表达式
	// require ajax.js

// 声明 oldCallbacks 赋值 空数组
var oldCallbacks = [],
	// 声明 rjsonp 赋值 正则表达式
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
// 缺省 jsonp 设置
// 调用 jQuery.ajaxSetup 方法
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		// 声明 callback 赋值 oldCallbacks.pop() 或者 ( jQuery.expando + "_" + ( nonce++ ) )
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		// 标记 this[ callback ] 为 true
		this[ callback ] = true;
		// 返回 callback
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
// 检测、规范化选项并安装 jsonp 请求的回调
// 调用 jQuery.ajaxPrefilter 方法
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	// 初始化 callbackName, overwritten, responseContainer
	var callbackName, overwritten, responseContainer,
		// 声明 jsonProp 赋值 s.jsonp !== false 并且 ( rjsonp.test( s.url ) 返回 为 true 则 赋值 "url"
		// 否则 赋值 typeof s.data === "string" 并且 ( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 并且 rjsonp.test( s.data ) && "data"
		// 这里 有个括号注意下 ( rjsonp.test( s.url ) ? ... : ... )
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	// 处理预期数据类型是“jsonp”，或者我们有一个参数设置
	// 判断 jsonProp 或者 s.dataTypes[ 0 ] === "jsonp"
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		// 获取回调名称，记住与之关联的预先存在的值
		// callbackName 和 s.jsonpCallback 赋值 isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		// 将回调插入 url 或表单数据
		// 判断 jsonProp
		if ( jsonProp ) {
			// s[ jsonProp ] 赋值 s[ jsonProp ].replace( rjsonp, "$1" + callbackName )
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			// 判断 s.jsonp !== false
		} else if ( s.jsonp !== false ) {
			// s.url 赋值 s.url + ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		// 使用数据转换器在脚本执行后检索 json
		// s.converters[ "script json" ] 赋值 匿名函数
		s.converters[ "script json" ] = function() {
			// 判断 !responseContainer
			if ( !responseContainer ) {
				// 执行 jQuery.error( callbackName + " was not called" )
				jQuery.error( callbackName + " was not called" );
			}
			// 返回 responseContainer[ 0 ]
			return responseContainer[ 0 ];
		};

		// Force json dataType
		// 强制 json 数据类型
		// s.dataTypes[ 0 ] 赋值 "json"
		s.dataTypes[ 0 ] = "json";

		// Install callback
		// 安装回调
		// overwritten 赋值 window[ callbackName ]
		overwritten = window[ callbackName ];
		// window[ callbackName ] 赋值 匿名函数
		window[ callbackName ] = function() {
			// responseContainer 赋值 arguments
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		// 清理功能（火灾后转换器）
		// 执行 jqXHR.always 方法 传入匿名函数
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			// 如果先前的值不存在-删除它
			// 判断 overwritten === undefined
			if ( overwritten === undefined ) {
				// 执行 jQuery( window ).removeProp( callbackName )
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			// 否则恢复先前存在的值
			} else {
				// window[ callbackName ] 赋值 overwritten
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			// 免费退回
			// 判断 s[ callbackName ]
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				// 确保重新使用这些选项不会影响周围的事物。
				// s.jsonpCallback 赋值 originalSettings.jsonpCallback
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				// 保存 callback name 为未来使用
				// oldCallbacks.push( callbackName )
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			// 如果它是一个函数，我们有一个响应
			// 判断 responseContainer 并且 isFunction( overwritten )
			if ( responseContainer && isFunction( overwritten ) ) {
				// 执行 overwritten( responseContainer[ 0 ] )
				overwritten( responseContainer[ 0 ] );
			}

			// responseContainer 和 overwritten 赋值 undefined
			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		// 委派脚本
		// 返回 "script"
		return "script";
	}
} );

} );
