define( function() {
	"use strict";

	// Only count HTML whitespace
	// Other whitespace should count in values
	// https://infra.spec.whatwg.org/#ascii-whitespace
  // 返回 新的正则表达式
	return ( /[^\x20\t\r\n\f]+/g );
} );
