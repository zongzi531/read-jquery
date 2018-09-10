define( [
	"../core",
	"../var/rcssNum"
], function( jQuery, rcssNum ) {

"use strict";
	// require core.js 获得 jQuery
	// require var/rcssNum.js 获得 正则表达式

// 声明 adjustCSS 方法
function adjustCSS( elem, prop, valueParts, tween ) {
	// 初始化 adjusted, scale
	var adjusted, scale,
		// 声明 maxIterations 赋值 20
		maxIterations = 20,
		// 声明 currentValue 赋值 tween ? fn : fn
		currentValue = tween ?
			function() {
				// 返回 tween.cur()
				return tween.cur();
			} :
			function() {
				// 返回 jQuery.css( elem, prop, "" )
				return jQuery.css( elem, prop, "" );
			},
		// 声明 initial 赋值 currentValue()
		initial = currentValue(),
		// 声明 unit 赋值 valueParts && valueParts[ 3 ] 或者 ( jQuery.cssNumber[ prop ] ? "" : "px" )
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		// 潜在单元失配需要启动值计算
		// 声明 initialInUnit 赋值 ( jQuery.cssNumber[ prop ] 或者 unit !== "px" && +initial ) 并且 rcssNum.exec( jQuery.css( elem, prop ) )
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	// 判断 initialInUnit 并且 initialInUnit[ 3 ] !== unit
	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		// 将迭代目标值减半以防止CSS上界的干扰
		// initial 赋值 initial / 2
		initial = initial / 2;

		// Trust units reported by jQuery.css
		// jQuery.css 报告的信任单元
		// unit 赋值 unit 或者 initialInUnit[ 3 ]
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		// 从非零起始点迭代逼近
		// initialInUnit 赋值 +initial 或者 1
		initialInUnit = +initial || 1;

		// 遍历 maxIterations
		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// 评估和更新我们的最佳猜测（加倍猜测零输出）。
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			// 完成，如果规模等于或交叉1（使旧*新产品不积极）。
			// 执行 jQuery.style( elem, prop, initialInUnit + unit )
			jQuery.style( elem, prop, initialInUnit + unit );
			// 判断 ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				// maxIterations 赋值 0
				maxIterations = 0;
			}
			// initialInUnit 赋值 initialInUnit / scale
			initialInUnit = initialInUnit / scale;

		}

		// initialInUnit 赋值 initialInUnit * 2
		initialInUnit = initialInUnit * 2;
		// 执行 jQuery.style( elem, prop, initialInUnit + unit )
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		// 确保稍后更新 tween 属性
		// valueParts 赋值 valueParts 或者 []
		valueParts = valueParts || [];
	}

	// 判断 valueParts
	if ( valueParts ) {
		// initialInUnit 赋值 +initialInUnit 或者 +initial 或者 0
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		// 如果指定的话，应用相对偏移（+= /-=）
		// adjusted 赋值 valueParts[ 1 ] ? initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] : +valueParts[ 2 ]
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		// 判断 tween
		if ( tween ) {
			// tween.unit 赋值 unit
			tween.unit = unit;
			// tween.start 赋值 initialInUnit
			tween.start = initialInUnit;
			// tween.end 赋值 adjusted
			tween.end = adjusted;
		}
	}
	// 返回 adjusted
	return adjusted;
}

// 返回 adjustCSS
return adjustCSS;
} );
