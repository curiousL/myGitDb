var game={
	data:[],
	RN:4,//行数
	CN:4,//列数
	score:0,
	state:1,//游戏状态
	RUNNING:1,//运行
	GAMEOVER:0,//结束
	getGeziHTML:function(){//背景格子
		for (var r=0,arr=[]; r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="g'
				+arr.join('" class="gezi"></div><div id="g')
				+'" class="gezi"></div>';
	},
	getCellHTML:function(){//显示的格子
		for (var r=0,arr=[]; r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="c'
				+arr.join('" class="cell"></div><div id="c')
				+'" class="cell"></div>';
	},
	start:function(){
		var panel=document.getElementById("gezi");//生成html
		panel.innerHTML=
				this.getGeziHTML()+this.getCellHTML();
		panel.style.height=this.RN*116+16+"px";//宽高
		panel.style.width=this.CN*116+16+"px";
		this.data=[];// 开始清空原数组
		for(var r=0;r<this.RN;r++){  //生成全0格子数组
			this.data.push([]);
			for(var c=0;c<this.CN;c++){
				this.data[r].push(0);
			}
		}
		this.score=0;//开始游戏，重置分数
		this.state=this.RUNNING;//重置游戏状态为运行中
		document.getElementById("gameOver").style.display="none";
		// document.getElementById("gameOver").style.display="none";
		this.randomNum(); this.randomNum();
		this.updateView();
	},
	randomNum:function(){ //生成随机2 4 
		if(!this.isFull()){
			for(;;){
				var r=Math.floor(Math.random()*this.RN);
				var c=Math.floor(Math.random()*this.CN);
				if(this.data[r][c]==0){
					this.data[r][c]=Math.random()>0.5?4:2;
					break;
				}
			}
		}
	},
	isFull:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				}
			}
		}
		return true;
	},
	updateView:function(){ //更新界面
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//找到页面上和当前位置对应的div
			    var divObj=document.getElementById("c"+r+c);
				if(this.data[r][c]==0){//如果当前值为0
					divObj.innerHTML="";//清除innerHTML
				//  还原className为"cell"
					divObj.className="cell";
				}else{//否则,将当前值放入innerHTML
					divObj.innerHTML=this.data[r][c];
				//  修改className为"cell n"+当前值
					divObj.className="cell n"+this.data[r][c];
				}
			}
		}
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		if(this.isGameOver()){
			//设置当前游戏对象的状态为GAMEOVER
			this.state=this.GAMEOVER;
			//找到id为finalScore的span，将游戏的score放入内容中
			document.getElementById("finalScore")//->span
				    .innerHTML=this.score;
			//找到id为gameOver的div，设置display属性为block
			document.getElementById("gameOver")//->div
				    .style.display="block";
		}
	},

	moveLeft:function(){
		var before=this.data.toString();//移动前数组
		for(var r=0;r<this.RN;r++){
			this.moveLeftInRow(r);//左移一行
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.updateView();
		}
	},
	moveLeftInRow:function(r){//左移第r行
		for(var c=0;c<this.CN-1;c++){
			//找c后值不为0的位置，存在nextc中
			var nextc=this.getNextInRow(r,c);
			if(nextc==-1){
				break;
			}else{
				if(this.data[r][c]==0){//为0换值
					this.data[r][c]=this.data[r][nextc];
					this.data[r][nextc]=0;
					c--;
				}else if(this.data[r][c] //相等合并
					==this.data[r][nextc]){
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					this.data[r][nextc]=0;
				}
			}

		}
	},
	getNextInRow:function(r,c){////找c后值不为0的位置，存在nextc中
		for(var nextc=c+1;nextc<this.CN;nextc++){
			if(this.data[r][nextc]!=0){
				return nextc;
			}
		}
		return -1;
	},
	moveRight:function(){//右移行,类似于moveLeft
		var before=this.data.toString();
		for(var r=0;r<this.RN;r++){
			this.moveRightInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.updateView();
		}
	},
	moveRightInRow:function(r){//右移行函数 类似左
		for(var c=this.CN-1;c>0;c--){
			var prevc=this.getPrevInRow(r,c);
			if(prevc==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][prevc];
					this.data[r][prevc]=0;
					c++;
				}else if(this.data[r][c]
					==this.data[r][prevc]){
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					this.data[r][prevc]=0;
				}
			}
		}
	},
	getPrevInRow:function(r,c){//同左
			for(var prevc=c-1;prevc>=0;prevc--){
			if(this.data[r][prevc]!=0){
				return prevc;
			}
		}
		return -1;
	},
	moveUp:function(){ //上移
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);//移动每列
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.updateView();
		}
	},
	moveUpInCol:function(c){  //上移每列函数
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
		if(nextr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					this.data[nextr][c]=0;
					r--;
				}else if(this.data[r][c]
					==this.data[nextr][c]){
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					this.data[nextr][c]=0;
				}
			}
		}
	},
	getNextInCol:function(r,c){//找列中下一个值不为0的位置
		for(var nextr=r+1;nextr<this.RN;nextr++){
			if(this.data[nextr][c]!=0){
				return nextr;
			}
		}
		return -1;
	},
	moveDown:function(){//下移每列
		var before=this.data.toString();
		for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.updateView();
		}
	},
	moveDownInCol:function(c){//下移c列函数
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getPrevInCol(r,c);
			if(prevr==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[prevr][c];
					this.data[prevr][c]=0;
					r++
				}else if(this.data[r][c]
						==this.data[prevr][c]){
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					this.data[prevr][c]=0;
				}
			}
		}
	},
	getPrevInCol:function(r,c){//c列上一个值不为0的位置
		for(var prevr=r-1;prevr>=0;prevr--){
			if(this.data[prevr][c]!=0){
				return prevr;
			}
		}
		return -1;
	},

	isGameOver:function(){//判断游戏的状态	
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){//有空位
					return false;
				}else if(c<this.CN-1&& //左右等值
					this.data[r][c]==this.data[r][c+1]){
					return false;
				}else if(r<this.RN-1&&//上下等值
					this.data[r][c]==this.data[r+1][c]){
					return false;
				}
			}
		}
		return true;
	}
}
//window加载完后
 window.onload=function(){
 	game.start();
 	//键盘事件
 	document.onkeydown=function(){
 		if(game.state=game.RUNNING){
 			var e=window.event||arguments[0];
 			var code=e.keyCode;
 			if(code==37){
				game.moveLeft();
			}else if(code==39){
				game.moveRight();
			}else if(code==38){
				game.moveUp();
			}else if(code==40){
				game.moveDown();
			}
 		}
 	}
 }