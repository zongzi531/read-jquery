define( [
	"../core",
	"../var/document",
	"../var/documentElement",
	"../var/support"
], function( jQuery, document, documentElement, support ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require var/documentElement.js 获得 window.document.documentElement
	// require var/support.js 获得 support 对象

// 执行 IIFE
( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	// 执行 pixelPosition 和 boxSizingReliable 测试只需要一个布局，所以它们同时执行以保存第二个计算。
	// 声明 computeStyleTests 函数
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		// 这是一个单体，我们只需要执行一次。
		// 判断 !div 满足 则直接 返回
		if ( !div ) {
			return;
		}

		// container.style.cssText 赋值 "position:absolute;left:-11111px;width:60px;" + "margin-top:1px;padding:0;border:0"
		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";

		// div.style.cssText 赋值 "position:relative;display:block;box-sizing:border-box;overflow:scroll;" + "margin:auto;border:1px;padding:1px;" + "width:60%;top:1%"
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";

		// 执行 documentElement.appendChild( container ).appendChild( div )
		documentElement.appendChild( container ).appendChild( div );

		// 声明 divStyle 赋值 window.getComputedStyle( div )
		var divStyle = window.getComputedStyle( div );

		// pixelPositionVal 赋值 divStyle.top !== "1%"
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		// reliableMarginLeftVal 赋值 roundPixelMeasures( divStyle.marginLeft ) === 12
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		// 一些样式以百分比值返回，即使它们不应该。
		// div.style.right 赋值 "60%"
		div.style.right = "60%";

		// pixelBoxStylesVal 赋值 roundPixelMeasures( divStyle.right ) === 36
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		// 检测盒大小标注内容维数的错误报告：边界盒元素
		// boxSizingReliableVal 赋值 roundPixelMeasures( divStyle.width ) === 36
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// 检测溢出：滚动螺纹
		// div.style.position 赋值 "absolute"
		div.style.position = "absolute";

		// scrollboxSizeVal 赋值 div.offsetWidth === 36 或者 "absolute"
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		// 执行 documentElement.removeChild( container )
		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		// 取消div，这样它就不会被存储在内存中，它也将是一个已经执行的校验的标志。
		// div 赋值 null
		div = null;
	}

	// 声明 roundPixelMeasures 函数
	function roundPixelMeasures( measure ) {

		// 返回 Math.round( parseFloat( measure ) )
		return Math.round( parseFloat( measure ) );
	}

	// 初始化 pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableMarginLeftVal
	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,

		// 声明 container 赋值 document.createElement( "div" )
		container = document.createElement( "div" ),

		// 声明 div 赋值 document.createElement( "div" )
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	// 在有限（非浏览器）环境中提前完成
	// 判断 !div.style 满足则 直接返回
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	// 克隆元件的类型影响源元件克隆
	// div.style.backgroundClip 赋值 "content-box"
	div.style.backgroundClip = "content-box";

	// div.cloneNode( true ).style.backgroundClip 赋值 ""
	div.cloneNode( true ).style.backgroundClip = "";

	// support.clearCloneStyle 赋值 div.style.backgroundClip === "content-box"
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// 执行 jQuery.extend 方法 对 support 对象 进行 操作
	jQuery.extend( support, {

		// boxSizingReliable 方法
		boxSizingReliable: function() {

			// 执行 computeStyleTests()
			computeStyleTests();

			// 返回 boxSizingReliableVal
			return boxSizingReliableVal;
		},

		// pixelBoxStyles 方法
		pixelBoxStyles: function() {

			// 执行 computeStyleTests()
			computeStyleTests();

			// 返回 pixelBoxStylesVal
			return pixelBoxStylesVal;
		},

		// pixelPosition 方法
		pixelPosition: function() {

			// 执行 computeStyleTests()
			computeStyleTests();

			// 返回 pixelPositionVal
			return pixelPositionVal;
		},

		// reliableMarginLeft 方法
		reliableMarginLeft: function() {

			// 执行 computeStyleTests()
			computeStyleTests();

			// 返回 reliableMarginLeftVal
			return reliableMarginLeftVal;
		},

		// scrollboxSize 方法
		scrollboxSize: function() {

			// 执行 computeStyleTests()
			computeStyleTests();

			// 返回 scrollboxSizeVal
			return scrollboxSizeVal;
		}
	} );
} )();

// 返回 support 对象
return support;

} );
