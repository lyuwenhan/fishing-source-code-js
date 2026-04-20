import lang from "./lang.js";
import * as data from "./data.js";
export function deepCopy(obj) {
	if (obj === null || typeof obj !== "object") {
		return obj
	}
	if (Array.isArray(obj)) {
		return obj.map(deepCopy)
	}
	const result = {};
	for (const key of Object.keys(obj)) {
		result[key] = deepCopy(obj[key])
	}
	return result
}
export const requiredFunctions = {
	write: async text => console.log(text),
	loadGame: async () => ({
		code: 0
	}),
	saveGame: async () => ({
		code: 0
	}),
	hasSave: async () => ({
		code: 0
	})
};
export function setFunctions(write, loadGame, saveGame, hasSave) {
	requiredFunctions.write = write;
	requiredFunctions.loadGame = loadGame;
	requiredFunctions.saveGame = saveGame;
	requiredFunctions.hasSave = hasSave
}
export function listToChoice(...lists) {
	return [lists].flat(2).map((name, index) => `${index+1}. ${capitalize(name)}`).join(", ")
}
export function write(text) {
	return requiredFunctions.write(text.replace(/\n/g, "\r\n"))
}
export async function clear() {
	await write("\x1bc")
}
export let consoleSize = {
	rows: 100,
	cols: 100
};
export function setConsoleSize(data) {
	consoleSize.rows = data.rows || 100;
	consoleSize.cols = data.cols || 100
}
const inputBuffer = [];
const waitingResolvers = [];
export function onInput(str) {
	if (typeof str !== "string") {
		str = String(str)
	}
	for (const ch of [...str.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\x08/g, "")]) {
		if (waitingResolvers.length > 0) {
			const resolve = waitingResolvers.shift();
			resolve(ch)
		} else {
			inputBuffer.push(ch)
		}
	}
}
export async function getch() {
	if (inputBuffer.length > 0) {
		return inputBuffer.shift()
	}
	return new Promise(resolve => {
		waitingResolvers.push(resolve)
	})
}
export function getch2() {
	if (inputBuffer.length > 0) {
		return inputBuffer.shift()
	}
	return ""
}
export function getch2s() {
	if (inputBuffer.length === 0) {
		return ""
	}
	return inputBuffer.splice(0).join("")
}
export function isNumberBetween(num, l, r) {
	return num >= l && num <= r
}
export async function getline(type = 0) {
	let ans = "";
	while (true) {
		const a = await getch();
		if (a === "\r") {
			if (ans) {
				break
			} else {
				continue
			}
		}
		if (a === "") {
			if (ans.length > 0) {
				ans = ans.slice(0, -1);
				if (type === 1 || type === 2) {
					await write("\b \b")
				}
			}
			continue
		}
		if (!/[!-~]/.test(a)) {
			continue
		}
		ans += a;
		if (type === 1) {
			await write(a)
		} else if (type === 2) {
			await write("*")
		}
	}
	await write("\n");
	return ans
}
export async function getlineYe(type = 0) {
	let ans = "";
	while (true) {
		const a = await getch();
		if (a === "\r") {
			break
		}
		if (a === "") {
			if (ans.length > 0) {
				ans = ans.slice(0, -1);
				if (type === 1 || type === 2) {
					await write("\b \b")
				}
			}
			continue
		}
		if (!/[!-~]/.test(a)) {
			continue
		}
		ans += a;
		if (type === 1) {
			await write(a)
		} else if (type === 2) {
			await write("*")
		}
	}
	await write("\n");
	return ans
}
export async function sleep(s) {
	return new Promise(resolve => setTimeout(resolve, s * 1e3))
}
export function capitalize(text) {
	if (!text) {
		return ""
	}
	return text[0].toUpperCase() + text.slice(1)
}
export async function printnl(text, time = .02) {
	await write("\x1b[?25l");
	try {
		if (!isNumberBetween(data.gameState.dataSaver.textSpeed, 0, 1) || time <= 0) {
			await write(text)
		} else {
			for (const char of text) {
				await write(char);
				await sleep(time / (data.gameState.dataSaver.textSpeed + 1) / lang.current.functions.outputSpeed)
			}
		}
	} finally {
		await write("\x1b[m\x1b[?25h")
	}
}
export async function print(text, time = .02) {
	await printnl(text, time);
	await write("\n")
}
export async function printa(text = "", time = .02) {
	await print(text + (text ? "    " : "") + "(" + capitalize(lang.current.functions.pressEnterToContinue) + ")", time);
	while (await getch() !== "\r");
}
export async function printYn(text = "", time = .02) {
	const toYN = {
		Y: "y",
		N: "n",
		y: "y",
		n: "n",
		"\r": "y"
	};
	await print(text + (text ? " " : "") + "(Y/n)", time);
	let c;
	do {
		c = await getch()
	} while (!toYN[c]);
	return toYN[c] === "y"
}
export function random(l, r) {
	return Math.floor(Math.random() * (r - l + 1)) + l
}
export async function choose() {
	await clear();
	await print(lang.current.functions.chooseSpeed);
	await print(listToChoice(lang.current.functions.speedName));
	let c;
	do {
		c = await getch()
	} while (!/[1-3]/.test(c));
	data.gameState.dataSaver.textSpeed = Number(c) - 1;
	await clear();
	for (let text of lang.current.functions.skills) {
		await print(text)
	}
	while (true) {
		const c = await getch();
		if (c === "1") {
			data.gameState.dataSaver.catchSpeedLevel = 5;
			break
		} else if (c === "2") {
			data.gameState.dataSaver.incomeLevel = 5;
			break
		} else if (c === "3") {
			data.gameState.dataSaver.slipOffChance = 10;
			break
		} else if (c === "4") {
			data.gameState.dataSaver.cleanerCount = 1;
			data.gameState.dataSaver.cleaningMultiplier = 2;
			break
		} else if (c === "5") {
			data.gameState.dataSaver.actionSpeedMultiplier = 2;
			break
		} else if (c === "6") {
			data.gameState.dataSaver.bigFishChance = 40;
			break
		} else if (c === "7") {
			break
		}
	}
}
export async function setTextSpeed() {
	await clear();
	await print(lang.current.functions.chooseSpeed);
	await print(listToChoice(lang.current.functions.speedName, lang.current.functions.exit));
	let c;
	do {
		c = Number(await getch())
	} while (!isNumberBetween(c, 1, 4));
	if (c <= 3) {
		data.gameState.dataSaver.textSpeed = c - 1
	}
}
export function isPlainObject(value) {
	if (value === null || typeof value !== "object") {
		return false
	}
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null
}
export function clamp(value, min, max, fallback = min) {
	const numberValue = Number(value);
	if (Number.isNaN(numberValue)) {
		return fallback
	}
	return Math.min(max, Math.max(min, numberValue))
}
export function clampInt(value, min, max, fallback = min) {
	const numberValue = Number(value);
	if (Number.isNaN(numberValue)) {
		return fallback
	}
	return Math.min(max, Math.max(min, Math.trunc(numberValue)))
}
export function deepFreeze(value, seen = new WeakSet) {
	if (value === null || typeof value !== "object" && typeof value !== "function") {
		return value
	}
	if (!Object.isExtensible(value) || seen.has(value)) {
		return value
	}
	seen.add(value);
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		if (!descriptor) {
			continue
		}
		if ("value" in descriptor) {
			deepFreeze(descriptor.value, seen)
		}
	}
	return Object.freeze(value)
}
