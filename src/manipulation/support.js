define( [
	"../var/document",
	"../var/support"
], function( document, support ) {

"use strict";

	// require var/document.js 获得 window.document
	// require var/support.js 获得 support 对象

// 执行 IIFE
( function() {

	// 声明 fragment 赋值 document.createDocumentFragment()
	var fragment = document.createDocumentFragment(),

		// 声明 div 赋值 fragment.appendChild( document.createElement( "div" ) )
		div = fragment.appendChild( document.createElement( "div" ) ),

		// 声明 input 赋值 document.createElement( "input" )
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// 如果设置了名称，请检查状态丢失
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	// 执行 input.setAttribute( "type", "radio" )
	input.setAttribute( "type", "radio" );

	// 执行 input.setAttribute( "checked", "checked" )
	input.setAttribute( "checked", "checked" );

	// 执行 input.setAttribute( "name", "t" )
	input.setAttribute( "name", "t" );

	// 执行 div.appendChild( input )
	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	// Older WebKit 不正确地在片段中克隆检查状态
	// support.checkClone 赋值 div.cloneNode( true ).cloneNode( true ).lastChild.checked
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// 确保 textarea（和 checkbox ）默认值被正确克隆
	// div.innerHTML 赋值 "<textarea>x</textarea>"
	div.innerHTML = "<textarea>x</textarea>";

	// support.noCloneChecked 赋值 !!div.cloneNode( true ).lastChild.defaultValue
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();

// 返回 support
return support;

} );
