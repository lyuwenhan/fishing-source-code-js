import lang from "./lang.js";
import * as data from "./data.js";
import * as functions from "./functions.js";

function avgText(minValue, maxValue) {
	const sum = minValue + maxValue;
	return sum % 2 === 0 ? String(sum / 2) : `${Math.floor(sum/2)}.5`
}
async function showResult(text) {
	await functions.print(text);
	await functions.sleep(.5)
}
async function shop0() {
	while (true) {
		await functions.clear();
		await functions.print(lang.current.shop.shopMainMenu);
		await functions.print(lang.current.shop.hookSpeedTitle);
		if (data.gameState.dataSaver.catchSpeedLevel === data.constant.maxCatchSpeedLevel) {
			await functions.print(lang.current.shop.levelMax)
		} else {
			await functions.print(lang.current.shop.hookSpeedCurrentPrefix + avgText(data.constant.minCatchSpeed[data.gameState.dataSaver.catchSpeedLevel], data.constant.maxCatchSpeed[data.gameState.dataSaver.catchSpeedLevel]) + lang.current.shop.hookSpeedNextPrefix + avgText(data.constant.minCatchSpeed[data.gameState.dataSaver.catchSpeedLevel + 1], data.constant.maxCatchSpeed[data.gameState.dataSaver.catchSpeedLevel + 1]));
			await functions.print(lang.current.shop.upgradeCostPrefix + data.constant.catchSpeedUpgradeCost[data.gameState.dataSaver.catchSpeedLevel + 1] + lang.current.shop.currentGoldPrefix + data.gameState.dataSaver.money)
		}
		await functions.print(lang.current.shop.fishingIncomeTitle);
		if (data.gameState.dataSaver.incomeLevel === data.constant.maxIncomeLevel) {
			await functions.print(lang.current.shop.levelMax)
		} else {
			await functions.print(lang.current.shop.fishingIncomeCurrentPrefix + avgText(data.constant.minIncome[data.gameState.dataSaver.incomeLevel], data.constant.maxIncome[data.gameState.dataSaver.incomeLevel]) + lang.current.shop.fishingIncomeNextPrefix + avgText(data.constant.minIncome[data.gameState.dataSaver.incomeLevel + 1], data.constant.maxIncome[data.gameState.dataSaver.incomeLevel + 1]));
			await functions.print(lang.current.shop.upgradeCostPrefix + data.constant.incomeLevelUpgradeCost[data.gameState.dataSaver.incomeLevel + 1] + lang.current.shop.currentGoldPrefix + data.gameState.dataSaver.money)
		}
		await functions.print(lang.current.shop.hookOffTitle);
		if (data.gameState.dataSaver.slipOffChance === 0) {
			await functions.print(lang.current.shop.levelMax)
		} else if (data.gameState.dataSaver.slipOffChance > 10) {
			data.gameState.dataSaver.slipOffChance = Math.floor(data.gameState.dataSaver.slipOffChance / 10) * 10;
			await functions.print(lang.current.shop.hookOffCurrentPrefix + data.gameState.dataSaver.slipOffChance + lang.current.shop.hookOffNextPrefix + (data.gameState.dataSaver.slipOffChance - 10) + "%");
			await functions.print(lang.current.shop.hookOffCost100Prefix + data.gameState.dataSaver.money)
		} else if (data.gameState.dataSaver.slipOffChance > 5) {
			data.gameState.dataSaver.slipOffChance = 10;
			await functions.print(lang.current.shop.hookOffPreset10To5);
			await functions.print(lang.current.shop.hookOffCost100Prefix + data.gameState.dataSaver.money)
		} else if (data.gameState.dataSaver.slipOffChance > 1) {
			await functions.print(lang.current.shop.hookOffCurrentPrefix + data.gameState.dataSaver.slipOffChance + lang.current.shop.hookOffNextPrefix + (data.gameState.dataSaver.slipOffChance - 1) + "%");
			await functions.print(lang.current.shop.hookOffCost100Prefix + data.gameState.dataSaver.money)
		} else {
			await functions.print(lang.current.shop.hookOffPreset1To0);
			await functions.print(lang.current.shop.hookOffCost500Prefix + data.gameState.dataSaver.money)
		}
		await functions.print(lang.current.shop.cleanerCountPrefix + data.gameState.dataSaver.cleanerCount);
		await functions.print(lang.current.shop.cleanerBuyCostPrefix + data.gameState.dataSaver.money);
		await functions.print(lang.current.shop.cleanEfficiencyTitle);
		if (data.gameState.dataSaver.cleaningMultiplier >= 10) {
			await functions.print(lang.current.shop.levelMax)
		} else {
			await functions.print(lang.current.shop.cleanEfficiencyCurrentPrefix + data.gameState.dataSaver.cleaningMultiplier + lang.current.shop.cleanEfficiencyNextPrefix + (data.gameState.dataSaver.cleaningMultiplier + 1) + lang.current.shop.cleanEfficiencySuffix);
			await functions.print(lang.current.shop.superCost30Prefix + data.gameState.dataSaver.money)
		}
		await functions.print(lang.current.shop.aquariumCapacityTitle);
		if (data.gameState.dataSaver.aquariumCapacity >= 30) {
			await functions.print(lang.current.shop.levelMax)
		} else {
			await functions.print(lang.current.shop.aquariumCurrentPrefix + data.gameState.dataSaver.aquariumCapacity + lang.current.shop.aquariumNextPrefix + (data.gameState.dataSaver.aquariumCapacity + 2) + lang.current.shop.aquariumSuffix);
			await functions.print(lang.current.shop.purchaseCostPrefix + (data.gameState.dataSaver.aquariumCapacity + 2) * 100 + lang.current.shop.currentGoldPrefix + data.gameState.dataSaver.money)
		}
		await functions.print(lang.current.shop.ovenCountTitle);
		if (data.gameState.dataSaver.ovenCount >= 3) {
			await functions.print(lang.current.shop.ovenMaxCount)
		} else {
			await functions.print(lang.current.shop.ovenCurrentPrefix + data.gameState.dataSaver.ovenCount);
			if (data.gameState.dataSaver.ovenCount < 1) {
				await functions.print(lang.current.shop.ovenCost50Prefix + data.gameState.dataSaver.money)
			} else if (data.gameState.dataSaver.ovenCount === 1) {
				await functions.print(lang.current.shop.ovenCost1000Prefix + data.gameState.dataSaver.money)
			} else {
				await functions.print(lang.current.shop.ovenCost2000Prefix + data.gameState.dataSaver.money)
			}
		}
		while (true) {
			const type = await functions.getch();
			if (type === "1") {
				if (data.gameState.dataSaver.catchSpeedLevel === data.constant.maxCatchSpeedLevel) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.money < data.constant.catchSpeedUpgradeCost[data.gameState.dataSaver.catchSpeedLevel + 1]) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.money -= data.constant.catchSpeedUpgradeCost[++data.gameState.dataSaver.catchSpeedLevel];
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "2") {
				if (data.gameState.dataSaver.incomeLevel === data.constant.maxIncomeLevel) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.money < data.constant.incomeLevelUpgradeCost[data.gameState.dataSaver.incomeLevel + 1]) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.money -= data.constant.incomeLevelUpgradeCost[++data.gameState.dataSaver.incomeLevel];
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "3") {
				if (data.gameState.dataSaver.slipOffChance === 0) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.slipOffChance === 1) {
					if (data.gameState.dataSaver.money < 500) {
						await showResult(lang.current.shop.notEnoughMoney);
						break
					} else {
						data.gameState.dataSaver.money -= 500;
						data.gameState.dataSaver.slipOffChance = 0;
						await showResult(lang.current.shop.purchaseSuccess);
						break
					}
				} else {
					if (data.gameState.dataSaver.money < 100) {
						await showResult(lang.current.shop.notEnoughMoney);
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
						await showResult(lang.current.shop.purchaseSuccess);
						break
					}
				}
			} else if (type === "4") {
				if (data.gameState.dataSaver.money < 10) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.cleanerCount++;
					data.gameState.dataSaver.money -= 10;
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "5") {
				if (data.gameState.dataSaver.cleaningMultiplier === 10) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.money < 30) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.money -= 30;
					data.gameState.dataSaver.cleaningMultiplier++;
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "6") {
				if (data.gameState.dataSaver.aquariumCapacity === 30) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.money < (data.gameState.dataSaver.aquariumCapacity + 2) * 100) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.money -= (data.gameState.dataSaver.aquariumCapacity + 2) * 100;
					data.gameState.dataSaver.aquariumCapacity += 2;
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "7") {
				if (data.gameState.dataSaver.ovenCount >= 3) {
					await showResult(lang.current.shop.ovenMaxCount);
					break
				} else {
					if (data.gameState.dataSaver.ovenCount < 1) {
						if (data.gameState.dataSaver.money < 50) {
							await showResult(lang.current.shop.notEnoughMoney);
							break
						} else {
							data.gameState.dataSaver.money -= 50;
							data.gameState.dataSaver.ovenCount = 1;
							await showResult(lang.current.shop.purchaseSuccess);
							break
						}
					} else if (data.gameState.dataSaver.ovenCount === 1) {
						if (data.gameState.dataSaver.money < 1e3) {
							await showResult(lang.current.shop.notEnoughMoney);
							break
						} else {
							data.gameState.dataSaver.money -= 1e3;
							data.gameState.dataSaver.ovenCount = 2;
							await showResult(lang.current.shop.purchaseSuccess);
							break
						}
					} else {
						if (data.gameState.dataSaver.money < 2e3) {
							await showResult(lang.current.shop.notEnoughMoney);
							break
						} else {
							data.gameState.dataSaver.money -= 2e3;
							data.gameState.dataSaver.ovenCount = 3;
							await showResult(lang.current.shop.purchaseSuccess);
							break
						}
					}
				}
			} else if (type === "8") {
				return
			}
		}
	}
}
async function shop1() {
	await functions.clear();
	await functions.printa(lang.current.shop.superShopWelcome);
	while (true) {
		await functions.clear();
		await functions.print(lang.current.shop.superShopMainMenu);
		await functions.print(lang.current.shop.superCastSpeedTitle);
		if (data.gameState.dataSaver.actionSpeedMultiplier >= 10) {
			await functions.print(lang.current.shop.levelMax)
		} else {
			await functions.print(lang.current.shop.superCurrentPrefix + data.gameState.dataSaver.actionSpeedMultiplier + lang.current.shop.superNextPrefix + (data.gameState.dataSaver.actionSpeedMultiplier + 1) + lang.current.shop.superSpeedSuffix);
			await functions.print(lang.current.shop.ovenCost1000Prefix + data.gameState.dataSaver.money)
		}
		await functions.print(lang.current.shop.superBigFishTitle);
		if (data.gameState.dataSaver.bigFishChance >= 60) {
			await functions.print(lang.current.shop.levelMax)
		} else {
			await functions.print(lang.current.shop.superBigFishCurrentPrefix + data.gameState.dataSaver.bigFishChance + lang.current.shop.superBigFishNextPrefix + (data.gameState.dataSaver.bigFishChance + 5) + "%");
			await functions.print(lang.current.shop.ovenCost1000Prefix + data.gameState.dataSaver.money)
		}
		while (true) {
			const type = await functions.getch();
			if (type === "1") {
				if (data.gameState.dataSaver.actionSpeedMultiplier >= 10) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.money < 1e3) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.money -= 1e3;
					data.gameState.dataSaver.actionSpeedMultiplier++;
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "2") {
				if (data.gameState.dataSaver.bigFishChance >= 60) {
					await showResult(lang.current.shop.levelMax);
					break
				} else if (data.gameState.dataSaver.money < 1e3) {
					await showResult(lang.current.shop.notEnoughMoney);
					break
				} else {
					data.gameState.dataSaver.money -= 1e3;
					data.gameState.dataSaver.bigFishChance += 5;
					await showResult(lang.current.shop.purchaseSuccess);
					break
				}
			} else if (type === "3") {
				await functions.sleep(.5);
				return
			}
		}
	}
}
export default async function shop() {
	while (true) {
		await functions.clear();
		await functions.print(lang.current.shop.shopSelectMenu);
		let type;
		while (true) {
			type = await functions.getch();
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
}
