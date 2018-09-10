define( [
	"../core",
	"../data/var/dataPriv",
	"../css/var/isHiddenWithinTree"
], function( jQuery, dataPriv, isHiddenWithinTree ) {

"use strict";
	// require core.js 获得 jQuery
	// require data/var/dataPriv.js 获得 Data 的实例
	// require css/var/isHiddenWithinTree.js 获得 isHiddenWithinTree 函数

// 声明 defaultDisplayMap 赋值 空对象
var defaultDisplayMap = {};

// 声明 getDefaultDisplay 函数
function getDefaultDisplay( elem ) {
	// 初始化 temp
	var temp,
		// 声明 doc 赋值 elem.ownerDocument
		doc = elem.ownerDocument,
		// 声明 nodeName 赋值 elem.nodeName
		nodeName = elem.nodeName,
		// 声明 display 赋值 defaultDisplayMap[ nodeName ]
		display = defaultDisplayMap[ nodeName ];

	// 判断 display
	if ( display ) {
		// 返回 display
		return display;
	}

	// temp 赋值 doc.body.appendChild( doc.createElement( nodeName ) )
	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	// display 赋值 jQuery.css( temp, "display" )
	display = jQuery.css( temp, "display" );

	// 执行 temp.parentNode.removeChild( temp )
	temp.parentNode.removeChild( temp );

	// 判断 display === "none"
	if ( display === "none" ) {
		// display 赋值 "block"
		display = "block";
	}
	// defaultDisplayMap[ nodeName ] 赋值 display
	defaultDisplayMap[ nodeName ] = display;

	// 返回 display
	return display;
}

// 声明 showHide 函数
function showHide( elements, show ) {
	// 初始化 display, elem
	var display, elem,
		// 声明 values 赋值 []
		values = [],
		// 声明 index 赋值 0
		index = 0,
		// 声明 length 赋值 elements.length
		length = elements.length;

	// Determine new display value for elements that need to change
	// 为需要更改的元素确定新的显示值
	// 遍历 length
	for ( ; index < length; index++ ) {
		// elem 赋值 elements[ index ]
		elem = elements[ index ];
		// 判断 !elem.style
		if ( !elem.style ) {
			// 跳过当次循环
			continue;
		}

		// display 赋值 elem.style.display
		display = elem.style.display;
		// 判断 show
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			// 由于我们强制级联隐藏元素可见，所以在第一个循环中需要立即（且慢）检查，除非我们有非空显示值（内联或即将恢复）
			// 判断 display === "none"
			if ( display === "none" ) {
				// values[ index ] 赋值 dataPriv.get( elem, "display" ) 或者 null
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				// 判断 !values[ index ]
				if ( !values[ index ] ) {
					// elem.style.display 赋值 ""
					elem.style.display = "";
				}
			}
			// 判断 elem.style.display === "" 并且 isHiddenWithinTree( elem )
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				// values[ index ] 赋值 getDefaultDisplay( elem )
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			// 判断 display !== "none"
			if ( display !== "none" ) {
				// values[ index ] 赋值 "none"
				values[ index ] = "none";

				// Remember what we're overwriting
				// 记住我们在写什么
				// 执行 dataPriv.set( elem, "display", display )
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	// 设置元素在第二个循环中的显示以避免恒定回流
	// 遍历 length
	for ( index = 0; index < length; index++ ) {
		// 判断 values[ index ] != null
		if ( values[ index ] != null ) {
			// elements[ index ].style.display 赋值 values[ index ]
			elements[ index ].style.display = values[ index ];
		}
	}

	// 返回 elements
	return elements;
}

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {
	// show 方法
	show: function() {
		// 返回 showHide( this, true )
		return showHide( this, true );
	},
	// hide 方法
	hide: function() {
		// 返回 showHide( this )
		return showHide( this );
	},
	// toggle 方法
	toggle: function( state ) {
		// 判断 typeof state === "boolean"
		if ( typeof state === "boolean" ) {
			// 返回 state ? this.show() : this.hide()
			return state ? this.show() : this.hide();
		}

		// 返回 this.each 方法 遍历当前元素集
		return this.each( function() {
			// 判断 isHiddenWithinTree( this )
			if ( isHiddenWithinTree( this ) ) {
				// 执行 jQuery( this ).show()
				jQuery( this ).show();
			} else {
				// 执行 jQuery( this ).hide()
				jQuery( this ).hide();
			}
		} );
	}
} );

// 返回 showHide 函数
return showHide;
} );
