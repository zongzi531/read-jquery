define( [
	"../data/var/dataPriv"
], function( dataPriv ) {

"use strict";

	// require data/var/dataPriv.js 获得 Data 的实例

// Mark scripts as having already been evaluated
// Mark scripts 已被评估
// 声明 setGlobalEval 方法
function setGlobalEval( elems, refElements ) {

	// 声明 i = 0
	// 声明 l = 元素集长度
	var i = 0,
		l = elems.length;

	// 遍历元素集
	for ( ; i < l; i++ ) {

		// 调用 Data 的 set 方法
		// 其实从这里 我暂时还无法理解 Data 里存的数据是用来做什么的
		// 第一参数 owner = elems[ i ]
		// 第二参数 data = "globalEval"
		// 第三参数 value = !refElements || dataPriv.get( refElements[ i ], "globalEval" )
		// 这里呢，又用到了 get 方法
		// 第一参数 owner = refElements[ i ]
		// 第二参数 key = "globalEval"
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}

// 返回 setGlobalEval 方法
return setGlobalEval;
} );
