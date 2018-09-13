define( [
	"../core"
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery

// Cross-browser xml parsing
// 跨浏览器XML解析
// 描述: 解析一个字符串到一个XML文档。
jQuery.parseXML = function( data ) {

	// 初始化 xml
	var xml;

	// 若 !data 或 data 为 String 类型 直接 返回 null
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	// IE在 parseFromString 输入无效输入
	try {

		// 尝试执行
		// DOMParser 可以将存储在字符串中的XML或HTML源代码解析为一个 DOM文档. DOMParser是在 DOM解析和序列化 中指定的。请注意, XMLHttpRequest  支持从URL可寻址资源解析XML和HTML。
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {

		// 若执行 失败
		// 则 xml = undefined
		xml = undefined;
	}

	// 如果解析失败, DOMParser 目前不会抛出任何异常, 只会返回一个给定的错误文档(查看 bug 45566):

	// <parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">
	// (error description)
	// <sourcetext>(a snippet of the source XML)</sourcetext>
	// </parsererror>
	// 解析错误会显示在错误控制台,包括文档的地址和错误的源代码.
	// 若 !xml 不存在 或者 xml.getElementsByTagName( "parsererror" ).length > 0
	// 也就是上面所说的 解析失败的情况
	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {

		// 调用 jQuery.error 返回相关报错
		jQuery.error( "Invalid XML: " + data );
	}

	// 返回 xml
	return xml;
};

// 返回 jQuery.parseXML 方法
return jQuery.parseXML;

} );
