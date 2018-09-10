define( [
	"../../core",
	"../../selector"

	// css is assumed
	// 假设 css
], function( jQuery ) {
	"use strict";
		// require core.js 获得 jQuery
		// require selector.js

	// isHiddenWithinTree reports if an element has a non-"none" display style (inline and/or
	// through the CSS cascade), which is useful in deciding whether or not to make it visible.
	// isHiddenWithinTree 报告元素是否具有非“none”显示样式（内联和/或通过CSS级联），这对于决定是否使其可见非常有用。
	// It differs from the :hidden selector (jQuery.expr.pseudos.hidden) in two important ways:
	// 它与隐藏选择器 (jQuery.expr.pseudos.hidden) 不同，有两种重要的方式：
	// * A hidden ancestor does not force an element to be classified as hidden.
	// * 隐藏的祖先不会强迫元素被分类为隐藏的。
	// * Being disconnected from the document does not force an element to be classified as hidden.
	// * 与文档断开连接不会强制将元素分类为隐藏的。
	// These differences improve the behavior of .toggle() et al. when applied to elements that are
	// detached or contained within hidden ancestors (gh-2404, gh-2863).
	// 这些差异改善了 .toggle() et al 的行为。当应用于隐藏或包含在隐藏祖先中的元素时
	// 返回 匿名函数
	return function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// isHiddenWithinTree 可以从 jQuery#filter 函数调用；
		// in that case, element will be second argument
		// 在这种情况下，元素将是第二个参数。
		// elem 赋值 el 或者 elem
		elem = el || elem;

		// Inline style trumps all
		// 内联样式胜过所有
		// 返回 elem.style.display === "none" 或者 elem.style.display === "" 并且 jQuery.contains( elem.ownerDocument, elem ) 并且 jQuery.css( elem, "display" ) === "none"
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// 否则，检查计算风格
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			// 断开的元素可以计算显示：没有，所以首先确认 elem 在文档中。
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};
} );
