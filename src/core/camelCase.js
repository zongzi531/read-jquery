define( [], function() {

"use strict";

// Matches dashed string for camelizing
// 匹配凸轮线的虚线串
// 声明 rmsPrefix 和 rdashAlpha
// 看起来像是匹配 css 样式前缀的
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
// camelCase 中 replace 方法的回调函数
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// CSS和数据模块使用（果然是用于 css）
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}

// 返回 camelCase 方法
return camelCase;

} );
