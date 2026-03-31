export const constant = Object.freeze({
	maxCatchSpeedLevel: 25,
	minCatchSpeed: Object.freeze([50, 40, 40, 40, 30, 30, 30, 30, 20, 20, 10, 9, 7, 5, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1]),
	maxCatchSpeed: Object.freeze([100, 100, 90, 80, 80, 70, 60, 50, 50, 40, 40, 40, 40, 40, 40, 35, 30, 25, 20, 10, 5, 4, 4, 3, 3, 2]),
	catchSpeedUpgradeCost: Object.freeze([0, 5, 5, 5, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 200, 200, 300, 350, 400, 500, 600, 700, 700]),
	maxIncomeLevel: 29,
	maxIncome: Object.freeze([20, 20, 20, 30, 30, 40, 40, 40, 50, 50, 55, 60, 60, 60, 70, 70, 80, 80, 90, 100, 105, 110, 120, 130, 135, 140, 145, 150, 170, 200]),
	minIncome: Object.freeze([10, 12, 15, 15, 20, 20, 25, 30, 35, 40, 40, 40, 45, 50, 60, 60, 60, 70, 80, 85, 85, 90, 95, 100, 100, 100, 100, 100, 100, 100]),
	incomeLevelUpgradeCost: Object.freeze([0, 20, 20, 20, 30, 40, 50, 60, 70, 80, 80, 80, 80, 90, 100, 150, 200, 200, 200, 300, 350, 400, 500, 600, 700, 700, 700, 700, 700, 700])
});
export const getData = () => ({
	money: 20,
	catchSpeedLevel: 0,
	incomeLevel: 0,
	totalFishCaught: 0,
	bigFishChance: 20,
	actionSpeedMultiplier: 1,
	slipOffChance: 50,
	cleanerCount: 0,
	cleaningMultiplier: 1,
	rodLevel: 1,
	textSpeed: 2,
	challengeLevel: 0,
	ovenCount: 0,
	hunger: 20,
	aquariumCapacity: 0,
	aquariumFishCounts: [0, 0, 0, 0, 0, 0, 0],
	foodFish: [
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	],
	compactMode: false
});
export const getGameState = () => ({
	username: "",
	fishMan: false,
	big: 0,
	diamond: 0,
	aqnow: 0,
	aqother: 0,
	password: "",
	dataSaver: getData()
});
export const gameState = getGameState();
