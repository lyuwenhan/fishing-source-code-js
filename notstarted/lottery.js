import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";

export default async function lottery(){
	await functions.clear();
	await functions.print(lang.current.lottery.lot_1);
	await functions.print(lang.current.lottery.lot_2 + data.gameState.dataSaver.cnt + lang.current.lottery.lot_3 + data.gameState.dataSaver.money);
	await functions.print(lang.current.lottery.lot_4);
	await functions.print(lang.current.lottery.lot_5);
	await functions.print(lang.current.lottery.lot_6);
	while(true){
		while(true){
			char c = getch();
			if(c === '1'){
				if(data.gameState.dataSaver.cnt < 100 && data.gameState.dataSaver.money < 1000){
					print(sp_7);
					sleep(1);
					break;
				}
				if(data.gameState.dataSaver.cnt < 100){
					print(sp_8);
					sleep(1);
					break;
				}
				if(data.gameState.dataSaver.money < 1000){
					print(sp_9);
					sleep(1);
					break;
				}

				data.gameState.dataSaver.cnt -= 100;
				data.gameState.dataSaver.money -= 1000;
				int ran = random(1, 100);
				if(ran <= 20){
					print(sp_10);
					print(sp_11);
					variate.fish_man = true;
				}else if(ran <= 40){
					print(sp_12);
					variate.big++;
				}else if(ran <= 41){
					print(sp_13);
					print(sp_14);
					variate.diamond++;
				}else{
					print(sp_15);
				}
				sleep(1);
				break;
			}else if(c === '2'){
				return;
			}
		}
		clear();
		cout << sp_1 << endl;
		cout << sp_2 << data.gameState.dataSaver.cnt << sp_3 << data.gameState.dataSaver.money << endl;
		cout << sp_4 << endl;
		cout << sp_5 << endl;
		cout << sp_6 << endl;
	}
}
