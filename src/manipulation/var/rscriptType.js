define( function() {
	"use strict";

  // 返回正则表达式
  // 看起来是会用来检查模块化 script 标签的
	return ( /^$|^module$|\/(?:java|ecma)script/i );
} );
