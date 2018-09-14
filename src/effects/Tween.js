define( [
	"../core",
	"../css"
], function( jQuery ) {

"use strict";

	// require core.js 获得 jQuery
	// require css.js

// 声明 Tween 函数
function Tween( elem, options, prop, end, easing ) {

	// 返回 new Tween.prototype.init( elem, options, prop, end, easing )
	return new Tween.prototype.init( elem, options, prop, end, easing );
}

// jQuery.Tween 赋值 Tween
jQuery.Tween = Tween;

// 有没有发现这里的写法 和 jQuery.init 方法一样

// Tween.prototype 赋值 对象
// 设置 Tween 原型
Tween.prototype = {

	// constructor 构造器 赋值 Tween
	constructor: Tween,

	// init 方法
	init: function( elem, options, prop, end, easing, unit ) {

		// this.elem 赋值 elem
		this.elem = elem;

		// this.prop 赋值 prop
		this.prop = prop;

		// this.easing 赋值 easing 或者 jQuery.easing._default
		this.easing = easing || jQuery.easing._default;

		// this.options 赋值 options
		this.options = options;

		// this.start 和 this.now 赋值 this.cur()
		this.start = this.now = this.cur();

		// this.end 赋值 end
		this.end = end;

		// this.unit 赋值 unit 或者 ( jQuery.cssNumber[ prop ] ? "" : "px" )
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},

	// cur 方法
	cur: function() {

		// 声明 hooks 赋值 Tween.propHooks[ this.prop ]
		var hooks = Tween.propHooks[ this.prop ];

		// 返回 hooks 返回 hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this)
		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},

	// run 方法
	run: function( percent ) {

		// 初始化 eased
		var eased,

			// 声明 hooks 赋值 Tween.propHooks[ this.prop ]
			hooks = Tween.propHooks[ this.prop ];

		// 判断 this.options.duration
		if ( this.options.duration ) {

			// this.pos 和 eased 赋值 jQuery.easing[this.easing](...)
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {

			// this.pos 和 eased 赋值 percent
			this.pos = eased = percent;
		}

		// this.now 赋值 ( this.end - this.start ) * eased + this.start
		this.now = ( this.end - this.start ) * eased + this.start;

		// 判断 this.options.step
		if ( this.options.step ) {

			// this.options.step.call( this.elem, this.now, this )
			this.options.step.call( this.elem, this.now, this );
		}

		// 判断 hooks 并且 hooks.set
		if ( hooks && hooks.set ) {

			// 执行 hooks.set( this )
			hooks.set( this );
		} else {

			// 执行 Tween.propHooks._default.set( this )
			Tween.propHooks._default.set( this );
		}

		// 返回 this
		return this;
	}
};

// Tween.prototype.init.prototype 赋值 Tween.prototype
Tween.prototype.init.prototype = Tween.prototype;

// Tween.propHooks 赋值 对象
Tween.propHooks = {

	// _default 对象
	_default: {

		// get 方法
		get: function( tween ) {

			// 初始化 result
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			// 当元素不是DOM元素时，或者当不存在匹配样式属性时，直接使用元素上的属性。
			// 判断 tween.elem.nodeType !== 1 或者 tween.elem[tween.prop] != null 并且 tween.elem.style[tween.prop] == null
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {

				// 返回 tween.elem[ tween.prop ]
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// 将空字符串作为第三个参数传递给.css将自动尝试parseFloat，如果解析失败，则返回字符串。
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			// 将诸如“10px”之类的简单值解析为浮动；复数值（如“rotate(1rad)”）按原样返回。
			// result 赋值 jQuery.css( tween.elem, tween.prop, "" )
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			// 空字符串，NULL，未定义和“AUTO”被转换为0。
			// 返回 !result 或者 result === "auto" ? 0 : result
			return !result || result === "auto" ? 0 : result;
		},

		// set 方法
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			// 使用后钩的 step hook。
			// 使用 cssHook 如果它在那里。
			// 使用 .style 可用，使用可用的普通属性
			// 判断 jQuery.fx.step[tween.prop]
			if ( jQuery.fx.step[ tween.prop ] ) {

				// 执行 jQuery.fx.step[ tween.prop ]( tween )
				jQuery.fx.step[ tween.prop ]( tween );

				// 判断 tween.elem.nodeType === 1 并且 (tween.elem.style[jQuery.cssProps[tween.prop]] != null 或者 jQuery.cssHooks[tween.prop])
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {

				// 执行 jQuery.style( tween.elem, tween.prop, tween.now + tween.unit )
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {

				// tween.elem[ tween.prop ] 赋值 tween.now
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
// 基于中断的节点断开设置方法
// Tween.propHooks.scrollTop 和 Tween.propHooks.scrollLeft 赋值 对象
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {

	// set 方法
	set: function( tween ) {

		// 判断 tween.elem.nodeType 并且 tween.elem.parentNode
		if ( tween.elem.nodeType && tween.elem.parentNode ) {

			// tween.elem[ tween.prop ] 赋值 tween.now
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

// jQuery.easing 赋值 对象
jQuery.easing = {

	// linear 方法
	linear: function( p ) {

		// 返回 p
		return p;
	},

	// swing 方法
	swing: function( p ) {

		// 返回 0.5 - Math.cos( p * Math.PI ) / 2
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

// jQuery.fx 赋值 Tween.prototype.init
jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
// 返回 compat <1.8 扩展点
// jQuery.fx.step 赋值 {}
jQuery.fx.step = {};

} );
