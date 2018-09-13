define( [
	"../core",
	"../selector"
], function( jQuery ) {

"use strict";

  // require core.js 获得 jQuery
  // require selector.js

// jQuery.expr.pseudos.hidden 赋值 匿名函数
jQuery.expr.pseudos.hidden = function( elem ) {

  // 返回 !jQuery.expr.pseudos.visible( elem )
	return !jQuery.expr.pseudos.visible( elem );
};

// jQuery.expr.pseudos.visible 赋值 匿名函数
jQuery.expr.pseudos.visible = function( elem ) {

  // 返回 !!( elem.offsetWidth 或者 elem.offsetHeight 或者 elem.getClientRects().length )
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};

} );
