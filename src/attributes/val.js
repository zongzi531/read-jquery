define( [
	"../core",
	"../core/stripAndCollapse",
	"./support",
	"../core/nodeName",
	"../var/isFunction",

	"../core/init"
], function( jQuery, stripAndCollapse, support, nodeName, isFunction ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/stripAndCollapse.js 获得 stripAndCollapse 方法
	// require ./support.js 获得 support 对象
	// require core/nodeName.js 获得 nodeName 方法
	// require var/isFunction.js 获得 isFunction 方法

// 声明 rreturn 赋值 /\r/g
var rreturn = /\r/g;

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// val 方法
	val: function( value ) {

		// 初始化 hooks, ret, valueIsFunction
		var hooks, ret, valueIsFunction,

			// 声明 elem 赋值 this[ 0 ]
			elem = this[ 0 ];

		// 判断 !arguments.length
		if ( !arguments.length ) {

			// 判断 elem
			if ( elem ) {

				// hooks 赋值 jQuery.valHooks[ elem.type ] 或者 jQuery.valHooks[ elem.nodeName.toLowerCase() ]
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				// 判断 hooks 并且 "get" in hooks 并且 ( ret 赋值 hooks.get( elem, "value" ) ) !== undefined
				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {

					// 返回 ret
					return ret;
				}

				// ret 赋值 elem.value
				ret = elem.value;

				// Handle most common string cases
				// 处理最常见的字符串实例
				// 判断 typeof ret === "string"
				if ( typeof ret === "string" ) {

					// 返回 ret.replace( rreturn, "" )
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				// 处理值为 null/undef 或数字的情况
				// 返回 ret == null ? "" : ret
				return ret == null ? "" : ret;
			}

			return;
		}

		// valueIsFunction 赋值 isFunction( value )
		valueIsFunction = isFunction( value );

		// 返回 this.each 方法 遍历当前元素集
		return this.each( function( i ) {

			// 初始化 val
			var val;

			// 判断 this.nodeType !== 1
			if ( this.nodeType !== 1 ) {
				return;
			}

			// 判断 valueIsFunction
			if ( valueIsFunction ) {

				// val 赋值 value.call( this, i, jQuery( this ).val() )
				val = value.call( this, i, jQuery( this ).val() );
			} else {

				// val 赋值 value
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			// 将空/未定义为“”；将数字转换为字符串
			// 判断 val == null
			if ( val == null ) {

				// val 赋值 ""
				val = "";

				// 判断 typeof val === "number"
			} else if ( typeof val === "number" ) {

				// val 赋值 val + ""
				val += "";

				// 判断 Array.isArray( val )
			} else if ( Array.isArray( val ) ) {

				// val 赋值 jQuery.map 返回值
				val = jQuery.map( val, function( value ) {

					// 返回 value == null ? "" : value + ""
					return value == null ? "" : value + "";
				} );
			}

			// hooks 赋值 jQuery.valHooks[ this.type ] 或者 jQuery.valHooks[ this.nodeName.toLowerCase() ]
			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			// 如果 set 返回未定义，则返回正常设置。
			// 判断 !hooks 或者 !( "set" in hooks ) 或者 hooks.set( this, val, "value" ) === undefined
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {

				// this.value 赋值 val
				this.value = val;
			}
		} );
	}
} );

// 执行 jQuery.extend 方法
jQuery.extend( {

	// valHooks 对象
	valHooks: {

		// option 对象
		option: {

			// get 方法
			get: function( elem ) {

				// 声明 val 赋值 jQuery.find.attr( elem, "value" )
				var val = jQuery.find.attr( elem, "value" );

				// 返回 val != null ? val : stripAndCollapse( jQuery.text( elem ) )
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},

		// select 对象
		select: {

			// get 方法
			get: function( elem ) {

				// 初始化 value, option, i
				var value, option, i,

					// 声明 options 赋值 elem.options
					options = elem.options,

					// 声明 index 赋值 elem.selectedIndex
					index = elem.selectedIndex,

					// 声明 one 赋值 elem.type === "select-one"
					one = elem.type === "select-one",

					// 声明 values 赋值 one ? null : []
					values = one ? null : [],

					// 声明 max 赋值 one ? index + 1 : options.length
					max = one ? index + 1 : options.length;

				// 判断 index < 0
				if ( index < 0 ) {

					// i 赋值 max
					i = max;

				} else {

					// i 赋值 one ? index : 0
					i = one ? index : 0;
				}

				// Loop through all the selected options
				// 循环遍历所有选择的选项
				// 遍历 max
				for ( ; i < max; i++ ) {

					// option 赋值 options[ i ]
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					// 判断 ( option.selected || i === index ) 并且 !option.disabled 并且 ( !option.parentNode.disabled 或者 !nodeName( option.parentNode, "optgroup" ) )
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							// 不要返回禁用或禁用的 optgroup 的选项
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						// 获取选项的特定值
						// value 赋值 jQuery( option ).val()
						value = jQuery( option ).val();

						// We don't need an array for one selects
						// 我们不需要一个数组来选择
						// 判断 one
						if ( one ) {

							// 返回 value
							return value;
						}

						// Multi-Selects return an array
						// 多选择返回数组
						// 执行 values.push( value )
						values.push( value );
					}
				}

				// 返回 values
				return values;
			},

			// set 方法
			set: function( elem, value ) {

				// 初始化 optionSet, option
				var optionSet, option,

					// 声明 options 赋值 elem.options
					options = elem.options,

					// 声明 values 赋值 jQuery.makeArray( value )
					values = jQuery.makeArray( value ),

					// 声明 i 赋值 options.length
					i = options.length;

				// 遍历 i
				while ( i-- ) {

					// option 赋值 options[ i ]
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					// 判断 option.selected 赋值 jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {

						// optionSet 赋值 true
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				// 强制浏览器在不匹配值设置时保持一致
				// 判断 !optionSet
				if ( !optionSet ) {

					// elem.selectedIndex 赋值 -1
					elem.selectedIndex = -1;
				}

				// 返回 values
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
// 执行 jQuery.each 方法 遍历 [ "radio", "checkbox" ]
jQuery.each( [ "radio", "checkbox" ], function() {

	// jQuery.valHooks[ this ] 赋值 对象
	jQuery.valHooks[ this ] = {

		// set 方法
		set: function( elem, value ) {

			// 判断 Array.isArray( value )
			if ( Array.isArray( value ) ) {

				// 返回 ( elem.checked 赋值 jQuery.inArray( jQuery( elem ).val(), value ) > -1 )
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};

	// 判断 !support.checkOn
	if ( !support.checkOn ) {

		// jQuery.valHooks[ this ].get 赋值 函数
		jQuery.valHooks[ this ].get = function( elem ) {

			// 返回 elem.getAttribute( "value" ) === null ? "on" : elem.value
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );

} );
