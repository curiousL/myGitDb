var tetris={
  OFFSET:15,//保存容器的内边距
  CSIZE:26,//保存每个格子的宽高
  shape:null,//保存正在下落的图形
  nextShape:null,//保存下一个图形
  interval:1000,//保存图形下落的速度
  timer:null,//保存当前动画的序号
  wall:null,//保存所有已经停止下落的方块的二位数组
  RN:20,//总行数
  CN:10,//总列数
  lines:0,//保存消除的总行数
  score:0,//保存当前得分
  SCORES:[0,10,50,120,200],
        //0  1  2  3   4
  state:1,//保存当前游戏状态
  RUNNING:1,//运行中
  PAUSE:2,//暂停
  GAMEOVER:0,//结束

  LN:10,//每10行一级
  LNINTERVAL:100,//每升一级，interva减100毫秒
  MIN:100,//interval最小的毫秒数
  level:1,//保存当前游戏的等级


	start:function(){
		this.interval=1000;
		this.level=1;
		this.state=this.RUNNING;
		this.lines=0;
		this.score=0;
		this.wall=[];//强wll初始化为空数组
		for(var r=0;r<this.RN;r++){//设置wall每行的元素都为CN个元素的空数组
			this.wall[r]=new Array(this.CN);
		}
		this.shape=this.randomShape();//生成第一个主角
    	this.nextShape=this.randomShape();//生成第一个配角
		this.paint();//画出图形
		this.timer=setInterval(//开始定时器 下落
			this.moveDown.bind(this),this.interval);
		var me=this;//留住this 为当前页面绑定键盘事件
		document.onkeydown=function(e){
	      switch(e.keyCode){//判断键盘号
	        case 37: 
	          //如果游戏状态为RUNNING
	          if(me.state==me.RUNNING){
	            me.moveLeft();//如果是37: 左移
	          }
	          break;
	        case 39: 
	          //如果游戏状态为RUNNING
	          if(me.state==me.RUNNING){
	            me.moveRight();//如果是39: 右移
	          }
	          break;
	        case 40: 
	          //如果游戏状态为RUNNING
	          if(me.state==me.RUNNING){
	            me.moveDown();//如果是40: 下落
	          }
	          break;
	        case 38: 
	          //如果游戏状态为RUNNING
	          if(me.state==me.RUNNING){
	            me.rotateR();//如果是38: 右转
	          }
	          break;
	        case 90: 
	          //如果游戏状态为RUNNING
	          if(me.state==me.RUNNING){
	            me.rotateL();//如果是90: 左转
	          }
	          break;
	        case 83: 
	          //如果当前游戏的状态为GAMEOVER
	          if(me.state==me.GAMEOVER){
	            me.start();//如果是83: 启动
	          }
	          break;
	        case 80://暂停
	          //如果当前游戏的状态为RUNNING
	          if(me.state==me.RUNNING){
	            me.pause();
	          }
	          break;
	        case 67://继续
	          //如果当前游戏的状态为PAUSE
	          if(me.state==me.PAUSE){
	            me.myContinue();
	          }
	          break;
	        case 81://退出
	          //如果状态不是GAMEOVER
	          if(me.state!=me.GAMEOVER){
	            me.quit();
	          }
	          break;
	        case 32://一落到底
	          if(me.state==me.RUNNING){//如果状态为RUNNING
	            me.hardDrop();
	          }
	      }
	    }
    },
	hardDrop:function(){// 快速下落函数
		while(this.canDown()){
			this.shape.moveDown();
		}
		this.paint();
	},
	canDown:function(){//判断能否下落
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r==19
			   ||this.wall[cell.r+1][cell.c]!=undefined){
				return false;
			}
		}
		return true;
	},
	myContinue:function(){
	    this.state=this.RUNNING;
	    this.paint();
	  },
	pause:function(){
	    this.state=this.PAUSE;
	    this.paint();
	  },
	canRotate:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>19||cell.c<0||cell.c>9
				||this.wall[cell.r][cell.c]!=undefined){
				return false;
			}
		}
		return true;
	},
	rotateR:function(){//先旋转在判断是否可？不可反旋转：可画出图形
		this.shape.rotateR();
		!this.canRotate()?this.shape.rotateL():this.paint();
	},
	rotateL:function(){//同上
		this.shape.rotateL();
		!this.canRotate()?this.shape.rotateR:this.paint();
	},
	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]!=undefined){
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){
		if (this.canLeft()) {
			this.shape.moveLeft();
			this.paint();
		}
	},
	canRight:function(){
	    for(var i=0;i<this.shape.cells.length;i++){
	      //将当前cell保存在变量cell中
	      var cell=this.shape.cells[i];
	      if(cell.c==this.CN-1
	        ||this.wall[cell.r][cell.c+1]!=undefined){
	        return false;
	      }
	    }
	    return true;
	},
    moveRight:function(){//专门负责右移一次
	    if(this.canRight()){//如果可以右移
	      this.shape.moveRight();//让shape右移一次
	      this.paint();//重绘一切
	    }
  	},
  	quit:function(){
	    this.state=this.GAMEOVER;//修改游戏状态为GAMEOVER
	    clearInterval(this.timer);//停止定时器
	    this.timer=null;
	    this.paint();
	  },
    moveDown:function(){
		if(this.state==this.RUNNING){
			if(this.canDown()){
				this.shape.moveDown();
			}else{
				this.landIntoWall();
				var ln=this.deleteRows();
				this.lines+=ln;
				this.score+=this.SCORES[ln];
				if(this.lines>this.level*this.LN){
					this.level++;
					if(this.interval>this.MIN){
						this.interval-=this.LNINTERVAL;
						clearInterval(this.timer);
						this.timer=setInterval(
							this.moveDown.bind(this),this.interval);
					}
				}
				if(this.isGameOver()){//如果游戏结束
					this.quit();
				}else{//否则 下一个转正shape 生成下一个
					this.shape=this.nextShape;
					this.nextShape=this.randomShape();
				}
			}
			this.paint();//绘制
		}
	},
	paintState:function(){//暂停和结束状态时
		if(this.state==this.PAUSE){
      //创建一个新Image对象，保存在变量img中
	      var img=new Image();
	      img.src="img/pause.png";//设置img的src为pause.png
	      pg.appendChild(img);//将img追加到pg下
	    }else if(this.state==this.GAMEOVER){
	      var img=new Image();
	      img.src="img/game-over.png";
	      pg.appendChild(img);//将img追加到pg下
	    }
	},
	isGameOver:function(){
	    //遍历备胎图形中的每个cell
	    for(var i=0;i<this.nextShape.cells.length;i++){
	      var cell=this.nextShape.cells[i];
	      //如果wall中cell相同位置有格
	      if(this.wall[cell.r][cell.c]!=undefined){
	        return true;
	      }
	    }
	    return false;
	  },
	 paintNext:function(){//专门绘制备胎图形,方法同绘制shape位置改变
	    var frag=document.createDocumentFragment();
	    for(var i=0;i<this.nextShape.cells.length;i++){
	      var cell=this.nextShape.cells[i];
	      var img=new Image();
	      img.src=cell.src;
	      img.style.top=
	        this.OFFSET+(cell.r+1)*this.CSIZE+"px";
	      img.style.left=
	        this.OFFSET+(cell.c+10)*this.CSIZE+"px";
	      frag.appendChild(img);
	    }
	    pg.appendChild(frag)//将frag追加到id为pg的元素下
  	 },
	paintScore:function(){
	    lines.innerHTML=this.lines;
	    score.innerHTML=this.score;
	    level.innerHTML=this.level;
	  },
	deleteRows:function(){//自底向上遍历wall中行判断空？,声明变量ln=0        
	    for(var r=this.RN-1,ln=0;
	        r>=0&&this.wall[r].join("")!="";
	        r--){
	      if(this.isFull(r)){//如果当前行是满格
	        this.deleteRow(r);//调用deleteRow，删除当前行
	        r++;//r留在原地
	        ln++;//ln+1
	        if(ln==4){break}//如果ln等于4了，就退出循环
	      }
	    }
	    return ln;//返回ln
    },   
    deleteRow:function(delr){//删除第delr行，r从delr开始遍历
	    for(var r=delr;r>0;r--){
	        //将wall中r-1行赋值给wall中r行
	        this.wall[r]=this.wall[r-1];
            this.wall[r-1]=new Array(this.CN);
	    for(var i=0;i<this.CN;i++){//遍历wall中r行的每个格
	        //将当前格保存在cell中
	        var cell=this.wall[r][i];
	        //如果cell有效，就将cell的r+1
	        cell!==undefined&&cell.r++;
	    }
	    //如果wall中r-2行是空行，就退出循环
	    if(this.wall[r-2].join("")==""){break;}
	    }
  },
    isFull:function(r){//r行转字符串，正则search空？满格返回true
	    return String(this.wall[r]).search(/^,|,,|,$/)==-1
	  },
	randomShape:function(){//专门随机创建一个图形
    	//在0~2之间生成随机数，保存在变量r中
	    var r=parseInt(Math.random()*3);
	    switch(r){//判断r
	      //如果是0：返回一个新的O类型的图形对象
	      case 0: return new O(); 
	      //如果是1：返回一个新的I类型的图形对象
	      case 1: return new I();
	      //如果是2：返回一个新的T类型的图形对象
	      case 2: return new T();
	    }
	  },
  	landIntoWall:function(){//专门负责将主角放入wall中
    	//遍历shape中每个cell
	    for(var i=0;i<this.shape.cells.length;i++){
	      //将当前cell临时存储在变量cell中
	      var cell=this.shape.cells[i];
	      //将当前cell赋值给wall中相同位置
	      this.wall[cell.r][cell.c]=cell;
	    }
	},
	paintWall:function(){//绘制墙的方法
		//创建文档片段frag
		var frag=document.createDocumentFragment();
    	//自底向上遍历wall中每行
	    for(var r=this.RN-1;
	        r>=0&&this.wall[r].join("")!="";
	        r--){
	      for(var c=0;c<this.CN;c++){//遍历wall中r行每个格
	        //将当前格子，保存在变量cell中
	        var cell=this.wall[r][c];
	        if(cell){//如果cell有效
	          //创建一个新Image对象，保存在变量img中
	          var img=new Image();
	          img.src=cell.src;//设置img的src为cell的src
	          //设置img的top为OFFSET+cell的r*CSIZE
	          img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
	          //设置img的left为OFFSET+cell的c*CSIZE
	          img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
	          frag.appendChild(img);//将img追加到frag中
	        }
	      }
	    }//(遍历结束)
	    pg.appendChild(frag);//将frag追加到pg中
	  },
	paint:function(){//重绘一切
	    var reg=/<img[^>]*>/g
	    //用reg删除pg的内容中的所有img,结果再保存回pg的内容中
	    pg.innerHTML=pg.innerHTML.replace(reg,"");
	    this.paintShape();//绘制主角
	    this.paintNext();//绘制备胎
	    this.paintWall();//绘制墙
	    this.paintScore();//绘制分数
	    this.paintState();//绘制状态图片
	  },
	paintShape:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			frag.appendChild(img);
		}
		pg.appendChild(frag);
	}
 }


window.onload=function(){tetris.start();}