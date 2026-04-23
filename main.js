import Lang from "./lang.js";
import Data from "./data.js";
import Functions from "./functions.js";
import NormalizeDataSaver from "./normalizeDataSaver.js";
import Checkpoint from "./checkpoint.js";
import Shop from "./shop.js";
import Parkour from "./parkour.js";
import Lottery from "./lottery.js";
import Adventure from "./adventure.js";
import Settings from "./settings.js";
export function createGameInstance(write, loadGame, saveGame, hasSave, languageCode) {
	const data = new Data;
	const lang = new Lang(languageCode);
	const functions = new Functions(data, lang);
	const normalizeDataSaver = new NormalizeDataSaver(data, functions);
	const checkpoint = new Checkpoint(lang, data, functions, normalizeDataSaver);
	const shop = new Shop(lang, data, functions);
	const parkour = new Parkour(lang, data, functions);
	const lottery = new Lottery(lang, data, functions);
	const adventure = new Adventure(lang, data, functions);
	const settings = new Settings(lang, data, functions);
	data.gameState.setRequiredFunctions(write, loadGame, saveGame, hasSave);
	let launchCount = 0;
	async function launch() {
		launchCount++;
		if (launchCount > 1) {
			return
		}
		await functions.clear();
		if (!data.gameState.settings.skipStory) {
			for (let text of lang.current.main.story) {
				await functions.printa(text)
			}
		}
		if (await checkpoint.login()) {
			if (!data.gameState.settings.forceUsername || !data.gameState.settings.forceBlancPassword || !data.gameState.settings.forceInstantOutput) {
				await functions.sleep(.5)
			}
			await settings.choose()
		}
		if (!data.gameState.settings.forceUsername || !data.gameState.settings.forceBlancPassword || !data.gameState.settings.forceInstantOutput) {
			await functions.sleep(.5)
		}
		while (true) {
			await functions.clear();
			await functions.print(functions.listToChoice(lang.current.main.mainMenu));
			while (true) {
				let type = await functions.getch();
				if (type === "1") {
					await fishing();
					break
				} else if (type === "2") {
					await shop.run();
					break
				} else if (type === "3") {
					await settings.setTextSpeed();
					break
				} else if (type === "4") {
					await lottery.run();
					break
				} else if (type === "5") {
					if (data.gameState.dataSaver.challengeLevel === 0) {
						await parkour.run()
					} else if (data.gameState.dataSaver.challengeLevel === 1) {
						await adventure.run()
					} else {
						await functions.clear();
						await functions.printa(lang.current.main.challengeCompleted)
					}
					break
				} else if (type === "6") {
					await functions.clear();
					return
				}
			}
			await checkpoint.save();
			await functions.sleep(.5)
		}
	}
	return {
		setConsoleSize: size => {
			data.gameState.setConsoleSize(size)
		},
		onInput: str => {
			functions.onInput(str)
		},
		languages: {
			langs: functions.deepCopy(lang.langs),
			setLanguage: code => {
				lang.setLanguage(code)
			}
		},
		settings: data.gameState.settings,
		launch
	}
}
