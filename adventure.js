export default class Adventure {
	#now = 0;
	#america = 0;
	#sleepcnt = 0;
	#eatcnt = 0;
	#e2 = 0;
	#s2 = 0;
	#temple = 0;
	#romar = 0;
	#headbone = 0;
	#drafood = 0;
	#m2 = [];
	#m1 = new Map;
	#lang = undefined;
	#data = undefined;
	#functions = undefined;
	constructor(lang, data, functions) {
		this.#lang = lang;
		this.#data = data;
		this.#functions = functions;
		for (let i = 1; i <= 9; i++) {
			this.#m2.push(String(i))
		}
		for (let i = 0; i < 26; i++) {
			this.#m2.push(String.fromCharCode(97 + i))
		}
		this.#m1 = new Map(this.#m2.map((ch, i) => [ch, i]));
		Object.seal(this)
	}
	#reset() {
		this.#america = this.#sleepcnt = this.#eatcnt = this.#e2 = this.#s2 = this.#temple = this.#romar = this.#headbone = this.#drafood = 0;
		this.#now = 0
	}
	async #runTurn(things) {
		const scene = things[this.#now];
		const {
			title,
			lines,
			choose,
			cnext,
			next: nextIds
		} = scene;
		if (title) {
			await this.#functions.print(title)
		}
		for (const line of lines) {
			await this.#functions.print(line);
			await this.#functions.sleep(.1)
		}
		await this.#functions.write("\n");
		if (this.#now === 21) {
			if (!this.#romar) {
				await this.#functions.printa(this.#lang.current.adventure.achievementAllRoadsToRome);
				this.#data.gameState.dataSaver.money += 100
			}
			if (this.#romar === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementWrongWay);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#romar++
		}
		if (this.#now === 22) {
			if (!this.#america) {
				await this.#functions.printa(this.#lang.current.adventure.achievementVoyage);
				this.#data.gameState.dataSaver.money += 100
			}
			if (this.#america === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementWrongWay);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#america++
		}
		if (this.#now === 24) {
			if (!this.#headbone) {
				await this.#functions.printa(this.#lang.current.adventure.achievementSurprise);
				this.#data.gameState.dataSaver.money += 100
			}
			if (this.#headbone === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementArchaeologist);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#headbone++
		}
		let menu = "";
		for (let i = 0; i < choose.length; i++) {
			menu += this.#m2[i] + "." + choose[i];
			if (i < choose.length - 1) {
				menu += ", "
			}
		}
		await this.#functions.print(menu);
		let ch;
		do {
			ch = await this.#functions.getch()
		} while (!this.#m1.has(ch) || this.#m1.get(ch) >= choose.length);
		const idx = this.#m1.get(ch);
		if (cnext[idx]) {
			await this.#functions.clear();
			await this.#functions.printa(cnext[idx])
		}
		this.#now = nextIds[idx];
		if (this.#now === 13) {
			if (!this.#temple) {
				await this.#functions.printa(this.#lang.current.adventure.achievementBuddhism);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#temple === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementAscend);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#temple++
		}
		if (this.#now === 30) {
			if (this.#eatcnt >= 30 && !this.#drafood) {
				await this.#functions.printa(this.#lang.current.adventure.achievementDragonMeal);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#drafood++
		}
		if (this.#now === -3) {
			if (this.#eatcnt >= 30 && this.#e2 === 0) {
				await this.#functions.printa(this.#lang.current.adventure.achievementOriginalAspiration);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#eatcnt >= 30 && this.#e2 === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementMission);
				this.#data.gameState.dataSaver.money += 200
			}
			this.#e2++;
			this.#now = 1
		}
		if (this.#now === -4) {
			if (this.#sleepcnt >= 30 && this.#s2 === 0) {
				await this.#functions.printa(this.#lang.current.adventure.achievementSoftBed);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#sleepcnt >= 30 && this.#s2 === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementSleepComfort);
				this.#data.gameState.dataSaver.money += 200
			}
			this.#s2++;
			this.#now = 1
		}
		if (this.#now === -1) {
			this.#eatcnt++;
			if (this.#eatcnt === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementNeedFood);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#eatcnt === 10) {
				await this.#functions.printa(this.#lang.current.adventure.achievementHungryGhost);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#eatcnt === 30) {
				await this.#functions.printa(this.#lang.current.adventure.achievementVirtuousHui);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#now = 1
		}
		if (this.#now === -2) {
			this.#sleepcnt++;
			if (this.#sleepcnt === 5) {
				await this.#functions.printa(this.#lang.current.adventure.achievementReadyAfterSleep);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#sleepcnt === 10) {
				await this.#functions.printa(this.#lang.current.adventure.achievementBedComfort);
				this.#data.gameState.dataSaver.money += 100
			} else if (this.#sleepcnt === 30) {
				await this.#functions.printa(this.#lang.current.adventure.achievementSleepGod);
				this.#data.gameState.dataSaver.money += 100
			}
			this.#now = 1
		}
		await this.#functions.sleep(.5)
	}
	async run() {
		if (this.#data.gameState.dataSaver.challengeLevel !== 1) {
			return
		}
		this.#reset();
		const things = this.#lang.current.adventure.story;
		while (true) {
			if (this.#now === -5) {
				await this.#functions.printa(this.#lang.current.adventure.missionComplete);
				this.#data.gameState.dataSaver.money += 100;
				this.#data.gameState.dataSaver.challengeLevel = 2;
				return
			}
			await this.#functions.clear();
			await this.#runTurn(things)
		}
	}
}
