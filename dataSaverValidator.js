import * as data from "./data.js";
import * as functions from "./functions.js";
export default function normalizeDataSaver(inputDataSaver) {
	const fallback = data.getData();
	const source = functions.isPlainObject(inputDataSaver) ? inputDataSaver : {};
	const normalized = {
		...fallback
	};
	normalized.money = functions.clampInt(source.money, 0, Number.MAX_SAFE_INTEGER, fallback.money);
	normalized.catchSpeedLevel = functions.clampInt(source.catchSpeedLevel, 0, data.constant.maxCatchSpeedLevel, fallback.catchSpeedLevel);
	normalized.incomeLevel = functions.clampInt(source.incomeLevel, 0, data.constant.maxIncomeLevel, fallback.incomeLevel);
	normalized.totalFishCaught = functions.clampInt(source.totalFishCaught, 0, Number.MAX_SAFE_INTEGER, fallback.totalFishCaught);
	normalized.bigFishChance = functions.clampInt(source.bigFishChance, 0, 100, fallback.bigFishChance);
	normalized.actionSpeedMultiplier = functions.clampInt(source.actionSpeedMultiplier, 1, 10, fallback.actionSpeedMultiplier);
	normalized.slipOffChance = functions.clampInt(source.slipOffChance, 0, 99, fallback.slipOffChance);
	normalized.cleanerCount = functions.clampInt(source.cleanerCount, 0, Number.MAX_SAFE_INTEGER, fallback.cleanerCount);
	normalized.cleaningMultiplier = functions.clampInt(source.cleaningMultiplier, 1, 10, fallback.cleaningMultiplier);
	normalized.rodLevel = functions.clampInt(source.rodLevel, 0, 6, fallback.rodLevel);
	normalized.textSpeed = functions.clampInt(source.textSpeed, 0, 2, fallback.textSpeed);
	normalized.challengeLevel = functions.clampInt(source.challengeLevel, 0, 2, fallback.challengeLevel);
	normalized.ovenCount = functions.clampInt(source.ovenCount, 0, 5, fallback.ovenCount);
	normalized.hunger = functions.clampInt(source.hunger, 0, 100, fallback.hunger);
	normalized.aquariumCapacity = functions.clampInt(source.aquariumCapacity, 0, 40, fallback.aquariumCapacity);
	let aquariumFishCounts;
	if (!Array.isArray(source.aquariumFishCounts)) {
		aquariumFishCounts = [...fallback.aquariumFishCounts]
	} else {
		if (source.aquariumFishCounts.length >= fallback.aquariumFishCounts.length) {
			aquariumFishCounts = source.aquariumFishCounts.slice(0, fallback.aquariumFishCounts.length)
		} else {
			aquariumFishCounts = [...source.aquariumFishCounts, ...Array(fallback.aquariumFishCounts.length - source.aquariumFishCounts.length).fill(0)]
		}
	}
	let fishLeft = normalized.aquariumCapacity;
	normalized.aquariumFishCounts = aquariumFishCounts.map(count => {
		count = functions.clampInt(count, 0, fishLeft, 0);
		fishLeft -= count;
		return count
	});
	let foodFish;
	if (!Array.isArray(source.foodFish)) {
		foodFish = fallback.foodFish.map(pair => [...pair])
	} else {
		if (source.foodFish.length >= fallback.foodFish.length) {
			foodFish = source.foodFish.slice(0, fallback.foodFish.length)
		} else {
			foodFish = [...source.foodFish, ...Array.from({
				length: fallback.foodFish.length - source.foodFish.length
			}, () => [0, 0])]
		}
	}
	normalized.foodFish = foodFish.map(pair => [functions.clampInt(pair?.[0], 0, Number.MAX_SAFE_INTEGER, 0), functions.clampInt(pair?.[1], 0, Number.MAX_SAFE_INTEGER, 0)]);
	normalized.compactMode = typeof source.compactMode === "boolean" ? source.compactMode : fallback.compactMode;
	return normalized
}
