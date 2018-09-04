define( [
	"../core",
	"../core/access",
	"./support",
	"../selector"
], function( jQuery, access, support ) {

"use strict";
	// require core.js 获得 jQuery
	// require core/access.js 获得 access 方法
	// require support.js 获得 support 对象
	// require selector.js

// 声明 rfocusable 正则表达式 用于判断 input|select|textarea|button
var rfocusable = /^(?:input|select|textarea|button)$/i,
	// 声明 rclickable 正则表达式 用于判断 a|area
	rclickable = /^(?:a|area)$/i;

// 使用 jQuery.fn.extend 方法
jQuery.fn.extend( {
	// prop 方法
	prop: function( name, value ) {
		// 返回 access( this, jQuery.prop, name, value, arguments.length > 1 )
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	// removeProp 方法
	removeProp: function( name ) {
		// 返回 遍历当前元素集
		return this.each( function() {
			// 使用 delete 操作符 删除对应 this[ jQuery.propFix[ name ] || name ]
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

// 使用 jQuery.extend 方法
jQuery.extend( {
	// prop 方法
	prop: function( elem, name, value ) {
		// 初始化 ret, hooks
		var ret, hooks,
			// 声明 nType 赋值 elem.nodeType
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		// 不要在文本、注释和属性节点上获取/设置属性
		// 判断 nType === 3 或者 nType === 8 或者 nType === 2 满足 则 直接 返回
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// 判断 nType !== 1 或者 !jQuery.isXMLDoc( elem )
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			// 修复名称和挂钩
			// name 赋值 jQuery.propFix[ name ] 或者 name;
			name = jQuery.propFix[ name ] || name;
			// hooks 赋值 jQuery.propHooks[ name ];
			hooks = jQuery.propHooks[ name ];
		}

		// 判断 value !== undefined
		if ( value !== undefined ) {
			// 判断 hooks 存在 并且 hooks 存在 set 属性 并且 ( ret = hooks.set( elem, value, name ) ) !== undefined
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				// 返回 ret
				return ret;
			}

			// 返回 ( elem[ name ] = value )
			return ( elem[ name ] = value );
		}

		// 判断 hooks 存在 并且 hooks 存在 get 属性 并且 ( ret = hooks.get( elem, name ) ) !== null
		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			// 返回 ret
			return ret;
		}

		// 返回 elem[ name ]
		return elem[ name ];
	},

	// propHooks 对象
	propHooks: {
		// tabIndex 对象
		tabIndex: {
			// get 方法
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// 当 elem.tabIndex 未显式设置时，它不总是返回正确的值。
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				// 声明 tabindex 赋值 jQuery.find.attr( elem, "tabindex" )
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				// 判断 tabindex
				if ( tabindex ) {
					// 返回 parseInt( tabindex, 10 )
					return parseInt( tabindex, 10 );
				}

				// 判断 rfocusable.test( elem.nodeName ) 或者
				// rclickable.test( elem.nodeName ) 并且
				// elem.href
				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					// 返回 0
					return 0;
				}

				// 返回 -1
				return -1;
			}
		}
	},

	// propFix 对象
	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// 访问 selectedIndex 属性迫使浏览器尊重在选项上选择的设置。
// The getter ensures a default option is selected
// when in an optgroup
// getter 确保在 optgroup 时选择默认选项。
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
// eslint 规则“没有未使用的表达式”被禁用，因为它认为这样的代码 noop
// 判断 !support.optSelected
if ( !support.optSelected ) {
	// jQuery.propHooks.selected 赋值 对象
	jQuery.propHooks.selected = {
		// get 方法
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			// 声明 parent 赋值 elem.parentNode
			var parent = elem.parentNode;
			// 判断 parent && parent.parentNode
			if ( parent && parent.parentNode ) {
				// parent.parentNode.selectedIndex
				// 这里在干嘛？？？
				parent.parentNode.selectedIndex;
			}
			// 返回 null
			return null;
		},
		// set 方法
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			// 声明 parent 赋值 elem.parentNode
			var parent = elem.parentNode;
			// 判断 parent
			if ( parent ) {
				parent.selectedIndex;

				// 判断 parent.parentNode
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

// 执行 jQuery.each 方法
jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	// 为 jQuery.propFix 对象 添加相应属性
	// 小写键
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

} );
