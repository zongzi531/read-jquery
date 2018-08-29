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
		返回 elem
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
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
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

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
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

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );

return jQuery;
} );
