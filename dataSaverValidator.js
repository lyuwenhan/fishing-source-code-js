import {
	constant,
	getData
} from "./data.js";

function isPlainObject(value) {
	if (value === null || typeof value !== "object") {
		return false
	}
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null
}

function clampInt(value, min, max, fallback) {
	const numberValue = Number(value);
	if (!Number.isFinite(numberValue)) {
		return fallback
	}
	const intValue = Math.trunc(numberValue);
	return Math.min(max, Math.max(min, intValue))
}
export default function normalizeDataSaver(inputDataSaver) {
	const fallback = getData();
	const source = isPlainObject(inputDataSaver) ? inputDataSaver : {};
	const normalized = {
		...fallback
	};
	normalized.money = clampInt(source.money, 0, Number.MAX_SAFE_INTEGER, fallback.money);
	normalized.catchSpeedLevel = clampInt(source.catchSpeedLevel, 0, constant.maxCatchSpeedLevel, fallback.catchSpeedLevel);
	normalized.incomeLevel = clampInt(source.incomeLevel, 0, constant.maxIncomeLevel, fallback.incomeLevel);
	normalized.totalFishCaught = clampInt(source.totalFishCaught, 0, Number.MAX_SAFE_INTEGER, fallback.totalFishCaught);
	normalized.bigFishChance = clampInt(source.bigFishChance, 0, 100, fallback.bigFishChance);
	normalized.actionSpeedMultiplier = clampInt(source.actionSpeedMultiplier, 1, 10, fallback.actionSpeedMultiplier);
	normalized.slipOffChance = clampInt(source.slipOffChance, 0, 99, fallback.slipOffChance);
	normalized.cleanerCount = clampInt(source.cleanerCount, 0, Number.MAX_SAFE_INTEGER, fallback.cleanerCount);
	normalized.cleaningMultiplier = clampInt(source.cleaningMultiplier, 1, 10, fallback.cleaningMultiplier);
	normalized.rodLevel = clampInt(source.rodLevel, 0, 6, fallback.rodLevel);
	normalized.textSpeed = clampInt(source.textSpeed, 0, 2, fallback.textSpeed);
	normalized.challengeLevel = clampInt(source.challengeLevel, 0, 2, fallback.challengeLevel);
	normalized.ovenCount = clampInt(source.ovenCount, 0, 5, fallback.ovenCount);
	normalized.hunger = clampInt(source.hunger, 0, 100, fallback.hunger);
	normalized.aquariumCapacity = clampInt(source.aquariumCapacity, 0, 40, fallback.aquariumCapacity);
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
		count = clampInt(count, 0, fishLeft, 0);
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
	normalized.foodFish = foodFish.map(pair => [clampInt(pair?.[0], 0, Number.MAX_SAFE_INTEGER, 0), clampInt(pair?.[1], 0, Number.MAX_SAFE_INTEGER, 0)]);
	normalized.compactMode = typeof source.compactMode === "boolean" ? source.compactMode : fallback.compactMode;
	return normalized
}
