
/// <reference path="./character.d.ts" />

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
