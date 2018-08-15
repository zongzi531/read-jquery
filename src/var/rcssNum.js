define( [
	"../var/pnum"
], function( pnum ) {

"use strict";

// require pnum.js 获得 相应的正则表达式字符串
// 返回 新的正则表达式
return new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );

} );

// define( [
//   "./pnum"
// ], function( pnum ) {
//   "use strict";

//   return new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
// } );
