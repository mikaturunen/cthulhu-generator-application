

interface Character {
	/**
	 * Generated GUID for the character. Not global uniqueness guaranteed. Just unique in the context of the players characters.
	 */
	guid: string;

	/**
	 * Character age, fairly obvious.
	 */
	age: number;

	/**
	 * Male or Female but we are not limited by this constrain; thus, string. Be whoever you want to be! EMBRACE IT!
	 */
	gender: string;

	sexualOrientation: string;
	firstName: string;
	lastName: string;
	occupation: string;
	education: string;
	stats: CharacterStats;
	skills: CharacterSkills1920s;
}

interface CharacterStats {
	ageModifier: number; // This is not really a stat, should be moved to some modifier structure
	strength: number;
	dexterity: number;
	intelligence: number;
	constitution: number;
	appearance: number;
	power: number;
	size: number;
	education: number;
	sanity: number;
	idea: number;
	luck: number;
	knowledge: number;
}

interface CharacterSkills {

}

interface CharacterSkills1920s extends CharacterSkills {
	accounting: number;
	anthropology: number;
	archaelogy: number;
	arts: CustomSkill[];
	astronomy: number;
	bargain: number;
	biology: number;
	chemistry: number;
	climb: number;
	conceal: number;
	crafts: CustomSkill[];
	creditRating: number;
	cthulhuMythos: number;
	disguise: number;
	dodge: number;
	driveAuto: number;
	electricalRepair: number;
	fastTalk: number;
	geology: number;
	hide: number;
	history: number;
	jump: number;
	law: number;
	libraryUse: number;
	listen: number;
	locksmith: number;
	martialArts: number;
	mechanicalRepair: number;
	medicine: number;
	naturalHistory: number;
	navigate: number;
	occult: number;
	operateHeavyMachinery: number;
	otherLanguages: CustomSkill[];
	nativeLanguages: CustomSkill[];
	persuade: number;
	pharmacy: number;
	photography: number;
	physics: number;
	pilot: number;
	psychoanalysis: number;
	psychology: number;
	ride: number;
	sneak: number;
	swim: number;
	throw: number;
	track: number;
	customSkills: CustomSkill[];
	handgun: number;
	machineGun: number;
	rifle: number;
	shotgun: number;
	smg: number;
}

interface CustomSkill {
	name: string;
	value: string;
}

interface EducationLevel {
	value: number;
	level: string;
}
