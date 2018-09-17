define( [
	"./core",
	"./core/access",
	"./var/document",
	"./var/documentElement",
	"./var/isFunction",
	"./css/var/rnumnonpx",
	"./css/curCSS",
	"./css/addGetHookIf",
	"./css/support",
	"./var/isWindow",
	"./core/init",
	"./css",
	"./selector" // contains
], function( jQuery, access, document, documentElement, isFunction, rnumnonpx,
             curCSS, addGetHookIf, support, isWindow ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/access.js 获得 access 方法
	// require var/document.js 获得 window.document
	// require var/documentElement.js 获得 window.document.documentElement
	// require var/isFunction.js 获得 isFunction 方法
	// require css/var/rnumnonpx.js 获得 正则表达式
	// require css/curCSS.js 获得 curCSS 函数
	// require css/addGetHookIf.js 获得 addGetHookIf 函数
	// require css/support.js 获得 support 对象
	// require var/isWindow.js 获得 isWindow 方法
	// require core/init.js
	// require css.js
	// require selector.js

// jQuery.offset 赋值 对象
jQuery.offset = {

	// setOffset 方法
	setOffset: function( elem, options, i ) {

		// 初始化 curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,

			// 声明 position 赋值 jQuery.css( elem, "position" )
			position = jQuery.css( elem, "position" ),

			// 声明 curElem 赋值 jQuery( elem )
			curElem = jQuery( elem ),

			// 声明 props 赋值 {}
			props = {};

		// Set position first, in-case top/left are set even on static elem
		// 首先设置位置，以使顶部/左侧设置在静态 elem 上
		// 判断 position === "static"
		if ( position === "static" ) {

			// elem.style.position 赋值 "relative"
			elem.style.position = "relative";
		}

		// curOffset 赋值 curElem.offset()
		curOffset = curElem.offset();

		// curCSSTop 赋值 jQuery.css( elem, "top" )
		curCSSTop = jQuery.css( elem, "top" );

		// curCSSLeft 赋值 jQuery.css( elem, "left" )
		curCSSLeft = jQuery.css( elem, "left" );

		// calculatePosition 赋值 ( position === "absolute" 或者 position === "fixed" ) 并且 ( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		// 如果顶部或左边是自动的，位置是绝对的或固定的，则需要能够计算位置。
		// 判断 calculatePosition
		if ( calculatePosition ) {

			// curPosition 赋值 curElem.position()
			curPosition = curElem.position();

			// curTop 赋值 curPosition.top
			curTop = curPosition.top;

			// curLeft 赋值 curPosition.left
			curLeft = curPosition.left;

		} else {

			// curTop 赋值 parseFloat( curCSSTop ) 或者 0
			curTop = parseFloat( curCSSTop ) || 0;

			// curLeft 赋值 parseFloat( curCSSLeft ) 或者 0
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		// 判断 isFunction( options )
		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			// 使用 jQuery.extend 扩展到这里允许坐标参数的修改（GH-1848）。
			// options 赋值 options.call( elem, i, jQuery.extend( {}, curOffset ) )
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		// 判断 options.top != null
		if ( options.top != null ) {

			// props.top 赋值 ( options.top - curOffset.top ) + curTop
			props.top = ( options.top - curOffset.top ) + curTop;
		}

		// 判断 options.left != null
		if ( options.left != null ) {

			// props.left 赋值 ( options.left - curOffset.left ) + curLeft
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		// 判断 "using" in options
		if ( "using" in options ) {

			// 执行 options.using.call( elem, props )
			options.using.call( elem, props );

		} else {

			// 执行 curElem.css( props )
			curElem.css( props );
		}
	}
};

// 使用 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	// offset() 将元素的边框与文档原点联系起来。
	// offset 方法
	offset: function( options ) {

		// Preserve chaining for setter
		// 为设置器保存链接
		// 判断 arguments.length
		if ( arguments.length ) {

			// 返回 options === undefined ? this : this.each( fn )
			return options === undefined ?
				this :
				this.each( function( i ) {

					// jQuery.offset.setOffset( this, options, i )
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		// 初始化 rect, win
		var rect, win,

			// 声明 elem 赋值 this[ 0 ]
			elem = this[ 0 ];

		// 判断 !elem
		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		// 在IE中的断开节点上运行 getBoundingClientRect 引发错误
		// 判断 !elem.getClientRects().length
		if ( !elem.getClientRects().length ) {

			// 返回 { top: 0, left: 0 }
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		// 通过将视口滚动到相对的 gBCR 获取文件相对位置
		// rect 赋值 elem.getBoundingClientRect()
		rect = elem.getBoundingClientRect();

		// win 赋值 elem.ownerDocument.defaultView
		win = elem.ownerDocument.defaultView;

		// 返回 对象
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	// position() 将元素的边距框与其偏移的父填充框关联起来。
	// 这相当于CSS绝对定位的行为。
	// position 方法
	position: function() {

		// 判断 !this[ 0 ]
		if ( !this[ 0 ] ) {
			return;
		}

		// 初始化 offsetParent, offset, doc
		var offsetParent, offset, doc,

			// 声明 elem 赋值 this[ 0 ]
			elem = this[ 0 ],

			// 声明 parentOffset 赋值 { top: 0, left: 0 }
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		// 位置：固定元素从视口偏移，其本身总是具有零偏移量。
		// 判断 jQuery.css( elem, "position" ) === "fixed"
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			// 假定位置：固定意味着 getBoundingClientRect 的可用性
			// offset 赋值 elem.getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {

			// offset 赋值 this.offset()
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			// 说明 *real* offset 父元素，当标识静态定位的元素时，它可以是文档或其根元素
			// doc 赋值 elem.ownerDocument
			doc = elem.ownerDocument;

			// offsetParent 赋值 elem.offsetParent 或者 doc.documentElement
			offsetParent = elem.offsetParent || doc.documentElement;

			// 遍历 offsetParent 并且 ( offsetParent === doc.body 或者 offsetParent === doc.documentElement ) 并且 jQuery.css( offsetParent, "position" ) === "static"
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				// offsetParent 赋值 offsetParent.parentNode
				offsetParent = offsetParent.parentNode;
			}

			// 判断 offsetParent 并且 offsetParent !== elem 并且 offsetParent.nodeType === 1
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				// 将边界合并到其偏移中，因为它们超出其内容来源
				// parentOffset 赋值 jQuery( offsetParent ).offset()
				parentOffset = jQuery( offsetParent ).offset();

				// parentOffset.top 赋值 parentOffset.top + jQuery.css( offsetParent, "borderTopWidth", true )
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );

				// parentOffset.left 赋值 parentOffset.left + jQuery.css( offsetParent, "borderLeftWidth", true )
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		// 减去父偏移和元素余量
		// 返回 对象
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	// 此方法将在以下情况下返回文档元素：
	// 1）对于没有RoFSET父级的IFRAME中的元素，此方法将返回父窗口的文档元素
	// 2）用于隐藏或分离元件
	// 3）用于体或HTML元素，即在HTML节点的情况下，它将返回自身。
	// 但是，这些例外从未被作为现实生活使用案例和可以被认为是更优选的结果。
	// 然而，这种逻辑是不能保证的，并且可以在将来的任何一点改变。
	// offsetParent 方法
	offsetParent: function() {

		// 返回 this.map 方法结果
		return this.map( function() {

			// 声明 offsetParent 赋值 this.offsetParent
			var offsetParent = this.offsetParent;

			// 遍历 offsetParent 并且 jQuery.css( offsetParent, "position" ) === "static"
			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {

				// offsetParent 赋值 offsetParent.offsetParent
				offsetParent = offsetParent.offsetParent;
			}

			// 返回 offsetParent 或者 documentElement
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
// 创建 scrollLeft 和 scrollTop 方法
// 使用 jQuery.each 方法 遍历第一参数 对象
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {

	// 声明 top 赋值 "pageYOffset" === prop
	var top = "pageYOffset" === prop;

	// jQuery.fn[ method ] 赋值 匿名函数
	jQuery.fn[ method ] = function( val ) {

		// 返回 access( this, fn, method, val, arguments.length )
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			// 初始化 win
			var win;

			// 判断 isWindow( elem )
			if ( isWindow( elem ) ) {

				// win 赋值 elem
				win = elem;

				// 判断 elem.nodeType === 9
			} else if ( elem.nodeType === 9 ) {

				// win 赋值 elem.defaultView
				win = elem.defaultView;
			}

			// 判断 val === undefined
			if ( val === undefined ) {

				// 返回 win ? win[ prop ] : elem[ method ]
				return win ? win[ prop ] : elem[ method ];
			}

			// 判断 win
			if ( win ) {

				// 执行 win.scrollTo( !top ? val : win.pageXOffset, top ? val : win.pageYOffset )
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {

				// elem[ method ] 赋值 val
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// 使用 jQuery.fn.position 添加 top/left cssHooks
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
// 当为 top/left/bottom/right 指定 getComputedStyle 时，返回%值；而不是使css模块依赖于偏移模块，只需要在这里检查它
// 使用 jQuery.each 方法遍历 第一参数 数组
jQuery.each( [ "top", "left" ], function( i, prop ) {

	// jQuery.cssHooks[ prop ] 赋值 addGetHookIf( support.pixelPosition, fn )
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {

			// 判断 computed
			if ( computed ) {

				// computed 赋值 curCSS( elem, prop )
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				// 如果 curCSS 返回百分比，则回落到偏移量。
				// 返回 rnumnonpx.test( computed ) ? jQuery( elem ).position()[ prop ] + "px" : computed
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );

// 返回 jQuery
return jQuery;
} );
