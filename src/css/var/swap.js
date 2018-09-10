define( function() {

"use strict";

// A method for quickly swapping in/out CSS properties to get correct calculations.
// 一种快速交换入/出CSS属性以获得正确计算的方法。
// 返回 匿名函数
return function( elem, options, callback, args ) {
	// 初始化 ret, name
	var ret, name,
		// 声明 old 赋值 空对象
		old = {};

	// Remember the old values, and insert the new ones
	// 记住旧的值，插入新的值
	// 遍历 options
	for ( name in options ) {
		// old[ name ] 赋值 elem.style[ name ]
		old[ name ] = elem.style[ name ];
		// elem.style[ name ] 赋值 options[ name ]
		elem.style[ name ] = options[ name ];
	}

	// ret 赋值 callback.apply( elem, args 或者 [] )
	ret = callback.apply( elem, args || [] );

	// Revert the old values
	// 还原旧值
	// 遍历 options
	for ( name in options ) {
		// elem.style[ name ] 赋值 old[ name ]
		elem.style[ name ] = old[ name ];
	}

	// 返回 ret
	return ret;
};

} );
