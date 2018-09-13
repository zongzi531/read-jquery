define( [
	"./core",
	"./var/concat",
	"./var/isFunction",
	"./var/push",
	"./core/access",
	"./manipulation/var/rcheckableType",
	"./manipulation/var/rtagName",
	"./manipulation/var/rscriptType",
	"./manipulation/wrapMap",
	"./manipulation/getAll",
	"./manipulation/setGlobalEval",
	"./manipulation/buildFragment",
	"./manipulation/support",

	"./data/var/dataPriv",
	"./data/var/dataUser",
	"./data/var/acceptData",
	"./core/DOMEval",
	"./core/nodeName",

	"./core/init",
	"./traversing",
	"./selector",
	"./event"
], function( jQuery, concat, isFunction, push, access,
	rcheckableType, rtagName, rscriptType,
	wrapMap, getAll, setGlobalEval, buildFragment, support,
	dataPriv, dataUser, acceptData, DOMEval, nodeName ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/concat.js 获得 Array.prototype.concat 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require var/push.js 获得 Array.prototype.push 方法
	// require core/access.js 获得 access 方法
	// require manipulation/var/rcheckableType.js 获得 正则表达式
	// require manipulation/var/rtagName.js 获得 正则表达式
	// require manipulation/var/rscriptType.js 获得 正则表达式
	// require manipulation/wrapMap.js 获得 wrapMap 对象
	// require manipulation/getAll.js 获得 getAll 方法
	// require manipulation/setGlobalEval.js 获得 setGlobalEval 方法
	// require manipulation/buildFragment.js 获得 buildFragment 方法
	// require manipulation/support.js 获得 support 对象
	// require data/var/dataPriv.js 获得 Data 的实例
	// require data/var/dataUser.js 获得 Data 的实例
	// require data/var/acceptData.js 获得 acceptData 方法
	// require core/DOMEval.js 获得 DOMEval 方法
	// require core/nodeName.js 获得 nodeName 方法
	// require core/init.js
	// require traversing.js
	// require selector.js
	// require event.js

var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	// 声明 rxhtmlTag 赋值 正则表达式
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// 在 IE/Edge 中使用 regex 组会导致严重的减速。
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	// 声明 rnoInnerhtml 赋值 正则表达式
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	// 声明 rchecked 赋值 正则表达式
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	// 声明 rcleanScript 赋值 正则表达式
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
// 更喜欢在父表上包含包含新行的体
// 声明 manipulationTarget 函数
function manipulationTarget( elem, content ) {

	// 判断 nodeName( elem, "table" ) 并且 nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" )
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		// 返回 jQuery( elem ).children( "tbody" )[ 0 ] 或者 elem
		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	// 返回 elem
	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
// 替换/恢复用于安全 DOM 操作的脚本元素的类型属性
// 声明 disableScript 函数
function disableScript( elem ) {

	// elem.type 赋值 ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;

	// 返回 elem
	return elem;
}

// 声明 restoreScript 函数
function restoreScript( elem ) {

	// 判断 ( elem.type 或者 "" ).slice( 0, 5 ) === "true/"
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {

		// elem.type 赋值 elem.type.slice( 5 )
		elem.type = elem.type.slice( 5 );
	} else {

		// 执行 elem.removeAttribute( "type" )
		elem.removeAttribute( "type" );
	}

	// 返回 elem
	return elem;
}

// 声明 cloneCopyEvent 函数
function cloneCopyEvent( src, dest ) {

	// 初始化 i, l, type, pdataOld, pdataCur, udataOld, udataCur, events
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	// 判断 dest.nodeType !== 1 满足 则 直接 返回
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	// 1. 复制私有数据：事件，处理程序等。
	// 判断 dataPriv.hasData( src )
	if ( dataPriv.hasData( src ) ) {

		// pdataOld 赋值 dataPriv.access( src )
		pdataOld = dataPriv.access( src );

		// pdataCur 赋值 dataPriv.set( dest, pdataOld )
		pdataCur = dataPriv.set( dest, pdataOld );

		// events 赋值 pdataOld.events
		events = pdataOld.events;

		// 判断 events
		if ( events ) {

			// 执行 delete pdataCur.handle
			delete pdataCur.handle;

			// pdataCur.events 赋值 {}
			pdataCur.events = {};

			// 遍历 events
			for ( type in events ) {

				// 遍历 events[ type ].length
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {

					// 执行 jQuery.event.add( dest, type, events[ type ][ i ] )
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	// 2. 复制用户数据
	// 判断 dataUser.hasData( src )
	if ( dataUser.hasData( src ) ) {

		// udataOld 赋值 dataUser.access( src )
		udataOld = dataUser.access( src );

		// udataCur 赋值 jQuery.extend( {}, udataOld )
		udataCur = jQuery.extend( {}, udataOld );

		// 执行 dataUser.set( dest, udataCur )
		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
// 修复IE错误，请参见支持测试
// 声明 fixInput 函数
function fixInput( src, dest ) {

	// 声明 nodeName 赋值 dest.nodeName.toLowerCase()
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	// 未能保持克隆的复选框或单选按钮的选中状态。
	// 判断 nodeName === "input" 并且 rcheckableType.test( src.type )
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// dest.checked 赋值 src.checked
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	// 当克隆选项失败时，无法将选定的选项返回默认选择的状态
	// 判断 nodeName === "input" 或者 nodeName === "textarea"
	} else if ( nodeName === "input" || nodeName === "textarea" ) {

		// dest.defaultValue 赋值 src.defaultValue
		dest.defaultValue = src.defaultValue;
	}
}

// 声明 domManip 函数
function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	// 平移任何嵌套数组
	// args 赋值 concat.apply( [], args )
	args = concat.apply( [], args );

	// 初始化 fragment, first, scripts, hasScripts, node, doc
	var fragment, first, scripts, hasScripts, node, doc,

		// 声明 i 赋值 0
		i = 0,

		// 声明 l 赋值 collection.length
		l = collection.length,

		// 声明 iNoClone 赋值 l - 1
		iNoClone = l - 1,

		// 声明 value 赋值 args[ 0 ]
		value = args[ 0 ],

		// 声明 valueIsFunction 赋值 isFunction( value )
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	// 在 WebKit 中，我们不能克隆包含检查的片段。
	// 判断 valueIsFunction 或者 ( l > 1 && typeof value === "string" 并且 !support.checkClone && rchecked.test( value ) )
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {

		// 返回 执行 collection.each 方法
		return collection.each( function( index ) {

			// 声明 self 赋值 collection.eq( index )
			var self = collection.eq( index );

			// 判断 valueIsFunction
			if ( valueIsFunction ) {

				// args[ 0 ] 赋值 value.call( this, index, self.html() )
				args[ 0 ] = value.call( this, index, self.html() );
			}

			// 执行 domManip( self, args, callback, ignored )
			domManip( self, args, callback, ignored );
		} );
	}

	// 判断 l
	if ( l ) {

		// fragment 赋值 buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored )
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );

		// first 赋值 fragment.firstChild
		first = fragment.firstChild;

		// 判断 fragment.childNodes.length === 1
		if ( fragment.childNodes.length === 1 ) {

			// fragment 赋值 first
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		// 需要新内容或忽略元素中的兴趣来调用回调
		// 判断 first 或者 ignored
		if ( first || ignored ) {

			// scripts 赋值 jQuery.map( getAll( fragment, "script" ), disableScript )
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );

			// hasScripts 赋值 scripts.length
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			// 在最后一个项目中使用原始片段，而不是第一个，因为在某些情况下，它可能最终被错误地清空。
			// 遍历 l
			for ( ; i < l; i++ ) {

				// node 赋值 fragment
				node = fragment;

				// 判断 i !== iNoClone
				if ( i !== iNoClone ) {

					// node 赋值 jQuery.clone( node, true, true )
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					// 保留对克隆脚本的引用以供以后恢复
					// 判断 hasScripts
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						// 执行 jQuery.merge( scripts, getAll( node, "script" ) )
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				// 执行 callback.call( collection[ i ], node, i )
				callback.call( collection[ i ], node, i );
			}

			// 判断 hasScripts
			if ( hasScripts ) {

				// doc 赋值 scripts[ scripts.length - 1 ].ownerDocument
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				// 可重写脚本
				// 执行 jQuery.map( scripts, restoreScript )
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				// 在第一个文档插入时评估可执行脚本
				// 遍历 hasScripts
				for ( i = 0; i < hasScripts; i++ ) {

					// node 赋值 scripts[ i ]
					node = scripts[ i ];

					// 判断 rscriptType.test( node.type || "" ) 并且 !dataPriv.access( node, "globalEval" ) 并且 jQuery.contains( doc, node )
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						// 判断 node.src 并且 ( node.type || "" ).toLowerCase()  !== "module"
						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							// 可选的 AJAX 依赖项，但如果不存在，则不运行脚本
							// 判断 jQuery._evalUrl
							if ( jQuery._evalUrl ) {

								// 执行 jQuery._evalUrl( node.src )
								jQuery._evalUrl( node.src );
							}
						} else {

							// 执行 DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node )
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	// 返回 collection
	return collection;
}

// 声明 remove 函数
function remove( elem, selector, keepData ) {

	// 初始化 node
	var node,

		// 声明 nodes 赋值 selector ? jQuery.filter( selector, elem ) : elem
		nodes = selector ? jQuery.filter( selector, elem ) : elem,

		// 声明 i 赋值 0
		i = 0;

	// 进行遍历 条件满足 ( node = nodes[ i ] ) != null 则继续
	for ( ; ( node = nodes[ i ] ) != null; i++ ) {

		// 判断 !keepData && node.nodeType === 1
		if ( !keepData && node.nodeType === 1 ) {

			// 执行 jQuery.cleanData( getAll( node ) )
			jQuery.cleanData( getAll( node ) );
		}

		// 判断 node.parentNode
		if ( node.parentNode ) {

			// 判断 keepData 并且 jQuery.contains( node.ownerDocument, node )
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {

				// 执行 setGlobalEval( getAll( node, "script" ) )
				setGlobalEval( getAll( node, "script" ) );
			}

			// 执行 node.parentNode.removeChild( node )
			node.parentNode.removeChild( node );
		}
	}

	// 返回 elem
	return elem;
}

// 执行 jQuery.extend 方法
jQuery.extend( {

	// htmlPrefilter 方法
	htmlPrefilter: function( html ) {

		// 返回 html.replace( rxhtmlTag, "<$1></$2>" )
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	// clone 方法
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {

		// 初始化 i, l, srcElements, destElements
		var i, l, srcElements, destElements,

			// 声明 clone 赋值 elem.cloneNode( true )
			clone = elem.cloneNode( true ),

			// 声明 inPage 赋值 jQuery.contains( elem.ownerDocument, elem )
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		// 修复 IE 克隆问题
		// 判断 !support.noCloneChecked 并且 ( elem.nodeType === 1 或者 elem.nodeType === 11 ) 并且 !jQuery.isXMLDoc( elem )
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			// 我们在这里避开表现。
			// destElements 赋值 getAll( clone )
			destElements = getAll( clone );

			// srcElements 赋值 getAll( elem )
			srcElements = getAll( elem );

			// 遍历 l = srcElements.length
			for ( i = 0, l = srcElements.length; i < l; i++ ) {

				// 执行 fixInput( srcElements[ i ], destElements[ i ] )
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		// 将事件从原始复制到克隆
		// 判断 dataAndEvents
		if ( dataAndEvents ) {

			// 判断 deepDataAndEvents
			if ( deepDataAndEvents ) {

				// srcElements 赋值 srcElements 或者 getAll( elem )
				srcElements = srcElements || getAll( elem );

				// destElements 赋值 destElements 或者 getAll( clone )
				destElements = destElements || getAll( clone );

				// 遍历 l = srcElements.length
				for ( i = 0, l = srcElements.length; i < l; i++ ) {

					// 执行 cloneCopyEvent( srcElements[ i ], destElements[ i ] )
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {

				// 执行 cloneCopyEvent( elem, clone )
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		// 保存脚本评估历史
		// destElements 赋值 getAll( clone, "script" )
		destElements = getAll( clone, "script" );

		// 判断 destElements.length > 0
		if ( destElements.length > 0 ) {

			// 执行 setGlobalEval( destElements, !inPage && getAll( elem, "script" ) )
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		// 返回克隆集
		// 返回 clone
		return clone;
	},

	// cleanData 方法
	cleanData: function( elems ) {

		// 初始化 data, elem, type
		var data, elem, type,

			// 声明 special 赋值 jQuery.event.special
			special = jQuery.event.special,

			// 声明 i 赋值 0
			i = 0;

		// 条件 遍历 满足 ( elem = elems[ i ] ) !== undefined
		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {

			// 判断 acceptData( elem )
			if ( acceptData( elem ) ) {

				// 判断 ( data = elem[ dataPriv.expando ] )
				if ( ( data = elem[ dataPriv.expando ] ) ) {

					// 判断 data.events
					if ( data.events ) {

						// 遍历 data.events
						for ( type in data.events ) {

							// 判断 special[ type ]
							if ( special[ type ] ) {

								// 执行 jQuery.event.remove( elem, type )
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							// 这是避免 jQuery.event.remove's 开销的捷径。
							} else {

								// 执行 jQuery.removeEvent( elem, type, data.handle )
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					// 分配未定义而不是使用删除，参见数据#删除
					// elem[ dataPriv.expando ] 赋值 undefined
					elem[ dataPriv.expando ] = undefined;
				}

				// 判断 elem[ dataUser.expando ]
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					// 分配未定义而不是使用删除，参见数据#删除
					// elem[ dataUser.expando ] 赋值 undefined
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// detach 方法
	detach: function( selector ) {

		// 返回 remove( this, selector, true )
		return remove( this, selector, true );
	},

	// remove 方法
	remove: function( selector ) {

		// 返回 remove( this, selector )
		return remove( this, selector );
	},

	// text 方法
	text: function( value ) {

		// 返回 access( this, fn, null, value, arguments.length )
		return access( this, function( value ) {

			// return 返回 value === undefined 三元表达式结果
			// 为真 则执行 jQuery.text( this )
			// 否则 执行 this.empty().each 方法
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {

					// 判断 this.nodeType === 1 或者 this.nodeType === 11 或者 this.nodeType === 9
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {

						// this.textContent 赋值 value
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	// append 方法
	append: function() {

		// 返回 return domManip( this, arguments, fn)
		return domManip( this, arguments, function( elem ) {

			// 判断 this.nodeType === 1 或者 this.nodeType === 11 或者 this.nodeType === 9
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {

				// 声明 target 赋值 manipulationTarget( this, elem )
				var target = manipulationTarget( this, elem );

				// 执行 target.appendChild( elem )
				target.appendChild( elem );
			}
		} );
	},

	// prepend 方法
	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );

				// 执行 target.insertBefore( elem, target.firstChild )
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	// before 方法
	before: function() {
		return domManip( this, arguments, function( elem ) {

			// 判断 this.parentNode
			if ( this.parentNode ) {

				// 执行 this.parentNode.insertBefore( elem, this )
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	// after 方法
	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {

				// 执行 this.parentNode.insertBefore( elem, this.nextSibling )
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	// empty 方法
	empty: function() {

		// 初始化 elem
		var elem,

			// 声明 i 赋值 0
			i = 0;

		// 条件遍历 满足 ( elem = this[ i ] ) != null
		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// 判断 elem.nodeType === 1
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				// 防止内存泄漏
				// 执行 jQuery.cleanData( getAll( elem, false ) )
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				// 删除任何剩余节点
				// elem.textContent 赋值 ""
				elem.textContent = "";
			}
		}

		// 返回 this
		return this;
	},

	// clone 方法
	clone: function( dataAndEvents, deepDataAndEvents ) {

		// dataAndEvents 赋值 dataAndEvents == null ? false : dataAndEvents
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;

		// deepDataAndEvents 赋值 deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		// 返回 this.map 方法执行结果
		return this.map( function() {

			// 返回 jQuery.clone( this, dataAndEvents, deepDataAndEvents )
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	// html 方法
	html: function( value ) {

		// 返回 access( this, fn, null, value, arguments.length )
		return access( this, function( value ) {

			// 声明 elem 赋值 this[ 0 ] || {}
			var elem = this[ 0 ] || {},

				// 声明 i 赋值 0
				i = 0,

				// 声明 l 赋值 this.length
				l = this.length;

			// 判断 value === undefined 并且 elem.nodeType === 1
			if ( value === undefined && elem.nodeType === 1 ) {

				// 返回 elem.innerHTML
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			// 看看我们是否可以走捷径，只需使用 innerHTML
			// 判断 typeof value === "string" 并且 !rnoInnerhtml.test( value ) 并且 !wrapMap[ ( rtagName.exec( value ) 或者 [ "", "" ] )[ 1 ].toLowerCase() ]
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				// value 赋值 jQuery.htmlPrefilter( value )
				value = jQuery.htmlPrefilter( value );

				// 尝试
				try {

					// 遍历 l
					for ( ; i < l; i++ ) {

						// elem 赋值 this[ i ] 或者 {}
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						// 删除元素节点并防止内存泄漏
						// 判断 elem.nodeType === 1
						if ( elem.nodeType === 1 ) {

							// 执行 jQuery.cleanData( getAll( elem, false ) )
							jQuery.cleanData( getAll( elem, false ) );

							// elem.innerHTML 赋值 value
							elem.innerHTML = value;
						}
					}

					// elem 赋值 0
					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				// 如果使用 innerHTML 抛出异常，请使用回退方法
				} catch ( e ) {}
			}

			// 判断 elem
			if ( elem ) {

				// 执行 this.empty().append( value )
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	// replaceWith 方法
	replaceWith: function() {

		// 声明 ignored 赋值 空数组
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		// 进行更改，用新内容替换每个不被忽略的上下文元素
		// 返回 domManip( this, arguments, fn, ignored )
		return domManip( this, arguments, function( elem ) {

			// 声明 parent 赋值 this.parentNode
			var parent = this.parentNode;

			// 判断 jQuery.inArray( this, ignored ) < 0
			if ( jQuery.inArray( this, ignored ) < 0 ) {

				// 执行 jQuery.cleanData( getAll( this ) )
				jQuery.cleanData( getAll( this ) );

				// 判断 parent
				if ( parent ) {

					// 执行 parent.replaceChild( elem, this )
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		// 调用的回调力量
		}, ignored );
	}
} );

// 执行 jQuery.each 方法 遍历以下对象
jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {

	// jQuery.fn[ name ] 赋值 匿名函数
	jQuery.fn[ name ] = function( selector ) {

		// 初始化 elems
		var elems,

			// 声明 ret 赋值 []
			ret = [],

			// 声明 insert 赋值 jQuery( selector )
			insert = jQuery( selector ),

			// 声明 last 赋值 insert.length - 1
			last = insert.length - 1,

			// 声明 i 赋值 0
			i = 0;

		// 遍历 last
		for ( ; i <= last; i++ ) {

			// elems 赋值 i === last ? this : this.clone( true )
			elems = i === last ? this : this.clone( true );

			// 执行 jQuery( insert[ i ] )[ original ]( elems )
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			// ret.push( elems.get() )
			push.apply( ret, elems.get() );
		}

		// 返回 this.pushStack( ret )
		return this.pushStack( ret );
	};
} );

// 返回 jQuery
return jQuery;
} );
