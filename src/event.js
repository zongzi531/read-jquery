define( [
	"./core",
	"./var/document",
	"./var/documentElement",
	"./var/isFunction",
	"./var/rnothtmlwhite",
	"./var/slice",
	"./data/var/dataPriv",
	"./core/nodeName",

	"./core/init",
	"./selector"
], function( jQuery, document, documentElement, isFunction, rnothtmlwhite,
	slice, dataPriv, nodeName ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require var/documentElement.js 获得 window.document.documentElement
	// require var/isFunction.js 获得 isFunction 方法
	// require var/rnothtmlwhite.js 获得 正则表达式
	// require var/slice.js 获得 Array.prototype.slice 方法
	// require data/var/dataPriv.js 获得 Data 的实例
	// require core/nodeName.js 获得 nodeName 方法
	// require core/init.js
	// require selector.js

var

	// 声明 rkeyEvent 正则表达式 用来检测 键盘事件
	rkeyEvent = /^key/,

	// 声明 rmouseEvent 正则表达式 用来检测 鼠标事件
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,

	// 声明 rtypenamespace 正则表达式 （类型命名空间）
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

// 声明 returnTrue 方法 返回 true
function returnTrue() {
	return true;
}

// 声明 returnFalse 方法 返回 false
function returnFalse() {
	return false;
}

// 这里 为什么要用函数呢？？？？
// 直接 var returnFalse = false 不行嘛？

// Support: IE <=9 only
// See #13393 for more info
// 声明 safeActiveElement 方法
function safeActiveElement() {
	try {

		// 尝试 去返回 document.activeElement
		// 若报错 则忽略
		return document.activeElement;
	} catch ( err ) { }
}

// 声明 on 方法
function on( elem, types, selector, data, fn, one ) {

	// 初始化 origFn, type
	var origFn, type;

	// Types can be a map of types/handlers
	// 类型可以是类型/处理程序的映射。
	// 判断 types 是否为 Object 类型
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		// 判断 selector 是否不为 String 类型
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			// 若 data 不存在则取 selector
			data = data || selector;

			// selector = undefined
			selector = undefined;
		}

		// 遍历 types 属性
		for ( type in types ) {

			// 递归调用 on 方法
			// fn 参数传入 types[ type ]
			on( elem, type, selector, data, types[ type ], one );
		}

		// 返回 elem
		return elem;
	}

	// 若 data == null 并且 fn == null
	if ( data == null && fn == null ) {

		// ( types, fn )
		// fn 赋值 selector
		fn = selector;

		// data = selector = undefined
		data = selector = undefined;

		// 若 fn == null 的情况
	} else if ( fn == null ) {

		// 若 selector 为 String 类型
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			// fn 赋值 data
			fn = data;

			// data = undefined
			data = undefined;

		// 若 selector 不为 String 类型
		} else {

			// ( types, data, fn )
			// fn 赋值 data
			fn = data;

			// data 赋值 selector
			data = selector;

			// selector = undefined
			selector = undefined;
		}
	}

	// 若 fn === false
	if ( fn === false ) {

		// 赋值 fn = returnFalse 这是一个方法
		fn = returnFalse;

		// 若 fn 为 除了 false 以外的 使用 ! 操作符可以返回为真的
	} else if ( !fn ) {

		// 返回 elem
		return elem;
	}

	// 若 one === 1
	if ( one === 1 ) {

		// origFn 赋值 fn
		origFn = fn;

		// fn 赋值 匿名函数
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			// 可以使用空集，因为事件包含信息
			// 描述: 移除一个事件处理函数。
			jQuery().off( event );

			// 返回 origFn(arguments)
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		// 使用相同的GUID，调用方可以使用Orgfn删除
		// 重新赋值 fn.guid 若 origFn.guid 存在 或者 jQuery.guid++
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}

	// 返回 元素集遍历
	return elem.each( function() {

		// 调用 jQuery.event.add 方法 这里还没读到
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * 管理事件的辅助函数——不是公共接口的一部分
 * Props to Dean Edwards' addEvent library for many of the ideas.
 * 为Dean Edwards的图书馆提供了很多想法。
 */
// 定义 jQuery.event 对象
jQuery.event = {

	// global 对象
	global: {},

	// add 方法
	add: function( elem, types, handler, data, selector ) {

		// 初始化 handleObjIn, eventHandle, tmp,
		// 初始化 events, t, handleObj,
		// 初始化 special, handlers, type, namespaces, origType
		// 声明 elemData 赋值 dataPriv.get( elem )
		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		// 不要将事件附加到 noData 或文本/注释节点（但允许普通对象）
		// 若 elemData 不存在 直接 返回
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		// 调用方可以传递自定义数据对象代替处理程序。
		// 若 handler.handler 存在
		if ( handler.handler ) {

			// handleObjIn 赋值 handler
			handleObjIn = handler;

			// handler 赋值 handleObjIn.handler
			handler = handleObjIn.handler;

			// selector 赋值 handleObjIn.selector
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// 确保无效选择器在附加时间引发异常。
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		// 在 elem 是非元素节点（例如，文档）的情况下，对文档元素进行评估
		// 若 selector 存在
		if ( selector ) {

			// 执行 jQuery.find.matchesSelector( documentElement, selector )
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		// 确保处理程序具有唯一的ID，用于以后查找/删除它。
		// 若 handler.guid 返回为 false 或者 不存在
		if ( !handler.guid ) {

			// handler.guid 赋值 jQuery.guid++
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		// 初始化元素的事件结构和主处理程序，如果这是第一个
		// events 赋值 elemData.events 后 使用 ! 操作符 返回 true
		if ( !( events = elemData.events ) ) {

			// 为 events 和 elemData.events 同时赋值 空对象
			events = elemData.events = {};
		}

		// eventHandle 赋值 elemData.handle 后 使用 ! 操作符 返回 true
		if ( !( eventHandle = elemData.handle ) ) {

			// 为 eventHandle 和 elemData.handle 同时赋值 匿名函数
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				// 丢弃 jQuery.event.trigger() 的第二个事件，并在页面卸载后调用事件。
				// 返回 若 jQuery 不为 undefined 并且
				// 判断 e.type 是否为真 若为真返回 jQuery.event.dispatch.apply( elem, arguments )
				// 否则返回 undefined
				// 然后与 jQuery.event.triggered 进行比较
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		// 处理由空间分隔的多个事件
		// types 赋值 types 不存在或者 '' 的情况 匹配 rnothtmlwhite 正则表达式 返回结果，若没有 则返回 ['']
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];

		// t 赋值 types 长度
		t = types.length;

		// 遍历 t
		while ( t-- ) {

			// tmp 赋值 rtypenamespace 正则表达式 执行 types[ t ] 的结果 或返回 []
			tmp = rtypenamespace.exec( types[ t ] ) || [];

			// type 和 origType 赋值 tmp[ 1 ]
			type = origType = tmp[ 1 ];

			// namespaces 赋值 tmp[ 2 ] 不存在或者 '' 的情况 截取 '.' 返回的数组 然后进行排序
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			// 必须是一种类型，不需要只附加命名空间
			// 若 type 不存在 则跳过此次循环
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			// 如果事件更改其类型，则使用已更改类型的特殊事件处理程序。
			// special 赋值 jQuery.event.special[ type ] 或 空对象
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			// 如果定义了选择器，则确定特殊事件API类型，否则指定类型
			// type 赋值 若 selector 存在 返回 special.delegateType 否则返回 special.bindType
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			// 基于新复位类型的特殊更新
			// special 赋值 jQuery.event.special[ type ] 或 空对象
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			// handleObj 传递给所有事件处理程序
			// handleObj 赋值 使用 jQuery.extend 方法 将 handleObjIn 合并至 第一参数对象
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			// 如果我们是第一个，则初始化事件处理程序队列。
			// handlers 赋值 events[ type ] 使用 ! 操作符 返回为 true
			if ( !( handlers = events[ type ] ) ) {

				// handlers 和 events[ type ] 赋值为 空数组
				handlers = events[ type ] = [];

				// handlers.delegateCount = 0
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				// 如果特殊事件处理程序返回false，则只使用 addEventListener 。
				// 若 !special.setup 返回 true 或者 special.setup.call( elem, data, namespaces, eventHandle ) === false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// 若 elem.addEventListener 存在
					if ( elem.addEventListener ) {

						// 执行 elem.addEventListener( type, eventHandle )
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			// 若 special.add 存在
			if ( special.add ) {

				// 执行 special.add( handleObj )
				special.add.call( elem, handleObj );

				// 若 !handleObj.handler.guid 返回为 true
				if ( !handleObj.handler.guid ) {

					// handleObj.handler.guid = handler.guid
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			// 添加到元素的处理程序列表中，前面的委托
			// 若 selector 存在
			if ( selector ) {

				// 执行 handlers.splice( handlers.delegateCount++, 0, handleObj )
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {

				// 否则执行 handlers.push( handleObj )
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			// 跟踪哪些事件被使用过，用于事件优化
			// 标记 jQuery.event.global[ type ] 为 true
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	// 从元素中分离事件或事件集
	// remove 方法
	remove: function( elem, types, handler, selector, mappedTypes ) {

		// 初始化 j, origCount, tmp,
		// 初始化 events, t, handleObj,
		// 初始化 special, handlers, type, namespaces, origType,
		// 声明 elemData 为 dataPriv.hasData( elem ) && dataPriv.get( elem )
		// 若 dataPriv.hasData( elem ) 存在 elemData 赋值 dataPriv.get( elem )
		// 否则 赋值 false
		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		// 若满足 !elemData 或者 !( events = elemData.events ) 为 true 的情况 直接 返回
		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		// 类型中的每个命名空间一次；类型可以省略。
		// types 赋值 ( types || "" ) 匹配 rnothtmlwhite 正则表达式 返回 [...] 或 [ "" ]
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];

		// t 赋值 types 长度
		t = types.length;

		// 遍历 t
		while ( t-- ) {

			// tmp 赋值 rtypenamespace 正则表达式执行 types[ t ] 的结果 或 []
			// 这里是倒过来的 和 add 方法里的这一步一样
			tmp = rtypenamespace.exec( types[ t ] ) || [];

			// type 和 origType 赋值 tmp[ 1 ]
			type = origType = tmp[ 1 ];

			// namespaces 赋值 ( tmp[ 2 ] || "" ) 截取 '.' 后返回的数组 然后进行排序的结果
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			// 为元素取消绑定所有事件（如果提供此命名空间）
			// 若 !type 返回为 true
			if ( !type ) {

				// 遍历 events 对象
				for ( type in events ) {

					// 递归调用 remove 方法
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}

				// 跳过本次 t 遍历
				continue;
			}

			// special 赋值 jQuery.event.special[ type ] 或 空对象
			special = jQuery.event.special[ type ] || {};

			// type 赋值 若 selector 存在 返回 special.delegateType 否则 返回 special.bindType 若 这里返回值不存在的话 type 还是原来的 type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// handlers 赋值 events[ type ] 或 空数组
			handlers = events[ type ] || [];

			// tmp 赋值 tmp[ 2 ] 存在的情况下的正则表达式 new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" )
			// 当然这个 正则表达式是用来做什么的 我并不知道
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			// 删除匹配事件
			// origCount 和 j 赋值 handlers 的长度
			origCount = j = handlers.length;

			// 遍历 j
			while ( j-- ) {

				// handleObj 赋值 handlers[ j ]
				// 同样 handleObj 这个也是倒过来的
				handleObj = handlers[ j ];

				// 判断 mappedTypes 或 origType === handleObj.origType 存在 并且
				// !handler 或 handler.guid === handleObj.guid 存在 或返回为 true 并且
				// （ !tmp 或 tmp.test( handleObj.namespace ) 返回为 true 并且 handleObj.selector ）
				// !selector 或 selector === handleObj.selector 或 selector === "**" 并且 handleObj.selector
				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {

					// handlers 删除 j 位置
					handlers.splice( j, 1 );

					// 判断 若 handleObj.selector 存在
					if ( handleObj.selector ) {

						// 执行 handlers.delegateCount--
						handlers.delegateCount--;
					}

					// 判断 若 special.remove 存在
					if ( special.remove ) {

						// 执行 special.remove( handleObj )
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// 删除一般事件处理程序，如果我们删除了一些，并且没有更多的处理程序存在
			// (avoids potential for endless recursion during removal of special event handlers)
			// （在删除特殊事件处理程序时避免无限递归）
			// 判断 origCount 存在 并且 !handlers.length 返回为 true
			if ( origCount && !handlers.length ) {

				// 判断 !special.teardown 或 special.teardown.call( elem, namespaces, elemData.handle ) === false
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					// 执行 jQuery.removeEvent( elem, type, elemData.handle )
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				// 删除 events[ type ] 属性
				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		// 删除数据和扩展号，如果不再使用
		// 判断 events 若为空对象
		if ( jQuery.isEmptyObject( events ) ) {

			// 执行 dataPriv.remove( elem, "handle events" )
			dataPriv.remove( elem, "handle events" );
		}
	},

	// dispatch 方法
	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		// 从本地事件对象创建可写 jQuery.Event
		// 声明 event 为 jQuery.event.fix( nativeEvent ) 执行结果
		var event = jQuery.event.fix( nativeEvent );

		// 初始化 i, j, ret, matched, handleObj, handlerQueue
		// 声明 args 赋值 arguments 长度的空数组
		// 声明 handlers 赋值 ( dataPriv.get( this, "events" ) 或 空对象 )[ event.type ] 或空数组
		// 声明 special 赋值 jQuery.event.special[ event.type ] 或 空对象
		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		// 使用 fix-ed jQuery.Event 而不是（只读）本地事件
		// args[ 0 ] 赋值 event
		args[ 0 ] = event;

		// 遍历 arguments 从第二位开始
		for ( i = 1; i < arguments.length; i++ ) {

			// args[ i ] 赋值 arguments[ i ]
			args[ i ] = arguments[ i ];
		}

		// event.delegateTarget 赋值 this
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		// 调用映射类型的 preDispatch 钩子，如果需要的话，让它进行保释。
		// 判断 special.preDispatch 并且 special.preDispatch.call( this, event ) === false 为 true
		// 否则 直接 返回
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		// 确定处理程序
		// handlerQueue 赋值 jQuery.event.handlers( event, handlers ) 的 执行结果
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		// 首先代表代表，他们可能希望停止在我们下面传播。
		// i 赋值 0
		i = 0;

		// 遍历 matched = handlerQueue[ i++ ] 并且 !event.isPropagationStopped()
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {

			// event.currentTarget 赋值 matched.elem
			event.currentTarget = matched.elem;

			// j 赋值 0
			j = 0;

			// 遍历 handleObj = matched.handlers[ j++ ] 并且 !event.isImmediatePropagationStopped()
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				// 触发事件必须是1）没有命名空间，或者2）具有子集的命名空间，或者等于绑定事件中的命名空间（两者都可以没有命名空间）。
				// 判断 !event.rnamespace 或 event.rnamespace.test( handleObj.namespace )
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					// event.handleObj 赋值 handleObj
					event.handleObj = handleObj;

					// event.data 赋值 handleObj.data
					event.data = handleObj.data;

					// ret 赋值 ( jQuery.event.special[ handleObj.origType ] || {} ).handle 方法是否存在 或者 handleObj.handler 方法
					// 执行 该方法 传入参数 args 的返回值
					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					// 判断 ret !== undefined
					if ( ret !== undefined ) {

						// 判断 ( event.result = ret ) === false
						if ( ( event.result = ret ) === false ) {

							// 执行 event.preventDefault()
							// Event 接口的 preventDefault( ) 方法，告诉user agent：如果此事件没有需要显式处理，那么它默认的动作也不要做（因为默认是要做的）。此事件还是继续传播，除非碰到事件侦听器调用stopPropagation() 或stopImmediatePropagation()，才停止传播。
							// 执行 event.stopPropagation()
							// event.stopPropagation() 阻止捕获和冒泡阶段中当前事件的进一步传播。
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		// 调用映射类型的后调度钩子
		// 判断 special.postDispatch
		if ( special.postDispatch ) {

			// 执行 special.postDispatch( event )
			special.postDispatch.call( this, event );
		}

		// 返回 event.result
		return event.result;
	},

	// handlers 方法
	handlers: function( event, handlers ) {

		// 初始化 i, handleObj, sel, matchedHandlers, matchedSelectors,
		var i, handleObj, sel, matchedHandlers, matchedSelectors,

			// 声明 handlerQueue 赋值 []
			handlerQueue = [],

			// 声明 delegateCount 赋值 handlers.delegateCount
			delegateCount = handlers.delegateCount,

			// 声明 cur 赋值 event.target
			cur = event.target;

		// Find delegate handlers
		// 查找委托处理程序
		// 判断 delegateCount 存在 并且 cur.nodeType 存在 并且
		// !( event.type === "click" && event.button >= 1 ) 返回为 true 进入判断
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			// 黑洞 SVG <use> 实例树
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// 禁止指定指示非主指针按钮的点击
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			// 但不是箭头键“点击”的无线电输入，它可以有'按钮' - 1
			!( event.type === "click" && event.button >= 1 ) ) {

			// 遍历 cur 满足 cur !== this 继续
			// 循环一次结束以后 执行 cur = cur.parentNode || this
			// 也就是说 当 cur.parentNode 不存在时候 会退出次循环
			// 并且 cur 这是为 this
			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// 不要检查非元素
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				// 不要处理禁用元素的点击
				// 判断 cur.nodeType === 1 并且 !( event.type === "click" && cur.disabled === true ) 返回为 true
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {

					// matchedHandlers 赋值 []
					matchedHandlers = [];

					// matchedSelectors 赋值 {}
					matchedSelectors = {};

					// 遍历 delegateCount
					for ( i = 0; i < delegateCount; i++ ) {

						// handleObj 赋值 handlers[ i ]
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						// 不要与 Object.prototype 属性冲突
						// sel 赋值 handleObj.selector + " "
						sel = handleObj.selector + " ";

						// 判断 matchedSelectors[ sel ] === undefined
						if ( matchedSelectors[ sel ] === undefined ) {

							// matchedSelectors[ sel ] 赋值 若 handleObj.needsContext 存在 返回 jQuery( sel, this ).index( cur ) > -1
							// 反之 返回 jQuery.find( sel, this, null, [ cur ] ).length
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}

						// 判断 matchedSelectors[ sel ]
						if ( matchedSelectors[ sel ] ) {

							// matchedHandlers 加入 handleObj
							matchedHandlers.push( handleObj );
						}
					}

					// 判断 matchedHandlers.length
					if ( matchedHandlers.length ) {

						// handlerQueue 加入 { elem: cur, handlers: matchedHandlers }
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		// 添加剩余的（直接绑定）处理程序
		// cur 赋值 this
		// cur 在上面这个 for 循环的结束的时候不就为this了么？？
		// 噢,要满足上面那些判断条件的
		cur = this;

		// 判断 delegateCount < handlers.length
		if ( delegateCount < handlers.length ) {

			// handlerQueue 加入 { elem: cur, handlers: handlers.slice( delegateCount ) }
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		// 返回 handlerQueue
		return handlerQueue;
	},

	// addProp 方法
	addProp: function( name, hook ) {

		// Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
		// Object.defineProperty(obj, prop, descriptor)
		// obj 要在其上定义属性的对象。
		// prop 要定义或修改的属性的名称。
		// descriptor 将被定义或修改的属性描述符。
		Object.defineProperty( jQuery.Event.prototype, name, {

			// enumerable 当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
			enumerable: true,

			// configurable 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
			configurable: true,

			// get 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。
			// 判断 hook 是否为 function
			get: isFunction( hook ) ?
				function() {

					// 判断 this.originalEvent
					if ( this.originalEvent ) {

							// 返回 hook( this.originalEvent )
							return hook( this.originalEvent );
					}
				} :
				function() {

					// 判断 this.originalEvent
					if ( this.originalEvent ) {

							// 返回 this.originalEvent[ name ]
							return this.originalEvent[ name ];
					}
				},

			// set 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,

					// writable 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
					writable: true,

					// value 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
					value: value
				} );
			}
		} );
	},

	// fix 方法
	fix: function( originalEvent ) {

		// 返回 若 originalEvent[ jQuery.expando ] 存在 返回 originalEvent 反之 实例化一个 jQuery.Event( originalEvent )
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	// special 对象
	special: {

		// load 对象
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			// 防止触发映像。加载事件从冒泡到 window.load
			noBubble: true
		},

		// focus 对象
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			// 如果可能的话，激发本地事件，这样 blur/focus 序列是正确的
			// trigger 方法
			trigger: function() {

				// 判断 this !== safeActiveElement() && this.focus
				if ( this !== safeActiveElement() && this.focus ) {

					// 执行 this.focus()
					this.focus();

					// 返回 false
					return false;
				}
			},
			delegateType: "focusin"
		},

		// blur 对象
		blur: {

			// trigger 方法
			trigger: function() {

				// 判断 this === safeActiveElement() && this.blur
				if ( this === safeActiveElement() && this.blur ) {

					// 执行 this.blur()
					this.blur();

					// 返回 false
					return false;
				}
			},
			delegateType: "focusout"
		},

		// click 对象
		click: {

			// For checkbox, fire native event so checked state will be right
			// 对于复选框，fire native event 如此检查状态将是正确的。
			// trigger 方法
			trigger: function() {

				// 判断 this.type === "checkbox" && this.click && nodeName( this, "input" )
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {

					// 执行 this.click()
					this.click();

					// 返回 false
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			// 对于跨浏览器的一致性，不要在链接上激发本地 .click()
			// _default 方法
			_default: function( event ) {

				// 返回 nodeName( event.target, "a" )
				return nodeName( event.target, "a" );
			}
		},

		// beforeunload 对象
		beforeunload: {

			// postDispatch 方法
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				// 如果没有设置返回值字段，Firefox不会发出警报。
				// 判断 event.result !== undefined && event.originalEvent
				if ( event.result !== undefined && event.originalEvent ) {

					// event.originalEvent.returnValue 赋值 event.result
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// jQuery.removeEvent 方法
jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	// 这个 “if” 是平原对象所需要的。
	// 判断 elem.removeEventListener
	if ( elem.removeEventListener ) {

		// 执行 elem.removeEventListener( type, handle )
		elem.removeEventListener( type, handle );
	}
};

// jQuery.Event 方法
jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	// 允许没有 “new” 关键字的实例化
	// 判断 !( this instanceof jQuery.Event )
	if ( !( this instanceof jQuery.Event ) ) {

		// 返回 实例化 jQuery.Event( src, props )
		return new jQuery.Event( src, props );
	}

	// Event object
	// 事件对象
	// 判断 src && src.type
	if ( src && src.type ) {

		// this.originalEvent 赋值 src
		this.originalEvent = src;

		// this.type 赋值 src.type
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		// 冒泡文档的事件可能已经被树下的处理程序所阻止，反映正确的值。
		// this.isDefaultPrevented 赋值 src.defaultPrevented 如果存在的话
		// 否则 若 src.defaultPrevented !== undefined 返回 false
		// src.defaultPrevented === undefined 并且 src.returnValue === false 成立 返回 returnTrue 不成立 返回 returnFalse
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// 创建目标属性
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		// 目标不应是文本节点
		// this.target 赋值 src.target && src.target.nodeType === 3 的情况 返回 src.target.parentNode 否则 都返回 src.target
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		// this.currentTarget 赋值 src.currentTarget
		this.currentTarget = src.currentTarget;

		// this.relatedTarget 赋值 src.relatedTarget
		this.relatedTarget = src.relatedTarget;

	// Event type
	// 事件类型
	} else {

		// this.type 赋值 src
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	// 将显式提供的属性放在事件对象上
	// 判断 props
	if ( props ) {

		// 使用 jQuery.extend 组合 this 和 props
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	// 如果传入事件没有一个时间戳，则创建时间戳
	// this.timeStamp 赋值 src && src.timeStamp 或 Date.now()
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	// 把它标记为固定的
	// this[ jQuery.expando ] 赋值 true
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// jQuery.Event 是基于 ECMAScript 语言绑定指定的 DOM3 事件
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
// jQuery.Event.prototype 对象
jQuery.Event.prototype = {

	// constructor 构造器
	constructor: jQuery.Event,

	// 一些状态 isDefaultPrevented, isPropagationStopped, isImmediatePropagationStopped, isSimulated
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	// preventDefault 方法
	preventDefault: function() {

		// 声明 e 赋值 this.originalEvent
		var e = this.originalEvent;

		// 标记 this.isDefaultPrevented 状态为 returnTrue
		this.isDefaultPrevented = returnTrue;

		// 判断 e && !this.isSimulated
		if ( e && !this.isSimulated ) {

			// 执行 原生事件 e.preventDefault()
			e.preventDefault();
		}
	},

	// stopPropagation 方法
	stopPropagation: function() {

		// 声明 e 赋值 this.originalEvent
		var e = this.originalEvent;

		// 标记 this.isPropagationStopped 状态为 returnTrue
		this.isPropagationStopped = returnTrue;

		// 判断 e && !this.isSimulated
		if ( e && !this.isSimulated ) {

			// 执行 原生事件 e.stopPropagation()
			e.stopPropagation();
		}
	},

	// stopImmediatePropagation 方法
	stopImmediatePropagation: function() {

		// 声明 e 赋值 this.originalEvent
		var e = this.originalEvent;

		// 标记 this.isImmediatePropagationStopped 状态为 returnTrue
		this.isImmediatePropagationStopped = returnTrue;

		// 判断 e && !this.isSimulated
		if ( e && !this.isSimulated ) {

			// 执行 原生事件 e.stopImmediatePropagation()
			e.stopImmediatePropagation();
		}

		// 调用 this.stopPropagation() 方法
		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
// 包括所有常见事件道具，包括键事件和鼠标事件专用道具
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,

	// 为啥 char 用 String 类型
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	// which 方法
	which: function( event ) {

		// 声明 button 赋值 event.button
		var button = event.button;

		// Add which for key events
		// 为关键事件添加
		// 判断 event.which == null && rkeyEvent.test( event.type )
		if ( event.which == null && rkeyEvent.test( event.type ) ) {

			// 返回 event.charCode != null ? event.charCode : event.keyCode
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// 为点击添加：1 === 左；2 === 中间；3 === 右
		// 判断 !event.which && button !== undefined && rmouseEvent.test( event.type )
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {

			// & 运算符：
			// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_AND
			// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		// 返回 event.which
		return event.which;
	}

	// 传入 jQuery.event.addProp 方法
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// 使用 mouseover/out 和事件时间检查创建 mouseenter/leave 事件
// so that event delegation works in jQuery.
// 使事件委托在jQuery中工作。
// Do the same for pointerenter/pointerleave and pointerover/pointerout
// 同样的做法也适用于 pointerenter/pointerleave 和 pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
// 使用 jQuery.each 方法遍历一下对象
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"

	// 回调
}, function( orig, fix ) {

	// jQuery.event.special[ orig ] 赋值 对象
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		// handle 方法
		handle: function( event ) {

			// 初始化 ret
			var ret,

				// 声明 target 赋值 this
				target = this,

				// 声明 related 赋值 event.relatedTarget
				related = event.relatedTarget,

				// 声明 handleObj 赋值 event.handleObj
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// 对于 mouseenter/leave 呼叫，如果相关的处理程序在目标外部。
			// NB: No relatedTarget if the mouse left/entered the browser window
			// NB: 如果鼠标左/进入浏览器窗口，则没有相关的目标
			// 判断 !related || ( related !== target && !jQuery.contains( target, related ) )
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {

				// event.type 赋值 handleObj.origType
				event.type = handleObj.origType;

				// ret 赋值 执行 handleObj.handler( arguments )
				ret = handleObj.handler.apply( this, arguments );

				// event.type 赋值 fix
				event.type = fix;
			}

			// 返回 ret
			return ret;
		}
	};
} );

// 调用 jQuery.fn.extend
jQuery.fn.extend( {

	// on 方法
	on: function( types, selector, data, fn ) {

		// 方法 on( this, types, selector, data, fn )
		return on( this, types, selector, data, fn );
	},

	// one 方法
	one: function( types, selector, data, fn ) {

		// 方法 on( this, types, selector, data, fn, 1 )
		return on( this, types, selector, data, fn, 1 );
	},

	// off 方法
	off: function( types, selector, fn ) {

		// 初始化 handleObj, type
		var handleObj, type;

		// 判断 types && types.preventDefault && types.handleObj
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			// handleObj 赋值 types.handleObj
			handleObj = types.handleObj;

			// 递归调用 jQuery( types.delegateTarget ).off 方法
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);

			// 返回 this
			return this;
		}

		// 判断 typeof types === "object"
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			// 遍历 types
			for ( type in types ) {

				// 递归调用 this.off( type, selector, types[ type ] ) 方法
				this.off( type, selector, types[ type ] );
			}

			// 返回 this
			return this;
		}

		// 判断 selector === false || typeof selector === "function"
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			// fn 赋值 selector
			fn = selector;

			// selector 赋值 undefined
			selector = undefined;
		}

		// 判断 fn === false
		if ( fn === false ) {

			// fn 赋值 returnFalse
			fn = returnFalse;
		}

		// 返回 this.each 方法执行结果
		return this.each( function() {

			// 调用 jQuery.event.remove( this, types, fn, selector )
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );

// 返回 jQuery
return jQuery;
} );
