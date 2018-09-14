define( [
	"./core",
	"./data/var/dataPriv",
	"./deferred",
	"./callbacks"
], function( jQuery, dataPriv ) {

"use strict";

	// require core.js 获得 jQuery
	// require data/var/dataPriv.js 获得 Data 的实例
	// require deferred.js
	// require callbacks.js

// 执行 jQuery.extend 方法
jQuery.extend( {

	// queue 方法
	queue: function( elem, type, data ) {

		// 初始化 queue
		var queue;

		// 判断 elem
		if ( elem ) {

			// type 赋值 ( type || "fx" ) + "queue"
			type = ( type || "fx" ) + "queue";

			// queue 赋值 dataPriv.get( elem, type )
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			// 如果只是一个查找，就赶快脱掉队列。
			// 判断 data
			if ( data ) {

				// 判断 !queue 或者 Array.isArray( data )
				if ( !queue || Array.isArray( data ) ) {

					// queue 赋值 dataPriv.access( elem, type, jQuery.makeArray( data ) )
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {

					// 执行 queue.push( data )
					queue.push( data );
				}
			}

			// 返回 queue 或者 []
			return queue || [];
		}
	},

	// dequeue 方法
	dequeue: function( elem, type ) {

		// type 赋值 type 或者 "fx"
		type = type || "fx";

		// 声明 queue 赋值 jQuery.queue( elem, type )
		var queue = jQuery.queue( elem, type ),

			// 声明 startLength 赋值 queue.length
			startLength = queue.length,

			// 声明 fn 赋值 queue.shift()
			fn = queue.shift(),

			// 声明 hooks 赋值 jQuery._queueHooks( elem, type )
			hooks = jQuery._queueHooks( elem, type ),

			// 声明 next 赋值 匿名函数
			next = function() {

				// 执行 jQuery.dequeue( elem, type )
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		// 如果 fx 队列已退队，则始终删除进度哨兵
		// 判断 fn === "inprogress"
		if ( fn === "inprogress" ) {

			// fn 赋值 queue.shift()
			fn = queue.shift();

			// 执行 startLength--
			startLength--;
		}

		// 判断 fn
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			// 添加进度标识符以防止 fx 队列自动退行
			// 判断 type === "fx"
			if ( type === "fx" ) {

				// 执行 queue.unshift( "inprogress" )
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			// 清除最后一个队列停止函数
			// 执行 delete hooks.stop
			delete hooks.stop;

			// 执行 fn.call( elem, next, hooks )
			fn.call( elem, next, hooks );
		}

		// 判断 !startLength 并且 hooks
		if ( !startLength && hooks ) {

			// 执行 hooks.empty.fire()
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	// 不是公共的——生成队列钩子对象，或者返回当前对象
	// _queueHooks 方法
	_queueHooks: function( elem, type ) {

		// 声明 key 返回 type + "queueHooks"
		var key = type + "queueHooks";

		// 返回 dataPriv.get( elem, key ) 或者 dataPriv.access( elem, key, { ... } )
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {

			// empty 赋值 jQuery.Callbacks( "once memory" ).add
			empty: jQuery.Callbacks( "once memory" ).add( function() {

				// 执行 dataPriv.remove( elem, [ type + "queue", key ] )
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// queue 方法
	queue: function( type, data ) {

		// 初始化 setter 赋值 2
		var setter = 2;

		// 判断 typeof type !== "string"
		if ( typeof type !== "string" ) {

			// data 赋值 type
			data = type;

			// type 赋值 "fx"
			type = "fx";

			// 执行 setter--
			setter--;
		}

		// 判断 arguments.length < setter
		if ( arguments.length < setter ) {

			// 返回 jQuery.queue( this[ 0 ], type )
			return jQuery.queue( this[ 0 ], type );
		}

		// 返回 data === undefined ? this : this.each(...)
		return data === undefined ?
			this :
			this.each( function() {

				// 声明 queue 赋值 jQuery.queue( this, type, data )
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				// 确保队列的钩子
				// 执行 jQuery._queueHooks( this, type )
				jQuery._queueHooks( this, type );

				// 判断 type === "fx" 并且 queue[ 0 ] !== "inprogress"
				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {

					// 执行 jQuery.dequeue( this, type )
					jQuery.dequeue( this, type );
				}
			} );
	},

	// dequeue 方法
	dequeue: function( type ) {

		// 返回 this.each(...)
		return this.each( function() {

			// 执行 jQuery.dequeue( this, type )
			jQuery.dequeue( this, type );
		} );
	},

	// clearQueue 方法
	clearQueue: function( type ) {

		// 返回 this.queue( type || "fx", [] )
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	// 当某个类型的队列被清空时，得到一个解决方案（默认情况下是 fx 类型）
	// promise 方法
	promise: function( type, obj ) {

		// 初始化 tmp
		var tmp,

			// 声明 count 赋值 1
			count = 1,

			// 声明 defer 赋值 jQuery.Deferred()
			defer = jQuery.Deferred(),

			// 声明 elements 赋值 this
			elements = this,

			// 声明 i 赋值 this.length
			i = this.length,

			// 声明 resolve 赋值 匿名函数
			resolve = function() {

				// 判断 !( --count )
				if ( !( --count ) ) {

					// 执行 defer.resolveWith( elements, [ elements ] )
					defer.resolveWith( elements, [ elements ] );
				}
			};

		// 判断 typeof type !== "string"
		if ( typeof type !== "string" ) {

			// obj 赋值 type
			obj = type;

			// type 赋值 undefined
			type = undefined;
		}

		// type 赋值 type 或者 "fx"
		type = type || "fx";

		// 遍历 i
		while ( i-- ) {

			// tmp 赋值 dataPriv.get( elements[ i ], type + "queueHooks" )
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );

			// 判断 tmp 并且 tmp.empty
			if ( tmp && tmp.empty ) {

				// 执行 count++
				count++;

				// 执行 tmp.empty.add( resolve )
				tmp.empty.add( resolve );
			}
		}

		// 执行 resolve()
		resolve();

		// 返回 defer.promise( obj )
		return defer.promise( obj );
	}
} );

// 返回 jQuery
return jQuery;
} );
