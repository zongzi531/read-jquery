define( [
	"./core",
	"./var/document",
	"./var/isFunction",
	"./var/rnothtmlwhite",
	"./ajax/var/location",
	"./ajax/var/nonce",
	"./ajax/var/rquery",

	"./core/init",
	"./ajax/parseXML",
	"./event/trigger",
	"./deferred",
	"./serialize" // jQuery.param
], function( jQuery, document, isFunction, rnothtmlwhite, location, nonce, rquery ) {

"use strict";
	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require var/isFunction.js 获得 isFunction 方法
	// require var/rnothtmlwhite.js 获得 正则表达式
	// require ajax/var/location.js 获得 window.location
	// require ajax/var/nonce.js 获得 Date.now()
	// require ajax/var/rquery.js 获得 正则表达式
	// require core/init.js
	// require ajax/parseXML.js
	// require event/trigger.js
	// require deferred.js
	// require serialize.js

var
	// 声明 r20 正则表达式
	r20 = /%20/g,
	// 声明 rhash 正则表达式
	rhash = /#.*$/,
	// 声明 rantiCache 正则表达式
	rantiCache = /([?&])_=[^&]*/,
	// 声明 rheaders 正则表达式
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	// 声明 rlocalProtocol 正则表达式
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	// 声明 rnoContent 正则表达式
	rnoContent = /^(?:GET|HEAD)$/,
	// 声明 rprotocol 正则表达式
	rprotocol = /^\/\//,

	/* Prefilters
	 * 预过滤器
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 1）它们有助于引入定制的 dataTypes（例如参见 ajax/jsonp.js ）
	 * 2) These are called:
	 * 2）这些被称为：
	 *    - BEFORE asking for a transport
	 *    - 在要求运输之前
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 *    - param 序列化之后（如果 s.processData 为真，s.data 是字符串）
	 * 3) key is the dataType
	 * 3）密钥是数据类型
	 * 4) the catchall symbol "*" can be used
	 * 4）可以使用卡符号“*”
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 * 5）执行将从传输数据类型开始，然后在需要时继续“*”。
	 */
	// 声明 prefilters 赋值 空对象
	prefilters = {},

	/* Transports bindings
	 * 传输绑定
	 * 1) key is the dataType
	 * 1）密钥是数据类型
	 * 2) the catchall symbol "*" can be used
	 * 2）可以使用卡符号“*”
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 * 3）选择将从传输数据类型开始，然后在需要时转到“*”
	 */
	// 声明 transports 赋值 空对象
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	// 避免 comment-prolog 字符序列；必须安抚皮毛和避免压缩。
	// 声明 allTypes 赋值 "*/".concat( "*" ) 就是 "*/*" 啊 为什么不直接写
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	// 用于解析文档源的锚标签
	// 声明 originAnchor 赋值 document.createElement( "a" )
	originAnchor = document.createElement( "a" );
	// 声明 originAnchor.href 赋值 location.href
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
// jQuery.ajaxPrefilter和 jQuery.ajaxTransport 的“构造函数”基础
// 声明 addToPrefiltersOrTransports 方法
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	// dataTypeExpression 是可选的，默认为“*”。
	// 返回 匿名函数
	return function( dataTypeExpression, func ) {

		// 判断 dataTypeExpression 是否为 "string" 类型
		if ( typeof dataTypeExpression !== "string" ) {
			// func 赋值 dataTypeExpression
			func = dataTypeExpression;
			// dataTypeExpression 赋值 "*"
			dataTypeExpression = "*";
		}

		// 初始化 dataType
		var dataType,
			// 声明 i 赋值 0
			i = 0,
			// 声明 dataTypes 赋值 dataTypeExpression.toLowerCase().match( rnothtmlwhite ) 或者 []
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

			// 判断 func 是否 为 function
		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			// 对于 dataTypeExpression 中的每一个 dataType
			// 遍历 dataTypes
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				// 如果需要，准备好
				// 判断 dataType[ 0 ] === "+"
				if ( dataType[ 0 ] === "+" ) {
					// dataType 赋值 dataType.slice( 1 ) 或者 "*"
					dataType = dataType.slice( 1 ) || "*";
					// ( structure[ dataType ] 赋值 structure[ dataType ] 或者 [] ).unshift( func )
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				// 否则追加
				} else {
					// ( structure[ dataType ] 赋值 structure[ dataType ] 或者 [] ).push( func )
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
// 前置滤波器和传输的基本检测功能
// 声明 inspectPrefiltersOrTransports 方法
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	// 声明 inspected 赋值 空对象
	var inspected = {},
		// 声明 seekingTransport 赋值 ( structure === transports )
		// 这儿为啥要加个括号呢？
		seekingTransport = ( structure === transports );

	// 声明 inspect 方法
	function inspect( dataType ) {
		// 初始化 selected
		var selected;
		// inspected[ dataType ] 赋值 true
		inspected[ dataType ] = true;
		// 使用 jQuery.each 方法遍历 structure[ dataType ] 或者 []
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			// 声明 dataTypeOrTransport 赋值 prefilterOrFactory( options, originalOptions, jqXHR )
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			// 判断 dataTypeOrTransport 为 "string" 类型 并且 !seekingTransport 并且 !inspected[ dataTypeOrTransport ]
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				// options.dataTypes.unshift( dataTypeOrTransport )
				options.dataTypes.unshift( dataTypeOrTransport );
				// 执行 inspect( dataTypeOrTransport )
				inspect( dataTypeOrTransport );
				// 返回 false
				return false;
				// 判断 seekingTransport
			} else if ( seekingTransport ) {
				// 返回 !( selected 赋值 dataTypeOrTransport )
				return !( selected = dataTypeOrTransport );
			}
		} );
		// 返回 selected
		return selected;
	}

	// 返回 inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" ) 的结果
	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Ajax 选项的特殊扩展，采用 “flat” 选项（不是深度扩展）
// Fixes #9887
// 声明 ajaxExtend 方法
function ajaxExtend( target, src ) {
	// 初始化 key, deep
	var key, deep,
		// 声明 flatOptions 赋值 jQuery.ajaxSettings.flatOptions 或者 {}
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	// 遍历 src
	for ( key in src ) {
		// 判断 src[ key ] !== undefined
		if ( src[ key ] !== undefined ) {
			// ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ]
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	// 判断 deep
	if ( deep ) {
		// jQuery.extend( true, target, deep )
		jQuery.extend( true, target, deep );
	}

	// 返回 target
	return target;
}

/* Handles responses to an ajax request:
 * 处理对 Ajax 请求的响应：
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - 找到正确的 dataType （介于内容类型和预期 dataType 之间）
 * - returns the corresponding response
 * - 返回相应的响应
 */
// 声明 ajaxHandleResponses 方法
function ajaxHandleResponses( s, jqXHR, responses ) {

	// 初始化 ct, type, finalDataType, firstDataType
	var ct, type, finalDataType, firstDataType,
		// contents 赋值 s.contents
		contents = s.contents,
		// dataTypes 赋值 s.dataTypes
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	// 删除 auto dataType 并在过程中获取内容类型
	// 遍历 dataTypes[ 0 ] === "*"
	while ( dataTypes[ 0 ] === "*" ) {
		// dataTypes.shift()
		dataTypes.shift();
		// 判断 ct === undefined
		if ( ct === undefined ) {
			// ct 赋值 s.mimeType 或者 jqXHR.getResponseHeader( "Content-Type" )
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	// 检查我们是否处理了一个已知的内容类型
	// 判断 ct
	if ( ct ) {
		// 遍历 contents
		for ( type in contents ) {
			// 判断 contents[ type ] 并且 contents[ type ].test( ct )
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				// dataTypes.unshift( type )
				dataTypes.unshift( type );
				// 退出当前循环 contents
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	// 检查是否有期望的数据类型的响应
	// 判断 dataTypes[ 0 ] in responses
	if ( dataTypes[ 0 ] in responses ) {
		// finalDataType 赋值 dataTypes[ 0 ]
		finalDataType = dataTypes[ 0 ];
		// 否则
	} else {

		// Try convertible dataTypes
		// 尝试可转换数据类型
		// 遍历 responses
		for ( type in responses ) {
			// 判断 !dataTypes[ 0 ] 或者 s.converters[ type + " " + dataTypes[ 0 ] ]
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				// finalDataType 赋值 type
				finalDataType = type;
				// 退出当前循环 responses
				break;
			}
			// 判断 !firstDataType
			if ( !firstDataType ) {
				// firstDataType 赋值 type
				firstDataType = type;
			}
		}

		// Or just use first one
		// 或者只使用第一个
		// finalDataType 赋值 finalDataType 或者 firstDataType
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// 如果我们找到一个数据类型
	// We add the dataType to the list if needed
	// and return the corresponding response
	// 如果需要，我们将数据类型添加到列表中，并返回相应的响应。
	// 判断 finalDataType
	if ( finalDataType ) {
		// 判断 finalDataType !== dataTypes[ 0 ]
		if ( finalDataType !== dataTypes[ 0 ] ) {
			// dataTypes.unshift( finalDataType )
			dataTypes.unshift( finalDataType );
		}
		// 返回 responses[ finalDataType ]
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * 给定请求和原始响应的链转换
 * Also sets the responseXXX fields on the jqXHR instance
 * 也在 jqXHR 实例上设置 responseXXX 字段
 */
// 声明 ajaxConvert 方法
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	// 初始化 conv2, current, conv, tmp, prev
	var conv2, current, conv, tmp, prev,
		// 声明 converters 赋值 空对象
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		// 在需要修改数据类型的情况下，使用数据类型的副本进行转换
		// 声明 dataTypes 赋值 s.dataTypes.slice()
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	// 用低级键创建转换器映射
	// 判断 dataTypes[ 1 ]
	if ( dataTypes[ 1 ] ) {
		// 遍历 s.converters
		for ( conv in s.converters ) {
			// converters[ conv.toLowerCase() ] 赋值 s.converters[ conv ]
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// current 赋值 dataTypes.shift()
	current = dataTypes.shift();

	// Convert to each sequential dataType
	// 转换到每个顺序数据类型
	// 遍历 current
	while ( current ) {

		// 判断 s.responseFields[ current ]
		if ( s.responseFields[ current ] ) {
			// jqXHR[ s.responseFields[ current ] ] 赋值 response
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		// 如果提供数据应用程序
		// 判断 !prev 并且 isSuccess 并且 s.dataFilter
		if ( !prev && isSuccess && s.dataFilter ) {
			// response 赋值 s.dataFilter( response, s.dataType )
			response = s.dataFilter( response, s.dataType );
		}

		// prev 赋值 current
		prev = current;
		// current 赋值 dataTypes.shift()
		current = dataTypes.shift();

		// 判断 current
		if ( current ) {

			// There's only work to do if current dataType is non-auto
			// 如果当前的数据类型是非自动的，只有工作要做。
			// 判断 current === "*"
			if ( current === "*" ) {

				// current 赋值 prev
				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			// 如果 prev 数据类型是非自动的，并且不同于当前，则转换响应。
			// 判断 prev !== "*" 并且 prev !== current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				// 寻求直接转换器
				// conv 赋值 converters[ prev + " " + current ] 或者 converters[ "* " + current ]
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				// 如果没有找到，寻找一对
				// 判断 !conv
				if ( !conv ) {
					// 遍历 converters
					for ( conv2 in converters ) {

						// If conv2 outputs current
						// 如果 conv2 输出电流
						// tmp 赋值 conv2.split( " " )
						tmp = conv2.split( " " );
						// 判断 tmp[ 1 ] === current
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							// 如果 prev 可以转换为可接受的输入
							// conv 赋值 converters[ prev + " " + tmp[ 0 ] ] 或者 converters[ "* " + tmp[ 0 ] ]
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							// 判断 conv
							if ( conv ) {

								// Condense equivalence converters
								// 冷凝等效变换器
								// 判断 conv === true
								if ( conv === true ) {
									// conv 赋值 converters[ conv2 ]
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								// 否则，插入中间数据类型
								// 判断 converters[ conv2 ] !== true
								} else if ( converters[ conv2 ] !== true ) {
									// current 赋值 tmp[ 0 ]
									current = tmp[ 0 ];
									// dataTypes.unshift( tmp[ 1 ] )
									dataTypes.unshift( tmp[ 1 ] );
								}
								// 退出当前循环 converters
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				// 应用转换器（如果不是等效的话）
				// 判断 conv !== true
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					// 除非错误允许冒泡，抓住并归还
					// 判断 conv && s.throws
					// 可以看出 这一步很关键
					if ( conv && s.throws ) {
						// response 赋值 conv( response )
						response = conv( response );
					} else {
						try {
							// 尝试 response 赋值 conv( response )
							response = conv( response );
						} catch ( e ) {
							// 若报错 返回 对象
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	// 返回 对象 { state: "success", data: response }
	return { state: "success", data: response };
}

// 执行 jQuery.extend 方法
jQuery.extend( {

	// Counter for holding the number of active queries
	// 保持主动查询数的计数器
	active: 0,

	// Last-Modified header cache for next request
	// 下一个请求的最后修改头缓存
	lastModified: {},
	etag: {},

	// ajaxSettings ajax 设置
	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		// accepts 对象
		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		// contents 对象
		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		// responseFields 对象
		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// 数据转换器
		// Keys separate source (or catchall "*") and destination types with a single space
		// 键单独的源 (或 catchall "*") 和目的地类型的单一空间
		converters: {

			// Convert anything to text
			// 将任何文本转换为文本
			"* text": String,

			// Text to html (true = no transformation)
			// 文本到HTML（TRUE＝NO转换）
			"text html": true,

			// Evaluate text as a json expression
			// 评估文本作为JSON表达式
			"text json": JSON.parse,

			// Parse text as xml
			// 将文本解析为XML
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		// 对于不应该进行深度扩展的选项：如果创建不应该进行深度扩展的选项，则可以在这里添加自己的自定义选项（参见 ajaxExtend ）
		// flatOptions 对象
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// 用 ajaxSettings 和设置字段创建一个完整的设置对象到目标。
	// If target is omitted, writes into ajaxSettings.
	// 如果目标被省略，则写入 ajaxSettings .
	// ajaxSetup 方法
	ajaxSetup: function( target, settings ) {
		// 返回 settings 返回为真 则返回 ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings )
		// 否则 返回 ajaxExtend( jQuery.ajaxSettings, target )
		return settings ?

			// Building a settings object
			// 建立设置对象
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			// 扩展 ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	// ajaxPrefilter 为 addToPrefiltersOrTransports( prefilters ) 执行结果
	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	// ajaxTransport 为 addToPrefiltersOrTransports( transports ) 执行结果
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	// 主方法
	// ajax 方法
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		// 如果 url 是对象，则模拟 前-1.5 签名
		// 判断 url 是否为 "object" 类型
		if ( typeof url === "object" ) {
			// options 赋值 url
			options = url;
			// url 赋值 undefined
			url = undefined;
		}

		// Force options to be an object
		// 强制选择对象
		// options 赋值 options 或者 空对象
		options = options || {};

		// 初始化 transport
		var transport,

			// URL without anti-cache param
			// URL没有 anti-cache 参数
			// 初始化 cacheURL
			cacheURL,

			// Response headers
			// 响应头
			// 初始化 responseHeadersString
			responseHeadersString,
			// 初始化 responseHeaders
			responseHeaders,

			// timeout handle
			// 超时句柄
			// 初始化 timeoutTimer
			timeoutTimer,

			// Url cleanup var
			// 清除 Url 变量
			// 初始化 urlAnchor
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			// 请求状态（在发送时变为假，完成后为假）
			// 初始化 completed
			completed,

			// To know if global events are to be dispatched
			// 了解全局事件是否将被派遣
			// 初始化 fireGlobals
			fireGlobals,

			// Loop variable
			// 循环变量
			// 初始化 i
			i,

			// uncached part of the url
			// URL的未恢复部分
			// 初始化 uncached
			uncached,

			// Create the final options object
			// 创建最终选项对象
			// 声明 s 赋值 jQuery.ajaxSetup( {}, options )
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			// 回调上下文
			// 声明 callbackContext 赋值 s.context 或者 s
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			// 如果是DOM节点或jQuery集合，则全局事件的上下文是回调上下文
			// 声明 globalEventContext 赋值 s.context 并且 ( callbackContext.nodeType 或者 callbackContext.jquery ) ? jQuery( callbackContext ) : jQuery.event
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			// 延迟
			// 声明 deferred 赋值 jQuery.Deferred()
			deferred = jQuery.Deferred(),
			// 声明 completeDeferred 赋值 jQuery.Callbacks( "once memory" )
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			// 状态相关回调
			// 声明 statusCode 赋值 s.statusCode 或者 {}
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			// 报头（它们一次发送）
			// 声明 requestHeaders 赋值 空对象
			requestHeaders = {},
			// 声明 requestHeadersNames 赋值 空对象
			requestHeadersNames = {},

			// Default abort message
			// 默认中止消息
			// 声明 strAbort 赋值 "canceled"
			strAbort = "canceled",

			// Fake xhr
			// 假 xhr
			// 声明 jqXHR 赋值 对象
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				// 如果需要的话，建立标题哈希表
				// getResponseHeader 方法
				getResponseHeader: function( key ) {
					// 初始化 match
					var match;
					// 判断 completed
					if ( completed ) {
						// 判断 !responseHeaders
						if ( !responseHeaders ) {
							// responseHeaders 赋值 {}
							responseHeaders = {};
							// 遍历 ( match 赋值 rheaders.exec( responseHeadersString ) )
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								// responseHeaders[ match[ 1 ].toLowerCase() ] 赋值 match[ 2 ]
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						// match 赋值 responseHeaders[ key.toLowerCase() ]
						match = responseHeaders[ key.toLowerCase() ];
					}
					// 返回 match == null ? null : match
					return match == null ? null : match;
				},

				// Raw string
				// 原始字符串
				// getAllResponseHeaders 方法
				getAllResponseHeaders: function() {
					// 返回 completed ? responseHeadersString : null
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				// 缓存报头
				// setRequestHeader 方法
				setRequestHeader: function( name, value ) {
					// 判断 completed == null
					if ( completed == null ) {
						// name 和 requestHeadersNames[ name.toLowerCase() ] 赋值 requestHeadersNames[ name.toLowerCase() ] 或者 name
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						// requestHeaders[ name ] 赋值 value
						requestHeaders[ name ] = value;
					}
					// 返回 this
					return this;
				},

				// Overrides response content-type header
				// 重写响应内容类型头
				// overrideMimeType 方法
				overrideMimeType: function( type ) {
					// 判断 completed == null
					if ( completed == null ) {
						// s.mimeType 赋值 type
						s.mimeType = type;
					}
					// 返回 this
					return this;
				},

				// Status-dependent callbacks
				// 状态相关回调
				// statusCode 方法
				statusCode: function( map ) {
					// 初始化 code
					var code;
					// 判断 map
					if ( map ) {
						// 判断 completed
						if ( completed ) {

							// Execute the appropriate callbacks
							// 执行适当的回调
							// 执行 jqXHR.always( map[ jqXHR.status ] )
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							// 以一种保存旧回调的方式懒惰地添加新的回调
							// 遍历 map
							for ( code in map ) {
								// statusCode[ code ] 赋值 [ statusCode[ code ], map[ code ] ]
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					// 返回 this
					return this;
				},

				// Cancel the request
				// 取消请求
				// abort 方法
				abort: function( statusText ) {
					// 声明 finalText 赋值 statusText 或者 strAbort
					var finalText = statusText || strAbort;
					// 判断 transport
					if ( transport ) {
						// 执行 transport.abort( finalText )
						transport.abort( finalText );
					}
					// 执行 done( 0, finalText )
					done( 0, finalText );
					// 返回 this
					return this;
				}
			};

		// Attach deferreds
		// 附加延迟
		// 执行 deferred.promise( jqXHR )
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// 如果未提供协议，则添加协议（预过滤器可能需要它）
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// 在设置对象中处理 falsy url（#10093：与旧签名一致）
		// We also use the url parameter if available
		// 如果可用的话，我们还使用 url 参数。
		// s.url 赋值 ( ( url || s.url || location.href ) + "" ).replace( rprotocol, location.protocol + "//" )
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		// 按票类型分类的别名方法选项
		// s.type 赋值 options.method 或者 options.type 或者 s.method 或者 s.type
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		// 提取数据类型列表
		// s.dataTypes 赋值 ( s.dataType 或者 "*" ).toLowerCase().match( rnothtmlwhite ) 或者 [ "" ]
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		// 当源与当前源不匹配时，需要跨域请求。
		// 判断 s.crossDomain == null
		if ( s.crossDomain == null ) {
			// urlAnchor 赋值 document.createElement( "a" )
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// 如果 url 出现错误，IE在访问 href 属性时抛出异常
			// e.g. http://example.com:80x/
			// 尝试执行
			try {
				// urlAnchor.href 赋值 s.url
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				// 当 s.url 是相对的时，锚的主机属性没有正确设置
				// urlAnchor.href 赋值 urlAnchor.href
				urlAnchor.href = urlAnchor.href;
				// s.crossDomain 赋值 originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				// 如果解析 URL 有错误，假定它是交叉域，如果无效，则可以拒绝该传输。
				// s.crossDomain 赋值 true
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		// 如果不是字符串，则转换数据
		// 判断 s.data && s.processData 并且 typeof s.data !== "string"
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			// s.data 赋值 jQuery.param( s.data, s.traditional )
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		// 应用预过滤器
		// 执行 inspectPrefiltersOrTransports( prefilters, s, options, jqXHR )
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		// 如果请求在预过滤器内部中止，请停止
		// 判断 completed
		if ( completed ) {
			// 返回 jqXHR
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// 如果需要，我们现在就可以触发全局事件。
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		// 如果在AMD使用场景中未定义 jQuery.event ，则不要触发事件。
		// fireGlobals 赋值 jQuery.event 并且 s.global
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		// 注意一组新的请求
		// 判断 fireGlobals 并且 jQuery.active++ === 0
		if ( fireGlobals && jQuery.active++ === 0 ) {
			// 执行 jQuery.event.trigger( "ajaxStart" )
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		// 大写类型
		// s.type 赋值 s.type.toUpperCase()
		s.type = s.type.toUpperCase();

		// Determine if request has content
		// 确定请求是否有内容
		// s.hasContent 赋值 !rnoContent.test( s.type )
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// 保存 URL ，如果我们在玩 If-Modified-Since 和/或如果没有匹配的标题稍后
		// Remove hash to simplify url manipulation
		// 移除哈希以简化 url 操作
		// cacheURL 赋值 s.url.replace( rhash, "" )
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		// 没有内容的请求的更多选项处理
		// 判断 !s.hasContent
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			// 记住哈希，这样我们就可以把它放回去。
			// uncached 赋值 s.url.slice( cacheURL.length )
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			// 如果数据可用并且应该被处理，将数据附加到URL
			// 判断 s.data 并且 ( s.processData 或者 typeof s.data === "string" )
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				// cacheURL 赋值 cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				// #9682: 删除数据，以便在最终重试中不使用它。
				// delete s.data
				delete s.data;
			}

			// Add or update anti-cache param if needed
			// 如果需要，添加或更新反缓存参数
			// 判断 s.cache === fals
			if ( s.cache === false ) {
				// cacheURL 赋值 cacheURL.replace( rantiCache, "$1" )
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				// uncached 赋值 ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			// 将哈希和反缓存放在将被请求的URL上
			// s.url 赋值 cacheURL + uncached
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		// 将“% 20”更改为“+”，如果这是由正文内容编码的
		// 判断 s.data 并且 s.processData 并且 ( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			// s.data 赋值 s.data.replace( r20, "+" )
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		// 如果在 ifModified 模式下设置 If-Modified-Since 和/或 If-None-Match 标题。
		// 判断 s.ifModified
		if ( s.ifModified ) {
			// 判断 jQuery.lastModified[ cacheURL ]
			if ( jQuery.lastModified[ cacheURL ] ) {
				// 执行 jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] )
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			// 判断 jQuery.etag[ cacheURL ]
			if ( jQuery.etag[ cacheURL ] ) {
				// 执行 jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] )
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		// 如果发送数据，则设置正确的页眉
		// 判断 s.data 并且 s.hasContent 并且 s.contentType !== false 或者 options.contentType
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			// 执行 jqXHR.setRequestHeader( "Content-Type", s.contentType )
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		// 根据数据类型设置服务器的接受标头
		// 执行 jqXHR.setRequestHeader 方法
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		// 检查页眉选项
		// 遍历 s.headers
		for ( i in s.headers ) {
			// 执行 jqXHR.setRequestHeader( i, s.headers[ i ] )
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		// 允许自定义 headers/mimetypes 和早期中止
		// 判断 s.beforeSend 并且 ( s.beforeSend.call( callbackContext, jqXHR, s ) === false 或者 completed ) 
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			// 如果尚未完成并返回，则中止
			// 返回 jqXHR.abort()
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		// 中止不再是取消
		// strAbort 赋值 "abort"
		strAbort = "abort";

		// Install callbacks on deferreds
		// 在延迟上安装回调
		// 执行 completeDeferred.add( s.complete )
		completeDeferred.add( s.complete );
		// 执行 jqXHR.done( s.success )
		jqXHR.done( s.success );
		// 执行 jqXHR.fail( s.error )
		jqXHR.fail( s.error );

		// Get transport
		// 获得运输
		// transport 赋值 inspectPrefiltersOrTransports( transports, s, options, jqXHR )
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		// 如果没有传输，我们自动中止
		// 判断 !transport
		if ( !transport ) {
			// 执行 done( -1, "No Transport" )
			done( -1, "No Transport" );
		} else {
			// jqXHR.readyState 赋值 1
			jqXHR.readyState = 1;

			// Send global event
			// 发送全局事件
			// 判断 fireGlobals
			if ( fireGlobals ) {
				// 执行 globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] )
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			// 如果请求在 ajaxSend 内中止，请停止
			// 判断 completed
			if ( completed ) {
				// 返回 jqXHR
				return jqXHR;
			}

			// Timeout
			// 超时
			// 判断 s.async 并且 s.timeout > 0
			if ( s.async && s.timeout > 0 ) {
				// timeoutTimer 赋值 window.setTimeout 方法
				// 传入 匿名函数 以及 s.timeout
				timeoutTimer = window.setTimeout( function() {
					// 执行 jqXHR.abort( "timeout" )
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			// 尝试执行
			try {
				// completed 赋值 false
				completed = false;
				// 执行 transport.send( requestHeaders, done )
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				// 重排后完成异常
				// 判断 completed
				if ( completed ) {
					// 抛出异常 e
					throw e;
				}

				// Propagate others as results
				// 传播他人作为结果
				// 执行 done( -1, e )
				done( -1, e );
			}
		}

		// Callback for when everything is done
		// 当一切都完成时的回调
		// 声明 done 方法
		function done( status, nativeStatusText, responses, headers ) {
			// 初始化 isSuccess, success, error, response, modified
			var isSuccess, success, error, response, modified,
				// 声明 statusText 赋值 nativeStatusText
				statusText = nativeStatusText;

			// Ignore repeat invocations
			// 忽略重复调用
			// 判断 completed
			if ( completed ) {
				// 返回
				return;
			}

			// completed 赋值 true
			completed = true;

			// Clear timeout if it exists
			// 如果它存在，清澈的超时
			// 判断 timeoutTimer
			if ( timeoutTimer ) {
				// 执行 window.clearTimeout( timeoutTimer )
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			// Dereference 运输早期垃圾收集（无论多长的 jqXHR 对象将使用）
			// transport 赋值 undefined
			transport = undefined;

			// Cache response headers
			// 缓存响应标题
			// responseHeadersString 赋值 headers 或者 ""
			responseHeadersString = headers || "";

			// Set readyState
			// 设置就绪状态
			// jqXHR.readyState 赋值 status > 0 ? 4 : 0
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			// 如果确定的成功
			// isSuccess 赋值 status >= 200 并且 status < 300 或者 status === 304
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			// 获取响应数据
			// 判断 responses
			if ( responses ) {
				// response 赋值 ajaxHandleResponses( s, jqXHR, responses )
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			// 无论如何转换（总是设置 responseXXX 字段）
			// response 赋值 ajaxConvert( s, response, jqXHR, isSuccess )
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			// 如果成功，句柄类型链
			// 判断 isSuccess
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				// 设置 If-Modified-Since 和/或 If-None-Match 头，如果在 ifModified 模式。
				// 判断 s.ifModified
				if ( s.ifModified ) {
					// modified 赋值 jqXHR.getResponseHeader( "Last-Modified" )
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					// 判断 modified
					if ( modified ) {
						// jQuery.lastModified[ cacheURL ] 赋值 modified
						jQuery.lastModified[ cacheURL ] = modified;
					}
					// modified 赋值 jqXHR.getResponseHeader( "etag" )
					modified = jqXHR.getResponseHeader( "etag" );
					// 判断 modified
					if ( modified ) {
						// jQuery.etag[ cacheURL ] 赋值 modified
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				// 如果没有内容
				// 判断 status === 204 或者 s.type === "HEAD"
				if ( status === 204 || s.type === "HEAD" ) {
					// statusText 赋值 "nocontent"
					statusText = "nocontent";

				// if not modified
				// 如果没有修改
				// 判断 status === 304
				} else if ( status === 304 ) {
					// statusText 赋值 "notmodified"
					statusText = "notmodified";

				// If we have data, let's convert it
				// 如果我们有数据，让我们转换它
				} else {
					// statusText 赋值 response.state
					statusText = response.state;
					// success 赋值 response.data
					success = response.data;
					// error 赋值 response.error
					error = response.error;
					// isSuccess 赋值 !error
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				// 从 statusText 中提取错误并对非中止进行规范化
				// error 赋值 statusText
				error = statusText;
				// 判断 status 或者 !statusText
				if ( status || !statusText ) {
					// statusText 赋值 "error"
					statusText = "error";
					// 判断 status < 0
					if ( status < 0 ) {
						// status 赋值 0
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			// 设置假 xhr 对象的数据
			// jqXHR.status 赋值 status
			jqXHR.status = status;
			// jqXHR.statusText 赋值 ( nativeStatusText 或者 statusText ) + ""
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			// 成功/错误
			// 判断 isSuccess
			if ( isSuccess ) {
				// 执行 deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] )
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				// 执行 deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] )
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			// 状态相关回调
			// 执行 jqXHR.statusCode( statusCode )
			jqXHR.statusCode( statusCode );
			// statusCode 赋值 undefined
			statusCode = undefined;

			// 判断 fireGlobals
			if ( fireGlobals ) {
				// 执行 globalEventContext.trigger 方法
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			// 完成
			// 执行 completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] )
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			// 判断 fireGlobals
			if ( fireGlobals ) {
				// 执行 globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] )
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				// 处理全局Ajax计数器
				// 判断 !( --jQuery.active )
				if ( !( --jQuery.active ) ) {
					// 执行 jQuery.event.trigger( "ajaxStop" )
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// 返回 jqXHR
		return jqXHR;
	},

	// getJSON 方法
	getJSON: function( url, data, callback ) {
		// 返回 jQuery.get( url, data, callback, "json" )
		return jQuery.get( url, data, callback, "json" );
	},

	// getScript 方法
	getScript: function( url, callback ) {
		// 返回 jQuery.get( url, undefined, callback, "script" )
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

// 使用 jQuery.each 方法 遍历 [ "get", "post" ]
jQuery.each( [ "get", "post" ], function( i, method ) {
	// jQuery[ method ] 赋值 匿名函数
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		// 如果省略数据参数，则转换参数
		// 判断 data 是否为 function
		if ( isFunction( data ) ) {
			// type 赋值 type 或者 callback
			type = type || callback;
			// callback 赋值 data
			callback = data;
			// data 赋值 undefined
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		// URL可以是一个选项对象（然后必须有.url）
		// 返回 jQuery.ajax 方法 传入的对象
		// 需要检查 jQuery.isPlainObject( url ) && url
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

// 返回 jQuery
return jQuery;
} );
