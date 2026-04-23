import deepFreeze from "./deepFreeze.js";
export default class Parkour {
	#level = 0;
	#x = 0;
	#y = 0;
	#sx = 1;
	#sy = 0;
	#born = [];
	#map = [];
	#lang = undefined;
	#data = undefined;
	#functions = undefined;
	run;
	#cellAt(mapRow, col) {
		if (mapRow < 0 || mapRow >= this.#map.length) {
			return undefined
		}
		const row = this.#map[mapRow];
		if (!row || col < 0 || col >= row.length) {
			return undefined
		}
		return row[col]
	}
	#isAirAbove() {
		return this.#cellAt(this.#y - 1, this.#x) === " "
	}
	#isLavaCell() {
		return this.#cellAt(this.#y, this.#x) === "*"
	}
	#isFinishCell(x2, y2) {
		const c = this.#cellAt(y2 - 1, x2);
		return c === "f" || c === "i" || c === "n" || c === "s" || c === "h"
	}
	#canMoveTo(x2, y2) {
		const c = this.#cellAt(y2 - 1, x2);
		return c === " " || c === "."
	}
	#getSlideDirection(x2, y2) {
		const c = this.#cellAt(y2 - 1, x2);
		return c === "/" ? 1 : c === "\\" ? -1 : 0
	}
	async #show() {
		let a = Math.max(this.#x - 30, 0);
		let b = Math.max(this.#y - 5, 0);
		if (a + 59 > 100) {
			a = 100 - 59
		}
		if (b > 21) {
			b = 21
		}
		for (let i = b; i < b + 10; i++) {
			for (let j = a; j < a + 60; j++) {
				if (i === this.#y - 1 && j === this.#x) {
					await this.#functions.write("O")
				} else {
					if (this.#map[i][j] === ".") {
						await this.#functions.write("\x1b[34;1m#\x1b[m")
					} else if (this.#map[i][j] === "*") {
						await this.#functions.write("\x1b[31;1m*\x1b[m")
					} else if (this.#map[i][j] === "Z") {
						await this.#functions.write("\x1b[32;1mZ\x1b[m")
					} else if (this.#map[i][j] === "^") {
						await this.#functions.write("\x1b[33;1m^\x1b[m")
					} else if (this.#map[i][j] === ">") {
						await this.#functions.write("\x1b[33;1m>\x1b[m")
					} else if (this.#map[i][j] === "<") {
						await this.#functions.write("\x1b[33;1m<\x1b[m")
					} else if (this.#isFinishCell(j, i + 1)) {
						await this.#functions.write("\x1b[33;1m" + this.#map[i][j] + "\x1b[m")
					} else {
						await this.#functions.write(this.#map[i][j])
					}
				}
			}
			await this.#functions.write("\n")
		}
	}
	#tryMove(x2, y2) {
		if (x2 <= 0) {
			return
		}
		if (y2 <= 0) {
			return
		}
		if (y2 > 31) {
			return
		}
		if (x2 >= 100) {
			return
		}
		if (this.#canMoveTo(x2, y2)) {
			this.#x = x2;
			this.#y = y2
		}
	}
	async #run() {
		if (this.#data.gameState.dataSaver.challengeLevel !== 0) {
			return
		}
		this.#x = this.#born[this.#level][0];
		this.#y = this.#born[this.#level][1];
		await this.#functions.clear();
		let sinkTimer = 0;
		let jumpCarry = false;
		while (true) {
			if (this.#x <= 0) {
				this.#x = 1
			}
			if (this.#y <= 0) {
				this.#y = 1
			}
			await this.#functions.clear();
			if (this.#level + 1 < this.#born.length && this.#x === this.#born[this.#level + 1][0] && this.#y === this.#born[this.#level + 1][1]) {
				this.#level++
			}
			if (this.#isAirAbove()) {
				sinkTimer = 0;
				await this.#functions.write(this.#lang.current.parkour.jumpTip + "\n");
				await this.#show();
				let shouldJump = false;
				let shouldRespawn = false;
				for (const c of this.#functions.getch2s()) {
					if (c === "") {
						return
					}
					if (c === "w" || c === " ") {
						shouldJump = true;
						jumpCarry = true
					}
					if (c === "r") {
						shouldRespawn = true
					}
				}
				if (this.#isFinishCell(this.#x, this.#y - 1)) {
					await this.#functions.clear();
					await this.#functions.printa(this.#lang.current.parkour.challengeCompleteReward);
					this.#data.gameState.dataSaver.money += 500;
					this.#data.gameState.dataSaver.challengeLevel = 1;
					return
				}
				if (this.#isLavaCell()) {
					await this.#functions.print(this.#lang.current.parkour.deathMessage);
					if (!await this.#functions.printYn(this.#lang.current.parkour.respawnConfirm)) {
						return
					}
					this.#x = this.#born[this.#level][0];
					this.#y = this.#born[this.#level][1];
					continue
				}
				if (shouldRespawn) {
					this.#x = this.#born[this.#level][0];
					this.#y = this.#born[this.#level][1];
					continue
				}
				if (this.#map[this.#y][this.#x] === "^") {
					this.#sy = 0;
					this.#tryMove(this.#x, this.#y - 4);
					await this.#functions.sleep(.1);
					continue
				}
				if (this.#map[this.#y][this.#x] === ">") {
					this.#sy = 0;
					this.#tryMove(this.#x + 4, this.#y);
					await this.#functions.sleep(.1);
					continue
				}
				if (this.#map[this.#y][this.#x] === "<") {
					this.#sy = 0;
					this.#tryMove(this.#x - 4, this.#y);
					await this.#functions.sleep(.1);
					continue
				}
				if (this.#map[this.#y][this.#x] === "Z") {
					this.#sy = 3
				}
				for (let i = 1; i <= this.#sy; i++) {
					this.#tryMove(this.#x, this.#y - 1);
					if (!this.#isAirAbove()) {
						this.#sy = 0;
						continue
					}
				}
				if (this.#canMoveTo(this.#x, this.#y + 1)) {
					this.#sy--
				} else {
					this.#sy = 0
				}
				if (this.#sy) {
					for (let i = 1; i <= this.#sy; i++) {
						this.#tryMove(this.#x, this.#y - 1);
						if (!this.#isAirAbove()) {
							this.#sy = 0;
							continue
						}
					}
					for (let i = 1; i <= -this.#sy; i++) {
						this.#tryMove(this.#x, this.#y + 1);
						if (!this.#isAirAbove()) {
							this.#sy = 0;
							continue
						}
					}
				}
				if (!this.#canMoveTo(this.#x + this.#sx, this.#y)) {
					if (this.#sx === this.#getSlideDirection(this.#x + this.#sx, this.#y) && this.#canMoveTo(this.#x + this.#sx, this.#y - 1) || this.#getSlideDirection(this.#x, this.#y + 1) !== 0) {
						this.#tryMove(this.#x, this.#y - 1);
						if (!this.#isAirAbove()) {
							this.#sy = 0;
							continue
						}
					} else {
						this.#sx *= -1
					}
				}
				this.#tryMove(this.#x + this.#sx, this.#y);
				if ((shouldJump || jumpCarry) && !this.#sy && !this.#canMoveTo(this.#x, this.#y + 1)) {
					jumpCarry = false;
					this.#sy = 2;
					for (let i = 1; i <= this.#sy; i++) {
						this.#tryMove(this.#x, this.#y - 1);
						if (!this.#isAirAbove()) {
							this.#sy = 0;
							continue
						}
					}
				}
				if (!this.#canMoveTo(this.#x, this.#y + 1)) {
					this.#sy = 0
				}
				await this.#functions.sleep(.1)
			} else {
				jumpCarry = false;
				await this.#functions.write(this.#lang.current.parkour.swimTip + "\n");
				await this.#show();
				sinkTimer++;
				sinkTimer %= 5;
				let moveUp = false;
				let moveDown = false;
				let moveLeft = false;
				let moveRight = false;
				let shouldRespawn = false;
				for (const c of this.#functions.getch2s()) {
					if (c === "") {
						return
					}
					if (c === "r") {
						shouldRespawn = true
					}
					if (c === "w") {
						moveUp = true
					}
					if (c === "a") {
						moveLeft = true
					}
					if (c === "s") {
						moveDown = true
					}
					if (c === "d") {
						moveRight = true
					}
				}
				if (this.#isLavaCell()) {
					await this.#functions.print(this.#lang.current.parkour.deathMessage);
					if (!await this.#functions.printYn(this.#lang.current.parkour.respawnConfirm)) {
						return
					}
					this.#x = this.#born[this.#level][0];
					this.#y = this.#born[this.#level][1];
					continue
				}
				if (shouldRespawn) {
					this.#x = this.#born[this.#level][0];
					this.#y = this.#born[this.#level][1];
					continue
				}
				if (moveUp && !moveDown) {
					this.#tryMove(this.#x, this.#y - 1)
				}
				if (moveDown && !moveUp) {
					this.#tryMove(this.#x, this.#y + 1)
				}
				if (!moveUp && !moveDown && !sinkTimer) {
					this.#tryMove(this.#x, this.#y + 1)
				}
				if (moveLeft && !moveRight) {
					this.#tryMove(this.#x - 1, this.#y)
				}
				if (!moveLeft && moveRight) {
					this.#tryMove(this.#x + 1, this.#y)
				}
				await this.#functions.sleep(.1)
			}
		}
	}
	constructor(lang, data, functions) {
		this.#lang = lang;
		this.#data = data;
		this.#functions = functions;
		this.#born = deepFreeze([
			[1, 30],
			[33, 30],
			[66, 30],
			[98, 11],
			[42, 14]
		]);
		this.#map = Object.freeze(["|     | |   |                                                                                       |", "+---+ +>+   |                                                                                +---   |", "|   | | | +-+          +---+                     --                          -      -      --+   \\  |", "|   | | | |            |   |                    /                                                 | |", "|   | | | |            |   +-------------------+*****Z****Z****Z****Z****Z******Z******Z**********| |", "+^^^+ +^+ +---------+  |   |  finish           +--------------------------------------------------+ |", "|   | | | |         |  |   |     \\             |                                                  | |", "|   | | | |   +---+ |  +---+      \\            |  -   -   -   -   -   -   -   -   -   -   -   -   | |", "|   |   |     |   |        |       \\           |</ \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\    |", "+^^^+--^+-----+---+--------+--------+-----------+-+-+---+---+---+---+---+---+---+---+---+---+---+---+", "|   |   |     |                                                                                 |...|", "|   |   |     |                                                                                 | |.|", "|   |   |     |                                                      |                          | |.|", "+^^^+ +-+  +--+ +-----     ------             |                   +--+      ---                 | |.|", "|   | | |  |  | |                \\        +---+                   |        |***\\                | |.|", "|   | | |  |  | |                 \\       |             ZZ        |        |****+--   -------     |.|", "|     |    |    |                  \\      |                       |        |*****************\\    |.|", "+^^^--+^---+^^--+^^^^^---+          \\     |******ZZ***********Z***|*****ZZ*|******************\\   |.|", "+-----+----+----+--------+-------+---+----+-----------------+-----+--------+-------------------+--+.|", "|                                |                          |     |                               |.|", "|                                |              ---+--+---- |     |                    +---       |.|", "|                                |                 |  |           |                   /           |.|", "|                                |       -------   |  |           |                  /            |.|", "|                         +----+ |                 |           /| |            -----+     |.......|.|", "|                    -----+    | |                 |  +-------+ | |                       |.......|.|", "|                              | +--------                      | |      +----+           |.......|.|", "|             |                | |                              | |     /      \\          |.......|.|", "|        -----+------          | |                              | |    /        \\         |.......|.|", "|             |                | |        -----+                | |   /          \\        |.......|.|", "|             |                |               |                |    /            \\       |.........|", "+-------------+----------------+---------------+----------------+---+--------------+------+---------|"]);
		Object.defineProperty(this, "run", {
			value: this.#run.bind(this),
			writable: false,
			configurable: false,
			enumerable: true
		});
		Object.seal(this)
	}
}
