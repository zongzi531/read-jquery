/* eslint-disable no-unused-vars*/
/*!
 * jQuery JavaScript Library v@VERSION
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: @DATE
 */
// 执行IIFE
( function( global, factory ) {

	"use strict";

	// 判断 typeof module === "object" 并且 typeof module.exports === "object"
	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		// 对于存在适当窗口的 CommonJS 和 CommonJS 环境，执行工厂并获取jQuery。
		// 对于没有“文档”（如 Node.js）的“窗口”的环境，将工厂暴露为模块。
		// 这强调了创造一个真正的“窗口”的必要性。
		// module.exports 赋值 global.document ? factory( global, true ) : fn
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {

				// 判断 !w.document
				if ( !w.document ) {

					// 执行 throw new Error( "jQuery requires a window with a document" )
					throw new Error( "jQuery requires a window with a document" );
				}

				// 返回 factory( w )
				return factory( w );
			};
	} else {

		// factory( global )
		factory( global );
	}

// Pass this if window is not defined yet
// 如果没有定义窗口，则传递
// 第一参数：global    typeof window !== "undefined" ? window : this
// 第二参数：factory   fn
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

// @CODE
// build.js inserts compiled jQuery here

// 返回 jQuery
return jQuery;
} );
