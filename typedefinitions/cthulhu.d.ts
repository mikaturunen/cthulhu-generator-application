
/**
 * Dice throw model.
 *
 * Describes a single throw of set of dices. Given 2d6+1 we would roll two dice (count: 2),
 * with six faces (max: 6) and adding one on top of the dice rolls (add: 1).
 */
interface Dice {
	/**
	* How many die are being thrown.
	* For example: 2d6+1 -> count: 2.
	*/
	count: number;

	/**
	* The max value of the die, or faces.
	* For example: 2d6+1 -> max: 6.
	*/
	max: number;

	/**
	* What value gets added to the die total.
	* For example: 2d6+1 -> add: 1.
	*/
	add: number;
}

interface Character {
	guid*

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

interface Profile {
	/**
	 * Mongo generated unique id
	 */
	_id: string;

	/**
	 * Unique identifier created by the service provider
	 */
	providerId: string;

	/**
	 * List of characters the user has.
	 */
	characters: Character[];

	// TODO expand the typing to contain the GM properties and the links to parties and such
	// NOTE as we are going to have the ability to form parties, there is going to be some relation
	// 		in the documenting database but we are keeping it to bare minimum
}

/**
 * Configuration for a specific game the players and the GM is intersted in. Usually created by the GM and invites the players to
 * be part of the game. Game can be played without a game configuration. All players can just use the application as a book keeping
 * tool which means that no party formations or game configurations are required. Just create characters and hammer away.
 */
interface GameConfiguration {
	/**
  	 * Name of the game / party.
	 */
	name: string;

	/**
	 * This is the _id of the the GameMasters Profile.
	 */
	gameMasterId: string;

	/**
	 * List of players in the play.
	 * Mongo makes sure player ids are globally unique.
	 */
	playerIds: string[];

	/**
	 * List of characters in the play.
	 * Characters are part of players profile, which means that as per se, they do not have mongo db generated
	 * character specific unique ID's but we'll generate ourselves a simple GUID for them. So in the context of a single
	 * character with the help of Profile._id + GUID generated during the character creation we can home in on the chars properly.
	 * Slightly silly but this is caused by the fact that the carrying idea currently is to enforce the advantages of the
	 * documenting db instead of going fully relational.
	 */
	characterIds: string[];
}
