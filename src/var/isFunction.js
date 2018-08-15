define( function() {
	"use strict";

  // 返回 isFunction 方法
  // 判断是否为函数对象
  // typeof obj.nodeType !== "number" 这段代码下面有相关英文注释，同时也可以学习以下介绍
  // MDN: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
	return function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };

} );
