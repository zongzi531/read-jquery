define( [
	"../core",
	"../core/stripAndCollapse",
	"../var/isFunction",
	"../var/rnothtmlwhite",
	"../data/var/dataPriv",
	"../core/init"
], function( jQuery, stripAndCollapse, isFunction, rnothtmlwhite, dataPriv ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/stripAndCollapse.js 获得 stripAndCollapse 方法
	// require var/isFunction.js 获得 isFunction 方法
	// require var/rnothtmlwhite.js 获得 正则表达式
	// require data/var/dataPriv.js 获得 Data 的实例
	// require core/init.js


// 声明 getClass 方法
function getClass( elem ) {

	// 返回 elem.getAttribute 并且 elem.getAttribute( "class" ) 或者 ""
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

// 声明 classesToArray 方法
function classesToArray( value ) {

	// 判断 Array.isArray( value )
	if ( Array.isArray( value ) ) {

		// 返回 value
		return value;
	}

	// 判断 typeof value === "string"
	if ( typeof value === "string" ) {

		// 返回 value.match( rnothtmlwhite ) 或者 []
		return value.match( rnothtmlwhite ) || [];
	}

	// 返回 []
	return [];
}

// 调用 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// addClass 方法
	addClass: function( value ) {

		// 初始化 classes, elem, cur, curValue, clazz, j, finalValue
		var classes, elem, cur, curValue, clazz, j, finalValue,

			// 声明 i 赋值 0
			i = 0;

		// 判断 isFunction( value )
		if ( isFunction( value ) ) {

			// 返回 this.each 方法 遍历 当前 元素集
			return this.each( function( j ) {

				// 执行 jQuery( this ).addClass( value.call( this, j, getClass( this ) ) )
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		// classes 赋值 classesToArray( value )
		classes = classesToArray( value );

		// 判断 classes.length
		if ( classes.length ) {

			// 遍历 ( elem 赋值 this[ i++ ] )
			while ( ( elem = this[ i++ ] ) ) {

				// curValue 赋值 getClass( elem )
				curValue = getClass( elem );

				// cur 赋值 elem.nodeType === 1 并且 ( " " + stripAndCollapse( curValue ) + " " )
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				// 判断 cur
				if ( cur ) {

					// j 赋值 0
					j = 0;

					// 遍历 ( clazz 赋值 classes[ j++ ] )
					while ( ( clazz = classes[ j++ ] ) ) {

						// 判断 cur.indexOf( " " + clazz + " " ) < 0
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {

							// cur 赋值 cur + clazz + " "
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					// 只分配不同的，以避免不必要的渲染。
					// finalValue 赋值 stripAndCollapse( cur )
					finalValue = stripAndCollapse( cur );

					// 判断 curValue !== finalValue
					if ( curValue !== finalValue ) {

						// 执行 elem.setAttribute( "class", finalValue )
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		// 返回 this
		return this;
	},

	// removeClass 方法
	removeClass: function( value ) {

		// 初始化 classes, elem, cur, curValue, clazz, j, finalValue
		var classes, elem, cur, curValue, clazz, j, finalValue,

			// 声明 i 赋值 0
			i = 0;

		// 判断 isFunction( value )
		if ( isFunction( value ) ) {

			// 返回 this.each 方法 遍历当前元素集
			return this.each( function( j ) {

				// 执行 jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) )
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		// 判断 !arguments.length
		if ( !arguments.length ) {

			// 返回 this.attr( "class", "" )
			return this.attr( "class", "" );
		}

		// classes 赋值 classesToArray( value )
		classes = classesToArray( value );

		// 判断 classes.length
		if ( classes.length ) {

			// 遍历 ( elem 赋值 this[ i++ ] )
			while ( ( elem = this[ i++ ] ) ) {

				// curValue 赋值 getClass( elem )
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				// 这个表达式是为了更好的可压缩性（见 addClass ）
				// cur 赋值 elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " )
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				// 判断 cur
				if ( cur ) {

					// j 赋值 0
					j = 0;

					// 遍历 ( clazz 赋值 classes[ j++ ] )
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						// 移除*所有*实例
						// 遍历 cur.indexOf( " " + clazz + " " ) > -1
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {

							// cur 赋值 cur.replace( " " + clazz + " ", " " )
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					// 只分配不同的，以避免不必要的渲染。
					// finalValue 赋值 stripAndCollapse( cur )
					finalValue = stripAndCollapse( cur );

					// 判断 curValue !== finalValue
					if ( curValue !== finalValue ) {

						// 执行 elem.setAttribute( "class", finalValue )
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		// 返回 this
		return this;
	},

	// toggleClass 方法
	toggleClass: function( value, stateVal ) {

		// 声明 type 赋值 typeof value
		var type = typeof value,

			// 声明 isValidValue 赋值 type === "string" 或者 Array.isArray( value )
			isValidValue = type === "string" || Array.isArray( value );

		// 判断 typeof stateVal === "boolean" 并且 isValidValue
		if ( typeof stateVal === "boolean" && isValidValue ) {

			// 返回 stateVal ? this.addClass( value ) : this.removeClass( value )
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		// 判断 isFunction( value )
		if ( isFunction( value ) ) {

			// 返回 this.each 方法 遍历 当前元素集
			return this.each( function( i ) {

				// 执行 jQuery( this ).toggleClass( value.call( this, i, getClass( this ), stateVal ), stateVal )
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		// 返回 this.each 方法 遍历 当前元素集
		return this.each( function() {

			// 初始化 className, i, self, classNames
			var className, i, self, classNames;

			// 判断 isValidValue
			if ( isValidValue ) {

				// Toggle individual class names
				// 切换单个类名
				// i 赋值 0
				i = 0;

				// self 赋值 jQuery( this )
				self = jQuery( this );

				// classNames 赋值 classesToArray( value )
				classNames = classesToArray( value );

				// 遍历 ( className 赋值 classNames[ i++ ] )
				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					// 检查给定的每个类名，空间分隔列表
					// 判断 self.hasClass( className )
					if ( self.hasClass( className ) ) {

						// 执行 self.removeClass( className )
						self.removeClass( className );
					} else {

						// 执行 self.addClass( className )
						self.addClass( className );
					}
				}

			// Toggle whole class name
			// 切换整个类名
			// 判断 value === undefined 或者 type === "boolean"
			} else if ( value === undefined || type === "boolean" ) {

				// className 赋值 getClass( this )
				className = getClass( this );

				// 判断 className
				if ( className ) {

					// Store className if set
					// 执行 dataPriv.set( this, "__className__", className )
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// 如果元素有一个类名，或者如果我们被传递“false”，那么删除整个类名（如果有的话，上面保存了它）。
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				// 否则，返回以前保存的任何东西（如果有的话），如果没有存储，则返回到空字符串。
				// 判断 this.setAttribute
				if ( this.setAttribute ) {

					// 执行 this.setAttribute( "class", className 或者 value === false ? "" : dataPriv.get( this, "__className__" ) 或者 "" )
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	// hasClass 方法
	hasClass: function( selector ) {

		// 初始化 className, elem
		var className, elem,

			// 声明 i 赋值 0
			i = 0;

		// className 赋值 " " + selector + " "
		className = " " + selector + " ";

		// 遍历 ( elem 赋值 this[ i++ ] )
		while ( ( elem = this[ i++ ] ) ) {

			// 判断 elem.nodeType === 1 并且 ( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {

					// 返回 true
					return true;
			}
		}

		// 返回 false
		return false;
	}
} );

} );
