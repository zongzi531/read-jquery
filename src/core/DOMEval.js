define( [
	"../var/document"
], function( document ) {
	"use strict";

	// require var/document.js 获得 window.document
	// 声明 preservedScriptAttributes 对象
	// 用于遍历已定义的 script 标签属性
	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {

		// 若doc未传入，默认为 document
		doc = doc || document;

		// 声明遍历属性i
		// 声明script标签
		var i,
			script = doc.createElement( "script" );

		// 将 code 传入 script.text
		script.text = code;

		// 若 node 存在，将遍历 preservedScriptAttributes 对象
		// 并对 node 中存在的 对应属性值 赋值到 新声明的 script 标签上
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}

		// 在 head 标签内插入 script 标签，然后移除 script 标签
		// 为什么要这样做呢？
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	// 返回 DOMEval 方法
	return DOMEval;
} );
