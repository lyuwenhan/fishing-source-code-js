#include"lang.h"
#include"variate.h"
#include"color.h"
#include"fishing.h"
#include"shop.h"
#include"checkpoint.h"
#include"function.h"
#include"story.h"
#include"spin.h"
#include"parkour.h"
#include"beat.h"
#include"tool.h"
int main(){
	srand(time(0));
	clear();
	system("mkdir -p checkpoint >/dev/null 2>&1");
	if(!directoryExists("checkpoint")){
		clear();
		exit(0);
	}
	story();
	if(!checkpoint.chp()){
		sleep(1);
		choose();
	}
	checkpoint.savechpnp(variate.name);
	sleep(1);
	while(true){
		clear();
		print(m_main);
		while(true){
			char type = getch();
			if(type === '1'){
				fishing.fishing_setup();
				break;
			}else if(type === '2'){
				shop.shop();
				break;
			}else if(type === '3'){
				setsp();
				break;
			}else if(type === '4'){
				spin.spin();
				break;
			}else if(type === '5'){
				if(data.gameState.dataSaver.try_level === 0){
					parkour.main();
				}else if(data.gameState.dataSaver.try_level === 1){
					beat.main();
				}else{
					clear();
					printa(m_did);
				}
				break;
			}else if(type === '6'){
				clear();
				return 0;
			}else if(type === 127){
				tool.tool();
				break;
			}
		}
		checkpoint.savechpnp(variate.name);
		sleep(0.5);
	}
}
