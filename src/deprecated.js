define( [
	"./core",
	"./core/nodeName",
	"./core/camelCase",
	"./core/toType",
	"./var/isFunction",
	"./var/isWindow",
	"./var/slice",

	"./event/alias"
], function( jQuery, nodeName, camelCase, toType, isFunction, isWindow, slice ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/nodeName.js 获得 nodeName 方法
	// require core/camelCase.js 获得 camelCase 方法
	// require core/toType.js 获得 toType 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require var/isWindow.js 获得 isWindow 方法
	// require var/slice.js 获得 Array.prototype.slice 方法
	// require event/alias.js

// 使用 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// bind 方法
	bind: function( types, data, fn ) {

		// 返回 this.on( types, null, data, fn )
		return this.on( types, null, data, fn );
	},

	// unbind 方法
	unbind: function( types, fn ) {

		// 返回 this.off( types, null, fn )
		return this.off( types, null, fn );
	},

	// delegate 方法
	delegate: function( selector, types, data, fn ) {

		// 返回 this.on( types, selector, data, fn )
		return this.on( types, selector, data, fn );
	},

	// undelegate 方法
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		// 返回 arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn)
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// 将函数绑定到上下文，可选地部分应用任何参数。
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
// jQuery.proxy 被禁止推广标准（特别是函数绑定），但是，它不会很快被删除。、
// jQuery.proxy 赋值 匿名函数
jQuery.proxy = function( fn, context ) {

	// 初始化 tmp, args, proxy
	var tmp, args, proxy;

	// 判断 typeof context === "string"
	if ( typeof context === "string" ) {

		// tmp 赋值 fn[ context ]
		tmp = fn[ context ];

		// context 赋值 fn
		context = fn;

		// fn 赋值 tmp
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	// 快速检查以确定目标是否可调用，在 spec 中，这会引发一个 TypeError ，但我们只返回未定义的。
	// 判断 !isFunction( fn )
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	// 模拟绑定
	// args 赋值 slice.call( arguments, 2 )
	args = slice.call( arguments, 2 );

	// proxy 赋值 匿名函数
	proxy = function() {

		// 返回 fn.apply( context 或者 this, args.concat( slice.call( arguments ) ) )
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	// 将唯一处理程序的 guid 设置为原始处理程序的相同，以便可以移除
	// proxy.guid 和 fn.guid 赋值 fn.guid 或者 jQuery.guid++
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	// 返回 proxy
	return proxy;
};

// jQuery.holdReady 赋值 匿名函数
jQuery.holdReady = function( hold ) {

	// 判断 hold
	if ( hold ) {

		// 执行 jQuery.readyWait++
		jQuery.readyWait++;
	} else {

		// 执行 jQuery.ready( true )
		jQuery.ready( true );
	}
};

// jQuery.isArray 赋值 Array.isArray
jQuery.isArray = Array.isArray;

// jQuery.parseJSON 赋值 JSON.parse
jQuery.parseJSON = JSON.parse;

// jQuery.nodeName 赋值 nodeName
jQuery.nodeName = nodeName;

// jQuery.isFunction 赋值 isFunction
jQuery.isFunction = isFunction;

// jQuery.isWindow 赋值 isWindow
jQuery.isWindow = isWindow;

// jQuery.camelCase 赋值 camelCase
jQuery.camelCase = camelCase;

// jQuery.type 赋值 toType
jQuery.type = toType;

// jQuery.now 赋值 Date.now
jQuery.now = Date.now;

// jQuery.isNumeric 赋值 匿名函数
jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	// 从jQuery 3.0开始，isNumeric仅限于字符串和数字（原语或对象），这些字符串和数字可以被强制为有限的数字（gh - 2662）
	// 声明 type 赋值 jQuery.type( obj )
	var type = jQuery.type( obj );

	// 返回 ( type === "number" 或者 type === "string" ) 并且 !isNaN( obj - parseFloat( obj ) )
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// parseFloat NaNs 数值铸造假阳性 ("")
		// ……但是误解了领先的数字串，特别是十六进制文字 ("0x...")。
		// 减法将无穷大力强加给了 NaN。
		!isNaN( obj - parseFloat( obj ) );
};

} );
