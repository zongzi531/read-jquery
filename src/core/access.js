define( [
	"../core",
	"../core/toType",
	"../var/isFunction"
], function( jQuery, toType, isFunction ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/toType.js 获得 toType 方法
	// require var/isFunction.js 获得 isFunction 方法

// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
// 获取和设置集合值的多功能方法
// 如果它是一个函数，则可以选择执行 value/s
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {

	// 声明 i = 0
	// 声明 len 赋值 元素集长度
	// 声明 bulk 赋值 key == null 返回的真假值
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	// 设置多个 values
	// 校验 key 类型，若 key 为 Object 类型
	if ( toType( key ) === "object" ) {

		// 标记 chainable 为 true
		chainable = true;

		// 使用 in 操作符遍历 key
		for ( i in key ) {

			// 进行递归
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	// 设置单个 value
	// value !== undefined
	} else if ( value !== undefined ) {

		// 标记 chainable 为 true
		chainable = true;

		// 若 value 不是 function
		if ( !isFunction( value ) ) {

			// 标记 raw 为 true
			raw = true;
		}

		// 若 bulk 为 真进入判断
		// key == null 返回的真假值
		if ( bulk ) {

			// Bulk operations run against the entire set
			// 批量操作对整个集合运行
			// 若 raw 为 真
			if ( raw ) {

				// 传递至 fn 参数 fn( value )
				fn.call( elems, value );

				// 手动释放 fn 内存
				fn = null;

			// ...except when executing function values
			// ...除非执行函数值
			} else {

				// 若 raw 为 假
				// 将 fn 赋值至 bulk
				bulk = fn;

				// 重新赋值 fn
				// 其实就是 fn( value )
				// 在外面套了一个壳，但是为什么要这么做呢？
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		// 若 fn 存在
		if ( fn ) {

			// 遍历元素集
			for ( ; i < len; i++ ) {

				// 执行 fn
				// 传入第三参数进行了三元表达式判断
				// 这和上面的 批量操作对整个集合运行 有共通的地方吧
				// value( i, fn( elems[ i ], key ) )
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	// 若 chainable 为 true
	if ( chainable ) {

		// 返回 元素集
		return elems;
	}

	// Gets
	// 若 bulk 为 真
	if ( bulk ) {

		// 返回 fn()
		return fn.call( elems );
	}

	// 返回 若 len 为真 fn( elems[ 0 ], key ) 否则 返回 emptyGet
	return len ? fn( elems[ 0 ], key ) : emptyGet;
};

// 返回 access 方法
return access;

} );
