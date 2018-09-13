define( [
	"../var/document",
	"../var/support"
], function( document, support ) {

"use strict";

	// require var/document.js 获得 window.document
	// require var/support.js 获得 空 Object 类型

// 执行 IIFE
( function() {

	// 声明 input 赋值 document.createElement( "input" )
	var input = document.createElement( "input" ),

		// 声明 select 赋值 document.createElement( "select" )
		select = document.createElement( "select" ),

		// 声明 opt 赋值 select.appendChild( document.createElement( "option" ) )
		opt = select.appendChild( document.createElement( "option" ) );

	// 设置 input.type 赋值 "checkbox"
	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	// 复选框的默认值应该是“on”。
	// support.checkOn 赋值 input.value !== ""
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	// 必须访问选择索引以进行默认选项选择
	// support.optSelected 赋值 opt.selected
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	// 输入变成 radio 后失去其价值
	// input 赋值 document.createElement( "input" )
	input = document.createElement( "input" );

	// input.value 赋值 "t"
	input.value = "t";

	// input.type 赋值 "radio"
	input.type = "radio";

	// support.radioValue 赋值 input.value === "t"
	support.radioValue = input.value === "t";
} )();

// 返回 support
return support;

} );
