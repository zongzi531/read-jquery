define( [
	"./cssExpand"
], function( cssExpand ) {
	"use strict";
    // require ./cssExpand.js 获得 [ "Top", "Right", "Bottom", "Left" ] 数组

  // 返回 正则表达式
  // 'Top|Right|Bottom|Left'
	return new RegExp( cssExpand.join( "|" ), "i" );
} );
