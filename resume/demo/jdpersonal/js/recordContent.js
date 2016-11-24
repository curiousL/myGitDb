// 完成消费记录的折线图的绘制
$(function(){
	// 初始化消费记录的数据
	var data = [1200,2000,3000,500,200,800,1800,2200,2600,1000,600,300];
	
	// 1. 获取<canvas>元素
	var canvas = document.getElementById("recordCvs");
	// 2. 创建画布对象
	var context = canvas.getContext("2d");
	// 3. 获取画布的宽度和高度
	const WIDTH = canvas.width;
	const HEIGHT = canvas.height;
	// 4. 定义绘制坐标轴的"内边距"
	var padding = {
		top : 10,
		left : 50,
		bottom : 30,
		right : 22
	}
	// 5. 绘制坐标轴
	context.beginPath();
	context.moveTo(padding.left,padding.top);
	context.lineTo(padding.left,HEIGHT-padding.bottom);
	context.lineTo(WIDTH-padding.right,HEIGHT-padding.bottom);
	context.stroke();
	// 6. 绘制坐标轴端点的箭头
	context.beginPath();
	context.moveTo(padding.left-10,padding.top+20);
	context.lineTo(padding.left,padding.top);
	context.lineTo(padding.left+10,padding.top+20);
	context.stroke();

	context.beginPath();
	context.moveTo(WIDTH-padding.right-20,HEIGHT-padding.bottom-10);
	context.lineTo(WIDTH-padding.right,HEIGHT-padding.bottom);
	context.lineTo(WIDTH-padding.right-20,HEIGHT-padding.bottom+10);
	context.stroke();
	/*
	   7. 绘制x轴的刻度
	   * 计算x轴的长度
	   * 12个月 - 将x轴的长度等分为12份,每一份的距离每两个月之间的距离
	     * 计算出12个月刻度的x轴值
	   * 因为为x轴绘制刻度,所以所有刻度的y轴值相同
	 */
	var xLength = WIDTH - padding.left - padding.right;

	for(var i=1;i<12;i++){
		context.beginPath();
		context.moveTo(padding.left+xLength/12*i,HEIGHT-padding.bottom);
		context.lineTo(padding.left+xLength/12*i,HEIGHT-padding.bottom+5);
		context.stroke();
	}
	// 8. 绘制12个月信息
	for(var i=1;i<=12;i++){
		context.font = "12px 微软雅黑";
		context.textAlign = "center";
		context.fillText(i+"月",padding.left+xLength/12*(i-1),HEIGHT-padding.bottom+18);
	}
	/*
	   9. 绘制y轴的刻度
	   * 得到12个月消费记录中的最大值
	   * 关键点 - 如何确定3000最大值的刻度坐标值
	     * 根据y轴的起点坐标值,计算最大值的坐标值
	   * 计算从最大值刻度到原点的距离
	   * 将得到的距离,等分4份
	 */
	
		//内置对象Math
	var max = Math.max.apply(Math,data);
	// 计算最大值的刻度到原点的距离
	var yLength = HEIGHT - (padding.top + 50) - padding.bottom;
	// 绘制y轴的刻度
	for(var i=0;i<4;i++){
		context.beginPath();
		context.moveTo(padding.left,padding.top+50+yLength/4*i);
		context.lineTo(padding.left-5,padding.top+50+yLength/4*i);
		context.stroke();
	}
	// 绘制y轴的金额
	for(var i=0;i<4;i++){
		context.font = "12px 微软雅黑";
		context.textAlign = "right";
		context.fillText(max-max/4*i,padding.left-10,padding.top+55+yLength/4*i);
	}
	/*
	   10. 绘制折线图
	   * 遍历存储数据的数组
	   * 根据金额计算每个点的坐标值(x,y)
	     * x - padding.left + xLength/12*i
		 * y - HEIGHT - padding.bottom - length
		   * 计算单位金额的距离 - yLength/max
		   * 计算原点到当前点的距离 - data[i]*(yLength/max) = length
	   * 
	 */
	context.beginPath();
	for(var i=0;i<data.length;i++){
		// 计算原点到当前点的距离
		var length = data[i]*(yLength/max);
		context.font = "12px 微软雅黑";
		if(i==0){
			context.textAlign = "left";
			context.textBaseline = "middle";

			context.moveTo(padding.left+xLength/12*i,HEIGHT-padding.bottom-length);
		}else{
			context.textAlign = "center";
			context.textBaseline = "bottom";

			context.lineTo(padding.left+xLength/12*i,HEIGHT-padding.bottom-length);
		}
		context.fillText(data[i],padding.left+xLength/12*i,HEIGHT-padding.bottom-length);
	}
	context.stroke();
	// 11. 为折线中每个点绘制一个圆形
	for(var i=0;i<12;i++){
		var length = data[i]*(yLength/max);
		context.beginPath();
		context.arc(padding.left+xLength/12*i,HEIGHT-padding.bottom-length,3,0,Math.PI*2);
		context.fill();
	}
	/* 12. 绘制折线点的值
	for(var i=0;i<data.length;i++){
		var length = data[i]*(yLength/max);
		context.font = "12px 微软雅黑";
		if(i==0){
			context.textAlign = "left";
			context.textBaseline = "middle";
		}else{
			context.textAlign = "center";
			context.textBaseline = "bottom";
		}

		context.fillText(data[i],padding.left+xLength/12*i,HEIGHT-padding.bottom-length);
	}*/
});