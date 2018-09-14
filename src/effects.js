define( [
	"./core",
	"./core/camelCase",
	"./var/document",
	"./var/isFunction",
	"./var/rcssNum",
	"./var/rnothtmlwhite",
	"./css/var/cssExpand",
	"./css/var/isHiddenWithinTree",
	"./css/var/swap",
	"./css/adjustCSS",
	"./data/var/dataPriv",
	"./css/showHide",

	"./core/init",
	"./queue",
	"./deferred",
	"./traversing",
	"./manipulation",
	"./css",
	"./effects/Tween"
], function( jQuery, camelCase, document, isFunction, rcssNum, rnothtmlwhite, cssExpand,
	isHiddenWithinTree, swap, adjustCSS, dataPriv, showHide ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/camelCase.js 获得 camelCase 方法
	// require var/document.js 获得 window.document
	// require var/isFunction.js 获得 isFunction 方法
	// require var/rcssNum.js 获得 正则表达式
	// require var/rnothtmlwhite.js 获得 正则表达式
	// require css/var/cssExpand.js 获得 [ "Top", "Right", "Bottom", "Left" ] 数组
	// require css/var/isHiddenWithinTree.js 获得 isHiddenWithinTree 方法
	// require css/var/swap.js 获得 swap 方法
	// require css/adjustCSS.js 获得 adjustCSS 方法
	// require data/var/dataPriv.js 获得 Data 的实例
	// require css/showHide.js 获得 showHide 函数
	// require core/init.js
	// require queue.js
	// require deferred.js
	// require traversing.js
	// require manipulation.js
	// require css.js
	// require effects/Tween.js

var

	// 初始化 fxNow, inProgress
	fxNow, inProgress,

	// 声明 rfxtypes 赋值 /^(?:toggle|show|hide)$/
	rfxtypes = /^(?:toggle|show|hide)$/,

	// 声明 rrun 赋值 /queueHooks$/
	rrun = /queueHooks$/;

// 声明 schedule 函数
function schedule() {

	// 判断 inProgress
	if ( inProgress ) {

		// 判断 document.hidden === false 并且 window.requestAnimationFrame
		if ( document.hidden === false && window.requestAnimationFrame ) {

			// 执行 window.requestAnimationFrame( schedule )
			window.requestAnimationFrame( schedule );
		} else {

			// 执行 window.setTimeout( schedule, jQuery.fx.interval )
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		// 执行 jQuery.fx.tick()
		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
// 同步创建的动画将同步运行。
// 声明 createFxNow 函数
function createFxNow() {
	window.setTimeout( function() {

		// 延迟执行 fxNow 赋值 undefined
		fxNow = undefined;
	} );

	// 返回 ( fxNow 赋值 Date.now() )
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
// 生成参数创建标准动画
// 声明 genFx 函数
function genFx( type, includeWidth ) {

	// 初始化 which
	var which,

		// 声明 i 赋值 0
		i = 0,

		// 声明 attrs 赋值 { height: type }
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	// 如果包含宽度，则步值为1以完成所有 cssExpand 值，否则步值为2，以跳过左右。
	// includeWidth 赋值 includeWidth ? 1 : 0
	includeWidth = includeWidth ? 1 : 0;

	// 遍历 i i 以 2 - includeWidth 递增 满足 i < 4
	for ( ; i < 4; i += 2 - includeWidth ) {

		// which 赋值 cssExpand[ i ]
		which = cssExpand[ i ];

		// attrs[ "margin" + which ] 和 attrs[ "padding" + which ] 赋值 type
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	// 判断 includeWidth
	if ( includeWidth ) {

		// attrs.opacity 和 attrs.width 赋值 type
		attrs.opacity = attrs.width = type;
	}

	// 返回 attrs
	return attrs;
}

// 声明 createTween 函数
function createTween( value, prop, animation ) {

	// 初始化 tween
	var tween,

		// 声明 collection 赋值 ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),

		// 声明 index 赋值 0,
		index = 0,

		// 声明 length 赋值 collection.length;
		length = collection.length;

	// 遍历 length
	for ( ; index < length; index++ ) {

		// 判断 (tween 赋值 collection[index].call(animation, prop, value))
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			// 我们已经完成了这个属性
			// 返回 tween
			return tween;
		}
	}
}

// 声明 defaultPrefilter 函数
function defaultPrefilter( elem, props, opts ) {

	// 初始化 prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,

		// 声明 isBox 赋值 "width" in props 或者 "height" in props
		isBox = "width" in props || "height" in props,

		// 声明 anim 赋值 this
		anim = this,

		// 声明 orig 赋值 {}
		orig = {},

		// 声明 style 赋值 elem.style
		style = elem.style,

		// 声明 hidden 赋值 elem.nodeType 并且 isHiddenWithinTree( elem )
		hidden = elem.nodeType && isHiddenWithinTree( elem ),

		// 声明 dataShow 赋值 dataPriv.get( elem, "fxshow" )
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	// 队列跳过动画劫持 fx 挂钩
	// 判断 !opts.queue
	if ( !opts.queue ) {

		// hooks 赋值 jQuery._queueHooks( elem, "fx" )
		hooks = jQuery._queueHooks( elem, "fx" );

		// 判断 hooks.unqueued == null
		if ( hooks.unqueued == null ) {

			// hooks.unqueued 赋值 0
			hooks.unqueued = 0;

			// oldfire 赋值 hooks.empty.fire
			oldfire = hooks.empty.fire;

			// hooks.empty.fire 赋值 匿名函数
			hooks.empty.fire = function() {

				// 判断 !hooks.unqueued
				if ( !hooks.unqueued ) {

					// 执行 oldfire()
					oldfire();
				}
			};
		}

		// 执行 hooks.unqueued++
		hooks.unqueued++;

		// 执行 anim.always
		anim.always( function() {

			// Ensure the complete handler is called before this completes
			// 确保在此完成之前调用完整的处理程序
			// 执行 anim.always
			anim.always( function() {

				// 执行 hooks.unqueued--
				hooks.unqueued--;

				// 判断 !jQuery.queue(elem, "fx").length
				if ( !jQuery.queue( elem, "fx" ).length ) {

					// 执行 hooks.empty.fire()
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	// 检测显示 / 隐藏动画
	// 遍历 props 对象
	for ( prop in props ) {

		// value 赋值 props[ prop ]
		value = props[ prop ];

		// 判断 rfxtypes.test(value)
		if ( rfxtypes.test( value ) ) {

			// 执行 delete props[ prop ]
			delete props[ prop ];

			// toggle 赋值 toggle 或者 value === "toggle"
			toggle = toggle || value === "toggle";

			// 判断 value === (hidden ? "hide" : "show")
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				// 假装是隐藏的，如果这是一个 "show" ，仍然有数据从停止显示 / 隐藏
				// 判断 value === "show" 并且 dataShow && dataShow[prop] !== undefined
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {

					// hidden 赋值 true
					hidden = true;

				// Ignore all other no-op show/hide data
				// 忽略所有其他 no-op 显示 / 隐藏数据
				} else {

					// 跳过此次遍历
					continue;
				}
			}

			// orig[ prop ] 赋值 dataShow && dataShow[ prop ] 或者 jQuery.style( elem, prop )
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	// 保释，如果这是一个 no-op 像 .hide().hide()。
	// propTween 赋值 !jQuery.isEmptyObject( props )
	propTween = !jQuery.isEmptyObject( props );

	// 判断 !propTween 并且 jQuery.isEmptyObject(orig) 满足 则 返回
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	// 在框动画中限制“溢出”和“显示”样式
	// 判断 isBox 并且 elem.nodeType === 1
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		// 记录所有3个溢出属性，因为IE不从相同值的溢出X和溢出Y推断速记，而Edge只镜像溢出X值。
		// opts.overflow 赋值 [ style.overflow, style.overflowX, style.overflowY ]
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		// 识别显示类型，在CSS级联上优先选择旧的显示 / 隐藏数据
		// restoreDisplay 赋值 dataShow 并且 dataShow.display
		restoreDisplay = dataShow && dataShow.display;

		// 判断 restoreDisplay == null
		if ( restoreDisplay == null ) {

			// restoreDisplay 赋值 dataPriv.get( elem, "display" )
			restoreDisplay = dataPriv.get( elem, "display" );
		}

		// display 赋值 jQuery.css( elem, "display" )
		display = jQuery.css( elem, "display" );

		// 判断 display === "none"
		if ( display === "none" ) {

			// 判断 restoreDisplay
			if ( restoreDisplay ) {

				// display 赋值 restoreDisplay
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				// 通过临时强制可见性获取非空值
				// 执行 showHide( [ elem ], true )
				showHide( [ elem ], true );

				// restoreDisplay 赋值 elem.style.display 或者 restoreDisplay
				restoreDisplay = elem.style.display || restoreDisplay;

				// display 赋值 jQuery.css( elem, "display" )
				display = jQuery.css( elem, "display" );

				// 执行 showHide( [ elem ] )
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		// 将内联元素作为内嵌块动画
		// 判断 display === "inline" 或者 display === "inline-block" 并且 restoreDisplay != null
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {

			// 判断 jQuery.css( elem, "float" ) === "none"
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				// 还原纯显示 / 隐藏动画结束时的原始显示值
				// 判断 !propTween
				if ( !propTween ) {

					// 执行 anim.done
					anim.done( function() {

						// style.display 赋值 restoreDisplay
						style.display = restoreDisplay;
					} );

					// 判断 restoreDisplay == null
					if ( restoreDisplay == null ) {

						// display 赋值 style.display
						display = style.display;

						// restoreDisplay 赋值 display === "none" ? "" : display
						restoreDisplay = display === "none" ? "" : display;
					}
				}

				// style.display 赋值 "inline-block"
				style.display = "inline-block";
			}
		}
	}

	// 判断 opts.overflow
	if ( opts.overflow ) {

		// style.overflow 赋值 "hidden"
		style.overflow = "hidden";

		// 执行 anim.always
		anim.always( function() {

			// style.overflow 赋值 opts.overflow[ 0 ]
			style.overflow = opts.overflow[ 0 ];

			// style.overflowX 赋值 opts.overflow[ 1 ]
			style.overflowX = opts.overflow[ 1 ];

			// style.overflowY 赋值 opts.overflow[ 2 ]
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	// 实现显示 / 隐藏动画
	// propTween 赋值 false
	propTween = false;

	// 遍历 orig 对象
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		// 此元素动画的一般显示 / 隐藏设置
		// 判断 !propTween
		if ( !propTween ) {

			// 判断 dataShow
			if ( dataShow ) {

				// 判断 "hidden" in dataShow
				if ( "hidden" in dataShow ) {

					// hidden 赋值 dataShow.hidden
					hidden = dataShow.hidden;
				}
			} else {

				// dataShow 赋值 dataPriv.access( elem, "fxshow", { display: restoreDisplay } )
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			// 存储隐藏 / 可见切换，所以 `.stop().toggle()` “反转”
			// 判断 toggle
			if ( toggle ) {

				// dataShow.hidden 赋值 !hidden
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			// 在动画之前显示元素
			// 判断 hidden
			if ( hidden ) {

				// 执行 showHide( [ elem ], true )
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			// 执行 anim.done
			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				// “隐藏”动画的最后一步实际上是隐藏元素。
				// 判断 !hidden
				if ( !hidden ) {

					// 执行 showHide( [ elem ] )
					showHide( [ elem ] );
				}

				// 执行 dataPriv.remove( elem, "fxshow" )
				dataPriv.remove( elem, "fxshow" );

				// 遍历 orig 对象
				for ( prop in orig ) {

					// 执行 jQuery.style( elem, prop, orig[ prop ] )
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		// 按属性设置
		// propTween 赋值 createTween( hidden ? dataShow[ prop ] : 0, prop, anim )
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

		// 判断 !( prop in dataShow )
		if ( !( prop in dataShow ) ) {

			// dataShow[ prop ] 赋值 propTween.start
			dataShow[ prop ] = propTween.start;

			// 判断 hidden
			if ( hidden ) {

				// propTween.end 赋值 propTween.start
				propTween.end = propTween.start;

				// propTween.start 赋值 0
				propTween.start = 0;
			}
		}
	}
}

// 声明 propFilter 函数
function propFilter( props, specialEasing ) {

	// 初始化 index, name, easing, value, hooks
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	// camelCase, specialEasing 并扩大 cssHook 通过
	// 遍历 props 对象
	for ( index in props ) {

		// name 赋值 camelCase( index )
		name = camelCase( index );

		// easing 赋值 specialEasing[ name ]
		easing = specialEasing[ name ];

		// value 赋值 props[ index ]
		value = props[ index ];

		// 判断 Array.isArray(value)
		if ( Array.isArray( value ) ) {

			// easing 赋值 value[ 1 ]
			easing = value[ 1 ];

			// value 赋值 props[ index ] = value[ 0 ]
			value = props[ index ] = value[ 0 ];
		}

		// 判断 index !== name
		if ( index !== name ) {

			// props[ name ] 赋值 value
			props[ name ] = value;

			// 执行 delete props[ index ]
			delete props[ index ];
		}

		// hooks 赋值 jQuery.cssHooks[ name ]
		hooks = jQuery.cssHooks[ name ];

		// 判断 hooks 并且 "expand" in hooks
		if ( hooks && "expand" in hooks ) {

			// value 赋值 hooks.expand( value )
			value = hooks.expand( value );

			// 执行 delete props[ name ]
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// 不太 $.extend ，这不会覆盖现有的密钥。
			// Reusing 'index' because we have the correct "name"
			// 重用“索引”，因为我们有正确的“名称”
			// 遍历 value 对象
			for ( index in value ) {

				// 判断 !(index in props)
				if ( !( index in props ) ) {

					// props[ index ] 赋值 value[ index ]
					props[ index ] = value[ index ];

					// specialEasing[ index ] 赋值 easing
					specialEasing[ index ] = easing;
				}
			}
		} else {

			// specialEasing[ name ] 赋值 easing
			specialEasing[ name ] = easing;
		}
	}
}

// 声明 Animation 函数
function Animation( elem, properties, options ) {

	// 初始化 result
	var result,

		// 初始化 stopped
		stopped,

		// 声明 index 赋值 0
		index = 0,

		// 声明 length 赋值 Animation.prefilters.length
		length = Animation.prefilters.length,

		// 声明 deferred 赋值 jQuery.Deferred().always(...)
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			// 不匹配 elem：动画选择器
			// 执行 delete tick.elem
			delete tick.elem;
		} ),

		// 声明 tick 赋值 匿名函数
		tick = function() {

			// 判断 stopped
			if ( stopped ) {

				// 返回 false
				return false;
			}

			// 声明 currentTime 赋值 fxNow || createFxNow()
			var currentTime = fxNow || createFxNow(),

				// 声明 remaining 赋值 Math.max( 0, animation.startTime + animation.duration - currentTime )
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				// Archaic crash bug 不允许我们使用 `1 - ( 0.5 || 0 )`
				// 声明 temp 赋值 remaining / animation.duration || 0
				temp = remaining / animation.duration || 0,

				// 声明 percent 赋值 1 - temp
				percent = 1 - temp,

				// 声明 index 赋值 0
				index = 0,

				// 声明 length 赋值 animation.tweens.length
				length = animation.tweens.length;

			// 遍历 length
			for ( ; index < length; index++ ) {

				// 执行 animation.tweens[ index ].run( percent )
				animation.tweens[ index ].run( percent );
			}

			// 执行 deferred.notifyWith( elem, [ animation, percent, remaining ] )
			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			// 如果还有更多的事情要做，yield
			// 判断 percent < 1 并且 length
			if ( percent < 1 && length ) {

				// 返回 remaining
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			// 如果这是一个空的动画，合成一个最后的进度通知
			// 判断 !length
			if ( !length ) {

				// 执行 deferred.notifyWith( elem, [ animation, 1, 0 ] )
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			// 解析动画并报告其结论
			// 执行 deferred.resolveWith( elem, [ animation ] )
			deferred.resolveWith( elem, [ animation ] );

			// 返回 false
			return false;
		},

		// 声明 animation 赋值 deferred.promise(...)
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],

			// createTween 方法
			createTween: function( prop, end ) {

				// 声明 tween 赋值 jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] 或者 animation.opts.easing)
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );

				// 返回 tween
				return tween;
			},

			// stop 方法
			stop: function( gotoEnd ) {

				// 声明 index 赋值 0
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					// 如果我们要结束，我们想运行所有的 tweens ，否则我们跳过这一部分。
					// length 赋值 gotoEnd ? animation.tweens.length : 0
					length = gotoEnd ? animation.tweens.length : 0;

				// 判断 stopped
				if ( stopped ) {

					// 返回 this
					return this;
				}

				// stopped 赋值 true
				stopped = true;

				// 遍历 length
				for ( ; index < length; index++ ) {

					// 执行 animation.tweens[ index ].run( 1 )
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				// 在播放最后一帧时解析，否则拒绝
				// 判断 gotoEnd
				if ( gotoEnd ) {

					// 执行 deferred.notifyWith( elem, [ animation, 1, 0 ] )
					deferred.notifyWith( elem, [ animation, 1, 0 ] );

					// 执行 deferred.resolveWith( elem, [ animation, gotoEnd ] )
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {

					// 执行 deferred.rejectWith( elem, [ animation, gotoEnd ] )
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}

				// 返回 this
				return this;
			}
		} ),

		// 声明 props 赋值 animation.props
		props = animation.props;

	// 执行 propFilter( props, animation.opts.specialEasing )
	propFilter( props, animation.opts.specialEasing );

	// 遍历 length
	for ( ; index < length; index++ ) {

		// result 赋值 Animation.prefilters[ index ].call( animation, elem, props, animation.opts )
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );

		// 判断 result
		if ( result ) {

			// 判断 isFunction( result.stop )
			if ( isFunction( result.stop ) ) {

				// jQuery._queueHooks(animation.elem, animation.opts.queue).stop 赋值 result.stop.bind(result)
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}

			// 返回 result
			return result;
		}
	}

	// 执行 jQuery.map( props, createTween, animation )
	jQuery.map( props, createTween, animation );

	// 判断 isFunction( animation.opts.start )
	if ( isFunction( animation.opts.start ) ) {

		// 执行 animation.opts.start.call( elem, animation )
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	// 从选项附加回调
	// 执行 animation 链式调用
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	// 执行 jQuery.fx.timer 方法
	jQuery.fx.timer(

		// 执行 jQuery.extend 方法
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// 返回 animation
	return animation;
}

// jQuery.Animation 赋值 使用 jQuery.extend 对 Animation 添加过对象的返回值
jQuery.Animation = jQuery.extend( Animation, {

	// tweeners 对象
	tweeners: {

		// "*" 赋值 数组
		"*": [ function( prop, value ) {

			// 声明 tween 赋值 this.createTween( prop, value )
			var tween = this.createTween( prop, value );

			// 执行 adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween )
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );

			// 返回 tween
			return tween;
		} ]
	},

	// tweener 方法
	tweener: function( props, callback ) {

		// 判断 isFunction( props )
		if ( isFunction( props ) ) {

			// callback 赋值 props
			callback = props;

			// props 赋值 [ "*" ]
			props = [ "*" ];
		} else {

			// props 赋值 props.match( rnothtmlwhite )
			props = props.match( rnothtmlwhite );
		}

		// 初始化 prop
		var prop,

			// 声明 index 赋值 0
			index = 0,

			// 声明 length 赋值 props.length
			length = props.length;

		// 遍历 length
		for ( ; index < length; index++ ) {

			// prop 赋值 props[ index ]
			prop = props[ index ];

			// Animation.tweeners[ prop ] 赋值 Animation.tweeners[ prop ] 或者 []
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];

			// 执行 Animation.tweeners[ prop ].unshift( callback )
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	// prefilters 赋值 [defaultPrefilter]
	prefilters: [ defaultPrefilter ],

	// prefilter 方法
	prefilter: function( callback, prepend ) {

		// 判断 prepend
		if ( prepend ) {

			// 执行 Animation.prefilters.unshift( callback )
			Animation.prefilters.unshift( callback );
		} else {

			// 执行 Animation.prefilters.push( callback )
			Animation.prefilters.push( callback );
		}
	}
} );

// jQuery.speed 赋值 匿名函数
jQuery.speed = function( speed, easing, fn ) {

	// 声明 opt 赋值 speed 并且 typeof speed === "object" ? jQuery.extend({}, speed) : { ... }
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	// 如果 fx 关闭，转到结束状态
	// 判断 jQuery.fx.off
	if ( jQuery.fx.off ) {

		// opt.duration 赋值 0
		opt.duration = 0;

	} else {

		// 判断 typeof opt.duration !== "number"
		if ( typeof opt.duration !== "number" ) {

			// 判断 opt.duration in jQuery.fx.speeds
			if ( opt.duration in jQuery.fx.speeds ) {

				// opt.duration 赋值 jQuery.fx.speeds[ opt.duration ]
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {

				// opt.duration 赋值 jQuery.fx.speeds._default
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	// 判断 opt.queue == null 或者 opt.queue === true
	if ( opt.queue == null || opt.queue === true ) {

		// opt.queue 赋值 "fx"
		opt.queue = "fx";
	}

	// Queueing
	// 排队
	// opt.old 赋值 opt.complete
	opt.old = opt.complete;

	// opt.complete 赋值 匿名函数
	opt.complete = function() {

		// 判断 isFunction(opt.old)
		if ( isFunction( opt.old ) ) {

			// 执行 opt.old.call( this )
			opt.old.call( this );
		}

		// 判断 opt.queue
		if ( opt.queue ) {

			// 执行 jQuery.dequeue( this, opt.queue )
			jQuery.dequeue( this, opt.queue );
		}
	};

	// 返回 opt
	return opt;
};

// 执行 jQuery.fn.extend 方法
jQuery.fn.extend( {

	// fadeTo 方法
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		// 在设置不透明度为0之后显示任何隐藏元素
		// 返回 this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show().end().animate( { opacity: to }, speed, easing, callback )
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			// 动画到指定的值
			.end().animate( { opacity: to }, speed, easing, callback );
	},

	// animate 方法
	animate: function( prop, speed, easing, callback ) {

		// 声明 empty 赋值 jQuery.isEmptyObject( prop )
		var empty = jQuery.isEmptyObject( prop ),

			// 声明 optall 赋值 jQuery.speed( speed, easing, callback )
			optall = jQuery.speed( speed, easing, callback ),

			// 声明 doAnimation 赋值 匿名函数
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				// 操作一个支柱的副本，所以每个财产宽松不会丢失
				// 声明 anim 赋值 Animation( this, jQuery.extend( {}, prop ), optall )
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				// 空动画，或完成立即解决
				// 判断 empty 或者 dataPriv.get(this, "finish")
				if ( empty || dataPriv.get( this, "finish" ) ) {

					// 执行 anim.stop( true )
					anim.stop( true );
				}
			};

			// doAnimation.finish 赋值 doAnimation
			doAnimation.finish = doAnimation;

		// 返回 empty 或者 optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation)
		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	// stop 方法
	stop: function( type, clearQueue, gotoEnd ) {

		// 声明 stopQueue 赋值 匿名函数
		var stopQueue = function( hooks ) {

			// 声明 stop 赋值 hooks.stop
			var stop = hooks.stop;

			// 执行 delete hooks.stop
			delete hooks.stop;

			// 执行 stop( gotoEnd )
			stop( gotoEnd );
		};

		// 判断 typeof type !== "string"
		if ( typeof type !== "string" ) {

			// gotoEnd 赋值 clearQueue
			gotoEnd = clearQueue;

			// clearQueue 赋值 type
			clearQueue = type;

			// type 赋值 undefined
			type = undefined;
		}

		// 判断 clearQueue 并且 type !== false
		if ( clearQueue && type !== false ) {

			// 执行 this.queue( type || "fx", [] )
			this.queue( type || "fx", [] );
		}

		// 返回 this.each 遍历 当前元素集
		return this.each( function() {

			// 声明 dequeue 赋值 true
			var dequeue = true,

				// 声明 index 赋值 type != null && type + "queueHooks"
				index = type != null && type + "queueHooks",

				// 声明 timers 赋值 jQuery.timers
				timers = jQuery.timers,

				// 声明 data 赋值 dataPriv.get( this )
				data = dataPriv.get( this );

			// 判断 index
			if ( index ) {

				// 判断 data[ index ] 并且 data[ index ].stop
				if ( data[ index ] && data[ index ].stop ) {

					// 执行 stopQueue( data[ index ] )
					stopQueue( data[ index ] );
				}
			} else {

				// 遍历 data
				for ( index in data ) {

					// 判断 data[ index ] 并且 data[ index ].stop 并且 rrun.test( index )
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {

						// 执行 stopQueue( data[ index ] )
						stopQueue( data[ index ] );
					}
				}
			}

			// 遍历 index 赋值 timers.length
			for ( index = timers.length; index--; ) {

				// 判断 timers[ index ].elem === this 并且 (type == null 或者 timers[index].queue === type)
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					// 执行 timers[ index ].anim.stop( gotoEnd )
					timers[ index ].anim.stop( gotoEnd );

					// dequeue 赋值 false
					dequeue = false;

					// 执行 timers.splice( index, 1 )
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// 如果最后一个步骤没有被强制，则在队列中启动下一个。
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			// 计时器当前将调用他们的完整回调，这将 dequeue ，但只有当他们是 gotoEnd。
			// 判断 dequeue 或者 !gotoEnd
			if ( dequeue || !gotoEnd ) {

				// 执行 jQuery.dequeue( this, type )
				jQuery.dequeue( this, type );
			}
		} );
	},

	// finish 方法
	finish: function( type ) {

		// 判断 type !== false
		if ( type !== false ) {

			// type 赋值 type || "fx"
			type = type || "fx";
		}

		// 返回 this.each 遍历 当前元素集
		return this.each( function() {

			// 初始化 index
			var index,

				// 声明 data 赋值 dataPriv.get( this )
				data = dataPriv.get( this ),

				// 声明 queue 赋值 data[ type + "queue" ]
				queue = data[ type + "queue" ],

				// 声明 hooks 赋值 data[ type + "queueHooks" ]
				hooks = data[ type + "queueHooks" ],

				// 声明 timers 赋值 jQuery.timers
				timers = jQuery.timers,

				// 声明 length 赋值 queue ? queue.length : 0
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			// 在私有数据上启用结束标志
			// data.finish 赋值 true
			data.finish = true;

			// Empty the queue first
			// 先清空队列
			// 执行 jQuery.queue( this, type, [] )
			jQuery.queue( this, type, [] );

			// 判断 hooks 并且 hooks.stop
			if ( hooks && hooks.stop ) {

				// 执行 hooks.stop.call( this, true )
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			// 寻找任何活动动画，并完成它们
			// 遍历 index 赋值 timers.length
			for ( index = timers.length; index--; ) {

				// 判断 timers[index].elem === this 并且 timers[index].queue === type
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {

					// 执行 timers[ index ].anim.stop( true )
					timers[ index ].anim.stop( true );

					// 执行 timers.splice( index, 1 )
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			// 查找旧队列中的任何动画并完成它们
			// 遍历 length
			for ( index = 0; index < length; index++ ) {

				// 判断 queue[ index ] 并且 queue[ index ].finish
				if ( queue[ index ] && queue[ index ].finish ) {

					// 执行 queue[ index ].finish.call( this )
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			// 关闭结束标志
			// 执行 delete data.finish
			delete data.finish;
		} );
	}
} );

// 执行 jQuery.each 遍历["toggle", "show", "hide"]
jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {

	// 声明 cssFn 赋值 jQuery.fn[ name ]
	var cssFn = jQuery.fn[ name ];

	// jQuery.fn[ name ] 赋值 匿名函数
	jQuery.fn[ name ] = function( speed, easing, callback ) {

		// 返回 speed == null 或者 typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback)
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
// 生成自定义动画的快捷方式
// 使用 jQuery.each 遍历以下对象
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {

	// jQuery.fn[ name ] 赋值 匿名函数
	jQuery.fn[ name ] = function( speed, easing, callback ) {

		// 返回 this.animate( props, speed, easing, callback )
		return this.animate( props, speed, easing, callback );
	};
} );

// jQuery.timers 赋值 []
jQuery.timers = [];

// jQuery.fx.tick 赋值 匿名函数
jQuery.fx.tick = function() {

	// 初始化 timer
	var timer,

		// 声明 i 赋值 0
		i = 0,

		// 声明 timers 赋值 jQuery.timers
		timers = jQuery.timers;

	// fxNow 赋值 Date.now()
	fxNow = Date.now();

	// 遍历 timers.length
	for ( ; i < timers.length; i++ ) {

		// timer 赋值 timers[ i ]
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		// 运行计时器并安全删除它（完成外部删除）
		// 判断 !timer() 并且 timers[ i ] === timer
		if ( !timer() && timers[ i ] === timer ) {

			// 执行 timers.splice( i--, 1 )
			timers.splice( i--, 1 );
		}
	}

	// 判断 !timers.length
	if ( !timers.length ) {

		// 执行 jQuery.fx.stop()
		jQuery.fx.stop();
	}

	// fxNow 赋值 undefined
	fxNow = undefined;
};

// jQuery.fx.timer 赋值 匿名函数
jQuery.fx.timer = function( timer ) {

	// 执行 jQuery.timers.push( timer )
	jQuery.timers.push( timer );

	// 执行 jQuery.fx.start()
	jQuery.fx.start();
};

// jQuery.fx.interval 赋值 13
jQuery.fx.interval = 13;

// jQuery.fx.start 赋值 匿名函数
jQuery.fx.start = function() {

	// 判断 inProgress 满足则 返回
	if ( inProgress ) {
		return;
	}

	// inProgress 赋值 true
	inProgress = true;

	// 执行 schedule()
	schedule();
};

// jQuery.fx.stop 赋值 匿名函数
jQuery.fx.stop = function() {

	// inProgress 赋值 null
	inProgress = null;
};

// jQuery.fx.speeds 赋值 对象
jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	// 默认速度
	_default: 400
};

// 返回 jQuery
return jQuery;
} );
