define( function() {

"use strict";

// 声明 nodeName
function nodeName( elem, name ) {

  // 返回 elem.nodeName 并且需要 elem.nodeName.toLowerCase() === name.toLowerCase()
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};

// 返回 nodeName 方法
return nodeName;

} );
