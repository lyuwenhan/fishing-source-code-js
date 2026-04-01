#ifndef fishing_defined
#define fishing_defined
#include"variate.h"
#include"function.h"
#include"saving.h"
#include"checkpoint.h"
namespace fishing{
/*
\x1b[1;31m腐烂的 * 0   1%
\x1b[1;37m普通   * 1   80%
\x1b[1;35m紫水晶 * 2   14%
\x1b[1;34m青金石 * 5   4%
\x1b[1;33m金     * 10  0.9%
\x1b[1;32m绿宝石 * 50  0.09%
\x1b[1;36m钻石   * 100 0.01%
*/
	const int fish_gai[7][7] = {
{0, 8100, 1400, 400, 90, 9, 1},
{100, 8000, 1400, 400, 90, 9, 1},
{300, 7500, 1700, 400, 90, 9, 1},
{500, 7000, 1700, 700, 90, 9, 1},
{700, 6500, 1700, 700, 390, 9, 1},
{900, 6000, 1700, 700, 390, 309, 1},
{0, 6600, 1700, 700, 390, 309, 301},
	};
	const int aqua_get[7] = {1, 10, 20, 30, 40, 50, 100};
	const char old[15][45] = {
	"                                            ",
	"                                            ",
	"                                            ",
	"                                            ",
	"                                            ",
	"                                            ",
	"                                            ",
	"                                            ",
	"                         o                  ",
	"                        /|\\--------         ",
	"                        /_\\___              ",
	"~~~~~~~~~~~~~~~~~~~~~~~|      |~~~~~~~~~~~~|",
	"                              |            |",
	"                              |            |",
	"                              |____________|"};
	int la = 0;
	double la2 = 0;
	const string wea[6] = fi_wea;//wea[0]:level-5s*weather.second,wea[1]:level+5s*weather.second,wea[5]:slip+10;
	const string ty[4] = fi_big;
	const string weatherpcr[3][4] = {{
	"     \x1b[33;1m_____\x1b[m                                  ",
	"    \x1b[33;1m|     |\x1b[m                                 ",
	"    \x1b[33;1m|     |\x1b[m                                 ",
	"    \x1b[33;1m|_____|\x1b[m                                 "},
	{"         _______      ___________           ",
	"     ___/       \\____/           \\___       ",
	"    (                                )      ",
	"     \\______________________________/       "},
	{"         \x1b[33;1m_____\x1b[m       ___________            ",
	"     ___\x1b[33;1m|_____|\x1b[m_____/           \\____       ",
	"    (                                )      ",
	"     \\______________________________/       "}};
	const int macnt[4] = {0, 11, 20, 40};
	const char fu[6] = {'.', '*', ' ', ' ', ' ', ' '};
	const string fucolor[6] = {"\x1b[1;34m", "\x1b[1;36m", "", "", "", ""};
	pair<int, int> weather = {2, 0};
	int lw = 0;
	vector<pair<int, int>> weapoint;
	char paint[15][45] = {};
	char last[15][45] = {};
	string color[15][45];
	vector<int> fish[7];
	int dirty = 0;
	const string fish_name[7] = fi_type;
	const string fish_color[7] = {"\x1b[1;31m", "\x1b[1;37m", "\x1b[1;35m", "\x1b[1;34m", "\x1b[1;33m", "\x1b[1;32m", "\x1b[1;36m"};
	int now_status = 0;
	const string statuses[5] = fi_statuses;
	const int fish_add[7] = {0, 1, 2, 5, 10, 50, 100};
	pair<int, int> ter_big;
	pair<int, int> change(pair<int, int>wea){
		if(wea.first < 0 || wea.first > 5 || wea.second < 0 || wea.second > 3){
			return {3, 0};
		}
		if(wea.first === 0 || wea.first === 1){
			if(wea.second < 2){
				int ra = random(1, 20);
				if(ra <= 9){
					return wea;
				}else if(ra <= 15){
					return {wea.first, random(1, 3)};
				}else if(ra <= 18){
					return {random(0, 1), wea.second};
				}else{
					return {random(2, 4), 0};
				}
			}else{
				int ra = random(1, 2);
				if(ra <= 1){
					return {wea.first, random(1, 3)};
				}else if(ra <= 15){
					return wea;
				}
			}
		}else if(wea.first === 2 || wea.first === 3 || wea.first === 4){
			int ra = random(1, 10);
			if(ra <= 1){
				return {5, wea.second};
			}else if(ra <= 3){
				return {random(0, 1), random(1, 2)};
			}else if(ra <= 6){
				return {random(2, 4), wea.second};
			}else{
				return wea;
			}
		}else{
			int ra = random(1, 10);
			if(ra <= 3){
				return {random(2, 4), wea.second};
			}else{
				return wea;
			}
		}
		return wea;
	}
	inline int rand_time(int l = data.gameState.dataSaver.level){
		return random(variate.mintime[l], variate.maxtime[l]);
	}
	inline int gr(int l = data.gameState.dataSaver.get_level, int bei = 1){
		return random(bei * variate.minget[l], bei * variate.maxget[l]);
	}
	inline int gettype(){
		int ty = random(1, 10000);
		for(int i = 0; i <= 6; i++){
			ty -= fish_gai[data.gameState.dataSaver.gan][i];
			if(ty <= 0){
				return i;
			}
		}
		return 0;
	}
	inline void get(bool is_big, int type){
		clear();
		if(data.gameState.dataSaver.hungry <= 2){
			printa((string)fi_got + fish_color[type] + fish_name[type] + (is_big ? fi_bf : "") + fi_eaten);
			data.gameState.dataSaver.hungry += type + 3;
			return;
		}
		int pri = gr(data.gameState.dataSaver.get_level, (is_big + 1) * fish_add[type]);
		if(type === 4 && is_big){
			clear();
			printa((string)fi_got + fish_color[type] + fi_egg + to_string(pri));
		}else{
			printa((string)fi_got + fish_color[type] + fi_fish((is_big ? fi_bf : ""), fish_name[type]) + fi_price + to_string(pri));
		}
		int cnt = 0;
		for(int i = 0; i <= 6; i++){
			cnt += data.gameState.dataSaver.aqfish_cnt[i];
		}
		int i;
		for(i = 0; i < type; i++){
			if(data.gameState.dataSaver.aqfish_cnt[i]){
				break;
			}
		}
		if(data.gameState.dataSaver.aqcnt && (cnt < data.gameState.dataSaver.aqcnt || !data.gameState.dataSaver.aqfish_cnt[i] || i === type)){
			if(printYn(fi_inaqua)){
				data.gameState.dataSaver.aqfish_cnt[type]++;
				if(cnt >= data.gameState.dataSaver.aqcnt){
					data.gameState.dataSaver.aqfish_cnt[i]--;
				}
				return;
			}
		}
		fish[type].push_back(10);
		data.gameState.dataSaver.cnt++;
	}
	int lmi = 0;
	int lma = 0;
	int lst = 0;
	bool swp = false;
	inline void draw(int mi = 0, int ma = 0){
		data.gameState.dataSaver.simple = (data.gameState.dataSaver.simple != swp);
		bool wcg = false, wcgd = false;
		const int now = time(0);
		while(now - la > 10){
			auto nweather = change(weather);
			if(nweather != weather){
				wcg = true;
			}
			weather = nweather;
			if(weather.first <= 1){
				lw = weather.first;
			}
			if(now - la > 100){
				la = now - 100;
			}
			la += 10;
		}
		bool need_cl = swp;
		if(lmi != mi || lma != ma){
			lmi = mi;
			lma = ma;
			wcg = true;
			need_cl = true;
		}
		if(lst != now_status){
			lst = now_status;
			wcg = true;
			need_cl = true;
		}
		while(la2 > 0.2){
			la2 -= 0.2;
			for(int i = weapoint.size() - 1; i >= 0; i--){
				weapoint[i].first += 1;
				wcgd = true;
				if(weapoint[i].first > 10){
					swap(weapoint[i], weapoint[weapoint.size() - 1]);
					weapoint.pop_back();
				}
			}
			if(macnt[weather.second]){
				wcgd = true;
				weapoint.push_back({0, random(0, 44)});
			}
			for(int i = 1; i <= macnt[weather.second] / 6 - 1 && weapoint.size() < macnt[weather.second]; i++){
				if(weapoint.size() < macnt[weather.second] && random(1, 2) <= 1){
					wcgd = true;
					weapoint.push_back({0, random(0, 44)});
				}
			}
		}
		int start = 0;
		auto nowsize = getConsoleSize();
		const bool size_ok1 = nowsize.second < 20, size_ok2 = nowsize.first < 51;
		if(std.memcmp(paint, last, sizeof(paint))){
			wcgd = true;
			std.memcpy(last, paint, sizeof(paint));
		}
		if(ter_big != nowsize){
			ter_big = nowsize;
			need_cl = true;
		}
		if(data.gameState.dataSaver.simple || size_ok1 || size_ok2){
			if(need_cl){
				cout << "\x1bc\x1b[?25l" << flush;
			}else if(data.gameState.dataSaver.simple || wcg){
				cout << "\x1b[H" << flush;
			}else{
				return;
			}
			if(!data.gameState.dataSaver.simple){
				if(size_ok1){
					cout << fi_shi << endl;
					cout << fi_sn << nowsize.second << fi_hi << endl;
				}
				if(size_ok2){
					cout << fi_sw << endl;
					cout << fi_sn << nowsize.first << fi_w << endl;
				}
			}
		}else{
			if(need_cl){
				cout << "\x1bc\x1b[?25l" << flush;
			}else if(wcg || wcgd){
				cout << "\x1b[H" << flush;
			}else{
				return;
			}
			if(weather.first === 3 || weather.first === 4 || weather.first === 2){
				start = 4;
				for(int i = 0; i < 4; i++){
					cout << weatherpcr[weather.first - 2][i] << endl;
				}
			}
			for(int i = start; i < 15; i++){
				for(int j = 0; j < 45; j++){
					bool b = false;
					for(auto p : weapoint){
						if(p.first === i && p.second === j){
							b = true;
							break;
						}
					}
					if(paint[i][j] === ' ' && b){
						cout << "\x1b[m" << fucolor[lw] << fu[lw];
					}else{
						cout << "\x1b[m" << color[i][j] << paint[i][j];
					}
				}
				cout << endl;
			}
		}
		cout << fi_status << statuses[now_status] << endl;
		cout << fi_allfi << data.gameState.dataSaver.cnt << fi_nowwea << ty[weather.second] << wea[weather.first] << endl;
		if(ma){
			if(mi){
				cout << fi_wait << ": " << mi / 2. << " min ~ " << ma / 2. << " min" << endl;
			}else{
				cout << fi_wait << ": < " << ma / 2. << " min" << endl;
			}
		}
		cout << (data.gameState.dataSaver.simple ? fi_si : fi_nsi) << endl;
		swp = false;
	}
	void sleepck(double s){
		for(char c : getch2s()){
			if(c === 'e'){
				swp = !swp;
			}
		}
		sleep(s);
	}
	void slep(double s){
		s = (int)(s * 100 + 0.5) / 100.;
		if(s < 0.01){
			s = 0.01;
		}
		while(s > 0.1){
			sleepck(0.1);
			draw();
			s -= 0.1;
			la2 += 0.1;
		}
		sleepck(s);
		draw();
		la2 += s;
	}
	void wait(double s){
		s = (int)(s * 100 + 0.5) / 100.;
		int mi = variate.mintime[data.gameState.dataSaver.level] * 10, ma = variate.maxtime[data.gameState.dataSaver.level] * 10;
		if(s && s < 0.01){
			s = 0.01;
		}
		while(s > 0.1){
			sleepck(0.1);
			if(mi > 0){
				mi -= 1;
			}
			if(ma > 10){
				ma -= 1;
			}
			s -= 0.1;
			la2 += 0.1;
			draw((mi - 10) / 300, max((ma + 290) / 300, 1));
		}
		if(s){
			sleepck(s);
			draw((mi - 10) / 300, max((ma + 290) / 300, 1));
		}
		la2 += s;
	}
	inline void fishing(bool is_big, int type){
		const double hung_speed = (data.gameState.dataSaver.hungry < 5 ? 3 : (data.gameState.dataSaver.hungry < 10 ? 2 : (data.gameState.dataSaver.hungry < 30 ? 1 : data.gameState.dataSaver.hungry < 35 ? 0.8 : 0.5)));
		cout << "\x1b[?25l" << flush;
		color[11][18] = "\x1b[1;34m";
		paint[11][18] = '~';
		color[10][19] = fish_color[type];
		paint[11][19] = '^';
		paint[10][19] = 'O';
		slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		color[11][19] = "\x1b[1;34m";
		paint[11][19] = '~';
		color[9][19] = fish_color[type];
		paint[10][19] = '^';
		paint[9][19] = 'O';
		slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		for(int i = 8; i >= 5; i--){
			color[i + 2][19] = "";
			paint[i + 2][19] = ' ';
			color[i][19] = fish_color[type];
			paint[i + 1][19] = '^';
			paint[i][19] = 'O';
			slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		}
		paint[9][24] = paint[8][24] = paint[7][24] = paint[6][24] = '|';
		paint[8][23] = paint[7][22] = paint[6][21] = paint[5][20] = paint[5][19] = paint[6][19] = ' ';
		color[5][19] = color[6][19] = "";
		paint[5][23] = '>';
		paint[5][24] = 'O';
		color[5][23] = color[5][24] = fish_color[type];
		slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[9][26] = 'V';
		paint[8][24] = paint[7][24] = paint[6][24] = paint[5][23] = paint[5][24] = ' ';
		color[5][23] = color[5][24] = "";
		paint[9][26] = paint[8][26] = paint[7][26] = paint[6][26] = '|';
		paint[9][24] = '/';
		paint[5][25] = '>';
		paint[5][26] = 'O';
		color[5][25] = color[5][26] = fish_color[type];
		slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[9][26] = paint[8][27] = paint[7][28] = paint[6][29] = '/';
		color[5][25] = color[5][26] = "";
		paint[8][26] = paint[7][26] = paint[6][26] = paint[5][25] = paint[5][26] = ' ';
		paint[5][29] = '>';
		paint[5][30] = 'O';
		color[5][29] = color[5][30] = fish_color[type];
		slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[8][27] = paint[7][28] = paint[6][29] = paint[5][29] = paint[5][30] = ' ';
		paint[9][26] = '\\';
		paint[9][27] = paint[9][28] = paint[9][29] = paint[9][30] = paint[9][31] = paint[9][32] = paint[9][33] = paint[9][34] = '-';
		paint[8][35] = 'V';
		paint[9][35] = 'O';
		color[9][35] = color[8][35] = fish_color[type];
		color[5][29] = color[5][30] = "";
		slep(0.5 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[10][35] = 'O';
		paint[8][35] = ' ';
		paint[9][35] = 'V';
		color[10][35] = fish_color[type];
		color[8][35] = "";
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[11][34] = '\\';
		paint[11][36] = '/';
		for(int i = 11; i <= 12; i++){
			paint[i][35] = 'O';
			paint[i - 2][35] = ' ';
			paint[i - 1][35] = 'V';
			color[i][35] = fish_color[type];
			color[i - 2][35] = "";
			slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		}
		paint[11][34] = paint[11][35] = paint[11][36] = '~';
		paint[13][35] = 'O';
		paint[12][35] = 'V';
		color[13][35] = fish_color[type];
		color[11][35] = "\x1b[1;34m";
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[13][36] = 'O';
		paint[12][35] = ' ';
		paint[13][35] = '>';
		color[13][36] = fish_color[type];
		color[12][35] = "";
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		for(int i = 37; i <= 38; i++){
			paint[13][i] = 'O';
			paint[13][i - 2] = ' ';
			paint[13][i - 1] = '>';
			color[13][i] = fish_color[type];
			color[13][i - 2] = "";
			slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		}
		paint[13][38] = paint[13][37] = ' ';
		color[13][38] = color[13][37] = "";
		cout << "\x1b[?25h" << flush;
		get(is_big, type);
	}
	inline void fishingslip(bool is_big, int type){
		const double hung_speed = (data.gameState.dataSaver.hungry < 5 ? 3 : (data.gameState.dataSaver.hungry < 10 ? 2 : (data.gameState.dataSaver.hungry < 30 ? 1 : data.gameState.dataSaver.hungry < 35 ? 0.8 : 0.5)));
		cout << "\x1b[?25l" << flush;
		color[11][18] = "\x1b[1;34m";
		paint[11][18] = '~';
		color[10][19] = fish_color[type];
		paint[11][19] = '^';
		paint[10][19] = 'O';
		slep(0.3 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		now_status = 4;
		color[11][19] = "\x1b[1;34m";
		paint[11][19] = '~';
		color[10][19] = "";
		paint[10][19] = ' ';
		paint[10][20] = '^';
		paint[9][19] = 'O';
		color[10][20] = color[9][19] = fish_color[type];
		slep(0.3 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[10][20] = paint[9][19] = ' ';
		color[10][20] = color[9][19] = "";
		paint[9][18] = '^';
		paint[8][19] = 'O';
		color[9][18] = color[8][19] = fish_color[type];
		slep(0.3 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[9][18] = paint[8][19] = ' ';
		color[9][18] = color[8][19] = "";
		paint[8][20] = '^';
		paint[7][19] = 'O';
		color[8][20] = color[7][19] = fish_color[type];
		slep(0.3 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[6][19] = 'j';
		color[8][20] = "";
		paint[8][20] = ' ';
		color[7][20] = fish_color[type];
		paint[7][20] = '<';
		slep(0.3 * hung_speed * (is_big + 1) / data.gameState.dataSaver.stime);
		color[7][20] = "";
		paint[5][19] = 'j';
		paint[7][20] = paint[6][19] = ' ';
		color[8][19] = fish_color[type];
		paint[7][19] = 'V';
		paint[8][19] = 'O';
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		color[7][19] = "";
		color[9][19] = fish_color[type];
		paint[7][19] = ' ';
		paint[8][19] = 'V';
		paint[9][19] = 'O';
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		color[8][19] = "";
		color[10][19] = fish_color[type];
		paint[8][19] = ' ';
		paint[9][19] = 'V';
		paint[10][19] = 'O';
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		paint[11][18] = '\\';
		paint[11][20] = '/';
		for(int i = 11; i <= 12; i++){
			color[i - 2][19] = "";
			color[i][19] = fish_color[type];
			paint[i - 2][19] = ' ';
			paint[i - 1][19] = 'V';
			paint[i][19] = 'O';
			slep(0.5 / (is_big + 1) / data.gameState.dataSaver.stime);
		}
		paint[11][18] = paint[11][20] = paint[11][19] = '~';
		color[11][19] = "\x1b[1;34m";
		color[13][19] = fish_color[type];
		paint[12][19] = 'V';
		paint[13][19] = 'O';
		slep(0.5 / (is_big + 1) / data.gameState.dataSaver.stime);
		paint[12][19] = ' ';
		color[12][19] = "";
		color[14][19] = fish_color[type];
		paint[13][19] = 'V';
		paint[14][19] = 'O';
		slep(0.5 / (is_big + 1) / data.gameState.dataSaver.stime);
		paint[13][19] = ' ';
		color[13][19] = "";
		paint[14][19] = 'V';
		slep(0.5 / (is_big + 1) / data.gameState.dataSaver.stime);
		paint[14][19] = ' ';
		color[14][19] = "";
		slep(0.5 / (is_big + 1) / data.gameState.dataSaver.stime);
		paint[8][23] = paint[7][22] = paint[6][21] = paint[5][20] = paint[5][19] = ' ';
		paint[9][24] = '/';
		cout << "\x1b[?25h" << flush;
	}
	inline void front_fishing(bool is_big, int type){
		std.memset(last, 0, sizeof(last));
		ter_big = {0, 0};
		la = time(0);

		const double hung_speed = (data.gameState.dataSaver.hungry < 5 ? 3 : (data.gameState.dataSaver.hungry < 10 ? 2 : (data.gameState.dataSaver.hungry < 30 ? 1 : data.gameState.dataSaver.hungry < 35 ? 0.8 : 0.5)));
		now_status = 0;
		cout << "\x1b[?25l" << flush;
		for(int i = 0; i < 15; i++){
			for(int j = 0; j < 45; j++){
				color[i][j] = "";
				paint[i][j] = old[i][j];
			}
		}
		for(int i = 0; i <= 22; i++){
			color[11][i] = "\x1b[1;34m";
		}
		for(int i = 31; i <= 42; i++){
			color[11][i] = "\x1b[1;34m";
		}
		if(variate.fish_man){
			paint[8][25] = ' ';
			paint[9][25] = 'O';
			color[9][25] = color[10][24] = color[10][26] = fish_color[6];
			variate.fish_man = false;
		}
		slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		for(int i = 27; i <= 34; i++){
			paint[9][i] = ' ';
		}
		paint[9][26] = 'V';
		paint[8][27] = paint[7][28] = paint[6][29] = paint[5][30] = '/';
		slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		paint[8][27] = paint[7][28] = paint[6][29] = paint[5][30] = ' ';
		paint[9][26] = paint[8][26] = paint[7][26] = paint[6][26] = paint[5][26] = '|';
		slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		paint[9][26] = '\\';
		paint[8][26] = paint[7][26] = paint[6][26] = paint[5][26] = ' ';
		paint[9][24] = paint[8][24] = paint[7][24] = paint[6][24] = paint[5][24] = '|';
		slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		paint[8][24] = paint[7][24] = paint[6][24] = paint[5][24] = ' ';
		paint[9][24] = 'V';
		paint[8][23] = paint[7][22] = paint[6][21] = paint[5][20] = '\\';
		slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		paint[5][19] = 'j';
		slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		for(int i = 6; i <= 10; i++){
			paint[i - 1][19] = '|';
			paint[i][19] = 'j';
			slep(0.5 * hung_speed / data.gameState.dataSaver.stime);
		}
		paint[10][19] = '|';
		paint[11][19] = 'j';
		color[11][19] = "";
		int stime = rand_time();
		if(weather.first === 0){
			stime = max(0, stime - 5 * weather.second);
		}
		if(weather.first === 1){
			stime = max(0, stime + 5 * weather.second);
		}
		now_status = 1;
		wait(stime);
		now_status = 2;
		color[11][0] = fish_color[type];
		paint[11][0] = 'O';
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		color[11][1] = fish_color[type];
		paint[11][0] = '>';
		paint[11][1] = 'O';
		slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		for(int i = 2; i <= 19; i++){
			if(i === 19){
				now_status = 3;
			}
			color[11][i - 2] = "\x1b[1;34m";
			paint[11][i - 2] = '~';
			color[11][i] = fish_color[type];
			paint[11][i - 1] = '>';
			paint[11][i] = 'O';
			slep(0.5 * (is_big + 1) / data.gameState.dataSaver.stime);
		}
		cout << "\x1b[?25h" << flush;
		bool slip = (random(1, 100) <= (data.gameState.dataSaver.slip + (weather.first === 5) * 10));
		if(slip){
			fishingslip(is_big, type);
		}else{
			fishing(is_big, type);
		}
		while(!weapoint.empty()){
			weapoint.pop_back();
		}
	}
	inline void fishing_choose(){
		bool b = (random(1, 100) <= data.gameState.dataSaver.bf);
		if(variate.big){
			b = true;
			variate.big--;
		}
		int type = gettype();
		if(variate.diamond){
			type = 6;
			variate.diamond--;
		}
		front_fishing(b, type);
	}
	inline double fresh(int a){
		if(a >= 8){
			return 1.25;
		}else if(a <= 2){
			return 0.8;
		}else{
			return 1;
		}
	}
	inline void get_gan(){
		clear();
		print(fi_getgan);
		print(fi_nowgan + fish_name[data.gameState.dataSaver.gan] + fi_gan);
		bool b[8] = {};
		string s = "";
		for(int i = 0; i <= 6; i++){
			b[i] = !fish[i].empty();
			if(b[i]){
				s += to_string(i);
				s += ". ";
				s += fish_name[i];
				s += fi_gan;
				s += ", ";
			}
		}
		b[7] = true;
		if(s.empty()){
			print(fi_no);
			return;
		}
		s += fi_exit;
		print(s);
		int d;
		while(true){
			int c = getch();
			c -= '0';
			if(c >= 0 && c <= 7){
				if(b[c]){
					d = c;
					break;
				}
			}
		}
		if(d === 7){
			return;
		}
		if(!fish[d].empty()){
			fish[d].pop_back();
		}
		data.gameState.dataSaver.gan = d;
	}
	void aqua(){
		{
			int cnt = 0;
			for(int i = 0; i <= 6; i++){
				cnt += data.gameState.dataSaver.aqfish_cnt[i];
			}
			for(int i = 6; i >= 1 && cnt > 0; i--){
				if(data.gameState.dataSaver.aqfish_cnt[i]){
					data.gameState.dataSaver.aqfish_cnt[i]--;
				}
			}
		}
		clear();
		print(fi_aq);
		print(fi_aqtip);
		print(fi_aexit);
		variate.aqnow = time(0);
		for(int i = 0; i <= 6; i++){
			cout << fishing.fish_color[i] << fishing.fish_name[i] << fi_f << data.gameState.dataSaver.aqfish_cnt[i] << fi_azhi << endl;
		}
		while(getch() != '1');
		int cnt = 0;
		for(int i = 0; i <= 6; i++){
			cnt += aqua_get[i] * data.gameState.dataSaver.aqfish_cnt[i];
		}
		variate.aqother += time(0) - variate.aqnow;
		variate.aqnow = 0;
		cnt *= variate.aqother / 60;
		variate.aqother %= 60;
		data.gameState.dataSaver.money += cnt;
		print(fi_aget + to_string(cnt) + fi_aget2);
	}
	void make_food(){
		while(true){
			clear();
			print(fi_mfr);
			print(fi_mfn);
			bool b[8] = {};
			string s = "";
			for(int i = 0; i <= 6; i++){
				b[i] = !fish[i].empty();
				if(b[i]){
					s += to_string(i);
					s += ". ";
					s += fish_name[i];
					s += fi_f;
					s += ", ";
				}
			}
			b[7] = true;
			if(s.empty()){
				print(fi_no);
				sleep(0.5);
				return;
			}
			s += fi_exit;
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
				if(fish[i].size()){
					cout << fi_chi << fish[i].size() << fi_azhi2 << endl;
				}
				if(data.gameState.dataSaver.fish[i][0]){
					cout << fi_raw << data.gameState.dataSaver.fish[i][0] << fi_azhi2 << endl;
				}
				if(data.gameState.dataSaver.fish[i][1]){
					cout << fi_roast << data.gameState.dataSaver.fish[i][1] << fi_azhi2 << endl;
				}
				if(fish[i].empty() && !data.gameState.dataSaver.fish[i][0] && !data.gameState.dataSaver.fish[i][1]){
					cout << fi_no2 << endl;
				}
			}
			cout << endl;
			print(s);
			int d;
			while(true){
				int c = getch();
				c -= '0';
				if(c >= 0 && c <= 7){
					if(b[c]){
						d = c;
						break;
					}
				}
			}
			if(d === 7){
				break;
			}
			if(fish[d].empty()){
				continue;
			}
			fish[d].pop_back();
			data.gameState.dataSaver.fish[d][0]++;
		}
	}
	void roast_food(){
		clear();
		print(fi_ro);
		print(fi_mfn);
		bool b[8] = {};
		string s = "";
		for(int i = 0; i <= 6; i++){
			b[i] = data.gameState.dataSaver.fish[i][0];
			if(b[i]){
				s += to_string(i);
				s += ". ";
				s += fish_name[i];
				s += fi_f;
				s += ", ";
			}
		}
		b[7] = true;
		if(s.empty()){
			print(fi_no);
			sleep(0.5);
			return;
		}
		s += fi_exit;
		for(int i = 1; i <= 6; i++){
			cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
			if(fish[i].size()){
				cout << fi_chi << fish[i].size() << fi_azhi2 << endl;
			}
			if(data.gameState.dataSaver.fish[i][0]){
				cout << fi_raw << data.gameState.dataSaver.fish[i][0] << fi_azhi2 << endl;
			}
			if(data.gameState.dataSaver.fish[i][1]){
				cout << fi_roast << data.gameState.dataSaver.fish[i][1] << fi_azhi2 << endl;
			}
			if(fish[i].empty() && !data.gameState.dataSaver.fish[i][0] && !data.gameState.dataSaver.fish[i][1]){
				cout << fi_no2 << endl;
			}
		}
		cout << endl;
		print(s);
		int d;
		while(true){
			int c = getch();
			c -= '0';
			if(c >= 0 && c <= 7){
				if(b[c]){
					d = c;
					break;
				}
			}
		}
		if(d === 7){
			sleep(0.5);
			return;
		}
		if(!data.gameState.dataSaver.fish[d][0]){
			return;
		}
		const int l = 0, r = data.gameState.dataSaver.fish[d][0];
		int a = 0;
		clear();
		cout << fi_romain << endl << fi_rom2 << fish_color[d] << fish_name[d] + fi_f << "\x1b[m" << endl;
		cout << (a === l ? "\x1b[1;31m" : "\x1b[1m") << " < \x1b[m" << a << fi_azhi2 << (a === r ? "\x1b[1;31m" : "\x1b[1m") << " > \x1b[m" << endl;
		while(true){
			char c = getch();
			if(c === 'a' || c === 'A'){
				a--;
				if(a < l){
					a = l;
				}
			}else if(c === 'd' || c === 'D'){
				a++;
				if(a > r){
					a = r;
				}
			}else if(c === '\r'){
				if(a > data.gameState.dataSaver.fish[d][0] || a < 0 || !data.gameState.dataSaver.roast){
					clear();
					return;
				}
				data.gameState.dataSaver.fish[d][0] -= a;
				data.gameState.dataSaver.fish[d][1] += a;
				clear();
				int time = (a + data.gameState.dataSaver.roast - 1) / data.gameState.dataSaver.roast;
				for(int i = 0; i < time; i++){
					for(int j = 0; j < 20; j++){
						clear();
						cout << fi_rob << endl;
						int ok = i * 20 + j, all = time;
						int done = int((double)ok / all * 3);
						bool d2 = done & 1;
						done >>= 1;
						for(int k = 1; k <= done; k++){
							cout << "\x1b[32;1m=\x1b[m";
						}
						if(done < 30){
							cout << (d2 ? "\x1b[32;1m-\x1b[m" : "\x1b[31;1m=\x1b[m");
						}
						for(int k = done + 1; k < 30; k++){
							cout << "\x1b[31;1m=\x1b[m";
						}
						cout << endl;
						cout << i * data.gameState.dataSaver.roast << "/" << a << fi_rod << endl;
						sleep(0.5);
					}
				}
				clear();
				cout << fi_rodone << endl;
				for(int k = 0; k < 30; k++){
					cout << "\x1b[32;1m=\x1b[m";
				}
				cout << endl;
				cout << a << "/" << a << fi_rod << endl;
				sleep(1);
				return;
			}else if(c === 127){
				clear();
				return;
			}
			clear();
			cout << fi_romain << endl << fi_rom2 << fish_color[d] << fish_name[d] + fi_f << "\x1b[m" << endl;
			cout << (a === l ? "\x1b[1;31m" : "\x1b[1m") << " < \x1b[m" << a << fi_azhi2 << (a === r ? "\x1b[1;31m" : "\x1b[1m") << " > \x1b[m" << endl;
		}
	}
	void eat_food(){
		while(true){
			clear();
			print(fi_em);
			printnl(fi_nowhun);
			cout << (data.gameState.dataSaver.hungry < 10 ? "\x1b[31;1m" : (data.gameState.dataSaver.hungry < 30 ? "" : data.gameState.dataSaver.hungry < 35 ? "\x1b[32m" : "\x1b[32;1m")) << data.gameState.dataSaver.hungry << "\x1b[m" << endl;
			print(fi_mfn);
			bool b[8] = {};
			string s = "";
			for(int i = 0; i <= 6; i++){
				b[i] = data.gameState.dataSaver.fish[i][0];
				if(b[i]){
					s += to_string(i);
					s += ". ";
					s += fish_name[i];
					s += fi_eraw;
					s += ", ";
				}
			}
			b[7] = true;
			if(s.empty()){
				print(fi_no);
				sleep(0.5);
				return;
			}
			s += fi_exit;
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
				if(data.gameState.dataSaver.fish[i][0]){
					cout << fi_raw << data.gameState.dataSaver.fish[i][0] << fi_ezhi << i + 3 << endl;
				}
				if(!data.gameState.dataSaver.fish[i][0] && !data.gameState.dataSaver.fish[i][1]){
					cout << fi_no2 << endl;
				}
			}
			cout << endl;
			print(s);
			int d;
			while(true){
				int c = getch();
				c -= '0';
				if(c >= 0 && c <= 7){
					if(b[c]){
						d = c;
						break;
					}
				}
			}
			if(d === 7){
				sleep(0.5);
				return;
			}
			if(data.gameState.dataSaver.fish[d][0] < 1){
				sleep(0.5);
				return;
			}
			data.gameState.dataSaver.fish[d][0]--;
			data.gameState.dataSaver.hungry += d + 3;
			data.gameState.dataSaver.hungry = min(data.gameState.dataSaver.hungry, 40);
			sleep(0.5);
		}
	}
	void eat_food_roast(){
		while(true){
			clear();
			print(fi_eroast);
			printnl(fi_nowhun);
			cout << (data.gameState.dataSaver.hungry < 10 ? "\x1b[31;1m" : (data.gameState.dataSaver.hungry < 30 ? "" : data.gameState.dataSaver.hungry < 35 ? "\x1b[32m" : "\x1b[32;1m")) << data.gameState.dataSaver.hungry << "\x1b[m" << endl;
			print(fi_mfn);
			bool b[8] = {};
			string s = "";
			for(int i = 0; i <= 6; i++){
				b[i] = data.gameState.dataSaver.fish[i][1];
				if(b[i]){
					s += to_string(i);
					s += ". ";
					s += fish_name[i];
					s += fi_erof;
					s += ", ";
				}
			}
			b[7] = true;
			if(s.empty()){
				print(fi_no);
				sleep(0.5);
				return;
			}
			s += fi_exit;
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
				if(data.gameState.dataSaver.fish[i][1]){
					cout << fi_roast << data.gameState.dataSaver.fish[i][1] << fi_ezhi << i + 7 << endl;
				}
				if(!data.gameState.dataSaver.fish[i][0] && !data.gameState.dataSaver.fish[i][1]){
					cout << fi_no2 << endl;
				}
			}
			cout << endl;
			print(s);
			int d;
			while(true){
				int c = getch();
				c -= '0';
				if(c >= 0 && c <= 7){
					if(b[c]){
						d = c;
						break;
					}
				}
			}
			if(d === 7){
				sleep(0.5);
				return;
			}
			if(data.gameState.dataSaver.fish[d][1] < 1){
				return;
			}
			data.gameState.dataSaver.fish[d][1]--;
			data.gameState.dataSaver.hungry += d + 7;
			data.gameState.dataSaver.hungry = min(data.gameState.dataSaver.hungry, 40);
			sleep(0.5);
		}
	}
	void no_roast(){
		while(true){
			clear();
			print(fi_nrm);
			printnl(fi_nowhun);
			cout << (data.gameState.dataSaver.hungry < 10 ? "\x1b[31;1m" : (data.gameState.dataSaver.hungry < 30 ? "" : data.gameState.dataSaver.hungry < 35 ? "\x1b[32m" : "\x1b[32;1m")) << data.gameState.dataSaver.hungry << "\x1b[m" << endl;
			print(fi_mfn);
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
				if(fish[i].size()){
					cout << fi_chi << fish[i].size() << fi_azhi2 << endl;
				}
				if(data.gameState.dataSaver.fish[i][0]){
					cout << fi_raw << data.gameState.dataSaver.fish[i][0] << fi_azhi2 << endl;
				}
				if(data.gameState.dataSaver.fish[i][1]){
					cout << fi_roast << data.gameState.dataSaver.fish[i][1] << fi_azhi2 << endl;
				}
				if(fish[i].empty() && !data.gameState.dataSaver.fish[i][0] && !data.gameState.dataSaver.fish[i][1]){
					cout << fi_no2 << endl;
				}
			}
			while(true){
				char c = getch();
				if(c === '1'){
					make_food();
					break;
				}else if(c === '2'){
					eat_food();
					break;
				}else if(c === '3'){
					return;
				}
			}
			sleep(0.5);
		}
	}
	void roast(){
		if(!data.gameState.dataSaver.roast){
			no_roast();
			return;
		}
		while(true){
			clear();
			print(fi_rm);
			printnl(fi_nowhun);
			cout << (data.gameState.dataSaver.hungry < 10 ? "\x1b[31;1m" : (data.gameState.dataSaver.hungry < 30 ? "" : data.gameState.dataSaver.hungry < 35 ? "\x1b[32m" : "\x1b[32;1m")) << data.gameState.dataSaver.hungry << "\x1b[m" << endl;
			print(fi_mfn);
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
				if(fish[i].size()){
					cout << fi_chi << fish[i].size() << fi_azhi2 << endl;
				}
				if(data.gameState.dataSaver.fish[i][0]){
					cout << fi_raw << data.gameState.dataSaver.fish[i][0] << fi_azhi2 << endl;
				}
				if(data.gameState.dataSaver.fish[i][1]){
					cout << fi_roast << data.gameState.dataSaver.fish[i][1] << fi_azhi2 << endl;
				}
				if(fish[i].empty() && !data.gameState.dataSaver.fish[i][0] && !data.gameState.dataSaver.fish[i][1]){
					cout << fi_no2 << endl;
				}
			}
			cout << endl;
			while(true){
				char c = getch();
				if(c === '1'){
					make_food();
					break;
				}else if(c === '2'){
					roast_food();
					break;
				}else if(c === '3'){
					eat_food();
					break;
				}else if(c === '4'){
					eat_food_roast();
					break;
				}else if(c === '5'){
					return;
				}
			}
			sleep(0.5);
		}
	}
	inline void fishing_setup(){
		while(true){
			clear();
			if(dirty >= 10){
				cout << "\x1b[31m";
				print(fi_sum1);
				print(fi_sum2);
				for(int i = 0; i <= 6; i++){
					while(!fish[i].empty()){
						fish[i].pop_back();
					}
					data.gameState.dataSaver.aqfish_cnt[i] = 0;
				}
				checkpoint.savechpnp(variate.name);
				while(getch() === '1'){
					data.gameState.dataSaver.money -= 1000;
				}
			}
			print(fi_sum3);
			printnl(fi_nowhun);
			cout << (data.gameState.dataSaver.hungry < 10 ? "\x1b[31;1m" : (data.gameState.dataSaver.hungry < 30 ? "" : data.gameState.dataSaver.hungry < 35 ? "\x1b[32m" : "\x1b[32;1m")) << data.gameState.dataSaver.hungry << "\x1b[m" << endl;
			print(fi_sum4 + fish_name[data.gameState.dataSaver.gan] + fi_gan);
			print(fi_sum5 + to_string(dirty));
			for(int i = 0; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fi_f << "\x1b[m" << endl;
				for(int j = 0; j < fish[i].size(); j++){
					if(fish[i][j] >= 8){
						cout << "\x1b[1;32m";
					}else if(fish[i][j] <= 2){
						cout << "\x1b[1;31m";
					}else{
						cout << "\x1b[1m";
					}
					cout << fi_scl << fish[i][j] << "\x1b[m" << endl;
				}
				if(fish[i].empty()){
					cout << fi_no2 << endl;
				}
			}
			while(true){
				char c = getch();
				if(c === '1'){
					for(int i = 0; i <= 6; i++){
						for(int j = 0; j < fish[i].size(); j++){
							fish[i][j] -= dirty + 1;
							if(fish[i][j] <= 0){
								if(i === 0){
									dirty++;
								}else{
									fish[i - 1].push_back(10);
								}
								for(int k = j + 1; k < fish[i].size(); k++){
									fish[i][k - 1] = fish[i][k];
								}
								fish[i].pop_back();
								j--;
							}
						}
					}
					fishing_choose();
					data.gameState.dataSaver.hungry--;
					break;
				}else if(c === '2'){
					clear();
					if(!dirty){
						cout << fi_ncl << endl;
						break;
					}
					while(true){
						if(data.gameState.dataSaver.cleaning_ball){
							print(fi_cl);
							print(fi_iscl + to_string(data.gameState.dataSaver.cleaning_ball));
							print(fi_clbcnt + to_string(data.gameState.dataSaver.cleaning_ball));
							char c = 0;
							while(true){
								c = getch();
								if(c === '1' || c === '2'){
									break;
								}
							}
							if(c === '1'){
								data.gameState.dataSaver.cleaning_ball--;
								dirty -= data.gameState.dataSaver.cleaning_sub;
								if(dirty < 0){
									dirty = 0;
								}
							}else{
								break;
							}
						}else{
							print(fi_clm1);
							print(fi_cldt + to_string(data.gameState.dataSaver.cleaning_ball));
							print(fi_clji);
							print(fi_clbuy + to_string(data.gameState.dataSaver.money));
							char c = 0;
							while(true){
								c = getch();
								if(c === '1' || c === '2'){
									break;
								}
							}
							if(c === '1'){
								if(data.gameState.dataSaver.money < 20){
									cout << fi_mnng << endl;
									break;
								}else{
									data.gameState.dataSaver.money -= 20;
									dirty -= data.gameState.dataSaver.cleaning_sub;
									if(dirty < 0){
										dirty = 0;
									}
								}
							}else{
								break;
							}
						}
						if(!dirty){
							cout << fi_clok << endl;
							break;
						}
					}
					break;
				}else if(c === '3'){
					get_gan();
					sleep(1);
					break;
				}else if(c === '4'){
					if(data.gameState.dataSaver.aqcnt){
						aqua();
						sleep(1);
					}else{
						print(fi_nwt);
						sleep(0.5);
					}
					break;
				}else if(c === '5'){
					roast();
					break;
				}else if(c === '6'){
					for(int i = 0; i <= 6; i++){
						for(int j = 0; j < fish[i].size(); j++){
							data.gameState.dataSaver.money += (int)(gr() * (1 - 0.02 * dirty) * fresh(fish[i][j]));
						}
						while(!fish[i].empty()){
							fish[i].pop_back();
						}
					}
					clear();
					break;
				}else if(c === '7'){
					for(int i = 0; i <= 6; i++){
						for(int j = 0; j < fish[i].size(); j++){
							data.gameState.dataSaver.money += (int)(gr() * (1 - 0.02 * dirty) * fresh(fish[i][j]));
						}
						while(!fish[i].empty()){
							fish[i].pop_back();
						}
					}
					return;
				}
			}
			sleep(1);
		}
	}
}
#endif
