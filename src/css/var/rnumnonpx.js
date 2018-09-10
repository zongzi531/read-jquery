define( [
	"../../var/pnum"
], function( pnum ) {
	"use strict";
    // require var/pnum.js 获得 ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source

  // 返回 正则表达式
  // 在 pnum 的基础上增加额外的正则条件匹配
	return new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
} );
