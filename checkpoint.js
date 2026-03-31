import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";

function checkName(username) {
	return /^[a-zA-Z0-9_-]+$/.test(username)
}
export async function loadGame() {
	const loadState = await functions.requiredFunctions.loadGame(data.gameState.username, data.gameState.password);
	if (loadState?.code === 1) {
		data.gameState.dataSaver = {
			...data.getData(),
			...loadState.data
		}
	}
	return loadState
}
export async function saveGame() {
	return functions.requiredFunctions.saveGame(data.gameState.username, data.gameState.password, JSON.stringify(data.gameState.dataSaver))
}
export async function login() {
	while (true) {
		var username, password;
		await functions.clear();
		await functions.print(functions.capitalize(lang.current.checkpoint.login));
		await functions.printnl(functions.capitalize(lang.current.checkpoint.username) + ": ");
		username = await functions.getline(1);
		if (!checkName(username)) {
			await functions.print(lang.current.checkpoint.invalid_username);
			await functions.sleep(1);
			continue
		}
		const userState = await functions.requiredFunctions.hasSave(username);
		if (!userState?.code) {
			await functions.print(functions.capitalize(lang.current.checkpoint.api_error));
			await functions.sleep(1);
			continue
		}
		const isNew = userState.code === 2;
		await functions.printnl(functions.capitalize(lang.current.checkpoint.password) + ": ");
		password = await functions.getline(2);
		if (isNew) {
			await functions.printnl(functions.capitalize(lang.current.checkpoint.confirm_password) + ": ");
			var newPassword = await functions.getline(2);
			if (newPassword !== password) {
				await functions.print(lang.current.checkpoint.password_not_match);
				await functions.sleep(1);
				continue
			}
		}
		data.gameState.username = username;
		data.gameState.password = password;
		if (isNew) {
			const saveState = await saveGame();
			if (!saveState?.code) {
				await functions.print(lang.current.checkpoint.api_error);
				await functions.sleep(1);
				continue
			}
			if (saveState.code === 2) {
				await functions.print(lang.current.checkpoint.password_error);
				await functions.sleep(1);
				continue
			}
		} else {
			const loadState = await loadGame();
			if (!loadState?.code) {
				await functions.print(lang.current.checkpoint.api_error);
				await functions.sleep(1);
				continue
			}
		}
		await functions.clear();
		return isNew
	}
}
