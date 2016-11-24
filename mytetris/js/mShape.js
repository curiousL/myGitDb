//构造图形
//每图4格，各个格子的属性位置不同图形相同:定义构造函数Cell
function Cell(r,c){
	this.r=r;this.c=c;this.src="";
}
//定义旋转状态state时各格子的位置
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0;this.c0=c0;
	this.r1=r1;this.c1=c1;
	this.r2=r2;this.c2=c2;
	this.r3=r3;this.c3=c3;
}
/*抽象公共父类型Shape*/
//定义父类型构造函数Shape,定义参数src,cells
function Shape(src,cells,orgi,states){
	this.cells=cells;
	for (var i=0; i<this.cells.length;i++){
		this.cells[i].src=src
	}
	this.orgi=orgi;
	this.states=states;
	this.statei=0;
}
//在Shape的原型对象中添加共有属性IMGS，继承给Cell
Shape.prototype.IMGS={
	T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	J:"img/J.png",
	L:"img/L.png",
	S:"img/S.png",
	Z:"img/Z.png"
}
//在Shape类型的原型对象中，添加公有下左右方法
Shape.prototype.moveDown=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r++;
	}
}
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c--;
	}
}
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c++;
	}
}
//给图形添加共有方法：rotateR，rotateL
Shape.prototype.rotateR=function(){
	this.statei++;
	this.statei==this.states.length&&(this.statei=0);
	this.rotate();
}
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];
	for(var i=0;i<this.cells.length;i++){
		var cell=this.cells[i];
		cell.r=orgCell.r+state["r"+i];
		cell.c=orgCell.c+state["c"+i];
	}
}
Shape.prototype.rotateL=function(){
	this.statei--;
	this.statei==-1&&(this.statei=this.states.length-1);
	this.rotate();
}
//定义各图形
//构造函数T
function T(){
	//用构造函数Shape，传入参数
	Shape.call(this,this.IMGS.T,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,4)
		],1,[
		new State(0,-1,0,0,0,+1,1,0),
		new State(-1,0,0,0,+1,0,0,-1),
		new State(0,+1,0,0,0,-1,-1,0),
		new State(+1,0,0,0,-1,0,0,+1)
		])
}
//让T类型额原型继承Shape类型的原型
Object.setPrototypeOf(T.prototype,Shape.prototype);
function O(){
	//用构造函数Shape，传入参数
	Shape.call(this,this.IMGS.O,[
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,4),
		new Cell(1,5)
		],0,[
		new State(0,0,0,+1,+1,0,+1,+1)
		])
}
//让O类型额原型继承Shape类型的原型
Object.setPrototypeOf(O.prototype,Shape.prototype);
//同上
function I(){
	//用构造函数Shape，传入参数
	Shape.call(this,this.IMGS.I,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(0,5),
		new Cell(0,6)
		],1,[
		new State(0,-1,0,0,0,+1,0,+2),
		new State(-1,0,0,0,+1,0,+2,0)
		])
}
//让T类型额原型继承Shape类型的原型
Object.setPrototypeOf(I.prototype,Shape.prototype);


