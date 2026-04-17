import {
	constant,
	getData
} from "./data.js";

function isPlainObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value)
}

function clampInt(value, min, max, fallback) {
	const numberValue = Number(value);
	if (!Number.isFinite(numberValue)) {
		return fallback
	}
	const intValue = Math.trunc(numberValue);
	return Math.min(max, Math.max(min, intValue))
}

function normalizeNumberArray(value, expectedLength, fallbackArray, minValue = 0) {
	if (!Array.isArray(value)) {
		return [...fallbackArray]
	}
	const result = [];
	for (let i = 0; i < expectedLength; i++) {
		result.push(clampInt(value[i], minValue, Number.MAX_SAFE_INTEGER, fallbackArray[i]))
	}
	return result
}

function normalizeFoodFish(value, fallbackValue) {
	if (!Array.isArray(value)) {
		return fallbackValue.map(pair => [...pair])
	}
	const result = [];
	for (let i = 0; i < fallbackValue.length; i++) {
		const sourcePair = value[i];
		if (!Array.isArray(sourcePair)) {
			result.push([...fallbackValue[i]]);
			continue
		}
		result.push([clampInt(sourcePair[0], 0, Number.MAX_SAFE_INTEGER, fallbackValue[i][0]), clampInt(sourcePair[1], 0, Number.MAX_SAFE_INTEGER, fallbackValue[i][1])])
	}
	return result
}
export default function normalizeDataSaver(inputDataSaver) {
	const fallback = getData();
	const source = isPlainObject(inputDataSaver) ? inputDataSaver : {};
	const normalized = {
		...fallback
	};
	normalized.money = clampInt(source.money, 0, Number.POSITIVE_INFINITY, fallback.money);
	normalized.catchSpeedLevel = clampInt(source.catchSpeedLevel, 0, constant.maxCatchSpeedLevel, fallback.catchSpeedLevel);
	normalized.incomeLevel = clampInt(source.incomeLevel, 0, constant.maxIncomeLevel, fallback.incomeLevel);
	normalized.totalFishCaught = clampInt(source.totalFishCaught, 0, Number.MAX_SAFE_INTEGER, fallback.totalFishCaught);
	normalized.bigFishChance = clampInt(source.bigFishChance, 0, 100, fallback.bigFishChance);
	normalized.actionSpeedMultiplier = clampInt(source.actionSpeedMultiplier, 1, 10, fallback.actionSpeedMultiplier);
	normalized.slipOffChance = clampInt(source.slipOffChance, 0, 100, fallback.slipOffChance);
	normalized.cleanerCount = clampInt(source.cleanerCount, 0, Number.MAX_SAFE_INTEGER, fallback.cleanerCount);
	normalized.cleaningMultiplier = clampInt(source.cleaningMultiplier, 1, 10, fallback.cleaningMultiplier);
	normalized.rodLevel = clampInt(source.rodLevel, 1, Number.MAX_SAFE_INTEGER, fallback.rodLevel);
	normalized.textSpeed = clampInt(source.textSpeed, 0, 2, fallback.textSpeed);
	normalized.challengeLevel = clampInt(source.challengeLevel, 0, 2, fallback.challengeLevel);
	normalized.ovenCount = clampInt(source.ovenCount, 0, 3, fallback.ovenCount);
	normalized.hunger = clampInt(source.hunger, 0, 100, fallback.hunger);
	normalized.aquariumCapacity = clampInt(source.aquariumCapacity, 0, 30, fallback.aquariumCapacity);
	normalized.aquariumFishCounts = normalizeNumberArray(source.aquariumFishCounts, fallback.aquariumFishCounts.length, fallback.aquariumFishCounts);
	normalized.foodFish = normalizeFoodFish(source.foodFish, fallback.foodFish);
	normalized.compactMode = typeof source.compactMode === "boolean" ? source.compactMode : fallback.compactMode;
	return normalized
}
