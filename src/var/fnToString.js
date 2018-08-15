define( [
	"./hasOwn"
], function( hasOwn ) {
	"use strict";

  // require hasOwn.js 获得 Object.prototype.hasOwnProperty 方法
  // 返回 Object.prototype.hasOwnProperty 的 toString 方法
	return hasOwn.toString;
} );
