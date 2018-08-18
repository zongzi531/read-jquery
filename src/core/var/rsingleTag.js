define( function() {
	"use strict";

	// Match a standalone tag
  // 匹配的独立的标签
  // 返回 正则表达式
	return ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
} );
