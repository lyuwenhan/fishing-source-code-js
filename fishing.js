#ifndef fishing_defined
#define fishing_defined
#include<hashtable.h>
#include<iostream>
#include<iomanip>
#include<vector>
using std::to_string;
using std::ostream;
using std::string;
using std::vector;
using std::hash;
using std::pair;
using std::cout;
using std::setw;
using std::min;
using std::max;
#include"variate.h"
#include"function.h"
#include"saving.h"
#include"checkpoint.h"
namespace fishing{
/*
\033[1;31m腐烂的 * 0   1%
\033[1;37m普通   * 1   80%
\033[1;35m紫水晶 * 2   14%
\033[1;34m青金石 * 5   4%
\033[1;33m金     * 10  0.9%
\033[1;32m绿宝石 * 50  0.09%
\033[1;36m钻石   * 100 0.01%
*/
	const int fishProbabilityTable[7][7] = {
{0, 8100, 1400, 400, 90, 9, 1},
{100, 8000, 1400, 400, 90, 9, 1},
{300, 7500, 1700, 400, 90, 9, 1},
{500, 7000, 1700, 700, 90, 9, 1},
{700, 6500, 1700, 700, 390, 9, 1},
{900, 6000, 1700, 700, 390, 309, 1},
{0, 6600, 1700, 700, 390, 309, 301},
	};
	const int aquariumYield[7] = {1, 10, 20, 30, 40, 50, 100};
	const char backgroundGrid[15][45] = {
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
	int lastUpdateTime = 0;
	double renderTimer = 0;
	const string weatherNames[6] = langWeatherNames; // weatherNames[0]: level - 5s * currentWeather.second, weatherNames[1]: level + 5s * currentWeather.second, weatherNames[5]: slip + 10
	const string weatherIntensityLabels[4] = langWeatherIntensityLabels;
	const string weatherAsciiArt[3][4] = {{
	"     \033[33;1m_____\033[m                                  ",
	"    \033[33;1m|     |\033[m                                 ",
	"    \033[33;1m|     |\033[m                                 ",
	"    \033[33;1m|_____|\033[m                                 "},
	{"         _______      ___________           ",
	"     ___/       \\____/           \\___       ",
	"    (                                )      ",
	"     \\______________________________/       "},
	{"         \033[33;1m_____\033[m       ___________            ",
	"     ___\033[33;1m|_____|\033[m_____/           \\____       ",
	"    (                                )      ",
	"     \\______________________________/       "}};
	const int weatherSpawnCounts[4] = {0, 11, 20, 40};
	const char waterTrailChars[6] = {'.', '*', ' ', ' ', ' ', ' '};
	const string waterTrailColors[6] = {"\033[1;34m", "\033[1;36m", "", "", "", ""};
	pair<int, int> currentWeather = {2, 0};
	int waterTrailIndex = 0;
	vector<pair<int, int>> rainPoints;
	char screenBuffer[15][45] = {};
	char previousScreenBuffer[15][45] = {};
	string screenColor[15][45];
	vector<int> caughtFishStacks[7];
	int pollutionLevel = 0;
	const string fishTypeLabels[7] = langFishTypeNames;
	const string fishColorCodes[7] = {"\033[1;31m", "\033[1;37m", "\033[1;35m", "\033[1;34m", "\033[1;33m", "\033[1;32m", "\033[1;36m"};
	int currentStatus = 0;
	const string statusLabels[5] = langStatusLabels;
	const int fishSizeBonus[7] = {0, 1, 2, 5, 10, 50, 100};
	pair<int, int> terminalSize;
	pair<int, int> updateWeather(pair<int, int> weatherPair){
		if(weatherPair.first < 0 || weatherPair.first > 5 || weatherPair.second < 0 || weatherPair.second > 3){
			return {3, 0};
		}
		if(weatherPair.first == 0 || weatherPair.first == 1){
			if(weatherPair.second < 2){
				int ra = random(1, 20);
				if(ra <= 9){
					return weatherPair;
				}else if(ra <= 15){
					return {weatherPair.first, random(1, 3)};
				}else if(ra <= 18){
					return {random(0, 1), weatherPair.second};
				}else{
					return {random(2, 4), 0};
				}
			}else{
				int ra = random(1, 2);
				if(ra <= 1){
					return {weatherPair.first, random(1, 3)};
				}else if(ra <= 15){
					return weatherPair;
				}
			}
		}else if(weatherPair.first == 2 || weatherPair.first == 3 || weatherPair.first == 4){
			int ra = random(1, 10);
			if(ra <= 1){
				return {5, weatherPair.second};
			}else if(ra <= 3){
				return {random(0, 1), random(1, 2)};
			}else if(ra <= 6){
				return {random(2, 4), weatherPair.second};
			}else{
				return weatherPair;
			}
		}else{
			int ra = random(1, 10);
			if(ra <= 3){
				return {random(2, 4), weatherPair.second};
			}else{
				return weatherPair;
			}
		}
		return weatherPair;
	}
	inline int getFishingWaitTime(int level = variate::data_saver.level){
		return random(variate::mintime[level], variate::maxtime[level]);
	}
	inline int getFishPrice(int level = variate::data_saver.get_level, int multiplier = 1){
		return random(multiplier * variate::minget[level], multiplier * variate::maxget[level]);
	}
	inline int chooseFishType(){
		int ty = random(1, 10000);
		for(int i = 0; i <= 6; i++){
			ty -= fish_gai[variate::data_saver.gan][i];
			if(ty <= 0){
				return i;
			}
		}
		return 0;
	}
	inline void processCatch(bool isBig, int fishType){
		clear();
		if(variate::data_saver.hungry <= 2){
			printa((string)caughtFishText + fish_color[fishType] + fish_name[fishType] + (isBig ? bigFishPrefix : "") + eatenBecauseHungryText);
			variate::data_saver.hungry += fishType + 3;
			return;
		}
		int pri = getFishPrice(variate::data_saver.get_level, (isBig + 1) * fishSizeBonus[fishType]);
		if(fishType == 4 && isBig){
			clear();
			printa((string)caughtFishText + fish_color[fishType] + eggFishValueText + to_string(pri));
		}else{
			printa((string)caughtFishText + fish_color[fishType] + fishDescription((isBig ? bigFishPrefix : ""), fish_name[fishType]) + fishPriceSuffix + to_string(pri));
		}
		int cnt = 0;
		for(int i = 0; i <= 6; i++){
			cnt += variate::data_saver.aqfish_cnt[i];
		}
		int i;
		for(i = 0; i < type; i++){
			if(variate::data_saver.aqfish_cnt[i]){
				break;
			}
		}
		if(variate::data_saver.aqcnt && (cnt < variate::data_saver.aqcnt || !variate::data_saver.aqfish_cnt[i] || i == fishType)){
			if(printYn(aquariumPrompt)){
				variate::data_saver.aqfish_cnt[fishType]++;
				if(cnt >= variate::data_saver.aqcnt){
					variate::data_saver.aqfish_cnt[i]--;
				}
				return;
			}
		}
		caughtFishStacks[fishType].push_back(10);
		variate::data_saver.cnt++;
	}
	int lastMin = 0;
	int lastMax = 0;
	int lastStatus = 0;
	bool simpleMode = false;
	inline void renderScreen(int minWait = 0, int maxWait = 0){
		variate::data_saver.simple = (variate::data_saver.simple != simpleMode);
		bool wcg = false, wcgd = false;
		const int now = time(0);
		while(now - la > 10){
			auto nweather = updateWeather(currentWeather);
			if(nweather != currentWeather){
				wcg = true;
			}
			currentWeather = nweather;
			if(currentWeather.first <= 1){
				lw = currentWeather.first;
			}
			if(now - la > 100){
				la = now - 100;
			}
			la += 10;
		}
		bool need_cl = simpleMode;
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
			for(int i = rainPoints.size() - 1; i >= 0; i--){
				rainPoints[i].first += 1;
				wcgd = true;
				if(rainPoints[i].first > 10){
					swap(rainPoints[i], rainPoints[rainPoints.size() - 1]);
					rainPoints.pop_back();
				}
			}
			if(weatherSpawnCounts[currentWeather.second]){
				wcgd = true;
				rainPoints.push_back({0, random(0, 44)});
			}
			for(int i = 1; i <= weatherSpawnCounts[currentWeather.second] / 6 - 1 && rainPoints.size() < weatherSpawnCounts[currentWeather.second]; i++){
				if(rainPoints.size() < weatherSpawnCounts[currentWeather.second] && random(1, 2) <= 1){
					wcgd = true;
					rainPoints.push_back({0, random(0, 44)});
				}
			}
		}
		int start = 0;
		auto nowsize = getConsoleSize();
		const bool size_ok1 = nowsize.second < 20, size_ok2 = nowsize.first < 51;
		if(std::memcmp(screenBuffer, previousScreenBuffer, sizeof(screenBuffer))){
			wcgd = true;
			std::memcpy(previousScreenBuffer, screenBuffer, sizeof(screenBuffer));
		}
		if(terminalSize != nowsize){
			ter_big = nowsize;
			need_cl = true;
		}
		if(variate::data_saver.simple || size_ok1 || size_ok2){
			if(need_cl){
				cout << "\033c\033[?25l" << flush;
			}else if(variate::data_saver.simple || wcg){
				cout << "\033[H" << flush;
			}else{
				return;
			}
			if(!variate::data_saver.simple){
				if(size_ok1){
					cout << screenHeightMinText << endl;
					cout << currentSizeText << nowsize.second << rowsSuffix << endl;
				}
				if(size_ok2){
					cout << screenWidthMinText << endl;
					cout << currentSizeText << nowsize.first << columnsSuffix << endl;
				}
			}
		}else{
			if(need_cl){
				cout << "\033c\033[?25l" << flush;
			}else if(wcg || wcgd){
				cout << "\033[H" << flush;
			}else{
				return;
			}
			if(currentWeather.first == 3 || currentWeather.first == 4 || currentWeather.first == 2){
				start = 4;
				for(int i = 0; i < 4; i++){
					cout << weatherAsciiArt[currentWeather.first - 2][i] << endl;
				}
			}
			for(int i = start; i < 15; i++){
				for(int j = 0; j < 45; j++){
					bool b = false;
					for(auto p : rainPoints){
						if(p.first == i && p.second == j){
							b = true;
							break;
						}
					}
					if(screenBuffer[i][j] == ' ' && b){
						cout << "\033[m" << waterTrailColors[lw] << waterTrailChars[lw];
					}else{
						cout << "\033[m" << screenColor[i][j] << screenBuffer[i][j];
					}
				}
				cout << endl;
			}
		}
		cout << currentStatusLabelText << statuses[now_status] << endl;
		cout << totalFishCaughtText << variate::data_saver.cnt << currentWeatherText << weatherPhrases[currentWeather.second] << weatherNames[currentWeather.first] << endl;
		if(ma){
			if(mi){
				cout << remainingTimeLabelText << ": " << mi / 2. << " min ~ " << ma / 2. << " min" << endl;
			}else{
				cout << remainingTimeLabelText << ": < " << ma / 2. << " min" << endl;
			}
		}
		cout << (variate::data_saver.simple ? enterMinimalModeText : exitMinimalModeText) << endl;
		simpleMode = false;
	}
	void checkSleepInput(double seconds){
		for(char c : getch2s()){
			if(c == 'e'){
				simpleMode = !simpleMode;
			}
		}
		sleep2(seconds);
	}
	void sleepAndRender(double seconds){
		seconds = (int)(seconds * 100 + 0.5) / 100.;
		if(s < 0.01){
			s = 0.01;
		}
		while(s > 0.1){
			checkSleepInput(0.1);
			renderScreen();
			s -= 0.1;
			la2 += 0.1;
		}
		checkSleepInput(s);
		renderScreen();
		la2 += s;
	}
	void waitForEvent(double seconds){
		s = (int)(s * 100 + 0.5) / 100.;
		int mi = variate::mintime[variate::data_saver.level] * 10, ma = variate::maxtime[variate::data_saver.level] * 10;
		if(s && s < 0.01){
			s = 0.01;
		}
		while(s > 0.1){
			checkSleepInput(0.1);
			if(mi > 0){
				mi -= 1;
			}
			if(ma > 10){
				ma -= 1;
			}
			s -= 0.1;
			la2 += 0.1;
			renderScreen((mi - 10) / 300, max((ma + 290) / 300, 1));
		}
		if(s){
			checkSleepInput(s);
			renderScreen((mi - 10) / 300, max((ma + 290) / 300, 1));
		}
		la2 += s;
	}
	inline void animateFishing(bool isBig, int fishType){
		const double hung_speed = (variate::data_saver.hungry < 5 ? 3 : (variate::data_saver.hungry < 10 ? 2 : (variate::data_saver.hungry < 30 ? 1 : variate::data_saver.hungry < 35 ? 0.8 : 0.5)));
		cout << "\033[?25l" << flush;
		screenColor[11][18] = "\033[1;34m";
		screenBuffer[11][18] = '~';
		screenColor[10][19] = fish_color[type];
		screenBuffer[11][19] = '^';
		screenBuffer[10][19] = 'O';
		sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenColor[11][19] = "\033[1;34m";
		screenBuffer[11][19] = '~';
		screenColor[9][19] = fish_color[type];
		screenBuffer[10][19] = '^';
		screenBuffer[9][19] = 'O';
		sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		for(int i = 8; i >= 5; i--){
			screenColor[i + 2][19] = "";
			screenBuffer[i + 2][19] = ' ';
			screenColor[i][19] = fish_color[type];
			screenBuffer[i + 1][19] = '^';
			screenBuffer[i][19] = 'O';
			sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		}
		screenBuffer[9][24] = screenBuffer[8][24] = screenBuffer[7][24] = screenBuffer[6][24] = '|';
		screenBuffer[8][23] = screenBuffer[7][22] = screenBuffer[6][21] = screenBuffer[5][20] = screenBuffer[5][19] = screenBuffer[6][19] = ' ';
		screenColor[5][19] = screenColor[6][19] = "";
		screenBuffer[5][23] = '>';
		screenBuffer[5][24] = 'O';
		screenColor[5][23] = screenColor[5][24] = fish_color[type];
		sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[9][26] = 'V';
		screenBuffer[8][24] = screenBuffer[7][24] = screenBuffer[6][24] = screenBuffer[5][23] = screenBuffer[5][24] = ' ';
		screenColor[5][23] = screenColor[5][24] = "";
		screenBuffer[9][26] = screenBuffer[8][26] = screenBuffer[7][26] = screenBuffer[6][26] = '|';
		screenBuffer[9][24] = '/';
		screenBuffer[5][25] = '>';
		screenBuffer[5][26] = 'O';
		screenColor[5][25] = screenColor[5][26] = fish_color[type];
		sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[9][26] = screenBuffer[8][27] = screenBuffer[7][28] = screenBuffer[6][29] = '/';
		screenColor[5][25] = screenColor[5][26] = "";
		screenBuffer[8][26] = screenBuffer[7][26] = screenBuffer[6][26] = screenBuffer[5][25] = screenBuffer[5][26] = ' ';
		screenBuffer[5][29] = '>';
		screenBuffer[5][30] = 'O';
		screenColor[5][29] = screenColor[5][30] = fish_color[type];
		sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[8][27] = screenBuffer[7][28] = screenBuffer[6][29] = screenBuffer[5][29] = screenBuffer[5][30] = ' ';
		screenBuffer[9][26] = '\\';
		screenBuffer[9][27] = screenBuffer[9][28] = screenBuffer[9][29] = screenBuffer[9][30] = screenBuffer[9][31] = screenBuffer[9][32] = screenBuffer[9][33] = screenBuffer[9][34] = '-';
		screenBuffer[8][35] = 'V';
		screenBuffer[9][35] = 'O';
		screenColor[9][35] = screenColor[8][35] = fish_color[type];
		screenColor[5][29] = screenColor[5][30] = "";
		sleepAndRender(0.5 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[10][35] = 'O';
		screenBuffer[8][35] = ' ';
		screenBuffer[9][35] = 'V';
		screenColor[10][35] = fish_color[type];
		screenColor[8][35] = "";
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[11][34] = '\\';
		screenBuffer[11][36] = '/';
		for(int i = 11; i <= 12; i++){
			screenBuffer[i][35] = 'O';
			screenBuffer[i - 2][35] = ' ';
			screenBuffer[i - 1][35] = 'V';
			screenColor[i][35] = fish_color[type];
			screenColor[i - 2][35] = "";
			sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		}
		screenBuffer[11][34] = screenBuffer[11][35] = screenBuffer[11][36] = '~';
		screenBuffer[13][35] = 'O';
		screenBuffer[12][35] = 'V';
		screenColor[13][35] = fish_color[type];
		screenColor[11][35] = "\033[1;34m";
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[13][36] = 'O';
		screenBuffer[12][35] = ' ';
		screenBuffer[13][35] = '>';
		screenColor[13][36] = fish_color[type];
		screenColor[12][35] = "";
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		for(int i = 37; i <= 38; i++){
			screenBuffer[13][i] = 'O';
			screenBuffer[13][i - 2] = ' ';
			screenBuffer[13][i - 1] = '>';
			screenColor[13][i] = fish_color[type];
			screenColor[13][i - 2] = "";
			sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		}
		screenBuffer[13][38] = screenBuffer[13][37] = ' ';
		screenColor[13][38] = screenColor[13][37] = "";
		cout << "\033[?25h" << flush;
		processCatch(is_big, type);
	}
	inline void animateFishingSlip(bool isBig, int fishType){
		const double hung_speed = (variate::data_saver.hungry < 5 ? 3 : (variate::data_saver.hungry < 10 ? 2 : (variate::data_saver.hungry < 30 ? 1 : variate::data_saver.hungry < 35 ? 0.8 : 0.5)));
		cout << "\033[?25l" << flush;
		screenColor[11][18] = "\033[1;34m";
		screenBuffer[11][18] = '~';
		screenColor[10][19] = fish_color[type];
		screenBuffer[11][19] = '^';
		screenBuffer[10][19] = 'O';
		sleepAndRender(0.3 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		now_status = 4;
		screenColor[11][19] = "\033[1;34m";
		screenBuffer[11][19] = '~';
		screenColor[10][19] = "";
		screenBuffer[10][19] = ' ';
		screenBuffer[10][20] = '^';
		screenBuffer[9][19] = 'O';
		screenColor[10][20] = screenColor[9][19] = fish_color[type];
		sleepAndRender(0.3 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[10][20] = screenBuffer[9][19] = ' ';
		screenColor[10][20] = screenColor[9][19] = "";
		screenBuffer[9][18] = '^';
		screenBuffer[8][19] = 'O';
		screenColor[9][18] = screenColor[8][19] = fish_color[type];
		sleepAndRender(0.3 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[9][18] = screenBuffer[8][19] = ' ';
		screenColor[9][18] = screenColor[8][19] = "";
		screenBuffer[8][20] = '^';
		screenBuffer[7][19] = 'O';
		screenColor[8][20] = screenColor[7][19] = fish_color[type];
		sleepAndRender(0.3 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[6][19] = 'j';
		screenColor[8][20] = "";
		screenBuffer[8][20] = ' ';
		screenColor[7][20] = fish_color[type];
		screenBuffer[7][20] = '<';
		sleepAndRender(0.3 * hung_speed * (is_big + 1) / variate::data_saver.stime);
		screenColor[7][20] = "";
		screenBuffer[5][19] = 'j';
		screenBuffer[7][20] = screenBuffer[6][19] = ' ';
		screenColor[8][19] = fish_color[type];
		screenBuffer[7][19] = 'V';
		screenBuffer[8][19] = 'O';
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		screenColor[7][19] = "";
		screenColor[9][19] = fish_color[type];
		screenBuffer[7][19] = ' ';
		screenBuffer[8][19] = 'V';
		screenBuffer[9][19] = 'O';
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		screenColor[8][19] = "";
		screenColor[10][19] = fish_color[type];
		screenBuffer[8][19] = ' ';
		screenBuffer[9][19] = 'V';
		screenBuffer[10][19] = 'O';
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		screenBuffer[11][18] = '\\';
		screenBuffer[11][20] = '/';
		for(int i = 11; i <= 12; i++){
			screenColor[i - 2][19] = "";
			screenColor[i][19] = fish_color[type];
			screenBuffer[i - 2][19] = ' ';
			screenBuffer[i - 1][19] = 'V';
			screenBuffer[i][19] = 'O';
			sleepAndRender(0.5 / (is_big + 1) / variate::data_saver.stime);
		}
		screenBuffer[11][18] = screenBuffer[11][20] = screenBuffer[11][19] = '~';
		screenColor[11][19] = "\033[1;34m";
		screenColor[13][19] = fish_color[type];
		screenBuffer[12][19] = 'V';
		screenBuffer[13][19] = 'O';
		sleepAndRender(0.5 / (is_big + 1) / variate::data_saver.stime);
		screenBuffer[12][19] = ' ';
		screenColor[12][19] = "";
		screenColor[14][19] = fish_color[type];
		screenBuffer[13][19] = 'V';
		screenBuffer[14][19] = 'O';
		sleepAndRender(0.5 / (is_big + 1) / variate::data_saver.stime);
		screenBuffer[13][19] = ' ';
		screenColor[13][19] = "";
		screenBuffer[14][19] = 'V';
		sleepAndRender(0.5 / (is_big + 1) / variate::data_saver.stime);
		screenBuffer[14][19] = ' ';
		screenColor[14][19] = "";
		sleepAndRender(0.5 / (is_big + 1) / variate::data_saver.stime);
		screenBuffer[8][23] = screenBuffer[7][22] = screenBuffer[6][21] = screenBuffer[5][20] = screenBuffer[5][19] = ' ';
		screenBuffer[9][24] = '/';
		cout << "\033[?25h" << flush;
	}
	inline void startFishingSequence(bool isBig, int fishType){
		std::memset(previousScreenBuffer, 0, sizeof(previousScreenBuffer));
		ter_big = {0, 0};
		la = time(0);

		const double hung_speed = (variate::data_saver.hungry < 5 ? 3 : (variate::data_saver.hungry < 10 ? 2 : (variate::data_saver.hungry < 30 ? 1 : variate::data_saver.hungry < 35 ? 0.8 : 0.5)));
		now_status = 0;
		cout << "\033[?25l" << flush;
		for(int i = 0; i < 15; i++){
			for(int j = 0; j < 45; j++){
				screenColor[i][j] = "";
				screenBuffer[i][j] = old[i][j];
			}
		}
		for(int i = 0; i <= 22; i++){
			screenColor[11][i] = "\033[1;34m";
		}
		for(int i = 31; i <= 42; i++){
			screenColor[11][i] = "\033[1;34m";
		}
		if(variate::fish_man){
			screenBuffer[8][25] = ' ';
			screenBuffer[9][25] = 'O';
			screenColor[9][25] = screenColor[10][24] = screenColor[10][26] = fish_color[6];
			variate::fish_man = false;
		}
		sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		for(int i = 27; i <= 34; i++){
			screenBuffer[9][i] = ' ';
		}
		screenBuffer[9][26] = 'V';
		screenBuffer[8][27] = screenBuffer[7][28] = screenBuffer[6][29] = screenBuffer[5][30] = '/';
		sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		screenBuffer[8][27] = screenBuffer[7][28] = screenBuffer[6][29] = screenBuffer[5][30] = ' ';
		screenBuffer[9][26] = screenBuffer[8][26] = screenBuffer[7][26] = screenBuffer[6][26] = screenBuffer[5][26] = '|';
		sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		screenBuffer[9][26] = '\\';
		screenBuffer[8][26] = screenBuffer[7][26] = screenBuffer[6][26] = screenBuffer[5][26] = ' ';
		screenBuffer[9][24] = screenBuffer[8][24] = screenBuffer[7][24] = screenBuffer[6][24] = screenBuffer[5][24] = '|';
		sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		screenBuffer[8][24] = screenBuffer[7][24] = screenBuffer[6][24] = screenBuffer[5][24] = ' ';
		screenBuffer[9][24] = 'V';
		screenBuffer[8][23] = screenBuffer[7][22] = screenBuffer[6][21] = screenBuffer[5][20] = '\\';
		sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		screenBuffer[5][19] = 'j';
		sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		for(int i = 6; i <= 10; i++){
			screenBuffer[i - 1][19] = '|';
			screenBuffer[i][19] = 'j';
			sleepAndRender(0.5 * hung_speed / variate::data_saver.stime);
		}
		screenBuffer[10][19] = '|';
		screenBuffer[11][19] = 'j';
		screenColor[11][19] = "";
		int stime = getFishingWaitTime();
		if(currentWeather.first == 0){
			stime = max(0, stime - 5 * currentWeather.second);
		}
		if(currentWeather.first == 1){
			stime = max(0, stime + 5 * currentWeather.second);
		}
		now_status = 1;
		waitForEvent(stime);
		now_status = 2;
		screenColor[11][0] = fish_color[type];
		screenBuffer[11][0] = 'O';
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		screenColor[11][1] = fish_color[type];
		screenBuffer[11][0] = '>';
		screenBuffer[11][1] = 'O';
		sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		for(int i = 2; i <= 19; i++){
			if(i == 19){
				now_status = 3;
			}
			screenColor[11][i - 2] = "\033[1;34m";
			screenBuffer[11][i - 2] = '~';
			screenColor[11][i] = fish_color[type];
			screenBuffer[11][i - 1] = '>';
			screenBuffer[11][i] = 'O';
			sleepAndRender(0.5 * (is_big + 1) / variate::data_saver.stime);
		}
		cout << "\033[?25h" << flush;
		bool slip = (random(1, 100) <= (variate::data_saver.slip + (currentWeather.first == 5) * 10));
		if(slip){
			animateFishingSlip(is_big, type);
		}else{
			fishing(is_big, type);
		}
		while(!rainPoints.empty()){
			rainPoints.pop_back();
		}
	}
	inline void chooseFishingOutcome(){
		bool b = (random(1, 100) <= variate::data_saver.bf);
		if(variate::big){
			b = true;
			variate::big--;
		}
		int type = chooseFishType();
		if(variate::diamond){
			type = 6;
			variate::diamond--;
		}
		startFishingSequence(b, type);
	}
	inline double freshnessMultiplier(int freshness){
		if(a >= 8){
			return 1.25;
		}else if(a <= 2){
			return 0.8;
		}else{
			return 1;
		}
	}
	inline void chooseRod(){
		clear();
		print(rodShopText);
		print(currentRodText + fish_name[variate::data_saver.gan] + rodText);
		bool b[8] = {};
		string s = "";
		for(int i = 0; i <= 6; i++){
			b[i] = !caughtFishStacks[i].empty();
			if(b[i]){
				s += to_string(i);
				s += ". ";
				s += fish_name[i];
				s += rodText;
				s += ", ";
			}
		}
		b[7] = true;
		if(s.empty()){
			print(noneText);
			return;
		}
		s += exitOptionText;
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
		if(d == 7){
			return;
		}
		if(!caughtFishStacks[d].empty()){
			caughtFishStacks[d].pop_back();
		}
		variate::data_saver.gan = d;
	}
	void showAquarium(){
		{
			int cnt = 0;
			for(int i = 0; i <= 6; i++){
				cnt += variate::data_saver.aqfish_cnt[i];
			}
			for(int i = 6; i >= 1 && cnt > 0; i--){
				if(variate::data_saver.aqfish_cnt[i]){
					variate::data_saver.aqfish_cnt[i]--;
				}
			}
		}
		clear();
		print(aquariumText);
		print(aquariumTipText);
		print(aquariumExitText);
		variate::aqnow = time(0);
		for(int i = 0; i <= 6; i++){
			cout << fishing::fish_color[i] << fishing::fish_name[i] << fishLabel << variate::data_saver.aqfish_cnt[i] << fishUnitText << endl;
		}
		while(getch() != '1');
		int cnt = 0;
		for(int i = 0; i <= 6; i++){
			cnt += aqua_get[i] * variate::data_saver.aqfish_cnt[i];
		}
		variate::aqother += time(0) - variate::aqnow;
		variate::aqnow = 0;
		cnt *= variate::aqother / 60;
		variate::aqother %= 60;
		variate::data_saver.money += cnt;
		print(profitPrefixText + to_string(cnt) + profitSuffixText);
	}
	void prepareFood(){
		while(true){
			clear();
			print(rawFishText);
			print(currentAmountText);
			bool b[8] = {};
			string s = "";
			for(int i = 0; i <= 6; i++){
				b[i] = !caughtFishStacks[i].empty();
				if(b[i]){
					s += to_string(i);
					s += ". ";
					s += fish_name[i];
					s += fishLabel;
					s += ", ";
				}
			}
			b[7] = true;
			if(s.empty()){
				print(noneText);
				sleept(0.5);
				return;
			}
			s += exitOptionText;
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
				if(caughtFishStacks[i].size()){
					cout << fishPondText << caughtFishStacks[i].size() << fishCountSuffix << endl;
				}
				if(variate::data_saver.caughtFishStacks[i][0]){
					cout << rawFishLinePrefix << variate::data_saver.caughtFishStacks[i][0] << fishCountSuffix << endl;
				}
				if(variate::data_saver.caughtFishStacks[i][1]){
					cout << roastedFishLinePrefix << variate::data_saver.caughtFishStacks[i][1] << fishCountSuffix << endl;
				}
				if(caughtFishStacks[i].empty() && !variate::data_saver.caughtFishStacks[i][0] && !variate::data_saver.caughtFishStacks[i][1]){
					cout << noneIndentedText << endl;
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
			if(d == 7){
				break;
			}
			if(caughtFishStacks[d].empty()){
				continue;
			}
			caughtFishStacks[d].pop_back();
			variate::data_saver.caughtFishStacks[d][0]++;
		}
	}
	void roastFood(){
		clear();
		print(prepareRoastedFishText);
		print(currentAmountText);
		bool b[8] = {};
		string s = "";
		for(int i = 0; i <= 6; i++){
			b[i] = variate::data_saver.caughtFishStacks[i][0];
			if(b[i]){
				s += to_string(i);
				s += ". ";
				s += fish_name[i];
				s += fishLabel;
				s += ", ";
			}
		}
		b[7] = true;
		if(s.empty()){
			print(noneText);
			sleept(0.5);
			return;
		}
		s += exitOptionText;
		for(int i = 1; i <= 6; i++){
			cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
			if(caughtFishStacks[i].size()){
				cout << fishPondText << caughtFishStacks[i].size() << fishCountSuffix << endl;
			}
			if(variate::data_saver.caughtFishStacks[i][0]){
				cout << rawFishLinePrefix << variate::data_saver.caughtFishStacks[i][0] << fishCountSuffix << endl;
			}
			if(variate::data_saver.caughtFishStacks[i][1]){
				cout << roastedFishLinePrefix << variate::data_saver.caughtFishStacks[i][1] << fishCountSuffix << endl;
			}
			if(caughtFishStacks[i].empty() && !variate::data_saver.caughtFishStacks[i][0] && !variate::data_saver.caughtFishStacks[i][1]){
				cout << noneIndentedText << endl;
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
		if(d == 7){
			sleept(0.5);
			return;
		}
		if(!variate::data_saver.caughtFishStacks[d][0]){
			return;
		}
		const int l = 0, r = variate::data_saver.caughtFishStacks[d][0];
		int a = 0;
		clear();
		cout << roastingInstructionsText << endl << roastingLineText << fish_color[d] << fish_name[d] + fishLabel << "\033[m" << endl;
		cout << (a == l ? "\033[1;31m" : "\033[1m") << " < \033[m" << a << fishCountSuffix << (a == r ? "\033[1;31m" : "\033[1m") << " > \033[m" << endl;
		while(true){
			char c = getch();
			if(c == 'a' || c == 'A'){
				a--;
				if(a < l){
					a = l;
				}
			}else if(c == 'd' || c == 'D'){
				a++;
				if(a > r){
					a = r;
				}
			}else if(c == '\r'){
				if(a > variate::data_saver.caughtFishStacks[d][0] || a < 0 || !variate::data_saver.roast){
					clear();
					return;
				}
				variate::data_saver.caughtFishStacks[d][0] -= a;
				variate::data_saver.caughtFishStacks[d][1] += a;
				clear();
				int time = (a + variate::data_saver.roast - 1) / variate::data_saver.roast;
				for(int i = 0; i < time; i++){
					for(int j = 0; j < 20; j++){
						clear();
						cout << roastingText << endl;
						int ok = i * 20 + j, all = time;
						int done = int((double)ok / all * 3);
						bool d2 = done & 1;
						done >>= 1;
						for(int k = 1; k <= done; k++){
							cout << "\033[32;1m=\033[m";
						}
						if(done < 30){
							cout << (d2 ? "\033[32;1m-\033[m" : "\033[31;1m=\033[m");
						}
						for(int k = done + 1; k < 30; k++){
							cout << "\033[31;1m=\033[m";
						}
						cout << endl;
						cout << i * variate::data_saver.roast << "/" << a << roastDoneSuffix << endl;
						sleept(0.5);
					}
				}
				clear();
				cout << roastFinishedText << endl;
				for(int k = 0; k < 30; k++){
					cout << "\033[32;1m=\033[m";
				}
				cout << endl;
				cout << a << "/" << a << roastDoneSuffix << endl;
				sleept(1);
				return;
			}else if(c == 127){
				clear();
				return;
			}
			clear();
			cout << roastingInstructionsText << endl << roastingLineText << fish_color[d] << fish_name[d] + fishLabel << "\033[m" << endl;
			cout << (a == l ? "\033[1;31m" : "\033[1m") << " < \033[m" << a << fishCountSuffix << (a == r ? "\033[1;31m" : "\033[1m") << " > \033[m" << endl;
		}
	}
	void eat_food(){
		while(true){
			clear();
			print(eatRawFishText);
			printnl(currentHungerText);
			cout << (variate::data_saver.hungry < 10 ? "\033[31;1m" : (variate::data_saver.hungry < 30 ? "" : variate::data_saver.hungry < 35 ? "\033[32m" : "\033[32;1m")) << variate::data_saver.hungry << "\033[m" << endl;
			print(currentAmountText);
			bool b[8] = {};
			string s = "";
			for(int i = 0; i <= 6; i++){
				b[i] = variate::data_saver.caughtFishStacks[i][0];
				if(b[i]){
					s += to_string(i);
					s += ". ";
					s += fish_name[i];
					s += rawFishItemText;
					s += ", ";
				}
			}
			b[7] = true;
			if(s.empty()){
				print(noneText);
				sleept(0.5);
				return;
			}
			s += exitOptionText;
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
				if(variate::data_saver.caughtFishStacks[i][0]){
					cout << rawFishLinePrefix << variate::data_saver.caughtFishStacks[i][0] << fishPlusSuffix << i + 3 << endl;
				}
				if(!variate::data_saver.caughtFishStacks[i][0] && !variate::data_saver.caughtFishStacks[i][1]){
					cout << noneIndentedText << endl;
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
			if(d == 7){
				sleept(0.5);
				return;
			}
			if(variate::data_saver.caughtFishStacks[d][0] < 1){
				sleept(0.5);
				return;
			}
			variate::data_saver.caughtFishStacks[d][0]--;
			variate::data_saver.hungry += d + 3;
			variate::data_saver.hungry = min(variate::data_saver.hungry, 40);
			sleept(0.5);
		}
	}
	void eat_food_roast(){
		while(true){
			clear();
			print(eatRoastedFishText);
			printnl(currentHungerText);
			cout << (variate::data_saver.hungry < 10 ? "\033[31;1m" : (variate::data_saver.hungry < 30 ? "" : variate::data_saver.hungry < 35 ? "\033[32m" : "\033[32;1m")) << variate::data_saver.hungry << "\033[m" << endl;
			print(currentAmountText);
			bool b[8] = {};
			string s = "";
			for(int i = 0; i <= 6; i++){
				b[i] = variate::data_saver.caughtFishStacks[i][1];
				if(b[i]){
					s += to_string(i);
					s += ". ";
					s += fish_name[i];
					s += roastedFishText;
					s += ", ";
				}
			}
			b[7] = true;
			if(s.empty()){
				print(noneText);
				sleept(0.5);
				return;
			}
			s += exitOptionText;
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
				if(variate::data_saver.caughtFishStacks[i][1]){
					cout << roastedFishLinePrefix << variate::data_saver.caughtFishStacks[i][1] << fishPlusSuffix << i + 7 << endl;
				}
				if(!variate::data_saver.caughtFishStacks[i][0] && !variate::data_saver.caughtFishStacks[i][1]){
					cout << noneIndentedText << endl;
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
			if(d == 7){
				sleept(0.5);
				return;
			}
			if(variate::data_saver.caughtFishStacks[d][1] < 1){
				return;
			}
			variate::data_saver.caughtFishStacks[d][1]--;
			variate::data_saver.hungry += d + 7;
			variate::data_saver.hungry = min(variate::data_saver.hungry, 40);
			sleept(0.5);
		}
	}
	void no_roast(){
		while(true){
			clear();
			print(makeFoodMenuText);
			printnl(currentHungerText);
			cout << (variate::data_saver.hungry < 10 ? "\033[31;1m" : (variate::data_saver.hungry < 30 ? "" : variate::data_saver.hungry < 35 ? "\033[32m" : "\033[32;1m")) << variate::data_saver.hungry << "\033[m" << endl;
			print(currentAmountText);
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
				if(caughtFishStacks[i].size()){
					cout << fishPondText << caughtFishStacks[i].size() << fishCountSuffix << endl;
				}
				if(variate::data_saver.caughtFishStacks[i][0]){
					cout << rawFishLinePrefix << variate::data_saver.caughtFishStacks[i][0] << fishCountSuffix << endl;
				}
				if(variate::data_saver.caughtFishStacks[i][1]){
					cout << roastedFishLinePrefix << variate::data_saver.caughtFishStacks[i][1] << fishCountSuffix << endl;
				}
				if(caughtFishStacks[i].empty() && !variate::data_saver.caughtFishStacks[i][0] && !variate::data_saver.caughtFishStacks[i][1]){
					cout << noneIndentedText << endl;
				}
			}
			while(true){
				char c = getch();
				if(c == '1'){
					make_food();
					break;
				}else if(c == '2'){
					eat_food();
					break;
				}else if(c == '3'){
					return;
				}
			}
			sleept(0.5);
		}
	}
	void roast(){
		if(!variate::data_saver.roast){
			no_roast();
			return;
		}
		while(true){
			clear();
			print(roastFoodMenuText);
			printnl(currentHungerText);
			cout << (variate::data_saver.hungry < 10 ? "\033[31;1m" : (variate::data_saver.hungry < 30 ? "" : variate::data_saver.hungry < 35 ? "\033[32m" : "\033[32;1m")) << variate::data_saver.hungry << "\033[m" << endl;
			print(currentAmountText);
			for(int i = 1; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
				if(caughtFishStacks[i].size()){
					cout << fishPondText << caughtFishStacks[i].size() << fishCountSuffix << endl;
				}
				if(variate::data_saver.caughtFishStacks[i][0]){
					cout << rawFishLinePrefix << variate::data_saver.caughtFishStacks[i][0] << fishCountSuffix << endl;
				}
				if(variate::data_saver.caughtFishStacks[i][1]){
					cout << roastedFishLinePrefix << variate::data_saver.caughtFishStacks[i][1] << fishCountSuffix << endl;
				}
				if(caughtFishStacks[i].empty() && !variate::data_saver.caughtFishStacks[i][0] && !variate::data_saver.caughtFishStacks[i][1]){
					cout << noneIndentedText << endl;
				}
			}
			cout << endl;
			while(true){
				char c = getch();
				if(c == '1'){
					make_food();
					break;
				}else if(c == '2'){
					roast_food();
					break;
				}else if(c == '3'){
					eat_food();
					break;
				}else if(c == '4'){
					eat_food_roast();
					break;
				}else if(c == '5'){
					return;
				}
			}
			sleept(0.5);
		}
	}
	inline void fishing_setup(){
		while(true){
			clear();
			if(pollutionLevel >= 10){
				cout << "\033[31m";
				print(pollutionFullText);
				print(cleanPondOptionText);
				for(int i = 0; i <= 6; i++){
					while(!caughtFishStacks[i].empty()){
						caughtFishStacks[i].pop_back();
					}
					variate::data_saver.aqfish_cnt[i] = 0;
				}
				checkpoint::savechpnp(variate::name);
				while(getch() == '1'){
					variate::data_saver.money -= 1000;
				}
			}
			print(mainMenuOptionsText);
			printnl(currentHungerText);
			cout << (variate::data_saver.hungry < 10 ? "\033[31;1m" : (variate::data_saver.hungry < 30 ? "" : variate::data_saver.hungry < 35 ? "\033[32m" : "\033[32;1m")) << variate::data_saver.hungry << "\033[m" << endl;
			print(currentRodLabelText + fish_name[variate::data_saver.gan] + rodText);
			print(currentPollutionLabelText + to_string(pollutionLevel));
			for(int i = 0; i <= 6; i++){
				cout << fish_color[i] << fish_name[i] + fishLabel << "\033[m" << endl;
				for(int j = 0; j < caughtFishStacks[i].size(); j++){
					if(caughtFishStacks[i][j] >= 8){
						cout << "\033[1;32m";
					}else if(caughtFishStacks[i][j] <= 2){
						cout << "\033[1;31m";
					}else{
						cout << "\033[1m";
					}
					cout << freshnessLabelText << caughtFishStacks[i][j] << "\033[m" << endl;
				}
				if(caughtFishStacks[i].empty()){
					cout << noneIndentedText << endl;
				}
			}
			while(true){
				char c = getch();
				if(c == '1'){
					for(int i = 0; i <= 6; i++){
						for(int j = 0; j < caughtFishStacks[i].size(); j++){
							caughtFishStacks[i][j] -= pollutionLevel + 1;
							if(caughtFishStacks[i][j] <= 0){
								if(i == 0){
									pollutionLevel++;
								}else{
									caughtFishStacks[i - 1].push_back(10);
								}
								for(int k = j + 1; k < caughtFishStacks[i].size(); k++){
									caughtFishStacks[i][k - 1] = caughtFishStacks[i][k];
								}
								caughtFishStacks[i].pop_back();
								j--;
							}
						}
					}
					chooseFishingOutcome();
					variate::data_saver.hungry--;
					break;
				}else if(c == '2'){
					clear();
					if(!pollutionLevel){
						cout << noCleaningNeededText << endl;
						break;
					}
					while(true){
						if(variate::data_saver.cleaning_ball){
							print(cleanMenuText);
							print(currentPollutionStatusText + to_string(variate::data_saver.cleaning_ball));
							print(cleaningSuppliesLabelText + to_string(variate::data_saver.cleaning_ball));
							char c = 0;
							while(true){
								c = getch();
								if(c == '1' || c == '2'){
									break;
								}
							}
							if(c == '1'){
								variate::data_saver.cleaning_ball--;
								pollutionLevel -= variate::data_saver.cleaning_sub;
								if(pollutionLevel < 0){
									pollutionLevel = 0;
								}
							}else{
								break;
							}
						}else{
							print(buyAndCleanMenuText);
							print(pollutionLevelText + to_string(variate::data_saver.cleaning_ball));
							print(cleaningSuppliesText);
							print(cleaningCostText + to_string(variate::data_saver.money));
							char c = 0;
							while(true){
								c = getch();
								if(c == '1' || c == '2'){
									break;
								}
							}
							if(c == '1'){
								if(variate::data_saver.money < 20){
									cout << notEnoughMoneyText << endl;
									break;
								}else{
									variate::data_saver.money -= 20;
									pollutionLevel -= variate::data_saver.cleaning_sub;
									if(pollutionLevel < 0){
										pollutionLevel = 0;
									}
								}
							}else{
								break;
							}
						}
						if(!pollutionLevel){
							cout << cleaningCompleteText << endl;
							break;
						}
					}
					break;
				}else if(c == '3'){
					get_gan();
					sleept(1);
					break;
				}else if(c == '4'){
					if(variate::data_saver.aqcnt){
						aqua();
						sleept(1);
					}else{
						print(aquariumRequiredText);
						sleept(0.5);
					}
					break;
				}else if(c == '5'){
					roast();
					break;
				}else if(c == '6'){
					for(int i = 0; i <= 6; i++){
						for(int j = 0; j < caughtFishStacks[i].size(); j++){
							variate::data_saver.money += (int)(getFishPrice() * (1 - 0.02 * pollutionLevel) * freshnessMultiplier(caughtFishStacks[i][j]));
						}
						while(!caughtFishStacks[i].empty()){
							caughtFishStacks[i].pop_back();
						}
					}
					clear();
					break;
				}else if(c == '7'){
					for(int i = 0; i <= 6; i++){
						for(int j = 0; j < caughtFishStacks[i].size(); j++){
							variate::data_saver.money += (int)(getFishPrice() * (1 - 0.02 * pollutionLevel) * freshnessMultiplier(caughtFishStacks[i][j]));
						}
						while(!caughtFishStacks[i].empty()){
							caughtFishStacks[i].pop_back();
						}
					}
					return;
				}
			}
			sleept(1);
		}
	}
}
#endif
