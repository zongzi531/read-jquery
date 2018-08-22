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
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
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
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

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
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );

// 返回 jQuery
return jQuery;
} );
