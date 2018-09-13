define( [
	"../core",
	"../var/document",
	"../core/readyException",
	"../deferred"
], function( jQuery, document ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require core/readyException.js
	// require deferred.js
// The deferred used on DOM ready
// DOM准备使用的延迟
// 直接调用 jQuery.Deferred()
// 声明 readyList 并将调用结果赋值
var readyList = jQuery.Deferred();

// 设置 jQuery.fn.ready 插入 callback 函数
jQuery.fn.ready = function( fn ) {

  // 调用 readyList 方法 传入 fn 参数
	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		// 在函数中包装 jQuery.readyException ，以便在错误处理时发生查找，而不是回调注册。
		.catch( function( error ) {

			// 捕获报错
			// 调用 jQuery.readyException 方法
			jQuery.readyException( error );
		} );

	// 返回 this
	return this;
};

// 调用 jQuery.extend 方法
jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	// DOM准备好了吗？一旦发生，就设置为真。
	// 设置 isReady 属性 为 false
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	// 一个计数器，用于跟踪准备好的事件发生之前等待多少项目。
	// 设置 readyWait 属性 为 1
	readyWait: 1,

	// Handle when the DOM is ready
	// 当DOM准备好时处理
	// 设置 ready 方法
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		// 如果有挂起的暂停，或者我们已经准备好了
		// 若 wait === true 为真
		// 直接 判断 --jQuery.readyWait
		// 否则判断 jQuery.isReady
		// 若返回 为 真 则直接 return
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		// 记住DOM已经准备就绪
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		// 如果正常DOM准备事件被触发、减量和等待，如果需要的话
		// 同样 若 wait !== true 并且 --jQuery.readyWait > 0 满足条件 则直接 return
		// 这里的 --jQuery.readyWait 与上面的 --jQuery.readyWait 只会执行其中之一
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		// 如果函数已绑定，则执行
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

// 设置 jQuery.ready.then 为 readyList.then
jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
// 准备好的事件处理程序和自清理方法
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// 一下内容同 core/ready-no-deferred.js
// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}

} );
