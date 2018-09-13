define( [
	"./core",
	"../external/sizzle/dist/sizzle"
], function( jQuery, Sizzle ) {

"use strict";

  // require core.js 获得 jQuery
  // require external/sizzle/dist/sizzle.js 获得 Sizzle

  // Sizzle
  // A pure-JavaScript CSS selector engine designed to be easily dropped in to a host library.
  // 一个纯粹的JavaScript CSS选择器引擎，它被设计成可以轻松地进入主机库。
  // GitHub: https://github.com/jquery/sizzle

  // 为 jQuery 添加属性
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;

} );
