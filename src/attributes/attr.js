define( [
	"../core",
	"../core/access",
	"../core/nodeName",
	"./support",
	"../var/rnothtmlwhite",
	"../selector"
], function( jQuery, access, nodeName, support, rnothtmlwhite ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/access.js 获得 access 方法
	// require core/nodeName.js 获得 nodeName 方法
	// require ./support.js 获得 support 对象
	// require var/rnothtmlwhite.js 获得 正则表达式
	// require selector.js


// 初始化 boolHook
var boolHook,

	// 声明 attrHandle 赋值 jQuery.expr.attrHandle
	attrHandle = jQuery.expr.attrHandle;

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// attr 方法
	attr: function( name, value ) {

		// 返回 access( this, jQuery.attr, name, value, arguments.length > 1 )
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	// removeAttr 方法
	removeAttr: function( name ) {

		// 返回 this.each 方法
		// 遍历当前元素集
		return this.each( function() {

			// 执行 jQuery.removeAttr( this, name )
			jQuery.removeAttr( this, name );
		} );
	}
} );

// 执行 jQuery.extend 方法
jQuery.extend( {

	// attr 方法
	attr: function( elem, name, value ) {

		// 初始化 ret, hooks
		var ret, hooks,

			// 声明 nType 赋值 elem.nodeType
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		// 不要在文本、注释和属性节点上获取/设置属性
		// 判断 nType === 3 || nType === 8 || nType === 2 满足 则 直接 返回
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		// 不支持属性时回落到道具
		// 判断 typeof elem.getAttribute === "undefined"
		if ( typeof elem.getAttribute === "undefined" ) {

			// 返回 jQuery.prop( elem, name, value )
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// 属性钩子由小写版本确定。
		// Grab necessary hook if one is defined
		// 抓取必要的钩子
		// 判断 nType !== 1 || !jQuery.isXMLDoc( elem )
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// hooks 赋值 jQuery.attrHooks[ name.toLowerCase() ] 或者 ( jQuery.expr.match.bool.test( name ) ? boolHook : undefined )
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		// 判断 value !== undefined
		if ( value !== undefined ) {

			// 判断 value === nul
			if ( value === null ) {

				// 执行 jQuery.removeAttr( elem, name )
				jQuery.removeAttr( elem, name );
				return;
			}

			// 判断 hooks 并且 "set" in hooks 并且 ( ret 赋值 hooks.set( elem, value, name ) ) !== undefined
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {

				// 返回 ret
				return ret;
			}

			// 执行 elem.setAttribute( name, value + "" )
			elem.setAttribute( name, value + "" );

			// 返回 value
			return value;
		}

		// 判断 hooks 并且 "get" in hooks 并且 ( ret 赋值 hooks.get( elem, name ) ) !== null
		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {

			// 返回 ret
			return ret;
		}

		// ret 赋值 jQuery.find.attr( elem, name )
		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		// 不存在的属性返回NULL，我们常态化为未定义。
		// 返回 ret == null ? undefined : ret
		return ret == null ? undefined : ret;
	},

	// attrHooks 对象
	attrHooks: {

		// type 对象
		type: {

			// set 方法
			set: function( elem, value ) {

				// 判断 !support.radioValue 并且 value === "radio" 并且 nodeName( elem, "input" )
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {

					// 声明 val 赋值 elem.value
					var val = elem.value;

					// 执行 elem.setAttribute( "type", value )
					elem.setAttribute( "type", value );

					// 判断 val
					if ( val ) {

						// elem.value 赋值 val
						elem.value = val;
					}

					// 返回 value
					return value;
				}
			}
		}
	},

	// removeAttr 方法
	removeAttr: function( elem, value ) {

		// 初始化 name
		var name,

			// 声明 i 赋值 0
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// 属性名称可以包含非HTML空白字符
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			// 声明 attrNames 赋值 value && value.match( rnothtmlwhite )
			attrNames = value && value.match( rnothtmlwhite );

		// 判断 attrNames 并且 elem.nodeType === 1
		if ( attrNames && elem.nodeType === 1 ) {

			// 遍历 满足 ( name = attrNames[ i++ ] ) 的情况
			while ( ( name = attrNames[ i++ ] ) ) {

				// 执行 elem.removeAttribute( name )
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
// 布尔属性钩子
// boolHook 赋值 对象
boolHook = {

	// set 方法
	set: function( elem, value, name ) {

		// 判断 value === false
		if ( value === false ) {

			// Remove boolean attributes when set to false
			// 当设置为false时删除布尔属性
			// 执行 jQuery.removeAttr( elem, name )
			jQuery.removeAttr( elem, name );
		} else {

			// 执行 elem.setAttribute( name, name )
			elem.setAttribute( name, name );
		}

		// 返回 name
		return name;
	}
};

// 对 jQuery.expr.match.bool.source.match( /\w+/g ) 返回结果 执行 jQuery.each 方法
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	// 声明 getter 赋值 attrHandle[ name ] 或者 jQuery.find.attr
	var getter = attrHandle[ name ] || jQuery.find.attr;

	// attrHandle[ name ] 赋值 匿名函数
	attrHandle[ name ] = function( elem, name, isXML ) {

		// 初始化 ret, handle
		var ret, handle,

			// 声明 lowercaseName 赋值 name.toLowerCase()
			lowercaseName = name.toLowerCase();

		// 判断 !isXML
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			// 通过从 getter 暂时删除此函数避免无限循环
			// handle 赋值 attrHandle[ lowercaseName ]
			handle = attrHandle[ lowercaseName ];

			// attrHandle[ lowercaseName ] 赋值 ret
			attrHandle[ lowercaseName ] = ret;

			// ret 赋值 getter( elem, name, isXML ) != null ? lowercaseName : null
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;

			// attrHandle[ lowercaseName ] 赋值 handle
			attrHandle[ lowercaseName ] = handle;
		}

		// 返回 ret
		return ret;
	};
} );

} );
