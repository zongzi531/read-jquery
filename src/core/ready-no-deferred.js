define( [
	"../core",
	"../var/document",
	"../var/isFunction"
], function( jQuery, document, isFunction ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require var/isFunction.js 获得 isFunction 方法
	// 声明 readyCallbacks 为空数组
var readyCallbacks = [],
	// 声明 whenReady 为向 readyCallbacks 添加 callback 函数
	whenReady = function( fn ) {
		readyCallbacks.push( fn );
	},
	// 声明 executeReady 执行 callback 函数
	executeReady = function( fn ) {

		// Prevent errors from freezing future callback execution (gh-1823)
		// 防止错误冻结未来回调执行
		// Not backwards-compatible as this does not execute sync
		// 不向后兼容，因为这不执行同步。
		window.setTimeout( function() {
			// 为 fn 绑定 this 指向至 document
			// 传入 jQuery 对象
			fn.call( document, jQuery );
		} );
	};

// 设置 jQuery.fn.ready 插入 callback 函数
jQuery.fn.ready = function( fn ) {
	whenReady( fn );
	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	// DOM准备好了吗？一旦发生，就设置为真。
	// 默认为 false
	isReady: false,

	// A counter to track how many items to wait for before
	// 一个计数器，用于跟踪之前要等待多少项目
	// the ready event fires. See #6781
	// 准备好的事件发生了。
	// 默认值为 1
	readyWait: 1,

	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		// 如果有挂起的暂停，或者我们已经准备好了
		// 判断 wait 的值
		// 若为 true 返回 --jQuery.readyWait，默认 1 的情况下 返回为 0 不会被 return
		// 若为 false 返回 jQuery.isReady
		// 就是说已准备的情况下 不会执行下面内容 而是直接 return
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		// 记住DOM已经准备就绪
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		// 如果正常DOM准备事件被触发、减量和等待，如果需要的话
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// 重新赋值 whenReady 方法
		whenReady = function( fn ) {
			// 向 readyCallbacks 添加 callback 函数
			readyCallbacks.push( fn );

			// 遍历 readyCallbacks
			while ( readyCallbacks.length ) {
				// 获取 readyCallbacks 第一个 fn
				fn = readyCallbacks.shift();
				// 若 fn 是 function
				if ( isFunction( fn ) ) {
					// 执行 executeReady
					executeReady( fn );
				}
			}
		};

		// 调用 whenReady 方法
		whenReady();
	}
} );

// Make jQuery.ready Promise consumable (gh-1778)
// 让 jQuery.ready Promise consumable
jQuery.ready.then = jQuery.fn.ready;

/**
 * The ready event handler and self cleanup method
 */
 // 准备好的事件处理程序和自清理方法
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// 获取 $(document).ready() 在哪儿被调用
// after the browser event has already occurred.
// 浏览器事件已经发生之后。
// Support: IE9-10 only
// Older IE sometimes signals "interactive" too soon
// 判断若  readyState === "complete" 或者 document.readyState !== "loading"  && !document.documentElement.doScroll
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	// 异步处理以允许脚本延迟准备就绪
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	// 使用简便的事件回调
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	// window.onload的回调，这将永远工作
	window.addEventListener( "load", completed );
}

} );
