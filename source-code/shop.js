export default function createShop(functions, lang, data, io) {
	function avgText(minValue, maxValue) {
		const sum = minValue + maxValue;
		return sum % 2 === 0 ? String(sum / 2) : `${Math.floor(sum/2)}.5`
	}
	async function showResult(text) {
		await io.print(text);
		await functions.sleep(.5)
	}
	async function shop0() {
		while (true) {
			await io.clear();
			await io.print(functions.listToChoice(lang.current.shop.shopMainMenu));
			await io.print(lang.current.shop.hookSpeedTitle + ": ");
			if (data.gameState.dataSaver.catchSpeedLevel === data.constant.maxCatchSpeedLevel) {
				await io.print("    " + lang.current.shop.maxLevelReached)
			} else {
				await io.print("    " + lang.current.shop.hookSpeedCurrentPrefix + ": " + avgText(data.constant.minCatchSpeed[data.gameState.dataSaver.catchSpeedLevel], data.constant.maxCatchSpeed[data.gameState.dataSaver.catchSpeedLevel]) + ", " + lang.current.shop.hookSpeedNextPrefix + ": " + avgText(data.constant.minCatchSpeed[data.gameState.dataSaver.catchSpeedLevel + 1], data.constant.maxCatchSpeed[data.gameState.dataSaver.catchSpeedLevel + 1]));
				await io.print("    " + lang.current.shop.upgradeCostPrefix + ": $" + data.constant.catchSpeedUpgradeCost[data.gameState.dataSaver.catchSpeedLevel + 1] + ", " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			}
			await io.print(lang.current.shop.fishingIncomeTitle + ": ");
			if (data.gameState.dataSaver.incomeLevel === data.constant.maxIncomeLevel) {
				await io.print("    " + lang.current.shop.maxLevelReached)
			} else {
				await io.print("    " + lang.current.shop.fishingIncomeCurrentPrefix + ": " + avgText(data.constant.minIncome[data.gameState.dataSaver.incomeLevel], data.constant.maxIncome[data.gameState.dataSaver.incomeLevel]) + ", " + lang.current.shop.fishingIncomeNextPrefix + ": " + avgText(data.constant.minIncome[data.gameState.dataSaver.incomeLevel + 1], data.constant.maxIncome[data.gameState.dataSaver.incomeLevel + 1]));
				await io.print("    " + lang.current.shop.upgradeCostPrefix + ": $" + data.constant.incomeLevelUpgradeCost[data.gameState.dataSaver.incomeLevel + 1] + ", " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			}
			await io.print(lang.current.shop.hookOffTitle + ": ");
			if (data.gameState.dataSaver.slipOffChance === 0) {
				await io.print("    " + lang.current.shop.maxLevelReached)
			} else if (data.gameState.dataSaver.slipOffChance > 10) {
				await io.print("    " + lang.current.shop.hookOffCurrentPrefix + ": " + data.gameState.dataSaver.slipOffChance + "%, " + lang.current.shop.hookOffNextPrefix + ": " + (data.gameState.dataSaver.slipOffChance - 10) + "%");
				await io.print("    " + lang.current.shop.hookOffCostPrefix + " $100, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			} else if (data.gameState.dataSaver.slipOffChance > 5) {
				await io.print("    " + lang.current.shop.hookOffPresetCurrent + " 10% " + lang.current.shop.hookOffPresetNext + " 5%");
				await io.print("    " + lang.current.shop.hookOffCostPrefix + " $100, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			} else if (data.gameState.dataSaver.slipOffChance > 1) {
				await io.print("    " + lang.current.shop.hookOffCurrentPrefix + ": " + data.gameState.dataSaver.slipOffChance + "%, " + lang.current.shop.hookOffNextPrefix + ": " + (data.gameState.dataSaver.slipOffChance - 1) + "%");
				await io.print("    " + lang.current.shop.hookOffCostPrefix + " $100, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			} else {
				await io.print("    " + lang.current.shop.hookOffPresetCurrent + " 1% " + lang.current.shop.hookOffPresetNext + " 0%");
				await io.print("    " + lang.current.shop.hookOffCostPrefix + " $500, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			}
			await io.print("    " + lang.current.shop.purchaseCostPrefix + " $10, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money);
			await io.print(lang.current.shop.ovenCountTitle + ": ");
			if (data.gameState.dataSaver.ovenCount >= 3) {
				await io.print("    " + lang.current.shop.ovenMaxCount)
			} else {
				await io.print("    " + lang.current.shop.ovenCurrentPrefix + ": " + data.gameState.dataSaver.ovenCount);
				if (data.gameState.dataSaver.ovenCount < 1) {
					await io.print("    " + lang.current.shop.purchaseCostPrefix + " $50, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
				} else if (data.gameState.dataSaver.ovenCount === 1) {
					await io.print("    " + lang.current.shop.purchaseCostPrefix + " $1000, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
				} else {
					await io.print("    " + lang.current.shop.purchaseCostPrefix + " $2000, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
				}
			}
			while (true) {
				const type = await io.getch();
				if (type === "1") {
					if (data.gameState.dataSaver.catchSpeedLevel === data.constant.maxCatchSpeedLevel) {
						await showResult("    " + lang.current.shop.maxLevelReached);
						break
					} else if (data.gameState.dataSaver.money < data.constant.catchSpeedUpgradeCost[data.gameState.dataSaver.catchSpeedLevel + 1]) {
						await showResult("    " + lang.current.shop.notEnoughMoney);
						break
					} else {
						data.gameState.dataSaver.money -= data.constant.catchSpeedUpgradeCost[++data.gameState.dataSaver.catchSpeedLevel];
						await showResult("    " + lang.current.shop.purchaseSuccess);
						break
					}
				} else if (type === "2") {
					if (data.gameState.dataSaver.incomeLevel === data.constant.maxIncomeLevel) {
						await showResult("    " + lang.current.shop.maxLevelReached);
						break
					} else if (data.gameState.dataSaver.money < data.constant.incomeLevelUpgradeCost[data.gameState.dataSaver.incomeLevel + 1]) {
						await showResult("    " + lang.current.shop.notEnoughMoney);
						break
					} else {
						data.gameState.dataSaver.money -= data.constant.incomeLevelUpgradeCost[++data.gameState.dataSaver.incomeLevel];
						await showResult("    " + lang.current.shop.purchaseSuccess);
						break
					}
				} else if (type === "3") {
					if (data.gameState.dataSaver.slipOffChance === 0) {
						await showResult("    " + lang.current.shop.maxLevelReached);
						break
					} else if (data.gameState.dataSaver.slipOffChance === 1) {
						if (data.gameState.dataSaver.money < 500) {
							await showResult("    " + lang.current.shop.notEnoughMoney);
							break
						} else {
							data.gameState.dataSaver.money -= 500;
							data.gameState.dataSaver.slipOffChance = 0;
							await showResult("    " + lang.current.shop.purchaseSuccess);
							break
						}
					} else {
						if (data.gameState.dataSaver.money < 100) {
							await showResult("    " + lang.current.shop.notEnoughMoney);
							break
						} else {
							data.gameState.dataSaver.money -= 100;
							if (data.gameState.dataSaver.slipOffChance > 10) {
								data.gameState.dataSaver.slipOffChance -= 10
							} else if (data.gameState.dataSaver.slipOffChance > 5) {
								data.gameState.dataSaver.slipOffChance = 5
							} else if (data.gameState.dataSaver.slipOffChance > 0) {
								data.gameState.dataSaver.slipOffChance -= 1
							}
							await showResult("    " + lang.current.shop.purchaseSuccess);
							break
						}
					}
				} else if (type === "4") {
					if (data.gameState.dataSaver.ovenCount >= 3) {
						await showResult("    " + lang.current.shop.ovenMaxCount);
						break
					} else {
						if (data.gameState.dataSaver.ovenCount < 1) {
							if (data.gameState.dataSaver.money < 50) {
								await showResult("    " + lang.current.shop.notEnoughMoney);
								break
							} else {
								data.gameState.dataSaver.money -= 50;
								data.gameState.dataSaver.ovenCount = 1;
								await showResult("    " + lang.current.shop.purchaseSuccess);
								break
							}
						} else if (data.gameState.dataSaver.ovenCount === 1) {
							if (data.gameState.dataSaver.money < 1e3) {
								await showResult("    " + lang.current.shop.notEnoughMoney);
								break
							} else {
								data.gameState.dataSaver.money -= 1e3;
								data.gameState.dataSaver.ovenCount = 2;
								await showResult("    " + lang.current.shop.purchaseSuccess);
								break
							}
						} else {
							if (data.gameState.dataSaver.money < 2e3) {
								await showResult("    " + lang.current.shop.notEnoughMoney);
								break
							} else {
								data.gameState.dataSaver.money -= 2e3;
								data.gameState.dataSaver.ovenCount = 3;
								await showResult("    " + lang.current.shop.purchaseSuccess);
								break
							}
						}
					}
				} else if (type === "5") {
					return
				}
			}
		}
	}
	async function shop1() {
		while (true) {
			await io.clear();
			await io.print(functions.listToChoice(lang.current.shop.superShopMainMenu));
			await io.print(lang.current.shop.superCastSpeedTitle + ": ");
			if (data.gameState.dataSaver.actionSpeedMultiplier >= 10) {
				await io.print("    " + lang.current.shop.maxLevelReached)
			} else {
				await io.print("    " + lang.current.shop.superCurrentPrefix + ": " + data.gameState.dataSaver.actionSpeedMultiplier + " " + lang.current.shop.superNextPrefix + ": " + (data.gameState.dataSaver.actionSpeedMultiplier + 1) + " " + lang.current.shop.superSpeedSuffix);
				await io.print("    " + lang.current.shop.purchaseCostPrefix + " $1000, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			}
			await io.print(lang.current.shop.superBigFishTitle + ": ");
			if (data.gameState.dataSaver.bigFishChance >= 60) {
				await io.print("    " + lang.current.shop.maxLevelReached)
			} else {
				await io.print("    " + lang.current.shop.superBigFishCurrentPrefix + ": " + data.gameState.dataSaver.bigFishChance + " " + "%, " + lang.current.shop.superBigFishNextPrefix + ": " + (data.gameState.dataSaver.bigFishChance + 5) + "%");
				await io.print("    " + lang.current.shop.purchaseCostPrefix + " $1000, " + lang.current.shop.currentGoldPrefix + ": $" + data.gameState.dataSaver.money)
			}
			while (true) {
				const type = await io.getch();
				if (type === "1") {
					if (data.gameState.dataSaver.actionSpeedMultiplier >= 10) {
						await showResult("    " + lang.current.shop.maxLevelReached);
						break
					} else if (data.gameState.dataSaver.money < 1e3) {
						await showResult("    " + lang.current.shop.notEnoughMoney);
						break
					} else {
						data.gameState.dataSaver.money -= 1e3;
						data.gameState.dataSaver.actionSpeedMultiplier++;
						await showResult("    " + lang.current.shop.purchaseSuccess);
						break
					}
				} else if (type === "2") {
					if (data.gameState.dataSaver.bigFishChance >= 60) {
						await showResult("    " + lang.current.shop.maxLevelReached);
						break
					} else if (data.gameState.dataSaver.money < 1e3) {
						await showResult("    " + lang.current.shop.notEnoughMoney);
						break
					} else {
						data.gameState.dataSaver.money -= 1e3;
						data.gameState.dataSaver.bigFishChance += 5;
						await showResult("    " + lang.current.shop.purchaseSuccess);
						break
					}
				} else if (type === "3") {
					return
				}
			}
		}
	}
	async function run() {
		await io.clear();
		await io.print(functions.listToChoice(lang.current.shop.shopSelectMenu));
		let type;
		while (true) {
			type = await io.getch();
			if (type === "1") {
				await shop0();
				break
			} else if (type === "2") {
				await shop1();
				break
			} else if (type === "3") {
				return
			}
		}
	}
	return run
}
