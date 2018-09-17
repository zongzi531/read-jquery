define( [
	"../core"
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery

// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
// 注册为命名的AMD模块，因为jQuery可以与可以使用define的其他文件连接，但不能通过理解匿名AMD模块的正确连接脚本连接。命名AMD是最安全和最稳健的注册方式。之所以使用小写jquery，是因为AMD模块名称来源于文件名，而jQuery通常以小写文件名传递。在创建全局后这样做，这样如果AMD模块想调用NoRebug来隐藏这个jQuery版本，它会起作用。

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
// 注意，为了实现最大的可移植性，不是jQuery的库应该声明自己为匿名模块，并且如果存在AMD加载器，则避免设置全局模块。jQuery是一个特例。

// 判断 typeof define === "function" && define.amd
if ( typeof define === "function" && define.amd ) {

	// 执行 define 方法
	define( "jquery", [], function() {

		// 返回 jQuery
		return jQuery;
	} );
}

} );
