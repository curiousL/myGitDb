window.addEventListener("load",function(){
	floor.init();
},false);
//为所有元素添加获得距页面顶部距离的方法，返回一个top值
HTMLElement.prototype.getElementTop=function(){
	//获得当前元素距父元素顶部的距离，保存在变量top中
	var top=this.offsetTop;
	//将当前元素的相对定位父元素对象保存在变量curr中
	var curr=this.offsetParent;
	//循环，只要curr不等于null，就继续获得父元素的父元素
	while(curr!=null){
	//	再次获得curr距它的父元素顶部的距离，累加到top中
	    top+=curr.offsetTop;
	//	将curr再设置为curr的相对定位的父元素
	    curr=curr.offsetParent;
	}
	return top;
}
var floor={
	init:function(){
		var self=this;
		window.addEventListener("scroll",function(){
			//获得页面滚动的高度
			var scrollTop=
				document.documentElement.scrollTop
				||document.body.scrollTop;
			//找到class为floor的div下的head下的所有span，保存在数组spans中
			var spans=$("div.floor>header>span");
			//遍历spans中每个span
			for(var i=0;i<spans.length;i++){
			//	获得当前span距页面顶部的距离，保存在变量spanTop中
				var spanTop=spans[i].getElementTop();
			//	如果spanTop刚好结余文档显示区范围内时
				if(spanTop>scrollTop+100
			&&spanTop<scrollTop+window.innerHeight-100){
			//		设置当前span的className为"hover"
					spans[i].className="hover";
				}else{//  否则
			//		清除当前span的className
					spans[i].className="";
				}
			}
			self.elevState();
		},false);
		$("#elevator>ul").addEventListener("mouseover",
			function(){
				var e=window.event||arguments[0];
				var target=e.srcElement||e.target;
				if(target.nodeName=="A"
					&&target.className!="etitle"){
						target.style.display="none";
						target.parentNode.$(".etitle")
							.style.display="block";
				}
			},false);
		$("#elevator>ul").addEventListener("mouseout",
			function(){
				var e=window.event||arguments[0];
				var target=e.srcElement||e.target;
				if(target.nodeName=="A"
					&&target.className=="etitle"
					&&$(target.href.slice(-3)+">header>span").className!="hover"){
						target.style.display="none";
					target.parentNode.$("a:first-child")
							.style.display="block";
				}
			},false);
	},
	elevState:function(){
		//判断elevator元素的显示状态
		$("#elevator").style.display=
			$("div.floor>header>span.hover").length!=0?
										"block":"none";
		//获得所有span的数组和所有li的数组
		var spans=$("div.floor>header>span");
		var lis=$("#elevator>ul>li");
		//遍历spans中每个span
		for(var i=0;i<spans.length;i++){
		//	在lis中找到相同位置的li
			var li=lis[i];
		//	如果当前span的class为hover
			if(spans[i].className=="hover"){
		//		在li下找第一个a，隐藏
			li.$("a:first-child").style.display="none";
		//		在li下找第二个a，显示
			li.$("a:first-child+a").style.display="block";
			}else{//	否则
		//		在li下找第一个a，显示
			li.$("a:first-child").style.display="block";
		//		在li下找第二个a，隐藏
			li.$("a:first-child+a").style.display="none";
			}
		}
	}
}