define( function() {
	"use strict";

	// [[Class]] -> type pairs
  // 返回 空 Object 类型
  // 用于存放类型，内容如下：
  // {
  //   "[object Array]": "array",
  //   "[object Boolean]": "boolean",
  //   "[object Date]": "date",
  //   "[object Error]": "error",
  //   "[object Function]": "function",
  //   "[object Number]": "number",
  //   "[object Object]": "object",
  //   "[object RegExp]": "regexp",
  //   "[object String]": "string",
  //   "[object Symbol]": "symbol"
  // }
  // 方法详见 src/core.js "// Populate the class2type map" 注释段
	return {};
} );
