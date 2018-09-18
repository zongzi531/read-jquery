define( [
	"./core",
	"./var/document",
	"./var/documentElement",
	"./var/hasOwn",
	"./var/indexOf"
], function( jQuery, document, documentElement, hasOwn, indexOf ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require var/documentElement.js 获得 window.document.documentElement
	// require var/hasOwn.js 获得 Object.prototype.hasOwnProperty 方法
	// require var/indexOf.js 获得 Array.prototype.indexOf 方法

/*
 * Optional (non-Sizzle) selector module for custom builds.
 *
 * Note that this DOES NOT SUPPORT many documented jQuery
 * features in exchange for its smaller size:
 *
 * Attribute not equal selector
 * Positional selectors (:first; :eq(n); :odd; etc.)
 * Type selectors (:input; :checkbox; :button; etc.)
 * State-based selectors (:animated; :visible; :hidden; etc.)
 * :has(selector)
 * :not(complex selector)
 * custom selectors via Sizzle extensions
 * Leading combinators (e.g., $collection.find("> *"))
 * Reliable functionality on XML fragments
 * Requiring all parts of a selector to match elements under context
 *   (e.g., $div.find("div > *") now matches children of $div)
 * Matching against non-elements
 * Reliable sorting of disconnected nodes
 * querySelectorAll bug fixes (e.g., unreliable :focus on WebKit)
 *
 * If any of these are unacceptable tradeoffs, either use Sizzle or
 * customize this stub for the project's specific needs.
 */

// 初始化 hasDuplicate, sortInput
var hasDuplicate, sortInput,

	// 声明 sortStable 赋值 jQuery.expando.split( "" ).sort( sortOrder ).join( "" ) === jQuery.expando
	sortStable = jQuery.expando.split( "" ).sort( sortOrder ).join( "" ) === jQuery.expando,

	// 声明 matches 赋值 documentElement.matches 或者 ...
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.mozMatchesSelector ||
		documentElement.oMatchesSelector ||
		documentElement.msMatchesSelector,

	// CSS string/identifier serialization
	// CSS 字符/序列化标识符
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	// 声明 rcssescape 赋值 /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,

	// 声明 fcssescape 赋值 匿名函数
	fcssescape = function( ch, asCodePoint ) {

		// 判断 asCodePoint
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			// U+0000 NULL 变为 U+FFFD 替换字符
			// 判断 ch === "\0"
			if ( ch === "\0" ) {

				// 返回 "\uFFFD"
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			// 控制字符和（取决于位置）数字作为代码点逃脱。
			// 返回 ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " "
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		// 其他特殊的ASCII字符得到反斜杠逃逸
		// 返回 "\\" + ch
		return "\\" + ch;
	};

// 声明 sortOrder 函数
function sortOrder( a, b ) {

	// Flag for duplicate removal
	// 重复删除标志
	// 判断 a === b
	if ( a === b ) {

		// hasDuplicate 赋值 true
		hasDuplicate = true;

		// 返回 0
		return 0;
	}

	// Sort on method existence if only one input has compareDocumentPosition
	// 如果只有一个输入具有相同的文档位置，则排序方法存在性
	// 声明 compare 赋值 !a.compareDocumentPosition - !b.compareDocumentPosition
	var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;

	// 判断 compare
	if ( compare ) {

		// 返回 compare
		return compare;
	}

	// Calculate position if both inputs belong to the same document
	// 如果两个输入属于同一个文档，则计算位置
	// compare 赋值 ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ? a.compareDocumentPosition( b ) : 1
	compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
		a.compareDocumentPosition( b ) :

		// Otherwise we know they are disconnected
		// 否则我们知道它们断开了。
		1;

	// Disconnected nodes
	// 断开节点
	// 判断 compare & 1
	if ( compare & 1 ) {

		// Choose the first element that is related to our preferred document
		// 选择与我们首选文档相关的第一个元素
		// 判断 a === document 或者 a.ownerDocument === document 并且 jQuery.contains(document, a)
		if ( a === document || a.ownerDocument === document &&
			jQuery.contains( document, a ) ) {

			// 返回 -1
			return -1;
		}

		// 判断 b === document 或者 b.ownerDocument === document 并且 jQuery.contains( document, b )
		if ( b === document || b.ownerDocument === document &&
			jQuery.contains( document, b ) ) {

			// 返回 1
			return 1;
		}

		// Maintain original order
		// 维持原始秩序
		// 返回 sortInput ? ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) : 0
		return sortInput ?
			( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
			0;
	}

	// 返回 compare & 4 ? -1 : 1
	return compare & 4 ? -1 : 1;
}

// 声明 uniqueSort 函数
function uniqueSort( results ) {

	// 初始化 elem
	var elem,

		// 声明 duplicates 赋值 []
		duplicates = [],

		// 声明 j 赋值 0
		j = 0,

		// 声明 i 赋值 0
		i = 0;

	// hasDuplicate 赋值 false
	hasDuplicate = false;

	// sortInput 赋值 !sortStable && results.slice( 0 )
	sortInput = !sortStable && results.slice( 0 );

	// 执行 results.sort( sortOrder )
	results.sort( sortOrder );

	// 判断 hasDuplicate
	if ( hasDuplicate ) {

		// 遍历 ( elem 赋值 results[ i++ ] )
		while ( ( elem = results[ i++ ] ) ) {

			// 判断 elem === results[i]
			if ( elem === results[ i ] ) {

				// j 赋值 duplicates.push( i )
				j = duplicates.push( i );
			}
		}

		// 遍历 j
		while ( j-- ) {

			// 执行 results.splice( duplicates[ j ], 1 )
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// 排序后清除输入以释放对象
	// See https://github.com/jquery/sizzle/pull/225
	// sortInput 赋值 null
	sortInput = null;

	// 返回 results
	return results;
}

// 声明 escape 函数
function escape( sel ) {

	// 返回 ( sel + "" ).replace( rcssescape, fcssescape )
	return ( sel + "" ).replace( rcssescape, fcssescape );
}

// 使用 jQuery.extend 方法
jQuery.extend( {
	uniqueSort: uniqueSort,
	unique: uniqueSort,
	escapeSelector: escape,

	// find 方法
	find: function( selector, context, results, seed ) {

		// 初始化 elem, nodeType
		var elem, nodeType,

			// 声明 i 赋值 0
			i = 0;

		// results 赋值 results 或者 []
		results = results || [];

		// context 赋值 context 或者 document
		context = context || document;

		// Same basic safeguard as Sizzle
		// 同样的基本保障
		// 判断 !selector 或者 typeof selector !== "string"
		if ( !selector || typeof selector !== "string" ) {

			// 返回 results
			return results;
		}

		// Early return if context is not an element or document
		// 如果上下文不是元素或文档，则提前返回
		// 判断 ( nodeType = context.nodeType ) !== 1 并且 nodeType !== 9
		if ( ( nodeType = context.nodeType ) !== 1 && nodeType !== 9 ) {

			// 返回 []
			return [];
		}

		// 判断 seed
		if ( seed ) {

			// 遍历 ( elem 赋值 seed[ i++ ] )
			while ( ( elem = seed[ i++ ] ) ) {

				// 判断 jQuery.find.matchesSelector( elem, selector )
				if ( jQuery.find.matchesSelector( elem, selector ) ) {

					// 执行 results.push( elem )
					results.push( elem );
				}
			}
		} else {

			// 执行 jQuery.merge( results, context.querySelectorAll( selector ) )
			jQuery.merge( results, context.querySelectorAll( selector ) );
		}

		// 返回 results
		return results;
	},

	// text 方法
	text: function( elem ) {

		// 初始化 node
		var node,

			// 声明 ret 赋值 ""
			ret = "",

			// 声明 i 赋值 0
			i = 0,

			// 声明 nodeType 赋值 elem.nodeType
			nodeType = elem.nodeType;

		// 判断 !nodeType
		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			// 如果没有 nodeType，这将是一个数组。
			// 遍历 ( node 赋值 elem[ i++ ] )
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				// 不要遍历注释节点
				// ret 赋值 ret + jQuery.text( node )
				ret += jQuery.text( node );
			}

			// 判断 nodeType === 1 或者 nodeType === 9 或者 nodeType === 11
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

			// Use textContent for elements
			// 元素使用 textContent
			// 返回 elem.textContent
			return elem.textContent;

			// 判断 nodeType === 3 或者 nodeType === 4
		} else if ( nodeType === 3 || nodeType === 4 ) {

			// 返回 elem.nodeValue
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes
		// 不包括注释或处理指令节点

		// 返回 ret
		return ret;
	},

	// contains 方法
	contains: function( a, b ) {

		// 声明 adown 赋值 a.nodeType === 9 ? a.documentElement : a
		var adown = a.nodeType === 9 ? a.documentElement : a,

			// 声明 bup 赋值 b 并且 b.parentNode
			bup = b && b.parentNode;

		// 返回 a === bup 或者 !!( bup && bup.nodeType === 1 并且 adown.contains( bup ) )
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains( bup ) );
	},

	// isXMLDoc 方法
	isXMLDoc: function( elem ) {

		// documentElement is verified for cases where it doesn't yet exist
		// 在不存在文档的情况下验证文档元素。
		// (such as loading iframes in IE - #4833)
		// 声明 documentElement 赋值 elem 并且 ( elem.ownerDocument 或者 elem ).documentElement
		var documentElement = elem && ( elem.ownerDocument || elem ).documentElement;

		// 返回 documentElement ? documentElement.nodeName !== "HTML" : false
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	},

	// expr 对象
	expr: {
		attrHandle: {},
		match: {
			bool: new RegExp( "^(?:checked|selected|async|autofocus|autoplay|controls|defer" +
				"|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i" ),
			needsContext: /^[\x20\t\r\n\f]*[>+~]/
		}
	}
} );

// 使用 jQuery.extend 方法 对 jQuery.find
jQuery.extend( jQuery.find, {

	// matches 方法
	matches: function( expr, elements ) {

		// 返回 jQuery.find( expr, null, null, elements )
		return jQuery.find( expr, null, null, elements );
	},

	// matchesSelector 方法
	matchesSelector: function( elem, expr ) {

		// 返回 matches.call( elem, expr )
		return matches.call( elem, expr );
	},

	// attr 方法
	attr: function( elem, name ) {

		// 声明 fn 赋值 jQuery.expr.attrHandle[ name.toLowerCase() ]
		var fn = jQuery.expr.attrHandle[ name.toLowerCase() ],

			// Don't get fooled by Object.prototype properties (jQuery #13807)
			// 不要被对象愚弄。原型属性
			// 声明 value 赋值 fn 并且 hasOwn.call( jQuery.expr.attrHandle, name.toLowerCase() ) ? fn( elem, name, jQuery.isXMLDoc( elem ) ) : undefined
			value = fn && hasOwn.call( jQuery.expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, jQuery.isXMLDoc( elem ) ) :
				undefined;

		// 返回 value !== undefined ? value : elem.getAttribute( name )
		return value !== undefined ? value : elem.getAttribute( name );
	}
} );

} );
