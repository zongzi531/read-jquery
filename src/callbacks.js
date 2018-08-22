define( [
	"./core",
	"./core/toType",
	"./var/isFunction",
	"./var/rnothtmlwhite"
], function( jQuery, toType, isFunction, rnothtmlwhite ) {

"use strict";
	// require core.js 获得 jQuery
	// require core/toType.js 获得 toType 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require var/rnothtmlwhite.js 获得 正则表达式

// Convert String-formatted options into Object-formatted ones
// 将字符串格式化选项转换为对象格式化选项
// 声明 createOptions 方法
function createOptions( options ) {
	// 声明 object = {}
	var object = {};
	// 使用 jQuery.each 去遍历 options.match( rnothtmlwhite ) || []
	// 将遍历内容 flag 存放至 object 并标记为 true
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	// 返回 object
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
/*
 * 使用以下参数创建回调列表：
 *
 * 选项：一个可选的空间分隔选项列表，将改变回调列表的行为或更传统的选项对象
 *
 * 默认情况下，回调列表将起到事件回调列表的作用，并且可以是多次“发射”。
 *
 * 可能的选择：
 *
 * once：将确保回调列表只能被触发一次（如延迟）
 *
 * memory：将跟踪以前的值，并调用任何回调添加 在名单被用最新的“记忆”开除之后值（如延迟）
 *
 * unique：将确保回调只能添加一次（没有重复列表）
 *
 * stopOnFalse：当回调返回false时中断调用
 *
 */
 // 定义 jQuery.Callbacks 函数
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// 如果需要，将选项从字符串格式转换为对象格式
	// (we check in cache first)
	// （我们第一步检查 cache）
	// 若 options 为 string 类型 直接调用 createOptions 方法
	// 反之 复制一个 options
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	// 初始化
	var // Flag to know if list is currently firing
		// 标记以知道列表是否正在启动
		firing,

		// Last fire value for non-forgettable lists
		// 不可遗忘列表的最后 fire value
		memory,

		// Flag to know if list was already fired
		// 标记以知道列表是否已被启动
		fired,

		// Flag to prevent firing
		// 防止射击的旗帜
		locked,

		// Actual callback list
		// 实际回调表
		list = [],

		// Queue of execution data for repeatable lists
		// 可重复列表的执行数据队列
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		// 当前正在触发回调的索引（根据需要修改/删除）
		firingIndex = -1,

		// Fire callbacks
		// Fire 回调函数
		fire = function() {

			// Enforce single-firing
			// 执行单个 firing？
			// 这里还是进行时了？？？
			// 所以到现在我都没理解 什么是fire
			// 重新赋值 locked 若 locked 不存在则取 options.once 的值
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// 为所有挂起的执行执行回调，
			// respecting firingIndex overrides and runtime changes
			// 尊重 firingIndex 覆盖和运行时更改
			// 将 fired 和 firing 设置为 true
			// 标记 已启动和正在启动 为 true
			fired = firing = true;
			// 遍历可重复列表的执行数据队列 queue
			// 所以 firingIndex 每次重置为 -1 ？
			for ( ; queue.length; firingIndex = -1 ) {
				// memory 获取 queue 的第一个值
				memory = queue.shift();
				// 遍历 实际回调表，只要 firingIndex 小于 实际回调表的长度即可
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					// 运行回调并检查提前终止
					// apply() 方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数。
					// func.apply(thisArg, [argsArray])
					// 获取 list[ firingIndex ] 对应的回调函数
					// 以 apply 形式执行 反正若为 false 并且 options.stopOnFalse 返回为 真 进入判断
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						// 跳转到结束，忘记数据。
						// 将 firingIndex 赋值为 实际回调表的长度 跳出循环
						// 将 memory 数据 赋值为 false
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			// 忘记数据，如果我们完成了
			// 若 options.memory 不存在
			if ( !options.memory ) {
				// 设置 memory = false
				memory = false;
			}

			// 设置 firing = false
			firing = false;

			// Clean up if we're done firing for good
			// 清理，如果我们做了好的 firing
			// 若 locked 为 真
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				// 如果有数据用于将来的添加调用，请保留空列表
				// 若 memory 为 真
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				// 否则，这个对象是失效的
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		// 实际回调对象
		self = {

			// Add a callback or a collection of callbacks to the list
			// 将回调或回调集合添加到列表中
			add: function() {
				// 判断 list 是否存在
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					// 如果我们有过去的记忆，我们应该在添加之后 fire。
					// 若 memory 存在 并且 firing 为 false
					if ( memory && !firing ) {
						// firingIndex 为实际回调表的长度 - 1，也就是最后一个
						firingIndex = list.length - 1;
						// 可重复列表的执行数据队列 queue 加入 memory
						queue.push( memory );
					}

					// 这里使用了IIFE来制造闭包，存下了 arguments
					// 也就是 self.add接受的所有参数
					( function add( args ) {
						// 调用 jQuery.each 遍历 arguments
						jQuery.each( args, function( _, arg ) {
							// 若传入 arguments 为 function
							if ( isFunction( arg ) ) {
								// 若 options.unique 为 false
								// 或者 self.has 方法返回为 false
								// self.has 暂时还没读
								if ( !options.unique || !self.has( arg ) ) {
									// 满足以上条件 list 加入 arg
									list.push( arg );
								}
								// 若 arg 存在，并且存在 length 并且 arg 不是 String 类型
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								// 递归检查
								// 认为这是一个数组，重新调用此IIFE中的 add 方法
								add( arg );
							}
						} );
					} )( arguments );

					// 若 memory 存在 并且 firing 为 false
					if ( memory && !firing ) {
						// 执行 fire 方法
						fire();
					}
				}
				// 返回 this
				return this;
			},

			// Remove a callback from the list
			// 从列表中删除回调
			remove: function() {
				// 使用 jQuery.each 遍历 arguments
				jQuery.each( arguments, function( _, arg ) {
					// 初始化 index
					var index;
					// 使用 jQuery.inArray 方法查找 list 中是否 含有 arg
					// 并赋值给 index
					// 只要 index > -1 就进入循环
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						// 移除被查找到的 index
						list.splice( index, 1 );

						// Handle firing indexes
						// 处理 firing indexes
						// 若 index <= firingIndex
						if ( index <= firingIndex ) {
							// firingIndex --
							// 所以这一步是在干什么？
							firingIndex--;
						}
					}
				} );
				// 返回 this
				return this;
			},

			// Check if a given callback is in the list.
			// 检查给定回调是否在列表中。
			// If no argument is given, return whether or not list has callbacks attached.
			// 如果不给出任何参数，则返回列表是否附加了回调。
			has: function( fn ) {
				// 返回 fn 是否存在对应的三元表达式值
				// 若 fn 不存在 返回 list.length > 0
				// 若 fn 存在 返回 jQuery.inArray( fn, list ) > -1
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			// 从列表中删除所有回调
			empty: function() {
				// 若 list 存在则将 list 赋值为 空数组
				if ( list ) {
					list = [];
				}
				// 返回 this
				return this;
			},

			// Disable .fire and .add
			// 禁止 .fire 和 .add 方法
			// Abort any current/pending executions
			// 中止任何当前/未决执行
			// Clear all callbacks and values
			// 清除所有回调和值
			disable: function() {
				// 这里的操作比 .lock 方法更狠
				locked = queue = [];
				list = memory = "";
				// 返回 this
				return this;
			},
			disabled: function() {
				// 返回 !list
				return !list;
			},

			// Disable .fire
			// 禁止 .fire 方法
			// Also disable .add unless we have memory (since it would have no effect)
			// 也禁止 .add 方法，除非我们有内存（因为它将没有效果）
			// Abort any pending executions
			// 中止任何未决执行
			lock: function() {
				// 将 locked = queue = []
				locked = queue = [];
				// 若 memory 返回为 false 并且 firing 返回为 false
				if ( !memory && !firing ) {
					// 将 list = memory = ""
					list = memory = "";
				}
				// 返回 this
				return this;
			},
			locked: function() {
				// 返回 使用 !! 运算符 的 locked 的布尔值
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			// 使用给定的上下文和参数调用所有回调
			fireWith: function( context, args ) {
				// 若 locked 返回 false
				if ( !locked ) {
					// 获取 args
					args = args || [];
					// 重新赋值 args
					// args.slice ? args.slice() : args 为什么要这么做？
					args = [ context, args.slice ? args.slice() : args ];
					// queue 加入 args
					queue.push( args );
					// 若 firing 为 false 执行 fire
					if ( !firing ) {
						fire();
					}
				}
				// 返回 this
				return this;
			},

			// Call all the callbacks with the given arguments
			// 用给定的参数调用所有回调
			fire: function() {
				// 调用 self.fireWith
				self.fireWith( this, arguments );
				// 返回 this
				return this;
			},

			// To know if the callbacks have already been called at least once
			// 知道回调是否已经至少被调用一次
			fired: function() {
				// 返回 使用 !! 运算符 的 fired 的布尔值
				return !!fired;
			}
		};

	// 返回 实际回调对象 self
	return self;
};

// 返回 jQuery
return jQuery;
} );
