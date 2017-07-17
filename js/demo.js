//var me = true;
var over = false;
var chessBorde = [];
//赢法数组
var wins = [];
//赢法统计数组
var mywin = [];
var computerwin = [];
for(var i =0;i<15;i++){
	chessBorde[i]=[];
	for(var j=0;j<15;j++){
		chessBorde[i][j]=0;
	}
}
for(var i=0; i<15; i++){
	wins[i] = [];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}
var counts = 0;
for(var i=0; i<15; i++){
	//横线上所有的赢法
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i][j+k][counts] = true;
		}
		counts++;
	}
}
for(var i=0; i<11; i++){
	//竖线上所有的赢法
	for(var j=0; j<15; j++){
		for(var k=0; k<5; k++){
			wins[i+k][j][counts] = true;
		}
		counts++;
	}
}
for(var i=0; i<11; i++){
	//斜线上所有的赢法
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i+k][j+k][counts] = true;
		}
		counts++;
	}
}
for(var i=0; i<11; i++){
	//反斜线上所有的赢法
	for(var j=14; j>3; j--){
		for(var k=0; k<5; k++){
			wins[i+k][j-k][counts] = true;
		}
		counts++;
	}
}
console.log(counts);
for(var i=0; i<counts; i++){
	mywin[i] = 0;
	computerwin[i] = 0;
}
var chess = document.getElementById('chess');
var context = chess.getContext('2d');
context.strokeStyle = "#BFBFBF";
var bg = new Image();
bg.src = "images/11.jpg";
bg.onload = function(){
	context.drawImage(bg,0,0,450,450);
	drawChessBorder();
}
//画棋盘
var drawChessBorder = function(){
	for(var i=0;i<15;i++){
		context.moveTo(15+30*i,15);
		context.lineTo(15+30*i,435);
		context.stroke();
		context.moveTo(15,15+30*i);
		context.lineTo(435,15+30*i);
		context.stroke();
	}
}
var oneStep = function(i,j,s){
	//画圆
	context.beginPath();
	context.arc(15+30*i,15+30*j,13,0,2*Math.PI);
	context.closePath();
	//创建渐变对象
	var gradient = context.createRadialGradient(15+30*i+2,15+30*j-2,13,15+30*i+2,15+30*j-2,0);
	if(s){
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();
}
chess.onclick = function(e){
	if(over){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	if(chessBorde[i][j]==0){
		oneStep(i,j,true);
		chessBorde[i][j] = 1;
		for(var k=0; k<counts; k++){
			if(wins[i][j][k]){
				mywin[k]++;
				computerwin[k] = 6;
				if(mywin[k]==5){
					alert("你赢了");
					over = true;
				}
			}
		}
		if(!over){
			computerAI();
		}
	}
	
}
var computerAI = function(){
	var myScore = [];
	var max=0;
	var u=0,v=0;
	var computerScore = [];
	for(var i=0; i<15; i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0; j<15; j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	for(var i=0; i<15; i++){
		for(var j=0; j<15; j++){
			if(chessBorde[i][j]==0){
				for(var k=0; k<counts; k++){
					if(wins[i][j][k]){
						if(mywin[k]==1){
							myScore[i][j]+=200;
						}else if(mywin[k]==2){
							myScore[i][j]+=400;
						}else if(mywin[k]==3){
							myScore[i][j] +=2000;
						}else if(mywin[k]==4){
							myScore[i][j] +=10000;
						}
						if(computerwin[k]==1){
							computerScore[i][j]  +=400;
						}else if(computerwin[k]==2){
							computerScore[i][j]+=800;
						}else if(computerwin[k]==3){
							computerScore[i][j] +=2600;
						}else if(computerwin[k]==4){
							computerScore[i][j] +=22000;
						}
					}
				}
				if(myScore[i][j]>max){
					max = myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max = computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	console.log(max);
	chessBorde[u][v]=2;
	for(var k=0; k<counts; k++){
			if(wins[u][v][k]){
				computerwin[k]++;
				mywin[k] = 6;
				if(computerwin[k]==5){
					alert("计算机赢了");
					over = true;
				}
			}
		}
		if(over){
			return;
		}
}