define( function() {
	"use strict";

	// 返回 匿名函数
	return function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// IE 抛出弹出窗口中创建的元素
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		// FF 同时通过 "defaultView.getComputedStyle" 抛出框架元素
		// 声明 view 赋值 elem.ownerDocument.defaultView
		var view = elem.ownerDocument.defaultView;

		// 判断 !view 或者 !view.opener
		if ( !view || !view.opener ) {
			// view 赋值 window
			view = window;
		}

		// 返回 view.getComputedStyle( elem )
		return view.getComputedStyle( elem );
	};
} );
