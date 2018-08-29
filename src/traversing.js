define( [
	"./core",
	"./var/indexOf",
	"./traversing/var/dir",
	"./traversing/var/siblings",
	"./traversing/var/rneedsContext",
	"./core/nodeName",

	"./core/init",
	"./traversing/findFilter",
	"./selector"
], function( jQuery, indexOf, dir, siblings, rneedsContext, nodeName ) {

"use strict";
	// require core.js 获得 jQuery
	// require var/indexOf.js 获得 Array.prototype.indexOf 方法
	// require traversing/var/dir.js 获得 dir 方法
	// require traversing/var/siblings.js 获得 siblings 方法
	// require traversing/var/rneedsContext.js 获得 Sizzle.selectors
	// require core/nodeName.js 获得 nodeName 方法
	// require core/init.js
	// require traversing/findFilter.js
	// require selector.js

// 声明 rparentsprev 为 正则表达式
var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	// 保证从唯一集合开始时生成唯一集合的方法
	// 声明 guaranteedUnique 对象
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {
	// has 方法
	has: function( target ) {
		// 声明 targets 为 jQuery( target, this )
		var targets = jQuery( target, this ),
			// 声明 l 为 targets 长度
			l = targets.length;

		// 描述: 筛选元素集合中匹配表达式 或 通过传递函数测试的 那些元素集合。
		// 一个函数用作测试集合中的每个元素。this 是当前DOM元素。
		// 遍历当前DOM元素，在每次遍历中继续进行遍历
		return this.filter( function() {
			// 声明 i = 0
			var i = 0;
			// 遍历 targets 长度
			for ( ; i < l; i++ ) {
				// 使用 jQuery.contains 方法进行检查
				// 若返回真 则返回真
				// filter function 参数的返回值
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	// closest 方法
	closest: function( selectors, context ) {
		// 初始化 cur
		var cur,
			// 声明 i = 0
			i = 0,
			// 声明 l = 当前元素集的长度
			l = this.length,
			// 声明 matched = []
			matched = [],
			// 声明 若 selectors 不为 String 类型 则返回 jQuery( selectors ) 否则返回 false
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		// 位置选择器永远不匹配，因为没有选择上下文。
		// 若 rneedsContext.test( selectors ) 返回 false 进入判断
		if ( !rneedsContext.test( selectors ) ) {
			// 遍历当前元素集的长度
			for ( ; i < l; i++ ) {
				// 继续遍历 一直往 parentNode 遍历
				// 将 当前遍历的元素 赋值给 cur
				// 判断条件为若 cur 存在 并且 cur !== context 满足遍历条件
				// 遍历完成后 cur = cur.parentNode
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					// 总是跳过文档片段
					// 若 cur.nodeType < 11 并且
					// 若 targets 存在 返回 targets.index( cur ) > -1 结果 必须 为 true
					// 若 targets 不存在 返回 cur.nodeType === 1 结果 必须 为 true
					// 若 targets 不存在 并且 jQuery.find.matchesSelector( cur, selectors ) 返回 为 true
					// 以上两个都得为 true 才能进入循环
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						// matched 加入 cur
						matched.push( cur );
						// 退出当前循环
						break;
					}
				}
			}
		}

		// Description: Sorts an array of DOM elements, in place, with the duplicates removed. Note that this only works on arrays of DOM elements, not strings or numbers.
		// 描述: 排序一个DOM元素的数组，恰当的除去重复项。 请注意，这仅适用于DOM元素数组，而不能处理字符串或者数字数组。
		// 返回 pushStack 方法
		// 若 matched 长度 大于 1
		// 返回 jQuery.uniqueSort( matched ) 否则 返回 matched
		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	// 确定元素在集合中的位置
	// index 方法
	index: function( elem ) {

		// No argument, return index in parent
		// 无参数，父级返回索引
		// 若 elem 不存在就是 无参
		if ( !elem ) {
			// 返回 若 当前元素集第一个元素 存在 并且 当前元素集第一个元素的父元素 存在
			// 调用 first 描述: 获取匹配元素集合中第一个元素。
			// 调用 prevAll 描述: 获得集合中每个匹配元素的所有前面的兄弟元素，选择性筛选的选择器。
			// 返回长度 否则 返回 -1
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		// 选择器中的索引
		// 若 elem 为 String 类型
		if ( typeof elem === "string" ) {
			// 返回 jQuery( elem ).indexOf(this[ 0 ])
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		// 定位所需元素的位置
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			// 如果接收到jQuery对象，则使用第一个元素
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	// add 方法
	add: function( selector, context ) {
		// 返回调用 pushStack 方法
		return this.pushStack(
			// 恰当的除去重复项。
			jQuery.uniqueSort(
				// 合并 当前元素集 和 新的元素集
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	// addBack 方法
	// 撤销 add
	addBack: function( selector ) {
		// 返回 add 方法 若 selector == null 则直接传入 this.prevObject
		// 反之 返回 this.prevObject 筛选 selector
		// 重新调用 add 方法
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

// sibling 方法
function sibling( cur, dir ) {
	// 遍历 cur [ dir ]
	// 一直往下获取
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	// 返回 cur
	return cur;
}

// 调用 jQuery.each 遍历下面对象
jQuery.each( {
	// parent 方法
	parent: function( elem ) {
		// 声明 parent 为 elem 的父节点
		var parent = elem.parentNode;
		// 返回 若 parent 存在并且 parent.nodeType !== 11 则返回 parent 否则返回 null
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	// parents 方法
	parents: function( elem ) {
		// 返回 调用 dir 方法
		return dir( elem, "parentNode" );
	},
	// parentsUntil 方法
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	// next 方法
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	// prev 方法
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	// nextAll 方法
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	// prevAll 方法
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	// nextUntil 方法
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	// prevUntil 方法
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	// siblings 方法
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	// children 方法
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	// contents 方法
	contents: function( elem ) {
				// 若 nodeName 是 iframe
        if ( nodeName( elem, "iframe" ) ) {
        		// 返回 elem.contentDocument
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        // 若 nodeName 是 template
        if ( nodeName( elem, "template" ) ) {
        		// 检查 elem 是否存在 content 属性 若存在赋值 elem.content
            elem = elem.content || elem;
        }

        // 返回 elem.childNodes
        return jQuery.merge( [], elem.childNodes );
	}
	// 回调函数
}, function( name, fn ) {
	// 为 jQuery.fn[ name ] 设置方法
	jQuery.fn[ name ] = function( until, selector ) {
		// 调用 jQuery.map fn 以回调形式传入
		// 声明 matched 赋值返回数组
		var matched = jQuery.map( this, fn, until );

		// 若 name 的后五位开始算 不是 Until 的话
		if ( name.slice( -5 ) !== "Until" ) {
			// selector = until
			selector = until;
		}

		// 若 selector 存在 并且 selector 为 String 类型
		if ( selector && typeof selector === "string" ) {
			// matched = 按照 selector 筛选 出来的 matched
			matched = jQuery.filter( selector, matched );
		}

		// 若当前元素集 > 1
		if ( this.length > 1 ) {

			// Remove duplicates
			// 删除重复
			// 若 guaranteedUnique[ name ] 返回 为 false
			if ( !guaranteedUnique[ name ] ) {
				// 执行 jQuery.uniqueSort( matched )
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			// parents* 和 prev-derivatives 的反序
			// 若 rparentsprev 正则表达式校验通过
			if ( rparentsprev.test( name ) ) {
				// 调用 Array.prototype.reverse()
				matched.reverse();
			}
		}

		// 返回 this.pushStack( matched )
		return this.pushStack( matched );
	};
} );

// 返回 jQuery
return jQuery;
} );
