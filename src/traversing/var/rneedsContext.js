define( [
	"../../core",
	"../../selector"
], function( jQuery ) {
	"use strict";

  // require core.js 获得 jQuery
  // require selector.js

  // 返回 jQuery.expr.match.needsContext
  // jQuery.expr = Sizzle.selectors
	return jQuery.expr.match.needsContext;
} );
