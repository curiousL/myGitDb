/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems==null?null:
	   elems.length==1?elems[0]:
		               elems;
}
/*广告图片数组*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];
var adv={
	LIWIDTH:670,//每个广告图片的宽度
	DURATION:500,//动画总时长
	WAIT:3000,//自动轮播之间等待的时长
	STEPS:150,//动画移动的总步数
	timer:null,//保存当前正在播放的定时器序号
	canAuto:true,//设置是否可以自动轮播

	init:function(){
		var self=this;
		self.updateView();
		
		//当鼠标进出广告区域时，禁用或启用自动轮播
		$("#slider").addEventListener("mouseover",function(){
			self.canAuto=false;
		},false);
		$("#slider").addEventListener("mouseout",function(){
			self.canAuto=true;
		},false);

		self.automove();//初始化时，就启动自动轮播

		//找到id为indexs的ul，绑定鼠标进入事件
		$("#indexs").addEventListener("mouseover",function(){
		//	获得目标元素target
			var e=window.event||arguments[0];
			var target=e.srcElement||e.target;
		//	如果target是LI，且target.innerHTML-1不等于imgs数组中第一个元素的i属性
			if(target.nodeName=="LI"
				&&target.innerHTML-1!=imgs[0].i){
		//		获取id为indexs下class为hover的li对象，清除样式类
				$("#indexs>.hover").className="";
		//		将target的className设置为"hover"
				target.className="hover";
		//		计算移动个数target的内容-1-imgs数组中第一个元素的i属性，保存在变量n中
				var n=target.innerHTML-1-imgs[0].i;
		//		调用move方法启动手动移动，传入n
				self.move(n);
			}
		},false);
	},
	//移动任意个li的方法——手动轮播
	move:function(n){//n表示要移动的li个数，左移为正
		//停止当前正在运行的timer动画，将timer设置为null
		clearTimeout(this.timer);

		this.timer=null;
		if(n<0){//如果右移
		//	将imgs数组结尾的-n个元素删除后，拼接到imgs数组开头，再保存回imgs中
			imgs=imgs.splice(imgs.length+n,-n).concat(imgs);
		//	调用updateView方法刷新界面
			this.updateView();
		//	设置id为imgs的ul的left为n*LIWIDTH
			$("#imgs").style.left=n*this.LIWIDTH+"px";
		}

		this.moveStep(n);//调用moveStep方法，传入n
	},
	//在移动前后，将imgs数组的内容刷新到页面
	updateView:function(){
		$("#imgs").style.width=//计算ul的总宽度
			this.LIWIDTH*imgs.length+"px";

		//遍历imgs中每个img对象,同时声明lis和idxs空数组
		for(var i=0,lis=[],idxs=[];i<imgs.length;i++){
		//	在lis中当前位置添加新元素：<li data-i="当前对象的i"><img src="当前对象的img"></li>
			lis[i]="<li data-i='"+imgs[i].i
					+"'><img src='"+imgs[i].img+"'></li>"
		//	在idxs中当前位置添加新元素:<li>i+1</li>
			idxs[i]="<li>"+(i+1)+"</li>";
		}//(遍历结束后)
		//设置id为imgs的ul的内容为lis无缝拼接后的结果
		$("#imgs").innerHTML=lis.join("");
		//设置id为indexs的ul的内容为idxs无缝拼接后的结果
		$("#indexs").innerHTML=idxs.join("");

		//找到#indexs下的class为hover的li，清除class
		$("#indexs>.hover").className="";
		//找到#indexs下所有li中下标和imgs数组中第一个对象的i属性相同的li，设置class为hover
		$("#indexs>li")[imgs[0].i].className="hover";
	},
	automove:function(){
		var self=this;//留住this
		//启动一次性定时器，传入匿名函数封装的moveStep方法调用，在moveStep方法中写死参数1，设置时间间隔为WAIT
		self.timer=setTimeout(function(){
			if(self.canAuto){//如果启用了自动轮播
				self.moveStep(1);//才移动一次
			}else{//如果禁用了自动轮播
				self.automove();//就反复等待
			}
		},self.WAIT);
	},
	//将ul移动一步
	moveStep:function(n){//n表示要移动的li个数，左移为正
		var self=this;//留住this
		//计算步长：LIWIDTH*n/STEPS，保存在变量step中
		var step=self.LIWIDTH*n/self.STEPS;
		//获得id为imgs的ul计算后的样式，保存在变量style中
		var style=getComputedStyle($("#imgs"));
		//计算新left值:style的left-step，保存在变量left中
		var left=parseFloat(style.left)-step;
		//将新left值设置到id为imgs的ul元素的left属性上
		$("#imgs").style.left=left+"px";
		//如果n>0且新left值>-LIWIDTH*n或n<0且新left值<0
		if(n>0&&left>-self.LIWIDTH*n||n<0&&left<0){
		//	启动下一次定时器，传入匿名函数封装moveStep方法调用，同时传入DURATION/STEPS作为时间间隔
			self.timer=setTimeout(function(){
				self.moveStep(n);
			},self.DURATION/self.STEPS);
		}else{//否则（说明移动完成）
		//	将id为imgs的ul的left属性重置为0px
			$("#imgs").style.left="0px";
		//  再次调用automove方法，启动自动轮播
			self.automove();
			if(n>0){//	如果n>0 （说明左移）
		//		从0位置开始删除原imgs数组中n个元素，删除结果直接拼接到imgs上，再保存回imgs变量中
				imgs=imgs.concat(imgs.splice(0,n));
		//		调用updateView方法，更新界面
				self.updateView();
			}
		}
	}
}
window.addEventListener("load",function(){
	adv.init();
},false);