define( [
	"../var/class2type",
	"../var/toString"
], function( class2type, toString ) {

"use strict";

  // require var/class2type.js 获得 空 Object 类型
  // require var/toString.js 获得 Object.prototype.toString 方法
function toType( obj ) {

  // 若 obj == null 则将obj转换为 String 类型返回
  // ==: Abstract Equality 抽象平等
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
  // 返回 typeof obj === "object" 或
  //     当 typeof obj === "function" 为 真时，去 class2type 内查找 Object.prototype.toString.call(obj) 为键 是否有值
  //     若有则返回，若无则返回 "object"
  //     当 typeof obj === "function" 为 假时，返回 typeof obj
  // 这个方法在做什么，我也暂时没明白……
  // 但是能确定的是，不会返回 "function" ，除非 class2type 返回的值是 "function"
  // 现在看用途大概能知道 class2type 是用来存放一些类型数据的，我相信后面会读到
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}

  // 返回 toType 方法
return toType;
} );
