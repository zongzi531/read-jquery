define( [
	"./core",
	"./var/isFunction",
	"./core/init",
	"./manipulation", // clone
	"./traversing" // parent, contents
], function( jQuery, isFunction ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/isFunction.js 获得 isFunction 方法
	// require core/init.js
	// require manipulation.js
	// require traversing.js

// 使用 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// wrapAll 方法
	wrapAll: function( html ) {

		// 初始化 wrap
		var wrap;

		// 判断 this[ 0 ]
		if ( this[ 0 ] ) {

			// 判断 isFunction( html )
			if ( isFunction( html ) ) {

				// html 赋值 html.call( this[ 0 ] )
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			// 包裹目标周围的元素
			// wrap 赋值 jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true )
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			// 判断 this[ 0 ].parentNode
			if ( this[ 0 ].parentNode ) {

				// 执行 wrap.insertBefore( this[ 0 ] )
				wrap.insertBefore( this[ 0 ] );
			}

			// 执行 wrap.map( fn ).append( this )
			wrap.map( function() {

				// 声明 elem 赋值 this
				var elem = this;

				// 遍历 elem.firstElementChild
				while ( elem.firstElementChild ) {

					// elem 赋值 elem.firstElementChild
					elem = elem.firstElementChild;
				}

				// 返回 elem
				return elem;
			} ).append( this );
		}

		// 返回 this
		return this;
	},

	// wrapInner 方法
	wrapInner: function( html ) {

		// 判断 isFunction( html )
		if ( isFunction( html ) ) {

			// 返回 this.each 遍历 当前元素集
			return this.each( function( i ) {

				// jQuery( this ).wrapInner( html.call( this, i ) )
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		// 返回 this.each 遍历 当前元素集
		return this.each( function() {

			// 声明 self 赋值 jQuery( this )
			var self = jQuery( this ),

				// 声明 contents 赋值 self.contents()
				contents = self.contents();

			// 判断 contents.length
			if ( contents.length ) {

				// contents.wrapAll( html )
				contents.wrapAll( html );

			} else {

				// self.append( html )
				self.append( html );
			}
		} );
	},

	// wrap 方法
	wrap: function( html ) {

		// 声明 htmlIsFunction 赋值 isFunction( html )
		var htmlIsFunction = isFunction( html );

		// 返回 this.each 遍历 当前元素集
		return this.each( function( i ) {

			// jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html )
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	// unwrap 方法
	unwrap: function( selector ) {

		// 执行 this.parent( selector ).not( "body" ).each 遍历
		this.parent( selector ).not( "body" ).each( function() {

			// jQuery( this ).replaceWith( this.childNodes )
			jQuery( this ).replaceWith( this.childNodes );
		} );

		// 返回 this
		return this;
	}
} );

// 返回 jQuery
return jQuery;
} );
