import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";
import validateDataSaver from "./dataSaverValidator.js";

function checkName(username) {
	return /^[a-zA-Z0-9_-]+$/.test(username)
}
export async function loadGame() {
	const loadState = await functions.requiredFunctions.loadGame(data.gameState.username, data.gameState.password);
	if (loadState?.code === 1) {
		data.gameState.dataSaver = {
			...data.getData(),
			...loadState.data
		};
		validateDataSaver(data.gameState.dataSaver)
	}
	return loadState
}
export async function saveGame() {
	validateDataSaver(data.gameState.dataSaver);
	return functions.requiredFunctions.saveGame(data.gameState.username, data.gameState.password, data.gameState.dataSaver)
}
export async function login() {
	while (true) {
		await functions.clear();
		let username, password = "";
		await functions.clear();
		await functions.print(functions.capitalize(lang.current.checkpoint.login));
		await functions.printnl(functions.capitalize(lang.current.checkpoint.username) + ": ");
		if (data.settings.forceUsername) {
			username = data.settings.forceUsername;
			await functions.write(username + "\n")
		} else {
			username = await functions.getline(1);
			if (!checkName(username)) {
				await functions.print(lang.current.checkpoint.invalidUsername);
				await functions.sleep(1);
				continue
			}
		}
		const userState = await functions.requiredFunctions.hasSave(username);
		if (!userState?.code) {
			await functions.print(functions.capitalize(lang.current.checkpoint.apiError));
			await functions.sleep(1);
			continue
		}
		const isNew = userState.code === 2;
		await functions.printnl(functions.capitalize(lang.current.checkpoint.password) + ": ");
		if (!data.settings.forceBlancPassword) {
			password = await functions.getline(2);
			if (isNew) {
				await functions.printnl(functions.capitalize(lang.current.checkpoint.confirmPassword) + ": ");
				let newPassword = await functions.getline(2);
				if (newPassword !== password) {
					await functions.print(lang.current.checkpoint.passwordNotMatch);
					await functions.sleep(1);
					continue
				}
			}
		}
		data.gameState.username = username;
		data.gameState.password = password;
		if (!isNew) {
			const loadState = await loadGame();
			if (loadState?.code !== 1) {
				await functions.print(lang.current.checkpoint.apiError);
				await functions.sleep(1);
				continue
			}
		}
		const saveState = await saveGame();
		if (!saveState?.code) {
			await functions.print(lang.current.checkpoint.apiError);
			await functions.sleep(1);
			continue
		}
		if (saveState.code === 2) {
			await functions.print(lang.current.checkpoint.passwordError);
			await functions.sleep(1);
			continue
		}
		await functions.clear();
		return isNew
	}
}
