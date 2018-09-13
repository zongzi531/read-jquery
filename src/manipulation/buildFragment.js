define( [
	"../core",
	"../core/toType",
	"./var/rtagName",
	"./var/rscriptType",
	"./wrapMap",
	"./getAll",
	"./setGlobalEval"
], function( jQuery, toType, rtagName, rscriptType, wrapMap, getAll, setGlobalEval ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/toType.js 获得 toType 方法
	// require ./var/rtagName.js 获得 正则表达式
	// require ./var/rscriptType.js 获得 检查模块化 script 标签的正则表达式
	// require ./wrapMap.js 获得 wrapMap 对象
	// require ./getAll.js 获得 getAll 方法
	// require ./setGlobalEval.js 获得 setGlobalEval 方法

// 声明 rhtml 正则表达式
var rhtml = /<|&#?\w+;/;

// 声明 buildFragment 方法
function buildFragment( elems, context, scripts, selection, ignored ) {

	// 初始化 elem, tmp, tag, wrap, contains, j
	// 声明 fragment 创建一个新的空白的文档片段( DocumentFragment)
	// 声明 nodes = 空数组
	// 声明 i = 0
	// 声明 l = 元素集长度
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	// 遍历元素集
	for ( ; i < l; i++ ) {

		// 获取到当前正在遍历的元素
		elem = elems[ i ];

		// 当前元素存在 或 === 0
		if ( elem || elem === 0 ) {

			// Add nodes directly
			// 直接添加节点
			// 元素类型为 object 类型
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				// const addElem = elem.nodeType ? [ elem ] : elem
				// 等同于 [...nodes, ...addElem]
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			// 将 非HTML 转换为文本节点
			// 正则表达式 rhtml 检查 elem 返回 false
			} else if ( !rhtml.test( elem ) ) {

				// 上下文调用 createTextNode 创建新的文本节点
				// 并将其插入 nodes 数组
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			// 将HTML转换为DOM节点
			} else {

				// 检查 tmp 是否存在 若不存在则 创建 div 元素 将其插入 fragment
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				// 反序列化标准表示
				// 使用 正则表达式 rtagName 进行搜索匹配 返回数组，或者在返回 null 的情况获得 [ "", "" ]
				// 取 [1] 将其转为小写
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();

				// 赋值 wrap 操作 获得 wrapMap[ tag ] 对应值 或者赋值 _default 值
				wrap = wrapMap[ tag ] || wrapMap._default;

				// 为 tmp 元素 设置 innerHTML 值 ，获取 wrap[ 1 ] （标签头）和 wrap[ 2 ] （标签尾）
				// jQuery.htmlPrefilter( elem ) 看起来是取标签中间那部分的
				// 印象里好像还没读到这个方法
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				// 通过包装到正确的内容
				// 赋值 j
				// 按照 wrap来看，0 号位置是用来存放 后面标签层数的
				j = wrap[ 0 ];

				// 遍历 j
				while ( j-- ) {

					// tmp 重新赋值 lastChild 值
					// lastChild: 返回当前节点的最后一个子节点
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				// 等同于 [...nodes, ...tmp.childNodes]
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				// 记住顶层容器
				// Node.firstChild 只读属性返回树中节点的第一个子节点，如果节点是无子节点，则返回 null。
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				// 确保创建的节点是孤立的
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	// 从碎片中移除包装器
	fragment.textContent = "";

	// 重置 i = 0
	i = 0;

	// 这样看起来上面那段遍历代码是在向 nodes 中插入元素
	// 然后这里拿出来
	// 遍历 nodes 数组
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		// 跳过上下文集合中的元素
		// selection 存在 且 selection 存在在 elem 中
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {

			// ignored 存在
			if ( ignored ) {

				// 向 ignored 加入 elem
				ignored.push( elem );
			}

			// 跳过此次，执行下一次循环
			continue;
		}

		// jQuery.contains 描述: 检查一个DOM元素是另一个DOM元素的后代。
		// Node.ownerDocument 只读属性会返回当前节点的顶层的 document 对象。
		// contains 返回 布尔值
		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		// 追加到碎片
		// 获取 fragment 下所有的 script 标签 并返回
		// 赋值给 tmp
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		// 保存脚本评估历史
		// 若 contains 为真
		if ( contains ) {

			// 执行 setGlobalEval 方法
			// 在干嘛 我也不知道
			// 看起来像是设置 当前所有者对象缓存 设置什么值
			setGlobalEval( tmp );
		}

		// Capture executables
		// 捕获可执行文件
		// 若 scripts 为真
		if ( scripts ) {

			// 设置 j = 0
			j = 0;

			// 遍历 tmp script 标签数组
			while ( ( elem = tmp[ j++ ] ) ) {

				// 检测 script 标签
				if ( rscriptType.test( elem.type || "" ) ) {

					// 将当前 elem 加入 scripts 数组
					scripts.push( elem );
				}
			}
		}
	}

	// 返回 fragment
	return fragment;
}

// 返回 buildFragment 方法
return buildFragment;
} );
