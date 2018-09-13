define( function() {

"use strict";

// 返回 匿名函数
return function( n, elem ) {

  // 声明 matched 为 []
	var matched = [];

  // 遍历 n
  // 每次结束后操作 n = n.nextSibling
	for ( ; n; n = n.nextSibling ) {

    // 若 n.nodeType === 1 && n !== elem 满足
		if ( n.nodeType === 1 && n !== elem ) {

      // matched 加入 n
			matched.push( n );
		}
	}

  // 返回 matched
	return matched;
};

} );
