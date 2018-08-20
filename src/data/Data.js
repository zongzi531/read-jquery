define( [
	"../core",
	"../core/camelCase",
	"../var/rnothtmlwhite",
	"./var/acceptData"
], function( jQuery, camelCase, rnothtmlwhite, acceptData ) {

"use strict";
	// require core.js 获得 jQuery
	// require core/camelCase.js 获得 camelCase 方法 是将于将css前缀转换成驼峰形式的
	// require var/rnothtmlwhite.js 获得 正则表达式
	// require ./var/acceptData.js 获得 匿名函数 用于确定对象是否可以具有数据


// 声明 Data 实例化后将 Data.expando = 拷贝每个独特的jQuery在页面上 + uid++
// 比如 jQuery331020932646765095321
// 相当于 "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ) + Data.uid++
// jQuery 331 02093264676509532 1
function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

// 设置默认值 uid = 1
Data.uid = 1;

// 设置 Data 原型
Data.prototype = {

	// cache 方法
	cache: function( owner ) {

		// Check if the owner object already has a cache
		// 检查所有者对象是否已经有缓存
		var value = owner[ this.expando ];

		// If not, create one
		// 如果没有缓存 则创建一个
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			// 在现代浏览器中，我们可以接受非元素节点的数据，但是我们不应该接受。总是返回空对象。
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				// 如果它是一个不可能被细化或循环使用的简单节点的节点
				// 若 owner 是 元素
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				// 否则，在不可枚举属性配置中确保它必须为真，以允许在删除数据时删除该属性。
				} else {
					// 反之使用 Object.defineProperty 设置属性
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		// 返回 缓存 value
		return value;
	},
	// set 方法
	set: function( owner, data, value ) {
		// 初始化 prop
		// 声明 cache 返回当前所有者的缓存
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		// 若传入 data 为 String 类型
		if ( typeof data === "string" ) {
			// 设置 cache 键值
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			// 遍历 data
			// 一个个设置 cache 键值
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		// 返回这个 cache
		return cache;
	},
	// get 方法
	get: function( owner, key ) {
		// 如果 key 为传入 则返回当前所有者的缓存
		// 反之检查当前所有者的缓存是否存在及返回对应的 key 值
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			// 这里始终使用驼峰键值对
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	// access 方法
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		// 在任一情况下：
		// 
		//   1. 未指定密钥
		//   2. 指定了字符串键，但没有提供任何值。
		// 
		// 采用“读取”路径并允许get方法确定
		// 返回的值分别为：
		// 
		//   1. 整个缓存对象
		//   2. 存储在密钥中的数据
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		// 当键不是字符串时，或者键和值都存在
		// 指定、设置或扩展（现有对象）：
		// 
		//   1.属性对象
		//   2.关键与价值
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		// 因为“设置”路径可以有两个可能的入口点
		// 根据所采用的路径返回预期数据[*]
		return value !== undefined ? value : key;
	},
	// remove 方法
	remove: function( owner, key ) {
		// 初始化 i
		// 声明 cache 获得当前所有者的缓存
		var i,
			cache = owner[ this.expando ];

		// 若 cache 不存在 直接返回
		if ( cache === undefined ) {
			return;
		}

		// 若 key 存在
		if ( key !== undefined ) {

			// Support array or space separated string of keys
			// 支持数组或空间分隔的键串
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				// 如果KEY是一个键数组…
				// 我们总是设置驼峰键，所以删除它。
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				// 如果一个 key 在 cache 存在，使用它。
				// 否则，创建一个非空白字符匹配的数组。
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			// 赋值 i 为 key 的长度
			i = key.length;

			// 循环删除对应 key
			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		// 如果没有更多的数据，删除这个 expando （当前所有者的缓存）
		// 若 key 不存在 或者 cache is empty
		// isEmptyObject 这个方法 我似乎还没读到
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			// 若 owner 为 元素
			// 强制赋值为 undefined
			// 为什么不赋值为 null 呢？
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				// 否则使用 delete 操作符
				delete owner[ this.expando ];
			}
		}
	},
	// hasData 方法
	hasData: function( owner ) {
		// 声明 cache 返回当前所有者的缓存
		var cache = owner[ this.expando ];
		// 判断所有者的缓存是否有属性
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};

// 返回 Data
return Data;
} );
