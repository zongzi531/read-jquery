define( [
	"../core",
	"../var/indexOf",
	"../var/isFunction",
	"./var/rneedsContext",
	"../selector"
], function( jQuery, indexOf, isFunction, rneedsContext ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/indexOf.js 获得 Array.prototype.indexOf 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require ./var/rneedsContext.js 获得 jQuery.expr.match.needsContext 方法
  // require selector.js

// Implement the identical functionality for filter and not
// 实现过滤器的相同功能和 not
// 这个 not 参数是用来干什么的，我也不知道……
// 看了下面的方法似乎知道 not 是选择器的一个布尔值参数
function winnow( elements, qualifier, not ) {
	// 判断 qualifier 是否为 function
	if ( isFunction( qualifier ) ) {
		// 返回 使用 jQuery.grep 方法对 元素集 进行条件过滤
		// 过滤条件参照下一行注释
		return jQuery.grep( elements, function( elem, i ) {
			// 返回 qualifier( i, elem ) 返回值 使用 !!操作符 转换为 Boolean 值 与 not 比较
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	// 单个元素
	// 判断是否存在 nodeType 属性值
	if ( qualifier.nodeType ) {
		// 返回 使用 jQuery.grep 方法对 元素集 进行条件过滤
		// 过滤条件参照下一行注释
		return jQuery.grep( elements, function( elem ) {
			// 返回 这个元素 与 qualifier 是否相等，并且与 not 进行比较
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	// 只要 qualifier 不是 string 类型
	if ( typeof qualifier !== "string" ) {
		// 返回 使用 jQuery.grep 方法对 元素集 进行条件过滤
		// 过滤条件参照下一行注释
		return jQuery.grep( elements, function( elem ) {
			// 返回 qualifier.indexOf(elem) > -1，并且与 not 进行比较
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	// 直接筛选简单和复杂的选择器
	return jQuery.filter( qualifier, elements, not );
}

// jQuery.filter 方法 一个过滤方法
// expr 为选择器名字，看起来应该是 String 类型
// 这是一个过滤方法，接受参数 expr 匹配字符串
// elems 元素集
// not 是否匹配 not 选择器
// 返回 Array 类型
jQuery.filter = function( expr, elems, not ) {
	// 声明 elem 赋值 元素集第一个元素
	var elem = elems[ 0 ];

	// 若 not 为真
	if ( not ) {
		// 重新赋值 expr
		expr = ":not(" + expr + ")";
	}

	// 若 元素集长度为 1 并且 nodeType 属性等于 1 
	// 说明传入元素集内仅含有 1 个元素
	if ( elems.length === 1 && elem.nodeType === 1 ) {
		// Sizzle.matchesSelector Sizzle下的方法，参见 selector-sizzle.js
		// 返回布尔值
		// 看起来是匹配 expr 和 elem，若返回 真 则返回当前元素数组，若 假 则返回 空 数组
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	// Sizzle.matches Sizzle下的方法，参见 selector-sizzle.js
	// 使用 jQuery.grep 过滤 nodeType 为 1 的元素，返回新的元素集
	// 再与 expr 进行匹配
	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

// 在此执行 extend 方法，为 jQuery 添加属性
// 暂时读到这里
jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );

} );
