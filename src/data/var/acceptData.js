define( function() {

"use strict";

/**
 * Determines whether an object can have data
 */
 // 确定对象是否可以具有数据。
return function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
  // Node.ELEMENT_NODE 的值为 1
  // Node.DOCUMENT_NODE 的值为 9
  // !( +owner.nodeType ) 这个我没看懂
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};

} );
