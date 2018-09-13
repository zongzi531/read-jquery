define( function() {

"use strict";

// 声明 addGetHookIf 函数
function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	// 定义钩子，如果需要，我们会检查第一次运行。
	// 返回 对象
	return {

		// get 方法
		get: function() {

			// 判断 conditionFn()
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				// 钩子不需要（或者由于缺少依赖性而不能使用它），删除它。
				// 执行 delete this.get
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			// 需要钩子；重新定义它，以便不再次执行支持测试。
			// 返回 ( this.get 赋值 hookFn ).apply( this, arguments )
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}

// 返回 addGetHookIf
return addGetHookIf;

} );
