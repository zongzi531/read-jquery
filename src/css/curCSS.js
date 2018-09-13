define( [
	"../core",
	"./var/rboxStyle",
	"./var/rnumnonpx",
	"./var/getStyles",
	"./support",
	"../selector" // Get jQuery.contains
], function( jQuery, rboxStyle, rnumnonpx, getStyles, support ) {

"use strict";

	// require core.js 获得 jQuery
	// require ./var/rboxStyle.js 获得 正则表达式
	// require ./var/rnumnonpx.js 获得 正则表达式
	// require ./var/getStyles.js 获得 getStyles 函数
	// require ./support.js 获得 support 对象
	// require selector.js

// 声明 curCSS 函数
function curCSS( elem, name, computed ) {

	// 初始化 width, minWidth, maxWidth, ret
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		// 在计算之前检索样式在某种程度上解决了在分离元素上获得错误值的问题。
		// style 赋值 elem.style
		style = elem.style;

	// computed 赋值 computed 或者 getStyles( elem )
	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	// 判断 computed
	if ( computed ) {

		// ret 赋值 computed.getPropertyValue( name ) 或者 computed[ name ]
		ret = computed.getPropertyValue( name ) || computed[ name ];

		// 判断 ret === "" 并且 !jQuery.contains( elem.ownerDocument, elem )
		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {

			// ret 赋值 jQuery.style( elem, name )
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// 对 Dean Edwards “令人敬畏的黑客”的致敬
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// Android 浏览器返回一些值的百分比，但宽度似乎是可靠的像素。
		// This is against the CSSOM draft spec:
		// 这是违反CSSOM草案规范的。
		// https://drafts.csswg.org/cssom/#resolved-values
		// 判断 !support.pixelBoxStyles() 并且 rnumnonpx.test( ret ) 并且 rboxStyle.test( name )
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			// 记住最初的值
			// width 赋值 style.width
			width = style.width;

			// minWidth 赋值 style.minWidth
			minWidth = style.minWidth;

			// maxWidth 赋值 style.maxWidth
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			// 放入新的值以获得计算值
			// style.minWidth 和 style.maxWidth 和 style.width 赋值 ret
			style.minWidth = style.maxWidth = style.width = ret;

			// ret 赋值 computed.width
			ret = computed.width;

			// Revert the changed values
			// 恢复已更改的值
			// style.width 赋值 width
			style.width = width;

			// style.minWidth 赋值 minWidth
			style.minWidth = minWidth;

			// style.maxWidth 赋值 maxWidth
			style.maxWidth = maxWidth;
		}
	}

	// 返回 ret !== undefined ? ret + "" : ret
	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		// IE 将 zIndex 值返回为整数。
		ret + "" :
		ret;
}

// 返回 curCSS 函数
return curCSS;
} );
