define( [
	"../ajax"
], function( jQuery ) {

"use strict";

	// require ajax.js 获得 jQuery

// jQuery._evalUrl 赋值 匿名函数
jQuery._evalUrl = function( url ) {

	// 返回 jQuery.ajax 执行 结果
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		// 使这一点明确，因为用户可以通过 ajaxSetup 来覆盖这个
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};

// 返回 jQuery._evalUrl
return jQuery._evalUrl;

} );
