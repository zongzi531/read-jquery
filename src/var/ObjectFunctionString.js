define( [
	"./fnToString"
], function( fnToString ) {
	"use strict";

  // require fnToString.js 获得 Object.prototype.hasOwnProperty.toString 方法
  // 返回 Object.prototype.hasOwnProperty.toString.call(Object)
  // 看了一些相关的文章，其实这个方法等价于 Function.prototype.toString.call(Object)
  // 但是为什么要这么做，我暂时还没有想到…… :(
	return fnToString.call( Object );
} );
