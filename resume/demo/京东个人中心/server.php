<?php
	//查询所有的订单数据
	//建立连接
	$conn=mysqli_connect('127.0.0.1','root','','jd','3306');
	//定义SQL语句
	$sql='SELECT * FROM jd_order';
	mysqli_query($conn,"SET NAMES UTF8");
	$result=mysqli_query($conn,$sql);
	$arr=array();
	//将结果集对象（mysqli_result）解析为数组类型
	//$row=mysqli_fetch_array($result,MYSQLI_ASSOC)是其中一条数据
	while($row=mysqli_fetch_array($result,MYSQLI_ASSOC)){
		array_push($arr,$row);
	}
	$json=json_encode($arr);
	
	echo $json;

?>