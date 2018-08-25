define( [
	"../var/rnothtmlwhite"
], function( rnothtmlwhite ) {
	"use strict";
  // require var/rnothtmlwhite.js 获得 新的正则表达式

	// Strip and collapse whitespace according to HTML spec
  // 根据HTML规范剥离和折叠空白
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
  // 声明 stripAndCollapse 方法
	function stripAndCollapse( value ) {
    // 声明 tokens 返回 value 匹配 正则表达式 rnothtmlwhite 的结果，若没有匹配成功则返回 []
		var tokens = value.match( rnothtmlwhite ) || [];
    // 返回 tokens.join( " " )
		return tokens.join( " " );
	}

  // 返回 stripAndCollapse
	return stripAndCollapse;
} );
