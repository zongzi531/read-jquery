define( [
	"../core",
	"../var/document",
	"../data/var/dataPriv",
	"../data/var/acceptData",
	"../var/hasOwn",
	"../var/isFunction",
	"../var/isWindow",
	"../event"
], function( jQuery, document, dataPriv, acceptData, hasOwn, isFunction, isWindow ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require data/var/dataPriv.js 获得 Data 的实例
	// require data/var/acceptData.js 获得 acceptData 方法
	// require var/hasOwn.js 获得 Object.prototype.hasOwnProperty 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require var/isWindow.js 获得 isWindow 方法
	// require event.js

// 声明 rfocusMorph 赋值 正则表达式
var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	// 声明 stopPropagationCallback 方法
	stopPropagationCallback = function( e ) {
		// 执行 e.stopPropagation()
		e.stopPropagation();
	};

// 使用 jQuery.extend 方法 合并 jQuery.event 和 第二参数对象
jQuery.extend( jQuery.event, {

	// trigger 方法
	trigger: function( event, data, elem, onlyHandlers ) {

		// 初始化 i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			// 声明 eventPath 赋值 [ elem || document ]
			eventPath = [ elem || document ],
			// 声明 type 赋值 hasOwn.call( event, "type" ) ? event.type : event
			type = hasOwn.call( event, "type" ) ? event.type : event,
			// 声明 namespaces 赋值 hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : []
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		// cur 和 lastElement 和 tmp 和 elem 赋值 elem || document
		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		// 不要在文本和评论节点上进行事件
		// 判断 elem.nodeType === 3 || elem.nodeType === 8 满足 则 直接 返回
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		// focus/blur 变为 focusin/out；确保我们现在不开火。
		// 判断 rfocusMorph.test( type + jQuery.event.triggered ) 满足 则 直接 返回
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		// 判断 type.indexOf( "." ) > -1
		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			// 命名空间触发器；创建 regexp 以匹配 handle() 中的事件类型
			// namespaces 赋值 type.split( "." )
			namespaces = type.split( "." );
			// type 赋值 namespaces.shift()
			type = namespaces.shift();
			// 执行 namespaces.sort()
			namespaces.sort();
		}
		// ontype 赋值 type.indexOf( ":" ) < 0 && "on" + type
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		// 调用方可以传递 jQuery.Event 对象、对象或事件类型字符串。
		// event 赋值 event[ jQuery.expando ] 返回 为 真 则 event 否则 实例化一个 jQuery.Event( type, typeof event === "object" && event )
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		// event.isTrigger 赋值 onlyHandlers ? 2 : 3
		event.isTrigger = onlyHandlers ? 2 : 3;
		// event.namespace 赋值 namespaces.join( "." )
		event.namespace = namespaces.join( "." );
		// event.rnamespace 赋值 event.namespace 返回 为 真 则 创建一个正则表达式 "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" 否则 返回 null
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		// 在重新使用时清理事件
		// event.result 赋值 undefined
		event.result = undefined;
		// 判断 !event.target
		if ( !event.target ) {
			// event.target 赋值 elem
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		// 克隆任何传入数据并准备事件，创建处理程序 arg 列表
		// data 赋值 data == null 返回 为 真 则 [ event ] 否则 jQuery.makeArray( data, [ event ] )
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		// 允许特殊事件在线外绘制
		// special 赋值 jQuery.event.special[ type ] 或 空对象
		special = jQuery.event.special[ type ] || {};
		// 判断 !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false 成立 则 直接 返回
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// 根据W3C事件规范提前确定事件传播路径
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		// 冒泡到文档，然后转到窗口；查看全局所有者文档 var
		// 判断 !onlyHandlers && !special.noBubble && !isWindow( elem )
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			// bubbleType 赋值 special.delegateType 或 type
			bubbleType = special.delegateType || type;
			// 判断 !rfocusMorph.test( bubbleType + type )
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				// cur 赋值 cur.parentNode
				cur = cur.parentNode;
			}
			// 遍历 cur
			for ( ; cur; cur = cur.parentNode ) {
				// eventPath 加入 cur
				eventPath.push( cur );
				// tmp 赋值 cur
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			// 只有添加窗口才能得到文档（例如，不是纯 obj 或分离 DOM）
			// 判断 tmp === ( elem.ownerDocument || document )
			if ( tmp === ( elem.ownerDocument || document ) ) {
				// eventPath 加入 tmp.defaultView 或 tmp.parentWindow 或 window
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		// 事件路径上的火灾处理程序
		// i 赋值 0
		i = 0;
		// 遍历 ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() 条件
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			// lastElement 赋值 cur
			lastElement = cur;
			// event.type 赋值 i > 1 返回 为 真 则 bubbleType 否则 special.bindType || type
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			// jQuery 处理器
			// handle 赋值 ( dataPriv.get( cur, "events" ) 或 空对象 )[ event.type ] && dataPriv.get( cur, "handle" )
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			// 判断 handle
			if ( handle ) {
				// 执行 handle( ...data )
				handle.apply( cur, data );
			}

			// Native handler
			// 本地处理器
			// handle 赋值 ontype && cur[ ontype ]
			handle = ontype && cur[ ontype ];
			// 判断 handle && handle.apply && acceptData( cur )
			if ( handle && handle.apply && acceptData( cur ) ) {
				// event.result 赋值 handle( ...data )
				event.result = handle.apply( cur, data );
				// 判断 event.result === false
				if ( event.result === false ) {
					// 执行 event.preventDefault()
					event.preventDefault();
				}
			}
		}
		// event.type 赋值 type
		event.type = type;

		// If nobody prevented the default action, do it now
		// 如果没有人阻止默认操作，现在就执行它。
		// 判断 !onlyHandlers && !event.isDefaultPrevented()
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			// 判断 ( !special._default 或 special._default( ...data ) === false ) 并且 acceptData( elem )
			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// 调用具有与事件同名的目标上的本机DOM方法。
				// Don't do default actions on window, that's where global variables be (#6170)
				// 不要在窗口上执行默认操作，这是全局变量的所在。
				// 判断 ontype && isFunction( elem[ type ] ) && !isWindow( elem 
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					// 当我们调用它的 FOO() 方法时，不要重新触发 onFOO 事件。
					// tmp 赋值 elem[ ontype ]
					tmp = elem[ ontype ];

					// 判断 tmp
					if ( tmp ) {
						// elem[ ontype ] 赋值 null
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					// 防止再次触发同一事件，因为我们已经在上面进行了冒泡。
					// jQuery.event.triggered 赋值 type
					jQuery.event.triggered = type;

					// 判断 event.isPropagationStopped()
					if ( event.isPropagationStopped() ) {
						// 执行 lastElement.addEventListener( type, stopPropagationCallback )
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					// 执行 elem[ type ]()
					elem[ type ]();

					// 判断 event.isPropagationStopped()
					if ( event.isPropagationStopped() ) {
						// 执行 lastElement.removeEventListener( type, stopPropagationCallback )
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					// jQuery.event.triggered 赋值 undefined
					jQuery.event.triggered = undefined;

					// 判断 tmp
					if ( tmp ) {
						// elem[ ontype ] 赋值 tmp
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		// 返回 event.result
		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// 捎带捐赠者事件模拟另一个事件
	// Used only for `focus(in | out)` events
	// 仅用于 `focus(in | out)` 事件
	// simulate 方法
	simulate: function( type, elem, event ) {
		// 声明 e 赋值 执行 jQuery.extend 后 返回的结果
		// 合并 new jQuery.Event() 和 event 和 第三参数对象
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		// 执行 jQuery.event.trigger( e, null, elem )
		jQuery.event.trigger( e, null, elem );
	}

} );

// 执行 jQuery.fn.extend
jQuery.fn.extend( {

	// trigger 方法
	// 描述: 根据绑定到匹配元素的给定的事件类型执行所有的处理程序和行为。
	trigger: function( type, data ) {
		// 返回 this.each 遍历回调
		return this.each( function() {
			// 执行 jQuery.event.trigger( type, data, this )
			jQuery.event.trigger( type, data, this );
		} );
	},
	// triggerHandler 方法
	// 描述: 为一个事件执行附加到元素的所有处理程序。
	triggerHandler: function( type, data ) {
		// 声明 elem 赋值 this[ 0 ]
		var elem = this[ 0 ];
		// 判断 elem
		if ( elem ) {
			// 返回 jQuery.event.trigger( type, data, elem, true )
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );

// 返回 jQuery
return jQuery;
} );
