import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";
const born = [[1, 30], [33, 30], [66, 30], [98, 11], [42, 14]];
let level = 0;
let x;
let y;
let sx = 1;
let sy = 0;
const End = 100;
const map1 = [
"|     | |   |                                                                                       |",
"+---+ +<+   |                                                                                +---   |",
"|   | | | +-+          +---+                     --                          -      -      --+   \\  |",
"|   | | | |            |   |                    /                                                 | |",
"|   | | | |            |   +-------------------+*****Z****Z****Z****Z****Z******Z******Z**********| |",
"+^^^+ +^+ +---------+  |   |  finish           +--------------------------------------------------+ |",
"|   | | | |         |  |   |     \\             |                                                  | |",
"|   | | | |   +---+ |  +---+      \\            |  -   -   -   -   -   -   -   -   -   -   -   -   | |",
"|   |   |     |   |        |       \\           |>/ \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\    |",
"+^^^+--^+-----+---+--------+--------+-----------+-+-+---+---+---+---+---+---+---+---+---+---+---+---+",
"|   |   |     |                                                                                 |...|",
"|   |   |     |                                                                                 | |.|",
"|   |   |     |                                                      |                          | |.|",
"+^^^+ +-+  +--+ +-----     ------             |                   +--+      ---                 | |.|",
"|   | | |  |  | |                \\        +---+                   |        |***\\                | |.|",
"|   | | |  |  | |                 \\       |             ZZ        |        |****+--   -------     |.|",
"|     |    |    |                  \\      |                       |        |*****************\\    |.|",
"+^^^--+^---+^^--+^^^^^---+          \\     |******ZZ***********Z***|*****ZZ*|******************\\   |.|",
"+-----+----+----+--------+-------+---+----+-----------------+-----+--------+-------------------+--+.|",
"|                                |                          |     |                               |.|",
"|                                |              ---+--+---- |     |                    +---       |.|",
"|                                |                 |  |           |                   /           |.|",
"|                                |       -------   |  |           |                  /            |.|",
"|                         +----+ |                 |           /| |            -----+     |.......|.|",
"|                    -----+    | |                 |  +-------+ | |                       |.......|.|",
"|                              | +--------                      | |      +----+           |.......|.|",
"|             |                | |                              | |     /      \\          |.......|.|",
"|        -----+------          | |                              | |    /        \\         |.......|.|",
"|             |                | |        -----+                | |   /          \\        |.......|.|",
"|             |                |               |                |    /            \\       |.........|",
"+-------------+----------------+---------------+----------------+---+--------------+------+---------|"
];
function ty(){//check air
	return map1[y - 1][x] === ' ';
}
function die(){//check lava
	return map1[y][x] === '*';
}
function fin(x2, y2){//finish
	return map1[y2 - 1][x2] === 'f' || map1[y2 - 1][x2] === 'i' || map1[y2 - 1][x2] === 'n' || map1[y2 - 1][x2] === 's' || map1[y2 - 1][x2] === 'h';
}
function ok(x2, y2){//check air/water
	return map1[y2 - 1][x2] === ' ' || map1[y2 - 1][x2] === '.';
}
function slide(x2, y2){//check can slide
	return (map1[y2 - 1][x2] === '/' ? 1 : (map1[y2 - 1][x2] === '\\' ? -1 : 0));
}
function show(){
	let a = Math.max(x - 30, 0);
	let b = Math.max(y - 5, 0);
	if(a + 59 > End){
		a = End - 59;
	}
	if(b > 21){
		b = 21;
	}
	for(let i = b; i < b + 10; i++){
		for(let j = a; j < a + 60; j++){
			if(i === y - 1 && j === x){
				await functions.write("O")
			}else{
				if(map1[i][j] === '.'){
					await functions.write("\x1b[34;1m#\x1b[m");
				}else if(map1[i][j] === '*'){
					await functions.write("\x1b[31;1m*\x1b[m");
				}else if(map1[i][j] === 'Z'){
					await functions.write("\x1b[32;1mZ\x1b[m");
				}else if(map1[i][j] === '^'){
					await functions.write("\x1b[33;1m^\x1b[m");
				}else if(map1[i][j] === '>'){
					await functions.write("\x1b[33;1m>\x1b[m");
				}else if(map1[i][j] === '<'){
					await functions.write("\x1b[33;1m<\x1b[m");
				}else if(fin(j, i + 1)){
					await functions.write("\x1b[33;1m" + map1[i][j] + "\x1b[m");
				}else{
					await functions.write(map1[i][j]);
				}
			}
		}
		await functions.write("\n");
	}
}
function tr(x2, y2){
	if(x2 <= 0){
		return;
	}
	if(y2 <= 0){
		return;
	}
	if(y2 > 31){
		return;
	}
	if(x2 >= End){
		return;
	}
	if(ok(x2, y2)){
		x = x2;
		y = y2;
	}
}
function main(){
	if(data.gameState.dataSaver.challengeLevel != 0){
		return;
	}
	x = born[level][0];
	y = born[level][1];
	clear();
	if(!printYn(pk_in)){
		return;
	}
	int swcnt = 0;
	bool ju = false;
	while(true){
		if(x <= 0){
			x = 1;
		}
		if(y <= 0){
			y = 1;
		}
		clear();
		if(x === born[level + 1][0] && y === born[level + 1][1]){
			level++;
		}
		if(ty()){
			swcnt = 0;
			cout << pk_tip1 << endl;
			show();
			bool u = false, di = false;
			for(char c : getch2s()){
				if(c === 127){
					return;
				}
				if(c === 'w' || c === ' '){
					u = true;
					ju = true;
				}
				if(c === 'r'){
					di = true;
				}
			}
			if(fin(x, y - 1)){
				clear();
				printa(pk_ok);
				data.gameState.dataSaver.money += 500;
				data.gameState.dataSaver.challengeLevel = 1;
				return;
			}
			if(die()){
				print(pk_die);
				if(!printYn(pk_rb)){
					return;
				}
				x = born[level][0];
				y = born[level][1];
				continue;
			}
			if(di){
				x = born[level][0];
				y = born[level][1];
				continue;
			}
			if(map1[y][x] === '^'){
				sy = 0;
				tr(x, y - 4);
				sleep(0.1);
				continue;
			}
			if(map1[y][x] === '>'){
				sy = 0;
				tr(x + 4, y);
				sleep(0.1);
				continue;
			}
			if(map1[y][x] === '<'){
				sy = 0;
				tr(x - 4, y);
				sleep(0.1);
				continue;
			}
			if(map1[y][x] === 'Z'){
				sy = 3;
			}
			for(int i = 1; i <= sy; i++){
				tr(x, y - 1);
				if(!ty()){
					sy = 0;
					continue;
				}
			}
			if(ok(x, y + 1)){
				sy--;
			}else{
				sy = 0;
			}
			if(sy){
				for(int i = 1; i <= sy; i++){
					tr(x, y - 1);
					if(!ty()){
						sy = 0;
						continue;
					}
				}
				for(int i = 1; i <= -sy; i++){
					tr(x, y + 1);
					if(!ty()){
						sy = 0;
						continue;
					}
				}
			}
			if(!ok(x + sx, y)){
				if((sx === slide(x + sx, y) && ok(x + sx, y - 1)) || (slide(x, y + 1) != 0)){
					tr(x, y - 1);
					if(!ty()){
						sy = 0;
						continue;
					}
				}else{
					sx *= -1;
				}
			}
			tr(x + sx, y);
			if((u || ju) && !sy && !ok(x, y + 1)){
				ju = false;
				sy = 2;
				for(int i = 1; i <= sy; i++){
					tr(x, y - 1);
					if(!ty()){
						sy = 0;
						continue;
					}
				}
			}
			if(!ok(x, y + 1)){
				sy = 0;
			}
			sleep(0.1);
		}else{
			ju = false;
			cout << pk_tip2 << endl;
			show();
			swcnt++;
			swcnt %= 5;
			bool u = false, d = false, l = false, r = false, di = false;
			for(char c : getch2s()){
				if(c === 127){
					return;
				}
				if(c === 'r'){
					di = true;
				}
				if(c === 'w'){
					u = true;
				}
				if(c === 'a'){
					l = true;
				}
				if(c === 's'){
					d = true;
				}
				if(c === 'd'){
					r = true;
				}
			}
			if(die()){
				print(pk_die);
				if(!printYn(pk_rb)){
					return;
				}
				x = born[level][0];
				y = born[level][1];
				continue;
			}
			if(di){
				x = born[level][0];
				y = born[level][1];
				continue;
			}
			if(u && !d){
				tr(x, y - 1);
			}
			if(d && !u){
				tr(x, y + 1);
			}
			if(!u && !d && !swcnt){
				tr(x, y + 1);
			}
			if(l && !r){
				tr(x - 1, y);
			}
			if(!l && r){
				tr(x + 1, y);
			}
			sleep(0.1);
		}
	}
}
