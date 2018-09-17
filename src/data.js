define( [
	"./core",
	"./core/access",
	"./core/camelCase",
	"./data/var/dataPriv",
	"./data/var/dataUser"
], function( jQuery, access, camelCase, dataPriv, dataUser ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/access.js 获得 access 方法
	// require core/camelCase.js 获得 camelCase 方法
	// require data/var/dataPriv.js 获得 Data 的实例
	// require data/var/dataUser.js 获得 Data 的实例

//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
// 实施总结
// 1. 用 1.9.x 分支实现API表面和语义兼容性
// 2. 通过减少单个机构的存储路径来提高模块的可维护性。
// 3. 使用相同的单一机制来支持“私有”和“用户”数据。
// 4. 从不将“私有”数据暴露给用户代码 (TODO: Drop _data, _removeData)
// 5. 避免在用户对象（如 expando 属性）上公开实现细节
// 6. 为2014实现弱映射提供清晰的路径

// 声明 rbrace 赋值 /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,

	// 声明 rmultiDash 赋值 /[A-Z]/g
	rmultiDash = /[A-Z]/g;

// 声明 getData 函数
function getData( data ) {

	// 判断 data === "true"
	if ( data === "true" ) {
		return true;
	}

	// 判断 data === "false"
	if ( data === "false" ) {
		return false;
	}

	// 判断 data === "null"
	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	// 只在不更改字符串的情况下转换为数字
	// 判断 data === +data + ""
	if ( data === +data + "" ) {
		return +data;
	}

	// 判断 rbrace.test( data )
	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	// 返回 data
	return data;
}

// 声明 dataAttr 函数
function dataAttr( elem, key, data ) {

	// 初始化 name
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	// 如果内部没有发现任何数据，请尝试从HTML5数据 -* 属性获取任何数据。
	// 判断 data === undefined 并且 elem.nodeType === 1
	if ( data === undefined && elem.nodeType === 1 ) {

		// name 赋值 "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase()
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();

		// data 赋值 elem.getAttribute( name )
		data = elem.getAttribute( name );

		// 判断 typeof data === "string"
		if ( typeof data === "string" ) {
			try {

				// data 赋值 getData( data )
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			// 确保我们设置数据，这样以后不会改变。
			// 执行 dataUser.set( elem, key, data )
			dataUser.set( elem, key, data );
		} else {

			// data 赋值 undefined
			data = undefined;
		}
	}

	// 返回 data
	return data;
}

// 使用 jQuery.extend 方法
jQuery.extend( {

	// hasData 方法
	hasData: function( elem ) {

		// 返回 dataUser.hasData( elem ) 或者 dataPriv.hasData( elem )
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	// data 方法
	data: function( elem, name, data ) {

		// 返回 dataUser.access( elem, name, data )
		return dataUser.access( elem, name, data );
	},

	// removeData 方法
	removeData: function( elem, name ) {

		// 执行 dataUser.remove( elem, name )
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	// TODO：现在对所有数据的调用都被直接调用到 dataPriv 方法，这些数据可以被弃用。
	// _data 方法
	_data: function( elem, name, data ) {

		// 返回 dataPriv.access( elem, name, data )
		return dataPriv.access( elem, name, data );
	},

	// _removeData 方法
	_removeData: function( elem, name ) {

		// 执行 dataPriv.remove( elem, name )
		dataPriv.remove( elem, name );
	}
} );

// 使用 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// data 方法
	data: function( key, value ) {

		// 初始化 i, name, data
		var i, name, data,

			// 声明 elem 赋值 this[ 0 ]
			elem = this[ 0 ],

			// 声明 attrs 赋值 elem 并且 elem.attributes
			attrs = elem && elem.attributes;

		// Gets all values
		// 获取所有值
		// 判断 key === undefined
		if ( key === undefined ) {

			// 判断 this.length
			if ( this.length ) {

				// data 赋值 dataUser.get( elem )
				data = dataUser.get( elem );

				// 判断 elem.nodeType === 1 并且 !dataPriv.get(elem, "hasDataAttrs")
				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {

					// i 赋值 attrs.length
					i = attrs.length;

					// 遍历 i
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						// attrs 元素可以为空。
						// 判断 attrs[ i ]
						if ( attrs[ i ] ) {

							// name 赋值 attrs[ i ].name
							name = attrs[ i ].name;

							// 判断 name.indexOf( "data-" ) === 0
							if ( name.indexOf( "data-" ) === 0 ) {

								// name 赋值 camelCase( name.slice( 5 ) )
								name = camelCase( name.slice( 5 ) );

								// 执行 dataAttr( elem, name, data[ name ] )
								dataAttr( elem, name, data[ name ] );
							}
						}
					}

					// 执行 dataPriv.set( elem, "hasDataAttrs", true )
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			// 返回 data
			return data;
		}

		// Sets multiple values
		// 设置多值
		// 判断 typeof key === "object"
		if ( typeof key === "object" ) {

			// 返回 this.each 方法 遍历 当前元素集
			return this.each( function() {

				// 执行 dataUser.set( this, key )
				dataUser.set( this, key );
			} );
		}

		// 返回 access( this, fn, null, value, arguments.length > 1, null, true )
		return access( this, function( value ) {

			// 初始化 data
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			// 调用jQuery对象（元素匹配）不是空的（因此在这个[0]处出现一个元素），并且没有定义“value”参数。空的jQuery对象将导致elem = this[0]的`.fined'，如果尝试读取数据缓存，将引发异常。
			// 判断 elem && value === undefined
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				// 尝试从缓存中获取数据
				// 密钥总是以数据为中心的。
				// data 赋值 dataUser.get( elem, key )
				data = dataUser.get( elem, key );

				// 判断 data !== undefined
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				// 尝试“发现”HTML5自定义数据 * 触发器中的数据
				// data 赋值 dataAttr( elem, key )
				data = dataAttr( elem, key );

				// 判断 data !== undefined
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				// 我们确实很努力，但数据并不存在。
				return;
			}

			// Set the data...
			// 设置数据…
			// 使用 this.each 方法
			this.each( function() {

				// We always store the camelCased key
				// 我们总是储存着骆驼钥匙。
				// 执行 dataUser.set( this, key, value )
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	// removeData 方法
	removeData: function( key ) {

		// 返回 this.each 方法结果
		return this.each( function() {

			// 执行 dataUser.remove( this, key )
			dataUser.remove( this, key );
		} );
	}
} );

// 返回 jQuery
return jQuery;
} );
