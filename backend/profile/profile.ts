
import { getDatabaseConnectionString } from "../environment/environment";
import * as mongodb from "mongodb";
import * as Q from "q";
import log from "../log/log";

const mongoClient = mongodb.MongoClient;
const databaseCollectionName = "profile";

namespace Profile {
	let database: mongodb.Db;
	let collection: mongodb.Collection;

	/**
	 * Setups the Profile module into use. Connects to the database and finds the required collection from there.
	 * If the collection does not exist, the setup function will create it.
	 */
	export function setup() {
		// 1. Open connection to database
		// 2. List all collections in database
		// 3. Check if our profile collection exists
		// 	- yes: use it
		//  - no : create a new collection with the proper name and use it

		// using Q to wrap the callback using function into a promise.
		return Q.nfcall(mongoClient.connect, getDatabaseConnectionString())
			.then((db: mongodb.Db) => {
				database = db;
				return database;
			})
			.then(() => database.collections())
			.then((collections: mongodb.Collection[]) => {
				if (collections.find(c => c.collectionName === databaseCollectionName)) {
					return database.collection(databaseCollectionName);
				}

				return database.createCollection(databaseCollectionName);
			})
			.then(databaseCollection => {
				collection = databaseCollection;
				return true;
			});
	}

	/**
	 * Upserts the given document. Returns the latest copy of it from db.
	 * @param {Profile} document Current Profile document we want to save to the database.
	 * @returns {Profile} latest profile that matches the _id of the document inserted.
	 */
	export function upsert(document: Profile) {
		// 1. Upsert into the given document
		// 2. return the inserted document

		collection.updateOne({
				_id: document._id
			},
			document,
			{
				upsert: true
			})
			.then((result: mongodb.UpdateWriteOpResult) => {
				log.info(JSON.stringify(result, null, 2));
				return get(document._id);
			});
	}

	/**
	 * Finds the latest document that matches the _id provided.
	 * @param {string} _id Profile._id property.
	 * @returns {Profile} latest profile that matches the _id of the document inserted.
	 */
	export function get(_id: string) {
		return collection.find({ _id: _id }).toArray()
			.then((profiles: Profile[]) => profiles.length > 0 ? profiles[0] : undefined);
	}
}

export default Profile;
