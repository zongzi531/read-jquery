// Initialize a jQuery object
// 初始化一个 jQuery 对象
define( [
	"../core",
	"../var/document",
	"../var/isFunction",
	"./var/rsingleTag",

	"../traversing/findFilter"
], function( jQuery, document, isFunction, rsingleTag ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require var/isFunction.js 获得 isFunction 方法
	// require ./var/rsingleTag.js 获得 正则表达式
	// require traversing/findFilter.js

// A central reference to the root jQuery(document)
// 对根 jQuery(document) 的中心引用
// 初始化 rootjQuery
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	// 一个简单的检查HTML字符串的方式
	// 声明 rquickExpr
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	// 声明 init 方法 同时赋值至 jQuery.fn.init
	init = jQuery.fn.init = function( selector, context, root ) {

		// 初始化 match, elem
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		// 若 $(""), $(null), $(undefined), $(false) 则直接返回 当前 this
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		// 方法 init() 接受一个替代的 rootjQuery
		// 因此迁移可以支持 jQuery.sub
		root = root || rootjQuery;

		// Handle HTML strings
		// 操作 HTML 选择器
		if ( typeof selector === "string" ) {

			// 若 selector 为 <?+> 进入判断
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				// 假设用 <> 开始和结束的字符串是HTML，跳过正则表达式检查。
				match = [ null, selector, null ];

			} else {

				// 否则进入正则表达式检查
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			// 匹配HTML或确保没有为 #id 指定上下文
			// match 为真 并且 match[ 1 ] 存在 或者 上下文取反?
			// 上下文为什么要取反?
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				// match[ 1 ] 存在
				if ( match[ 1 ] ) {

					// 对 上下文进行检查，使用 instanceof 运算符检查 上下文 context 是否为 jQuery 的实例
					// 若 为真 则取 上下文 [0] 否则返回 上下文 则为不进行操作
					// 为什么要这么做呢？ 暂时对上下文还是没有很好的理解
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					// 运行脚本的选项对于后台编译器是正确的
					// 如果不存在parseHTML，则有意抛出错误
					// 使用 jQuery.merge 进行合并操作
					// jQuery.parseHTML 暂时还没读到 返回肯定是个数组或者元素集吧
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					// OK 没看懂这里是要做什么
					// 使用 rsingleTag 校验 match[ 1 ] 并且 上下文 需要是纯粹的对象
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {

						// 使用 in 操作符 遍历上下文
						for ( match in context ) {

							// Properties of context are called as methods if possible
							// 如果可能的话，上下文的属性被称为方法。
							// 检测当前 match 在 this 上是否为 function
							if ( isFunction( this[ match ] ) ) {

								// 执行 this[ match ] 传入参数 context[ match ] 值
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							// 否则设置属性
							} else {

								// 执行 attr 方法，传入 对应的 match 键值
								// attr 方法 我暂时还没读到
								this.attr( match, context[ match ] );
							}
						}
					}

					// 返回 this
					return this;

				// HANDLE: $(#id)
				// 操作 #id 选择器
				} else {

					// 这里取的是 2 号位置
					// 那么 match 是 rquickExpr 返回的结果
					// 使用原生方法获取当前元素
					elem = document.getElementById( match[ 2 ] );

					// 若当前元素存在
					// 当前元素集 0 号位置为当前元素
					// 并且元素集 长度为 1
					if ( elem ) {

						// Inject the element directly into the jQuery object
						// 将元素直接注入jQuery对象
						this[ 0 ] = elem;
						this.length = 1;
					}

					// 返回 this
					return this;
				}

			// HANDLE: $(expr, $(...))
			// 操作 正则? 没看懂
			// 若 上下文不存在 或者 context 有 jquery 属性
			} else if ( !context || context.jquery ) {

				// 返回 上下文 或者 根 jQuery 去执行 find 查找 选择器
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			// 这相当于 $(context).find(expr)
			} else {

				// this.constructor 就是 jQuery 也就是 $
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		// 操作 DOMElement
		} else if ( selector.nodeType ) {

			// 直接将元素直接注入jQuery对象
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		// 操作 function
		// document准备好的快捷方式
		} else if ( isFunction( selector ) ) {

			// 返回 若 root.ready 存在，则 root.ready( selector )
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				// 如果准备不存在，立即执行
				selector( jQuery );
		}

		// 返回 将 selector 转换为 JavaScript 数组（包含 this）
		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
// 赋予init函数jQuery原型，用于以后的实例化
init.prototype = jQuery.fn;

// Initialize central reference
// 初始化中心参考值
rootjQuery = jQuery( document );

// 返回 init
return init;

} );
