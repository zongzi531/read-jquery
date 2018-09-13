define( [
	"./core",
	"./core/toType",
	"./manipulation/var/rcheckableType",
	"./var/isFunction",
	"./core/init",
	"./traversing", // filter
	"./attributes/prop"
], function( jQuery, toType, rcheckableType, isFunction ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/toType.js 获得 toType 方法
	// require manipulation/var/rcheckableType.js 获得 用来检查 checkbox 或者 radio 的正则表达式
	// require var/isFunction.js 获得 isFunction 方法
	// require core/init.js
	// require traversing.js
	// require attributes/prop.js

var

	// 声明 rbracket 正则表达式
	rbracket = /\[\]$/,

	// 声明 rCRLF 正则表达式
	rCRLF = /\r?\n/g,

	// 声明 rsubmitterTypes 正则表达式 用于判断 submit|button|image|reset|file
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,

	// 声明 rsubmittable 正则表达式 用于判断 input|select|textarea|keygen
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

// 声明 buildParams 方法
function buildParams( prefix, obj, traditional, add ) {

	// 初始化 name
	var name;

	// 判断 obj 是否为数组
	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		// Serialize 数组 项目
		// 使用 jQuery.each 方法 遍历 obj
		jQuery.each( obj, function( i, v ) {

			// 判断 traditional 或者 rbracket.test( prefix )
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				// 将每个数组项视为标量。
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				// 项是非标量（数组或对象），编码其数值索引。
				// 递归调用
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	// 判断 !traditional 并且 toType( obj ) === "object"
	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		// Serialize 对象 项目
		// 使用 in 操作符 遍历 obj
		for ( name in obj ) {

			// 递归调用
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		// 序列化的例子项目。
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
// 将表单元素数组或一组键值/值序列化为查询字符串
// jQuery.param 赋值 匿名函数
jQuery.param = function( a, traditional ) {

	// 初始化 prefix
	var prefix,

		// 声明 s 赋值 []
		s = [],

		// 声明 add 赋值 方法
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			// 如果值是函数，则调用它并使用其返回值。
			// 声明 value 赋值 isFunction( valueOrFunction ) ? valueOrFunction() : valueOrFunction
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			// s[ s.length ] 赋值 encodeURIComponent( key ) + "=" + encodeURIComponent( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	// 如果传入一个数组，假设它是一个表单元素数组。
	// 判断 Array.isArray( a ) 或者 ( a.jquery 并且 !jQuery.isPlainObject( a ) )
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		// 序列化表单元素
		// 遍历 a 数组
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		// 如果是传统的，编码“旧”方式（1.3.2或更老的方式），否则递归编码 params。
		// 使用 in 操作符 遍历 a 对象
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	// 返回结果序列化
	// 返回 s.join( "&" )
	return s.join( "&" );
};

// jQuery.fn.extend 方法
jQuery.fn.extend( {

	// serialize 方法
	serialize: function() {

		// 返回 jQuery.param( this.serializeArray() )
		return jQuery.param( this.serializeArray() );
	},

	// serializeArray 方法
	serializeArray: function() {

		// 方法 map 方法
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			// 可以为“元素”添加 propHook 来过滤或添加表单元素
			// 声明 elements 赋值 jQuery.prop( this, "elements" )
			var elements = jQuery.prop( this, "elements" );

			// 返回 elements ? jQuery.makeArray( elements ) : this
			return elements ? jQuery.makeArray( elements ) : this;
		} )

		// 链式调用 filter 方法
		.filter( function() {

			// 声明 type 赋值 this.type
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			// 使用 .is( ":disabled" ) 使 fieldset[disabled] 工作
			// 返回 this.name 并且 !jQuery( this ).is( ":disabled" ) 并且
			// rsubmittable.test( this.nodeName ) 并且 !rsubmitterTypes.test( type ) 并且
			// ( this.checked 或者 !rcheckableType.test( type ) )
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )

		// 链式调用 map 方法
		.map( function( i, elem ) {

			// 声明 val 赋值 jQuery( this ).val()
			var val = jQuery( this ).val();

			// 判断 val == null 满足 则 返回 null
			if ( val == null ) {
				return null;
			}

			// 判断 val 是否为数组
			if ( Array.isArray( val ) ) {

				// 返回 对 val 使用 jQuery.map 方法
				return jQuery.map( val, function( val ) {

					// 返回 { name: elem.name, value: val.replace( rCRLF, "\r\n" ) }
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			// 返回  name: elem.name, value: val.replace( rCRLF, "\r\n" ) }
			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };

		// 链式调用 get 方法
		} ).get();
	}
} );

// 返回 jQuery
return jQuery;
} );
