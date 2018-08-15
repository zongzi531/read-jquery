define( function() {
	"use strict";

  // 返回 isWindow 方法
  // 判断是否为浏览器全局对象 window 对象
	return function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};

} );
