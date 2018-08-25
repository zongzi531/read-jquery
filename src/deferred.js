define( [
	"./core",
	"./var/isFunction",
	"./var/slice",
	"./callbacks"
], function( jQuery, isFunction, slice ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/isFunction.js 获得 isFunction 方法
	// require var/slice.js 获得 Array.prototype.slice 方法
	// require callbacks.js
// 声明 Identity 方法
function Identity( v ) {
	// 返回 v
	return v;
}
// 声明 Thrower 方法
function Thrower( ex ) {
	// 抛出 ex 异常
	throw ex;
}

// 声明 adoptValue 方法
function adoptValue( value, resolve, reject, noValue ) {
	// 初始化 method
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		// 检查允诺方面优先特权同步行为
		// 检查 value 是否存在 并且 value.promise 是否为 function
		// 绑定至 method
		if ( value && isFunction( ( method = value.promise ) ) ) {
			// method 绑定 value 执行
			// 链式调用 done 和 fail
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		// 另外 thenables 对象
		// 检查 value 是否存在 并且 value.then 是否为 function
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			// then 方法传入 resolve, reject 执行
			method.call( value, resolve, reject );

		// Other non-thenables
		// 另外 no thenables 对象
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// 通过 Array#slice 将布尔值 “noValue” 转换成整数来控制 “resolve” 参数
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			// resolve([ value ].slice( noValue )) 看上面
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// 对于 Promises/A+，将异常转换为拒绝
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	// 由于 jQuery.when 没有打开 thenables ，所以我们可以跳过 Deferred#then 中出现的额外检查来有条件地抑制拒绝。
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		// 没有 .call/.apply 方法 GET全局对象上下文调用的严格模式函数
		// reject([ value ])
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	// Deferred
	Deferred: function( func ) {
		// 声明 tuples
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				// 我拿 这个数组举例：
				// [ "resolve", "done        ", jQuery.Callbacks( "once memory" ), jQuery.Callbacks( "once memory" ), 0             , "resolved   " ]
				// [ "action ", "add listener", callbacks                        , .then handlers                   , argument index, [final state] ]
				// [ "操作   ", "添加侦听器    ", 回调                              , .then 处理程序                    , 参数索引        , [  最终状态  ] ]
				// 我是这么理解他这个注释的
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			// 声明 state = "pending"
			state = "pending",
			// 声明 promise 对象
			promise = {
				// state 方法
				state: function() {
					// 返回 state
					return state;
				},
				// always 方法
				always: function() {
					// 再执行一遍 done 方法和 fail 方法
					// 传入 arguments
					// 原来 always 方法是这样写的 有点意思
					deferred.done( arguments ).fail( arguments );
					// 返回 this
					return this;
				},
				// catch 方法
				"catch": function( fn ) {
					// 学过 Promise 的就知道， catch 就是 then 的第二参数的快捷写法
					// 返回 promise.then( null, fn )
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				// 保持背部的管子
				// pipe 方法
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					// 看起来 像是接受参数 fnDone, fnFail, fnProgress
					// 声明 fns 赋值 arguments
					var fns = arguments;

					// 返回 jQuery.Deferred 在调用 promise 执行的方法
					// Deferred 本身就接受一个参数 func
					return jQuery.Deferred( function( newDefer ) {
						// 使用 jQuery.each 去遍历 tuples 返回 i, tuple
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							// Map tuples（进度、完成、失败）到参数（完成、失败、进展）
							// 首先看下 tuple[ 4 ] 是个什么东西
							// tuple[ 4 ] 是 .then handlers （.then 处理程序）
							// .then 处理程序 需要是 function 然后赋值给 fn
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							// tuple[ 1 ] 是 add listener（添加侦听器）
							// 调用 deferred 对应的 侦听器 看上面默认的三个注释
							deferred[ tuple[ 1 ] ]( function() {
								// 声明 returned 为 fn 存在并且 fn(arguments)
								// 此 arguments 为当前作用域内的 arguments
								var returned = fn && fn.apply( this, arguments );
								// 判断 若 returned 存在 并且 returned.promise 是 function
								if ( returned && isFunction( returned.promise ) ) {
									// 执行 returned.promise()
									// 然后链式调用这些
									// 具体在干啥 我没看懂
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									// tuple[ 0 ] action（操作）
									// 这个在干嘛呢 我也不知道
									// 调用 newDefer[ tuple[ 0 ] + "With" ]
									// 传入 this 和 fn ? [ returned ] : arguments
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						// 释放 fns 内存
						fns = null;
					} ).promise();
				},
				// then 方法
				then: function( onFulfilled, onRejected, onProgress ) {
					// 声明 maxDepth = 0
					var maxDepth = 0;
					// 声明 resolve 方法
					function resolve( depth, deferred, handler, special ) {
						// 返回 匿名函数
						return function() {
							// 声明 that 绑定 this
							var that = this,
								// 声明 args 赋值 匿名函数接受 arguments
								args = arguments,
								// 声明 mightThrow 函数
								mightThrow = function() {
									// 初始化 returned, then
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									// 忽略双分辨率尝试
									// 若 depth < maxDepth 直接返回
									if ( depth < maxDepth ) {
										return;
									}

									// 执行 handler(args) 绑定当前 that
									// 返回值赋值给 returned
									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									// 若 returned === deferred.promise()
									// 直接提示类型报错
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									// 只检索 `then` 一次
									// 若 returned 为真 并且
									// returned 为 Object 类型 或者 function 类型 并且
									// returned.then 存在 将 returned.then 赋值给 then
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										// 只检查对象和函数是否可行
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									// 处理返回的可处理的
									// 若 then 是 function
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										// 特殊处理器（通知）等待解析
										// 若 special 为 真
										if ( special ) {
											// 执行 then(
											// 	resolve( maxDepth, deferred, Identity, special ),
											// 	resolve( maxDepth, deferred, Thrower, special )
											// ) 作用域 this 绑定为 returned
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										// 正常处理器（解决方案）也进入进展阶段
										} else {

											// ...and disregard older resolution values
											// 忽略旧的解析值
											// maxDepth 累加
											maxDepth++;

											// 执行 then(
											// 	resolve( maxDepth, deferred, Identity, special ),
											// 	resolve( maxDepth, deferred, Thrower, special ),
											// 	resolve( maxDepth, deferred, Identity,
											// 		deferred.notifyWith )
											// ) 作用域 this 绑定为 returned
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									// 处理所有其他返回值
									} else {

										// Only substitute handlers pass on context
										// 只有替代的处理程序通过上下文
										// and multiple values (non-spec behavior)
										// 和多个值（非规范行为）
										// 若 handler !== Identity
										if ( handler !== Identity ) {
											// that 赋值 undefined
											that = undefined;
											// args 赋值 [ returned ]
											args = [ returned ];
										}

										// Process the value(s)
										// 处理 value(s)
										// Default process is resolve
										// 默认进程正在解析
										// 若 special 存在 special(that, args)
										// 否则 deferred.resolveWith(that, args)
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								// 只有普通处理器（解析）捕获和拒绝异常
								// 声明 process
								// 若 special 为 真 返回 mightThrow 方法
								// 否则重新赋值一个匿名函数
								process = special ?
									mightThrow :
									function() {
										try {
											// 尝试去执行
											mightThrow();
										} catch ( e ) {

											// 若执行过程中出错
											// 比如 if ( returned === deferred.promise() ) {
											// 	throw new TypeError( "Thenable self-resolution" );
											// }
											// 若 jQuery.Deferred.exceptionHook 存在
											// 执行 jQuery.Deferred.exceptionHook( e, process.stackTrace );
											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											// 忽略解析后异常
											// 若 depth + 1 >= maxDepth
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// 只有替代的处理程序通过上下文
												// and multiple values (non-spec behavior)
												// 和多个值（非规范行为）
												// 若 handler !== Thrower
												if ( handler !== Thrower ) {
													// that 赋值 undefined
													that = undefined;
													// args 赋值 [ e ]
													args = [ e ];
												}

												// 执行 deferred.rejectWith( that, args )
												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							// 立即解决承诺，以避免错误拒绝后续错误
							// 若 depth 为真 执行 process
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// 如果有例外，请调用可选的钩子来记录堆栈。
								// since it's otherwise lost when execution goes async
								// 因为当执行异步时它会丢失。
								// 若 jQuery.Deferred.getStackHook 存在
								if ( jQuery.Deferred.getStackHook ) {
									// 执行 jQuery.Deferred.getStackHook
									// 将返回值 赋值给 process.stackTrace
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								// 使用 window.setTimeout 方法延迟 process 执行
								window.setTimeout( process );
							}
						};
					}

					// 返回 jQuery.Deferred方法 并执行 promise() 的那种
					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						// 进程处理程序.添加（…）
						// tuples[ 0 ][ 3 ] = jQuery.Callbacks( "memory" )
						// 所以 jQuery.Callbacks( "memory" ) 到底是干嘛？
						// 传入 resolve( 0, newDefer, isFunction( onProgress ) ? onProgress : Identity, newDefer.notifyWith )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						// 完成处理程序.添加（…）
						// tuples[ 1 ][ 3 ] = jQuery.Callbacks( "once memory" )
						// 传入 resolve( 0, newDefer, isFunction( onFulfilled ) ? onFulfilled : Identit )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						// 拒绝处理程序.添加（…）
						// tuples[ 2 ][ 3 ] = jQuery.Callbacks( "once memory" )
						// 传入 resolve( 0, newDefer, isFunction( onRejected ) ? onRejected : Thrower )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// 得到这个延期的承诺
				// If obj is provided, the promise aspect is added to the object
				// 如果提供 obj，则将允诺方面添加到对象中。
				// promise 方法
				promise: function( obj ) {
					// 返回 若 obj != null 返回 jQuery.extend( obj, promise )
					// 否则返回 promise
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			// 声明 deferred 对象
			deferred = {};

		// Add list-specific methods
		// 添加列表特定方法
		// 使用 jQuery.each 遍历 tuples
		jQuery.each( tuples, function( i, tuple ) {
			// 声明 list 获取 tuple[ 2 ]
			// jQuery.Callbacks( "memory" )
			// jQuery.Callbacks( "once memory" )
			// jQuery.Callbacks( "once memory" )
			var list = tuple[ 2 ],
				// 声明 stateString 获取 tuple[ 5 ]
				// undefined
				// "resolved"
				// "rejected"
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			// 原注释已经枚举
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			// 句柄状态
			// 若 stateString 存在 也就是 返回 "resolved" 或 "rejected"
			if ( stateString ) {
				// 调用 list.add 方法
				list.add(
					// 传入 匿名函数
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						// 赋值 state = stateString
						state = stateString;
					},

					// 这里我想起来 callback 返回的内容是个对象
					// 上面其实也是这样的
					// 下面原注释已经给了对应的注释
					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			// 这里也是
			// 调用 list.add 方法 传入 tuple[ 3 ].fire
			// 同样是执行 callback 函数返回的对象的 fire 属性
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			// 原注释同样枚举了三种情况
			deferred[ tuple[ 0 ] ] = function() {
				// 这里看一看传参
				// 第一参数 若 this === deferred 返回 undefined 否则返回 this
				// 第二参数 arguments
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				// 返回 this
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			// 原注释同样枚举了三种情况
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		// 推迟承诺
		promise.promise( deferred );

		// Call given func if any
		// 若 func 存在 则执行
		if ( func ) {
			// func( deferred )
			func.call( deferred, deferred );
		}

		// All done!
		// 都做完了！
		// 返回 deferred
		return deferred;
	},

	// Deferred helper
	// 延迟助手
	// when
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			// 未完成下属数
			// 声明 remaining 赋值为 arguments 长度 也就是参数长度
			remaining = arguments.length,

			// count of unprocessed arguments
			// 未处理参数计数
			// 声明 i 为 remaining
			i = remaining,

			// subordinate fulfillment data
			// 下属履行数据
			// 声明 resolveContexts 为 i 数量的数组
			resolveContexts = Array( i ),
			// 声明 resolveValues 赋值 Array.prototype.slice(arguments)
			resolveValues = slice.call( arguments ),

			// the master Deferred
			// 声明 master 赋值 执行 jQuery.Deferred() 为 返回
			master = jQuery.Deferred(),

			// subordinate callback factory
			// 下属回调工厂
			// 声明 updateFunc 方法
			updateFunc = function( i ) {
				// 返回 匿名函数
				return function( value ) {
					// resolveContexts[ i ] 存放 当前匿名函数指向 this
					// resolveValues[ i ] 存放 当前匿名函数 arguments 若 arguments 长度 <= 1 则存放 value
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					// 判断 !( --remaining )
					// 若 remaining 还有 则进入判断
					if ( !( --remaining ) ) {
						// 调用 jQuery.Deferred() 返回对象的 resolveWith 方法
						// 传入 resolveContexts, resolveValues
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		// 单参数和空参数采用类似的解决方案。
		// 若 remaining 参数 <= 1
		if ( remaining <= 1 ) {
			// 执行 adoptValue 方法
			// 传入第一参数 singleValue
			// 第二参数 master.done( updateFunc( i ) ).resolve
			// 第三参数 master.reject
			// 第四参数 !remaining
			// master.done( updateFunc( i ) ).resolve 按照上面的理解 其实你可以看成是
			// master.done((value) => { ... }).resolve
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			//使用 .then() 打开第二 thenables
			// 若 master.state() === "pending" 或者 resolveValues[ i ].then 是个 function
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				// 返回 master.then()
				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		// 多个参数像约定一样聚合：所有数组元素
		// 遍历开始
		while ( i-- ) {
			// 执行 adoptValue 方法
			// 有点意思 adoptValue 方法 和上面是在做一样的事情哎
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		// 返回 master.promise()
		return master.promise();
	}
} );

// 返回 jQuery
return jQuery;
} );
