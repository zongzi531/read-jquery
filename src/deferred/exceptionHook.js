define( [
	"../core",
	"../deferred"
], function( jQuery ) {

"use strict";

  // require core.js 获得 jQuery
  // require deferred.js

// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
// 这些通常指示程序员在开发过程中的错误，尽快警告他们而不是吞咽他们。
// 声明 rerrorNames 赋值 正则表达式
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// jQuery.Deferred.exceptionHook 赋值 匿名函数
jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
  // 当 dev 工具打开时控制台存在，随时可能发生。
  // 判断 window.console 并且 window.console.warn 并且 error 并且 rerrorNames.test( error.name )
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {

    // 执行 window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack )
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};

} );
