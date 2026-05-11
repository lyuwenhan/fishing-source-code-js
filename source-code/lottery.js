export default function createLottery(functions, lang, data, io) {
	async function run() {
		while (true) {
			await io.clear();
			await io.print(functions.listToChoice(functions.getLangWithFallback(lang.current, "current", "lottery", "menu")));
			await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "costPrefix") + data.gameState.dataSaver.totalFishCaught + functions.getLangWithFallback(lang.current, "current", "lottery", "currentMoneyPrefix") + data.gameState.dataSaver.money);
			await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "oddsHeader"));
			for (const line of functions.getLangWithFallback(lang.current, "current", "lottery", "oddsTable")) {
				await io.print(line)
			}
			while (true) {
				const c = await io.getch();
				if (c === "1") {
					if (data.gameState.dataSaver.totalFishCaught < 100 && data.gameState.dataSaver.money < 1e3) {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "notEnoughBoth"));
						await functions.sleep(1);
						break
					}
					if (data.gameState.dataSaver.totalFishCaught < 100) {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "notEnoughFishCount"));
						await functions.sleep(1);
						break
					}
					if (data.gameState.dataSaver.money < 1e3) {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "notEnoughMoney"));
						await functions.sleep(1);
						break
					}
					data.gameState.dataSaver.totalFishCaught -= 100;
					data.gameState.dataSaver.money -= 1e3;
					const ran = functions.random(1, 100);
					if (ran <= 2) {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "rewardDiamondFish") + " x1");
						data.gameState.diamondFish++
					} else if (ran <= 20) {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "rewardBigFishBait") + " x1");
						data.gameState.bigFish++
					} else if (ran <= 28) {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "rewardFishFishFish") + " x1");
						data.gameState.fishMan = true
					} else if (ran <= 49) {
						data.gameState.dataSaver.money += 500;
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "rewardGoldText") + " $500")
					} else if (ran <= 73) {
						data.gameState.dataSaver.money += 200;
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "rewardGoldText") + " $200")
					} else if (ran <= 80) {
						data.gameState.bigFish += 2;
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "rewardBigFishBait") + " x2")
					} else {
						await io.print(functions.getLangWithFallback(lang.current, "current", "lottery", "thanks"))
					}
					await functions.sleep(1);
					break
				} else if (c === "2") {
					return
				}
			}
		}
	}
	return run
}
