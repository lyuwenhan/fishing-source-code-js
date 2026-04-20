export default [{
	title: "Prologue",
	lines: ["The dragon has terrorized the kingdom for years.", "You are the one people speak of - the hero who will face it.", "Help and danger will both find you.", "Your choices write the story."],
	choose: ["Begin"],
	cnext: [""],
	next: [1]
}, {
	title: "",
	lines: ["Morning light fills your room.", "What will you do first?"],
	choose: ["Eat breakfast", "Go outside", "Sleep a little longer"],
	cnext: ["You eat and feel ready for the day.", "", "You pull the blanket up and drift off again."],
	next: [-1, 2, -2]
}, {
	title: "",
	lines: ["You step onto the dirt road outside your home.", "Where to?"],
	choose: ["Go back for breakfast", "Go back to bed", "Visit the blacksmith"],
	cnext: ["You eat at home, then return outside.", "You crawl back under the covers.", "You walk toward the forge."],
	next: [-1, -2, 3]
}, {
	title: "The forge",
	lines: ["Sparks fly as the blacksmith hammers metal.", "Blacksmith: So you're the one hunting the dragon.", "Blacksmith: You'll want more than courage - you'll want steel.", "Blacksmith: Say what you need.", "Blacksmith: I might be able to help."],
	choose: ["Leave", "Ask for a weapon"],
	cnext: ["You walk back to the road.", ""],
	next: [2, 4]
}, {
	title: "The forge",
	lines: ["Blacksmith: What are we making?"],
	choose: ["A longsword"],
	cnext: ["The blacksmith hands you a longsword and nods."],
	next: [5]
}, {
	title: "",
	lines: ["The road splits your journey in two."],
	choose: ["Follow the narrow path east", "Take the broad road west"],
	cnext: ["", ""],
	next: [6, 14]
}, {
	title: "",
	lines: ["The eastern path winds through trees.", "An inn appears ahead."],
	choose: ["Go inside for the night", "Camp outside instead"],
	cnext: ["You pay for a room and sleep.", "You pitch a tent by the road - it's a cold night."],
	next: [10, 9]
}, {
	title: "",
	lines: ["The eastern path winds through trees.", "Another inn - same sign, different village."],
	choose: ["Go inside for the night", "Keep walking"],
	cnext: ["You rent a room and rest.", ""],
	next: [8, 12]
}, {
	title: "The End",
	lines: ["Thieves were waiting. You don't wake up.", "(The inn wasn't what it seemed.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "The End",
	lines: ["The cold wins. You never wake.", "(Sleeping outside without gear was a mistake.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "",
	lines: ["The road opens onto a market square.", "A merchant waves you over."],
	choose: ["Buy supplies", "Move on"],
	cnext: ["You fill your pack with bread and dried meat.", ""],
	next: [7, 11]
}, {
	title: "The End",
	lines: ["You ignored food too long.", "Your strength gives out on the road.", "(Always pack a meal.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "",
	lines: ["A quiet temple sits beside the path."],
	choose: ["Step inside", "Keep walking"],
	cnext: ["", ""],
	next: [13, 11]
}, {
	title: "The temple",
	lines: ["Incense and chanting fill the hall.", "Days turn into years.", "You find peace - and completely forget about the dragon.", "(Not every hero finishes the quest.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "",
	lines: ["The western road climbs a hill.", "A second inn stands alone at the crossroads."],
	choose: ["Go inside for the night", "Keep walking"],
	cnext: ["You take a room and rest.", ""],
	next: [15, 11]
}, {
	title: "The inn",
	lines: ["Voices drift up from the common room below."],
	choose: ["Listen at the stairs", "Ignore it and sleep"],
	cnext: ["", ""],
	next: [16, 8]
}, {
	title: "The inn",
	lines: ["You catch part of a plan: they want to steal your money.", "You have seconds to decide."],
	choose: ["Climb out the window", "Confront the innkeeper"],
	cnext: ["", ""],
	next: [17, 18]
}, {
	title: "The End",
	lines: ["The ground is farther than you thought.", "You land badly. That was your last mistake.", "(Jumping out the window was not safe.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "The inn",
	lines: ["It's an ugly brawl, but you walk away breathing.", "The road is clear again."],
	choose: ["Leave town"],
	cnext: [""],
	next: [19]
}, {
	title: "",
	lines: ["The path splits: south toward the coast, north toward the hills."],
	choose: ["Head south", "Head north"],
	cnext: ["", ""],
	next: [20, 23]
}, {
	title: "",
	lines: ["The southern road reaches a fork.", "To one side, the sea; to the other, more land."],
	choose: ["Keep walking south", "Board the ship at the dock"],
	cnext: ["", "You sign on as crew - wherever it's going."],
	next: [21, 22]
}, {
	title: "...Rome?",
	lines: ["(This is a silly joke.) In old sayings, 'all roads lead to Rome.'", "Somehow you really are in Rome. No dragon here - only people with cameras.", "(You got lost in the story. Try another path next time.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "...Land ho?",
	lines: ["Sailors shout when they see land: 'Land ho!' The trip takes a long time.", "You reach a new coast. It is not where the dragon lives. (Wrong place. Still no dragon.)", "(Ship jokes are for fun. The real quest is on land.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "",
	lines: ["The northern trail ends at a cliff face.", "A dark cave mouth waits."],
	choose: ["Enter the cave", "Turn back"],
	cnext: ["You light a torch and go in.", ""],
	next: [24, 25]
}, {
	title: "The cave",
	lines: ["You dig where the soil looks disturbed.", "Old bones come up. They look important - like something for a museum or a science report.", "Scientists would love this find. You only want a bed.", "(Still no dragon here.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "",
	lines: ["Smoke stains the sky ahead.", "The dragon's lair is carved into the mountain."],
	choose: ["Go in", "Return home to eat", "Return home to sleep"],
	cnext: ["You step inside. It is hot and dark.", "", ""],
	next: [26, -3, -4]
}, {
	title: "Dragon's lair",
	lines: ["Ash crunches under your boots.", "The beast is somewhere in the dark."],
	choose: ["Fight the dragon", "Return home to eat", "Return home to sleep"],
	cnext: ["Steel meets scales - somehow you survive.", "", ""],
	next: [27, -3, -4]
}, {
	title: "Dragon's lair",
	lines: ["The cavern falls silent.", "The dragon is defeated - but the nest isn't empty."],
	choose: ["Search the nest for loot"],
	cnext: [""],
	next: [28]
}, {
	title: "Dragon's lair",
	lines: ["Among the bones and coins sits a single heavy egg."],
	choose: ["Smash it", "Try to hatch it", "Return home to eat", "Return home to sleep"],
	cnext: ["", "", "", ""],
	next: [32, 29, -3, -4]
}, {
	title: "Dragon's lair",
	lines: ["Warmth spreads through the shell.", "A hatchling blinks at you - cute, until it isn't."],
	choose: ["...Eat it? (You're hungry.)", "Let it go"],
	cnext: ["", ""],
	next: [30, 31]
}, {
	title: "The End",
	lines: ["Even a baby dragon has sharp teeth.", "You had a good run.", "(Do not fight a baby dragon up close.)"],
	choose: ["Try again"],
	cnext: [""],
	next: [1]
}, {
	title: "Dragon's lair",
	lines: ["The kingdom is safe.", "You leave the mountain with a story no tavern will believe.", "Thanks for playing."],
	choose: ["Leave the adventure"],
	cnext: [""],
	next: [-5]
}, {
	title: "Dragon's lair",
	lines: ["The kingdom is safe.", "You leave the mountain with a story no tavern will believe.", "Thanks for playing."],
	choose: ["Leave the adventure"],
	cnext: [""],
	next: [-5]
}];
