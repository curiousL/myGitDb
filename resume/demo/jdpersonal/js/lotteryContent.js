// 完成幸运转盘的功能
$(function(){
	// 1. 获取<cavnas>元素
	var canvas = document.getElementById("lotteryCvs");
	// 2. 创建画布对象
	var context = canvas.getContext("2d");
	// 3. 得到画布的宽度和高度
	const WIDTH = canvas.width;
	const HEIGHT = canvas.height;
	// 4. 将画布向右下平移 (画布宽度/2,画布高度/2)
	context.translate(WIDTH/2,HEIGHT/2);
	// 5. 加载幸运转盘和指针的图片 地址为相对html的位置
	var as = new Image();
	as.src = "img/as.png";
	as.width = 499;
	as.height = 499;

	var pin = new Image();
	pin.src = "img/pin.png";
	pin.width = 358;
	pin.height = 301;
	// 6. 初始化旋转的角度
	var du = 0,cha = 0;
	var flag = false;//开关
	var startTime;//定义开始时间
	// 7. 当点击button按钮时,开始旋转
	$("#btnLottery").click(function(){
		flag = true;
		// 获取开始旋转的时间
		startTime = new Date().getTime();
		// 将button按钮禁用掉
		$(this).attr("disabled","disabled");
		// 随机生成一个角度 (0 - 180)
		du = parseInt(Math.random() * 180);
		// 第二次旋转时,重新设置setInterval()
	});
	// 绘制静态效果以及第一次的旋转
	var t = setInterval(function(){
		// 绘制幸运转盘和指针的图片 图片加载可能有先后 指针可能被转盘覆盖
		// 
		context.drawImage(as,-as.width/2,-as.height/2);
		context.drawImage(pin,-pin.width/2+10,-pin.height/2-10);
		// 旋转逻辑
		if(flag){
			du = du + cha;//匀速 - 每次累加值相同
		}
		// a. 将画布旋转角度
		context.rotate(Math.PI/180*du);
		// b. 再次绘制幸运转盘图片
		context.drawImage(as,-as.width/2,-as.height/2);
		// c. 将画布旋转角度
		context.rotate(-Math.PI/180*du);
		// d. 再次绘制指针图片
		context.drawImage(pin,-pin.width/2+10,-pin.height/2-10);
		// 获取当前时间
		var endTime = new Date().getTime();
		// 判断当前时间-开始时间>=10,停止
		if(endTime-startTime <= 5000){//前5秒
			// 加速 - 每次累加值(本身也累加)
			cha++;
		}else if(endTime-startTime <= 10000){//后5秒
			// 减速 - 每次累加值(本身在减少)
			cha--;
		}else{
			//clearInterval(t);
			flag = false;
			// 重新启用button按钮
			$("#btnLottery").removeAttr("disabled");
		}
	},100);
	/*
	   问题:
	   * 只能抽一次奖 - 如何解决反复抽奖
	   * 效果
	     * 前5秒,加速运动
		 * 后5秒,减速运动
		 * 到10秒,停止
	   * 绘制幸运转盘时,根据随机角度绘制
	 */
});