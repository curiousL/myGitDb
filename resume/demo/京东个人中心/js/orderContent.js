// 完成查询订单列表的功能

/*
   为String扩展方法 - 将0,1,2,3,4,...替换成真实的数据
   * 将真实的数据内容,作为实参传递给当前方法formate
     * 利用arguments对象可以得到所有的实参
	 * 遍历过程中,arguments[i]表示每个实参的内容
   * 检索字符串的话,一般使用正则表达式
     * 正则表达式 - new RegExp("\\{"+i+"\\}","gm")
   * 扩展String的方法,this指代调用该方法的String
   * 利用replace()方法进行替换
 */
String.prototype.formate = function(){
	// 得到HTML模板内容
	var string = this;
	// 遍历真实的数据内容
	for(var i=0;i<arguments.length;i++){
		string = string.replace(new RegExp("\\{"+i+"\\}","gm"),arguments[i]);
	}
	return string;
}

$(function(){
	/*
	   定义所需要的HTML模板
	   0 - 订单编号
	   1 - 商店地址
	   2 - 商店名称
	   3 - 图片链接
	   4 - 商品描述
	   5 - 收货人
	   6 - 商品价格
	   7 - 支付方式
	   8 - 订单日期
	   9 - 订单时间
	   10 - 订单状态
	 */
	var html = '<tr class="trOrder">'
					+'<td colspan="6">'
					+'<span>订单编号: {0}</span>'
					+'<span><a href="{1}" target="_blank">{2}</a></span>'
					+'</td>'
			   +'</tr>'
			   +'<tr class="trProd">'
					+'<td>'
					+'<div class="imgList">'
					+'<a href="9545709796" target="_blank"><img src="{3}" width="50" height="50" title="{4}" /></a>'
					+'</div>'
					+'</td>'
					+'<td>{5}</td>'
					+'<td>￥{6}<br/>{7}</td>'
					+'<td>{8}<br/>{9}</td>'
					+'<td>{10}</td>'
					+'<td>'
					+'<a href="{0}">查看</a>|<a href="{1}">删除</a><br/>'
					+'<a href="{2}">评价晒单</a><br/>'
					+'<a class="btn_buy_again" href="{3}">还要买</a>'
					+'</td>'
				+'</tr>';
	
	$.get("server.php",function(data){
		var newHtml = "";
		// 1. 遍历JSON格式的数据
		for(var i=0;i<data.length;i++){
			var order = data[i];
			var date = order.payTime.split(" ")[0];
			var time = order.payTime.split(" ")[1];
			var temp = html.formate(order.orderId,
						 order.shopAddr,
						 order.shopName,
						 order.imgLink,
						 "",
						 order.userName,
						 order.payMoney,
						 order.payMode,
						 date,
						 time,
						 order.payState
						);
			newHtml += temp;
		}
		$("#orderList").append($(newHtml));
	},"json");
});