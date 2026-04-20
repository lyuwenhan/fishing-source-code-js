import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";
import * as checkpoint from "./checkpoint.js";
import shop from "./shop.js";
import parkour from "./parkour.js";
import lottery from "./lottery.js";
import adventure from "./adventure.js";
export const onInput = functions.onInput;
export const setConsoleSize = functions.setConsoleSize;
export const languages = functions.deepCopy(lang);
export const settings = data.gameState.settings;
let started = false;
export async function start(write, loadGame, saveGame, hasSave) {
	if (settings.forceInstantOutput) {
		data.gameState.dataSaver.textSpeed = 2
	}
	if (started) {
		return
	}
	started = true;
	functions.setFunctions(write, loadGame, saveGame, hasSave);
	await functions.clear();
	if (!settings.skipStory) {
		for (let text of lang.current.main.story) {
			await functions.printa(text)
		}
	}
	if (await checkpoint.login()) {
		await functions.sleep(.5);
		await functions.choose()
	}
	if (settings.forceInstantOutput) {
		data.gameState.dataSaver.textSpeed = 2
	}
	await functions.sleep(.5);
	while (true) {
		await functions.clear();
		await functions.print(functions.listToChoice(lang.current.main.mainMenu));
		while (true) {
			let type = await functions.getch();
			if (type === "1") {
				await fishing();
				break
			} else if (type === "2") {
				await shop();
				break
			} else if (type === "3") {
				await functions.setTextSpeed();
				break
			} else if (type === "4") {
				await lottery();
				break
			} else if (type === "5") {
				if (data.gameState.dataSaver.challengeLevel === 0) {
					await parkour()
				} else if (data.gameState.dataSaver.challengeLevel === 1) {
					await adventure()
				} else {
					await functions.clear();
					await functions.printa(lang.current.main.challengeCompleted)
				}
				break
			} else if (type === "6") {
				await functions.clear();
				started = false;
				return
			}
		}
		const saveState = await checkpoint.saveGame();
		if (!saveState?.code) {
			await functions.printa(lang.current.checkpoint.apiError);
			continue
		}
		if (saveState.code === 2) {
			await functions.printa(lang.current.checkpoint.passwordError);
			continue
		}
		await functions.sleep(.5)
	}
}
