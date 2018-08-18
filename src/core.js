/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module

define( [
	"./var/arr",
	"./var/document",
	"./var/getProto",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/fnToString",
	"./var/ObjectFunctionString",
	"./var/support",
	"./var/isFunction",
	"./var/isWindow",
	"./core/DOMEval",
	"./core/toType"
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, isFunction, isWindow, DOMEval, toType ) {

"use strict";

	// require var/arr.js 获得 空 Array 类型
	// require var/document.js 获得 window.document
	// require var/getProto.js 获得 Object.getPrototypeOf 方法
	// require var/slice.js 获得 Array.prototype.slice 方法
	// require var/concat.js 获得 Array.prototype.concat 方法
	// require var/push.js 获得 Array.prototype.push 方法
	// require var/indexOf.js 获得 Array.prototype.indexOf 方法
	// require var/class2type.js 获得 空 Object 类型
	// require var/toString.js 获得 Object.prototype.toString 方法
	// require var/hasOwn.js 获得 Object.prototype.hasOwnProperty 方法
	// require var/fnToString.js 获得 Object.prototype.hasOwnProperty 的 toString 方法
	// require var/ObjectFunctionString.js 获得 Object.prototype.hasOwnProperty.toString.call(Object)
	// require var/support.js 获得 空 Object 类型
	// require var/isFunction.js 获得 isFunction 方法
	// require var/isWindow.js 获得 isWindow 方法
	// require core/DOMEval.js 获得 DOMEval 方法
	// require core/toType.js 获得 toType 方法

	// 声明版本：3.3.1
var
	version = "3.3.1",

	// Define a local copy of jQuery
	// 定义jQuery的本地副本
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		// 返回 实例化的init 方法
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	// 声明一个正则表达式 rtrim
	// 用于jQuery.trim去掉字符串起始和结尾的空格。
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// 定义jQuery 原型，并且将原型连接至 fn 属性
jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	// 当前jQuery 版本
	jquery: version,

	// 构造器为 jQuery
	constructor: jQuery,

	// The default length of a jQuery object is 0
	// jQuery对象的默认长度为0
	// 描述: 在jQuery对象中元素的数量。
	length: 0,

	// toArray 方法
	// 将当前jQuery 浅拷贝到一个新数组对象
	// 返回干净数组中的所有元素
	// Return all the elements in a clean array
	// 描述: 返回一个包含jQuery对象集合中的所有DOM元素的数组。
	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	// 获取匹配元素集合中的第n个元素或将整个匹配元素集合作为一个干净数组
	// 若 num == null 其实与 toArray 方法功能一致
	// 描述: 通过jQuery对象获取一个对应的DOM元素。
	get: function( num ) {

		// Return all the elements in a clean array
		// 若 num == null 返回干净数组中的所有元素
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		// 若 num < 0 则反向取正
		// 但是若 num < this.length 的话，就没辙了
		// 返回 undefined
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	// 使用元素数组并将其推到堆栈上
	//（返回新匹配元素集）
	// 这个方法做什么用，暂时还没理解……
	// 描述: 将一个DOM元素集合加入到jQuery栈。
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		// 建立一个新的jQuery的匹配
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		// 将旧对象添加到堆栈（作为参考）
		ret.prevObject = this;

		// Return the newly-formed element set
		// 返回新型的元素集
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// 为匹配的集合中的每个元素执行回调
	// 描述: 遍历一个jQuery对象，为每个匹配元素执行一个函数。
	each: function( callback ) {
		// 返回 each方法 传入当前元素集和回调函数
		return jQuery.each( this, callback );
	},

	// 描述: 通过一个函数匹配当前集合中的每个元素,产生一个包含新的jQuery对象。
	map: function( callback ) {
		// jQuery.map 传入当前元素集和回调函数
		// 返回出来的新数组再调用 pushStack 方法
		// 将旧的元素集赋值到 ret.prevObject
		// MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
		// fun.call(thisArg, arg1, arg2, ...)
		// thisArg 在fun函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。
		// 所以 callback.call( elem, i, elem ) 第一个 elem 为绑定 function 内作用域
		// 接受参数 i, elem
		// 所以 $('div').map((index, item) => item)
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	// 描述: 根据指定的下标范围，过滤匹配的元素集合，并生成一个新的 jQuery 对象。
	slice: function() {
		// 对 this 当前元素集 执行 Array.prototype.slice()
		// 返回出来的新数组再调用 pushStack 方法
		// 将旧的元素集赋值到 ret.prevObject
		return this.pushStack( slice.apply( this, arguments ) );
	},

	// 描述: 获取匹配元素集合中第一个元素。
	first: function() {
		// 返回 当前元素集第一个元素
		return this.eq( 0 );
	},

	// 描述: 获取匹配元素集合中最后一个元素。
	last: function() {
		// 返回 当前元素集最后一个元素
		return this.eq( -1 );
	},

	// eq 方法
	// 描述: 减少匹配元素的集合为指定的索引的哪一个元素。
	eq: function( i ) {
		// 声明 len 并将 this 当前元素集的长度 进行赋值
		// 声明 j 取 i 值， 利用 +i 将 i 转换为 Number 类型
		// 同样，若 i < 0 则 反向取正
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		// 三元表达式程序安全性校验 保证 j >= 0 && j < len 取 当前元素集对应元素
		// 否则返回 空 数组
		// 返回出来的新数组再调用 pushStack 方法
		// 将旧的元素集赋值到 ret.prevObject
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	// end 方法
	// 描述: 终止在当前链的最新过滤操作，并返回匹配的元素的以前状态。
	end: function() {
		// 返回当前元素集的 prevObject 属性值 或者 构造器
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	// 只供内部使用
  // 行为类似于数组的方法，而不是像jQuery方法那样
  // Array.prototype.push 方法
	push: push,
	// Array.prototype.sort 方法
	sort: arr.sort,
	// Array.prototype.splice 方法
	splice: arr.splice
};

// jQuery.extend
// 描述: 将两个或更多对象的内容合并到第一个对象。
//
// jQuery.fn.extend
// 描述: 一个对象的内容合并到jQuery的原型，以提供新的jQuery实例方法。
jQuery.extend = jQuery.fn.extend = function() {
	// 初始化 options, name, src, copy, copyIsArray, clone,
	// 声明 target 为 arguments[ 0 ]，若不存在则为 空 对象
	// 声明 i = 1
	// 声明 length = 参数长度
	// 声明 deep = false
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	// 处理深度拷贝的情况
	// 若 arguments[ 0 ] 为布尔值
	if ( typeof target === "boolean" ) {
		// deep 赋值 target
		deep = target;

		// Skip the boolean and the target
		// 跳过布尔值和 target
		// target 重新赋值 arguments[ 1 ]，若不存在则为 空 对象
		// i++
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	// 当目标是字符串或某物时处理（可能在深拷贝中）
	// 若 arguments[ 1 ] 不为 "object" 类型并且不是 function 的话
	// target = {}
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	// 如果仅传递一个参数，则扩展jQuery本身
	// i 值没有改变的情况下就是 1
	if ( i === length ) {
		// target = jQuery 本身
		target = this;
		// i 值在之后为 0
		// 用于后续遍历
		i--;
	}

	// 遍历 arguments
	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		// 只处理非空/未定义值
		// options = arguments[ i ]
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			// 扩展基本对象
			// 使用 in 操作符遍历 options 对象
			for ( name in options ) {
				// src 为目标 target[ name ] 对应的值
				// copy 为拷贝 options[ name ] 对应的值
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				// 防止不停循环
				// 若 target 为 copy 的一个子集，则continue
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				// 如果我们合并平原对象或数组
				// 进入深拷贝
				// 若 deep 为 true，copy 存在，copy 是一个纯粹的对象或者 copy是一个数组
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					// 如果 copyIsArray 为 true
					if ( copyIsArray ) {
						// 重置 copyIsArray 为 false
						copyIsArray = false;
						// 判断 src 是否存在，src 是否为数组
						// 若满足以上则返回 src，否则返回 空 数组
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						// copyIsArray 为 false 的情况
						// 判断 src 是否存在，src 是否为纯粹的对象
						// 若满足以上则返回 src，否则返回 空 对象
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					// 从不移动原始对象，克隆它们
					// 这里其实并没有直接拷贝对象
					// 也就是说，重新调用 extend 方法
					// 若 target[ name ] 也就是 src 本身就不存在的话
					// 会基于 copy 的类型去创建空的 同类型，然后重新调用 extend 方法
					// 若 src 存在的话，则也是一个道理
					// 这里有个前提 这是深拷贝
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				// 不要引入未定义的值
				// 只要 copy !== undefined，直接进行浅拷贝
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	// 返回修改后的对象
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	// 拷贝每个独特的jQuery在页面上
	// 只保留数字
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	// 假设没有准备好的模块，jQuery已经就绪
	isReady: true,

	// 描述: 接受一个字符串，并抛出包含这个字符串的异常。
	error: function( msg ) {
		throw new Error( msg );
	},

	// 描述: 一个空函数
	noop: function() {},

	// 描述: 测试对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）
	isPlainObject: function( obj ) {
		// 初始化proto, Ctor
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		// 判断 obj 不存在或者 Object.prototype.toString 不等于 "[object Object]" 直接返回 false
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		// 获得 obj 对象的原型
		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		// 没有原型的对象（例如，Object.create( null )）是普通的
		// 若原型不存在 则返回 true
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		// 原型对象是纯IFF，它们是由全局对象函数构造的
		// 获取构造器
		// 使用 Object.prototype.hasOwnProperty 获取 obj 对象的原型 上是否包含 constructor 属性
		// 若包含则返回该构造器，否则返回 false
		// 对构造器进行类型校验 必须是 "function" 类型 并且判断 Object.prototype.hasOwnProperty.toString.call(Ctor),
		// 是否与Object.prototype.hasOwnProperty.toString.call(Object)相等
		// 若满足以上条件则返回 true，否则返回 falce
		// fnToString.call( Ctor ) === ObjectFunctionString 这段代码在我看来，就是判断 obj 是不是一个纯粹的对象
		// 所以，源代码注释 Objects with prototype are plain iff they were constructed by a global Object function 这段话很好的解释了这一点
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	// 描述: 检查对象是否为空（不包含任何属性）。
	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		// 声明 name
		var name;

		// 若有属性则返回 false
		for ( name in obj ) {
			return false;
		}
		// 没有属性 返回 true
		return true;
	},

	// Evaluates a script in a global context
	// 描述: 在全局上下文下执行一些JavaScript代码。
	globalEval: function( code ) {
		// 执行JavaScript代码
		DOMEval( code );
	},

	// each 方法
	// 描述: 一个通用的迭代函数，它可以用来无缝迭代对象和数组。数组和类似数组的对象通过一个长度属性（如一个函数的参数对象）来迭代数字索引，从0到length - 1。其他对象通过其属性名进行迭代。
	each: function( obj, callback ) {
		// 初始化 length 和 i = 0
		var length, i = 0;

		// 判断 obj 是否为一个类似数组的对象
		if ( isArrayLike( obj ) ) {
			// 赋值 obj.length
			length = obj.length;
			// 遍历 length
			for ( ; i < length; i++ ) {
				// callback 接受两个参数 i, obj[ i ]
				// 若有一次 callback 返回 false 则 break 退出此次遍历
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			// 认为 obj 为对象，使用 in 操作符进行遍历
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		// 返回 obj
		return obj;
	},

	// Support: Android <=4.0 only
	// 描述: 去掉字符串起始和结尾的空格。
	trim: function( text ) {
		// 若 text == null 则返回 空 String 类型
		// 反之，text + "" 将 text 转为 String 类型 使用 String.prototype.replace() 去将一些 满足正则表达式的字符串替换为空字符串
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	// 描述: 转换一个类似数组的对象成为真正的JavaScript数组。
	makeArray: function( arr, results ) {
		// 初始化 ret 若参数 results 不存在则初始化为 空数组
		var ret = results || [];

		// 判断 arr != null
		if ( arr != null ) {
			// 不是很看得懂 为什么要 Object( arr )
			// 判断 arr 是否为 数组对象
			// 满足的话调用jQuery.merge
			// 第二参数判断，若 arr 为 "string" 类型
			// 则返回 [ arr ]
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				// 否则直接使用ret.push(arr)
				push.call( ret, arr );
			}
		}

		return ret;
	},

	// 描述: 在数组中查找指定值并返回它的索引（如果没有找到，则返回-1）。
	inArray: function( elem, arr, i ) {
		// 若 arr == null 返回 -1
		// 否则调用 Array.prototype.indexOf 方法
		// arr.indexOf(elem, i)
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	// 描述: 合并两个数组内容到第一个数组。
	// 合并方法
	// 功能等同于ES 6的 [...first, ...second]
	merge: function( first, second ) {
		// 声明 len 获取 second 的长度，这个 + 号有点意思，利用JS的特性对 second.length 隐式转换成 Number 类型
		// 初始化 j = 0
		// 声明 i 为 first 的长度
		var len = +second.length,
			j = 0,
			i = first.length;

		// 循环 second 的长度
		// 并将 second对应索引的值赋值至 first 的尾部
		// 这里的 i++ 也可以写成 i+j，我觉得也是没问题的
		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		// 最后将长度赋值给 length 属性
		first.length = i;

		// 返回 first
		return first;
	},

	// 描述: 查找满足过滤函数的数组元素。原始数组不受影响。
	grep: function( elems, callback, invert ) {
		// 初始化 callbackInverse
		// 声明 matches 为 空数组
		// 声明 i = 0
		// 声明 length 为 元素集长度
		// 声明 callbackExpect 为 invert 参数 取反
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		// 通过数组，只保存项目
		// 通过验证程序功能
		// 遍历元素集
		for ( ; i < length; i++ ) {
			// callbackInverse = 回调返回取反
			callbackInverse = !callback( elems[ i ], i );
			// 若 callbackInverse !== callbackExpect
			// 匹配数组 push 该元素
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		// 返回匹配数组
		return matches;
	},

	// arg is for internal usage only
	// arg 仅用于内部使用。
	// 描述: 将一个数组中的所有元素转换到另一个数组中。
	map: function( elems, callback, arg ) {
		// 初始化 length, value, i = 0, ret = []
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		// 遍历数组，将每个项转换为新值
		// 判断 elems 是否为一个类似数组的对象
		if ( isArrayLike( elems ) ) {
			// 获取 elems 的长度
			length = elems.length;
			// 遍历 elems
			for ( ; i < length; i++ ) {
				// 将 elems[ i ], i, arg 传入回调函数，并执行返回赋值至 value
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					// 只要 value != null，将 value 添加至 ret
					ret.push( value );
				}
			}

		// Go through every key on the object,
		// 检查对象上的每个键
		} else {
			// 认为 elems 为对象，使用 in 操作符进行遍历
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		// 返回一个新的数组 ret
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	// 对象的全局GUID计数器
	// 干什么用的不知道……
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	// jQuery.support 在核心中不使用，但其他项目将它们的属性附加到它，因此它需要存在。
	// 这里是个空对象 也不知道干什么用的……
	support: support
} );

// 判断是否存在 Symbol 数据类型
if ( typeof Symbol === "function" ) {
	// 若存在，则将数组的迭代器方法拷贝至 jQuery.fn
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
// 终于找到了给 class2type 赋值的位置了
// 遍历这个String 并且进行赋值。
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

// isArrayLike 方法
function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	// 声明 length 首先判断 !!obj 为真，并且含有 length 属性，返回 obj.length 长度，否则返回 false
	// 声明type 调用 toType方法
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	// 判断 obj 是否为 function 或者 window，若是则返回 false
	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	// 若 type === "array" 返回 true
	// 若 length === 0 返回 true
	// 若 typeof length === "number" 并且 length > 0 并且 ( length - 1 ) in obj 返回 true
	// 上一条判断条件是判断当 length > 0 的情况，并且 -1 后 in 操作符还是能返回 true 的情况
	// 否则返回 false
	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

// 返回 jQuery
return jQuery;
} );
