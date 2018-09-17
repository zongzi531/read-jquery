define( [
	"../core",
	"../data/var/dataPriv",
	"./support",

	"../event",
	"./trigger"
], function( jQuery, dataPriv, support ) {

"use strict";

	// require core.js 获得 jQuery
	// require data/var/dataPriv.js 获得 Data 的实例
	// require ./support.js 获得 support 对象
	// require event.js
	// require ./trigger.js

// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
// 判断 !support.focusin
if ( !support.focusin ) {

	// 使用 jQuery.each 方法 遍历 第一参数 对象
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		// 在文档中附加单个捕获处理程序，而有人希望 focusin/focusout
		// 声明 handler 赋值 匿名函数
		var handler = function( event ) {

			// 执行 jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) )
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		// jQuery.event.special[ fix ] 赋值 对象
		jQuery.event.special[ fix ] = {

			// setup 方法
			setup: function() {

				// 声明 doc 赋值 this.ownerDocument 或者 this
				var doc = this.ownerDocument || this,

					// 声明 attaches 赋值 dataPriv.access( doc, fix )
					attaches = dataPriv.access( doc, fix );

				// 判断 !attaches
				if ( !attaches ) {

					// 执行 doc.addEventListener( orig, handler, true )
					doc.addEventListener( orig, handler, true );
				}

				// 执行 dataPriv.access( doc, fix, ( attaches || 0 ) + 1 )
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},

			// teardown 方法
			teardown: function() {

				// 声明 doc 赋值 this.ownerDocument 或者 this
				var doc = this.ownerDocument || this,

					// 声明 attaches 赋值 dataPriv.access( doc, fix ) - 1
					attaches = dataPriv.access( doc, fix ) - 1;

				// 判断 !attaches
				if ( !attaches ) {

					// 执行 doc.removeEventListener( orig, handler, true )
					doc.removeEventListener( orig, handler, true );

					// 执行 dataPriv.remove( doc, fix )
					dataPriv.remove( doc, fix );

				} else {

					// 执行 dataPriv.access( doc, fix, attaches )
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}

// 返回 jQuery
return jQuery;
} );
