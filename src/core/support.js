define( [
	"../var/document",
	"../var/support"
], function( document, support ) {

"use strict";
  // require var/document.js 获得 window.document
  // require var/support.js 获得 空 Object 类型

// Support: Safari 8 only
// 仅支持 Safari 8
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// 在 Safari 8 documents 下通过 document.implementation.createHTMLDocument 创建的 forms
// 会出现第二个在第一个的子集，应该是这么理解这句话的
// collapse sibling forms 这个是个啥？
// Because of that, this security measure has to be disabled in Safari 8.
// 因此，必须在 Safari 8 禁用此安全措施
// https://bugs.webkit.org/show_bug.cgi?id=137337
// createHTMLDocument 直接使用 IIFE 返回 布尔值
support.createHTMLDocument = ( function() {
  // In Safari 8 documents created via document.implementation.createHTMLDocument
	var body = document.implementation.createHTMLDocument( "" ).body;
  // 但是呢为什么这里要使用 <form></form><form></form>？
	body.innerHTML = "<form></form><form></form>";
  // 返回 body.childNodes.length === 2
	return body.childNodes.length === 2;
} )();

// 返回 support
return support;
} );
