define( [
	"./core",
	"./var/pnum",
	"./core/access",
	"./core/camelCase",
	"./var/document",
	"./var/rcssNum",
	"./css/var/rnumnonpx",
	"./css/var/cssExpand",
	"./css/var/getStyles",
	"./css/var/swap",
	"./css/curCSS",
	"./css/adjustCSS",
	"./css/addGetHookIf",
	"./css/support",

	"./core/init",
	"./core/ready",
	"./selector" // contains
], function( jQuery, pnum, access, camelCase, document, rcssNum, rnumnonpx, cssExpand,
	getStyles, swap, curCSS, adjustCSS, addGetHookIf, support ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/pnum.js 获得 正则表达式对象的模式文本的字符串
	// require core/access.js 获得 access 方法
	// require core/camelCase.js 获得 camelCase 方法
	// require var/document.js 获得 window.document
	// require var/rcssNum.js 获得 正则表达式
	// require css/var/rnumnonpx.js 获得 正则表达式
	// require css/var/cssExpand.js 获得 [ "Top", "Right", "Bottom", "Left" ] 数组
	// require css/var/getStyles.js 获得 getStyles 方法
	// require css/var/swap.js 获得 swap 方法
	// require css/curCSS.js 获得 curCSS 函数
	// require css/adjustCSS.js 获得 adjustCSS 方法
	// require css/addGetHookIf.js 获得 addGetHookIf 函数
	// require css/support.js 获得 support 对象
	// require core/init.js
	// require core/ready.js
	// require selector.js

var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// 如果“表”、“表单元格”或“表标题”显示为“无”或“表”，则可交换。
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	// 声明 rdisplayswap 赋值 正则表达式
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	// 声明 rcustomProp 赋值 正则表达式
	rcustomProp = /^--/,

	// 声明 cssShow 赋值 { position: "absolute", visibility: "hidden", display: "block" }
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// 声明 cssNormalTransform 赋值 { letterSpacing: "0", fontWeight: "400" }
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	// 声明 cssPrefixes 赋值 [ "Webkit", "Moz", "ms" ]
	cssPrefixes = [ "Webkit", "Moz", "ms" ],

	// 声明 emptyStyle 赋值 document.createElement( "div" ).style
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
// 返回映射到潜在供应商前缀属性的CSS属性
// 声明 vendorPropName 函数
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	// 不是厂商前缀的名称的快捷方式
	// 遍历 emptyStyle
	if ( name in emptyStyle ) {

		// 返回 name
		return name;
	}

	// Check for vendor prefixed names
	// 检查供应商前缀名称
	// 声明 capName 赋值 name[ 0 ].toUpperCase() + name.slice( 1 )
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),

		// 声明 i 赋值 cssPrefixes.length
		i = cssPrefixes.length;

	// 遍历 i
	while ( i-- ) {

		// name 赋值 cssPrefixes[ i ] + capName
		name = cssPrefixes[ i ] + capName;

		// 遍历 emptyStyle
		if ( name in emptyStyle ) {

			// 返回 name
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
// 返回沿 jQuery.cssProps 建议的属性或供应商前缀属性。
// 声明 finalPropName 函数
function finalPropName( name ) {

	// 声明 ret 赋值 jQuery.cssProps[ name ]
	var ret = jQuery.cssProps[ name ];

	// 判断 !ret
	if ( !ret ) {

		// ret 和 jQuery.cssProps[ name ] 赋值 vendorPropName( name ) 或者 name
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}

	// 返回 ret
	return ret;
}

// 声明 setPositiveNumber 函数
function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	// 在这个点上，任何相对值（+/-）已经被标准化了。
	// 初始化 matches 赋值 rcssNum.exec( value )
	var matches = rcssNum.exec( value );

	// 返回 matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		// 防止未定义的“减法”，例如，在 cssHooks 中使用时
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

// 声明 boxModelAdjustment 函数
function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {

	// 声明 i 赋值 dimension === "width" ? 1 : 0
	var i = dimension === "width" ? 1 : 0,

		// 声明 extra 赋值 0
		extra = 0,

		// 声明 delta 赋值 0
		delta = 0;

	// Adjustment may not be necessary
	// 调整可能不是必要的
	// 判断 box === (isBorderBox ? "border" : "content")
	if ( box === ( isBorderBox ? "border" : "content" ) ) {

		// 返回 0
		return 0;
	}

	// 遍历 i 每次 + 2 递增 满足 i < 4
	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// 盒模型边缘都拒绝
		// 判断 box === "margin"
		if ( box === "margin" ) {

			// delta 赋值 delta + jQuery.css( elem, box + cssExpand[ i ], true, styles )
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		// 如果我们有一个内容框，我们正在寻找“填充”或“边框”或“空白”。
		// 判断 !isBorderBox
		if ( !isBorderBox ) {

			// Add padding
			// 添加填充
			// delta 赋值 delta + jQuery.css( elem, "padding" + cssExpand[ i ], true, styles )
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			// 对于“边框”或“边距”，添加边框
			// 判断 box !== "padding"
			if ( box !== "padding" ) {

				// delta 赋值 delta + jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles )
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			// 但仍然保持跟踪
			} else {

				// extra 赋值 extra + jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles )
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			// 对于“内容”，减去填充
			// 判断 box === "content"
			if ( box === "content" ) {

				// delta 赋值 delta - jQuery.css( elem, "padding" + cssExpand[ i ], true, styles )
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			// 对于“内容”或“填充”，减去边界。
			// 判断 box !== "margin"
			if ( box !== "margin" ) {

				// delta 赋值 delta - jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles )
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	// 当提供 computedVal 请求时，请记录正内容框滚动水槽
	// 判断 !isBorderBox && computedVal >= 0
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// offsetWidth/offsetHeight 是内容、填充、滚动槽和边框的舍入总和。
		// Assuming integer scroll gutter, subtract the rest and round down
		// 假设整数滚动槽，减去其余的并向下舍入。
		// delta 赋值 delta + Math.max(0, Math.ceil(...))
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	// 返回 delta
	return delta;
}

// 声明 getWidthOrHeight 函数
function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	// 从计算风格开始
	// 声明 styles 赋值 getStyles( elem )
	var styles = getStyles( elem ),

		// 声明 val 赋值 curCSS( elem, dimension, styles )
		val = curCSS( elem, dimension, styles ),

		// 声明 isBorderBox 赋值 jQuery.css( elem, "boxSizing", false, styles ) === "border-box"
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",

		// 声明 valueIsBorderBox 赋值 isBorderBox
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	// 适当地返回混淆的非像素值或佯装无知。
	// 判断 rnumnonpx.test(val)
	if ( rnumnonpx.test( val ) ) {

		// 判断 !extra
		if ( !extra ) {

			// 返回 val
			return val;
		}

		// val 赋值 "auto"
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	// 检查样式，当浏览器返回不可靠的 getComputedStyle 值时，静默地返回到可靠的元素。
	// valueIsBorderBox 赋值 valueIsBorderBox 并且 (support.boxSizingReliable() || val === elem.style[dimension])
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// 当价值是“自动”时，退回到宽度 / 偏移量。
	// This happens for inline elements with no explicit setting (gh-3571)
	// 这发生在没有显式设置的内联元素上。
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	// 还使用 offsetWidth/offsetHeight 用于错误报告的内联维度
	// 判断 val === "auto" 或者 !parseFloat(val) 并且 jQuery.css(elem, "display", false, styles) === "inline"
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		// val 赋值 elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ]
		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		// offsetWidth/offsetHeight 提供边界框值
		// valueIsBorderBox 赋值 true
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	// 规范 "" 和 自动
	// val 赋值 parseFloat( val ) 或者 0
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	// 元素盒模型的调整
	// 返回 (val + ...) + "px"
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			// 提供当前计算大小请求涡旋槽计算
			val
		)
	) + "px";
}

// 执行 jQuery.extend 方法
jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	// 添加样式属性钩子以重写获取和设置样式属性的默认行为
	// cssHooks 对象
	cssHooks: {

		// opacity 对象
		opacity: {

			// get 方法
			get: function( elem, computed ) {

				// 判断 computed
				if ( computed ) {

					// We should always get a number back from opacity
					// 我们应该总是从不透明中得到一个数字。
					// 声明 ret 赋值 curCSS( elem, "opacity" )
					var ret = curCSS( elem, "opacity" );

					// 返回 ret === "" ? "1" : ret
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	// 不要自动将“px”添加到这些可能的无单位属性中。
	// cssNumber 对象
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	// 在设置或获取值之前添加要修复的名称
	cssProps: {},

	// Get and set the style property on a DOM Node
	// 获取并设置DOM Node的样式属性
	// style 方法
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		// 不要在文本和评论节点上设置样式
		// 判断 !elem 或者 elem.nodeType === 3 或者 elem.nodeType === 8 或者 !elem.style 满足 则 直接返回
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		// 确保我们用正确的名字工作
		// 初始化 ret, type, hooks
		var ret, type, hooks,

			// 声明 origName 赋值 camelCase( name )
			origName = camelCase( name ),

			// 声明 isCustomProp 赋值 rcustomProp.test( name )
			isCustomProp = rcustomProp.test( name ),

			// 声明 style 赋值 elem.style
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		// 确保我们用正确的名字工作。我们不想查询值，如果它是CSS自定义属性，因为它们是用户定义的。
		// 判断 !isCustomProp
		if ( !isCustomProp ) {

			// name 赋值 finalPropName( origName )
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		// 获取前缀版本的钩子，然后非前缀版本。
		// hooks 赋值 jQuery.cssHooks[ name ] 或者 jQuery.cssHooks[ origName ]
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		// 检查我们是否设置了一个值
		// 判断 value !== undefined
		if ( value !== undefined ) {

			// type 赋值 typeof value
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			// 将“+=”或“-=”转换为相对数
			// 判断 type === "string" 并且 (ret = rcssNum.exec(value)) 并且 ret[1]
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {

				// value 赋值 adjustCSS( elem, name, ret )
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				// type 赋值 "number"
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			// 确保 null 和 NaN 的值没有设置
			// 判断 value == null 或者 value !== value 满足 则直接 返回
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// 如果传入一个数字，则添加该单元（除了某些CSS属性之外）
			// 判断 type === "number"
			if ( type === "number" ) {

				// value 赋值 value + ret 并且 ret[ 3 ] 或者 ( jQuery.cssNumber[ origName ] ? "" : "px" )
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			// 背景 - 道具影响原始克隆的价值
			// 判断 !support.clearCloneStyle 并且 value === "" 并且 name.indexOf("background") === 0
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {

				// style[ name ] 赋值 "inherit"
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			// 如果提供钩子，则使用该值，否则只需设置指定值即可。
			// 判断 !hooks 或者 !("set" in hooks) 或者 (value 赋值 hooks.set(elem, value, extra)) !== undefined
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// 判断 isCustomProp
				if ( isCustomProp ) {

					// 执行 style.setProperty( name, value )
					style.setProperty( name, value );
				} else {

					// style[ name ] 赋值 value
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			// 如果提供了钩子，则从那里获得非计算值。
			// 判断 hooks 并且 "get" in hooks 并且 (ret 赋值 hooks.get(elem, false, extra)) !== undefined
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				// 返回 ret
				return ret;
			}

			// Otherwise just get the value from the style object
			// 否则只需从样式对象中获取值即可。
			// 返回 style[ name ]
			return style[ name ];
		}
	},

	// css 方法
	css: function( elem, name, extra, styles ) {

		// 初始化 val, num, hooks
		var val, num, hooks,

			// 声明 origName 赋值 camelCase( name )
			origName = camelCase( name ),

			// 声明 isCustomProp 赋值 rcustomProp.test( name )
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		// 确保我们用正确的名字工作。如果它是用户自定义的CSS自定义属性，我们不想修改它的值。
		// 判断 !isCustomProp
		if ( !isCustomProp ) {

			// name 赋值 finalPropName( origName )
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		// 尝试前缀名，后缀名
		// hooks 赋值 jQuery.cssHooks[ name ] 或者 jQuery.cssHooks[ origName ]
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		// 如果提供了钩子，则从那里得到计算值。
		// 判断 hooks 并且 "get" in hooks
		if ( hooks && "get" in hooks ) {

			// val 赋值 hooks.get( elem, true, extra )
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		// 否则，如果获得计算值的方式，请使用
		// 判断 val === undefined
		if ( val === undefined ) {

			// val 赋值 curCSS( elem, name, styles )
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		// 将“正常”转换为计算值
		// 判断 val === "normal" 并且 name in cssNormalTransform
		if ( val === "normal" && name in cssNormalTransform ) {

			// val 赋值 cssNormalTransform[ name ]
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		// 如果数值强制或提供限定符，val 看起来数字
		// 判断 extra === "" 或者 extra
		if ( extra === "" || extra ) {

			// num 赋值 parseFloat( val )
			num = parseFloat( val );

			// 返回 extra === true 或者 isFinite( num ) ? num 或者 0 : val
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		// 返回 val
		return val;
	}
} );

// 使用 jQuery.each 方法 遍历 ["height", "width"]
jQuery.each( [ "height", "width" ], function( i, dimension ) {

	// jQuery.cssHooks[dimension] 赋值对象
	jQuery.cssHooks[ dimension ] = {

		// get 方法
		get: function( elem, computed, extra ) {

			// 判断 computed
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				// 某些元素如果我们不可见地显示它们，就可以有尺寸信息，但是它必须有一个可以受益的当前显示样式。
				// 返回 rdisplayswap.test(jQuery.css(elem, "display")) 并且
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Safari 中的表列具有非零 offsetWidth ＆ zero
					// getBoundingClientRect(). 除非改变显示宽度。
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					// 在 IE 中的断开节点上运行 getBoundingClientRect 会引发错误。
					// (!elem.getClientRects().length 或者 !elem.getBoundingClientRect().width) ? swap(elem, cssShow, fn) : getWidthOrHeight(elem, dimension, extra)
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {

							// 返回 getWidthOrHeight( elem, dimension, extra )
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		// set 方法
		set: function( elem, value, extra ) {

			// 初始化 matches
			var matches,

				// 声明 styles 赋值 getStyles( elem )
				styles = getStyles( elem ),

				// 声明 isBorderBox 赋值 jQuery.css( elem, "boxSizing", false, styles ) === "border-box"
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",

				// 声明 subtract 赋值 extra 并且 boxModelAdjustment(...)
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			// 通过比较偏移量 * 计算和伪造内容框以获得边界和填充，来解释不可靠的边框尺寸。
			// 判断 isBorderBox 并且 support.scrollboxSize() === styles.position
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {

				// subtract 赋值 subtract - Math.ceil(...)
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			// 如果需要值调整，转换为像素
			// 判断 subtract 并且 (matches 赋值 rcssNum.exec(value)) 并且 (matches[3] || "px") !== "px"
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				// elem.style[ dimension ] 赋值 value
				elem.style[ dimension ] = value;

				// value 赋值 jQuery.css( elem, dimension )
				value = jQuery.css( elem, dimension );
			}

			// 返回 setPositiveNumber( elem, value, subtract )
			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

// jQuery.cssHooks.marginLeft 赋值 addGetHookIf(...)
jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {

		// 判断 computed
		if ( computed ) {

			// 返回 (parseFloat(curCSS(elem, "marginLeft")) 或者 elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, fn)) + "px"
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {

						// 返回 elem.getBoundingClientRect().left
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
// 这些钩子被动画用来扩展属性。
// 使用 jQuery.each 方法 遍历下面对象
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	// jQuery.cssHooks[prefix + suffix] 赋值 对象
	jQuery.cssHooks[ prefix + suffix ] = {

		// expand 方法
		expand: function( value ) {

			// 声明 i 赋值 0
			var i = 0,

				// 声明 expanded 赋值 空对象
				expanded = {},

				// Assumes a single number if not a string
				// 如果不是字符串，则假定单个数字
				// 声明 parts 赋值 typeof value === "string" ? value.split( " " ) : [ value ]
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			// 遍历 i 满足 i < 4 i 递增
			for ( ; i < 4; i++ ) {

				// expanded[prefix + cssExpand[i] + suffix] 赋值 parts[i] 或者 parts[i - 2] 或者 parts[0]
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			// 返回 expanded
			return expanded;
		}
	};

	// 判断 prefix !== "margin"
	if ( prefix !== "margin" ) {

		// jQuery.cssHooks[ prefix + suffix ].set 赋值 setPositiveNumber
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

// 使用 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// css 方法
	css: function( name, value ) {

		// 返回 access(this, fn, name, value, arguments.length > 1)
		return access( this, function( elem, name, value ) {

			// 初始化 styles, len
			var styles, len,

				// 声明 map 赋值 {}
				map = {},

				// 声明 i 赋值 0
				i = 0;

			// 判断 Array.isArray(name)
			if ( Array.isArray( name ) ) {

				// styles 赋值 getStyles( elem )
				styles = getStyles( elem );

				// len 赋值 name.length
				len = name.length;

				// 遍历 len
				for ( ; i < len; i++ ) {

					// map[ name[ i ] ] 赋值 jQuery.css( elem, name[ i ], false, styles )
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				// 返回 map
				return map;
			}

			// 返回 value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name)
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );

// 返回 jQuery
return jQuery;
} );
