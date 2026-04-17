import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";
import * as checkpoint from "./checkpoint.js";
import shop from "./shop.js";
import parkour from "./parkour.js";
let started = false;
export async function start(write, loadGame, saveGame, hasSave, giveOnInput, giveSetConsoleSize, giveSetLanguage) {
	if (started) {
		return
	}
	started = true;
	functions.setFunctions(write, loadGame, saveGame, hasSave);
	giveOnInput?.(functions.onInput);
	giveSetConsoleSize?.(functions.setConsoleSize);
	giveSetLanguage?.(lang);
	await functions.clear();
	for (let text of lang.current.main.story) {
		await functions.printa(text)
	}
	if (await checkpoint.login()) {
		await functions.sleep(0.5);
		await functions.choose()
	}
	await functions.sleep(0.5);
	while (true) {
		await functions.clear();
		await functions.print(functions.listToChoice(lang.current.main.main_menu));
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
				await spin();
				break
			} else if (type === "5") {
				if (data.gameState.dataSaver.challengeLevel === 0) {
					await parkour()
				} else if (data.gameState.dataSaver.challengeLevel === 1) {
					await beat()
				} else {
					await functions.clear();
					await functions.printa(lang.current.main.challenge_completed)
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
			await functions.printa(lang.current.checkpoint.api_error);
			continue
		}
		if (saveState.code === 2) {
			await functions.printa(lang.current.checkpoint.password_error);
			continue
		}
		await functions.sleep(.5)
	}
}
