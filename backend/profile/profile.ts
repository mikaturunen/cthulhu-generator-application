
import { getDatabaseConnectionString } from "../environment/environment";
import * as mongodb from "mongodb";
import * as Q from "q";

const mongoClient = mongodb.MongoClient;
const databaseCollectionName = "profile";

class ProfileModule {
	private database: mongodb.Db;
	private collection: mongodb.Collection;

	constructor(private container: InversionOfControlContainer) {
		//
	}

	/**
	 * Setups the Profile module into use. Connects to the database and finds the required collection from there.
	 * If the collection does not exist, the setup function will create it.
	 */
	public setup() {
		if (this.database) {
			return Q.resolve(true);
		}

		// 1. Open connection to database
		// 2. List all collections in database
		// 3. Check if our profile collection exists
		// 	- yes: use it
		//  - no : create a new collection with the proper name and use it

		// using Q to wrap the callback using function into a promise.
		return Q.nfcall(mongoClient.connect, getDatabaseConnectionString())
			.then((db: mongodb.Db) => {
				this.database = db;
				return this.database;
			})
			.then(() => this.database.collections())
			.then((collections: mongodb.Collection[]) => {
				if (collections.find(c => c.collectionName === databaseCollectionName)) {
					return this.database.collection(databaseCollectionName);
				}

				return this.database.createCollection(databaseCollectionName);
			})
			.then(databaseCollection => {
				this.collection = databaseCollection;
				return true;
			});
	}

	/**
	 * Upserts the given document. Returns the latest copy of it from db.
	 * @param {Profile} document Current Profile document we want to save to the database.
	 * @returns {Profile} latest profile that matches the _id of the document inserted.
	 */
	public upsert(document: Profile) {
		// 1. Upsert into the given document
		// 2. return the inserted document

		return this.collection.updateOne({
				_id: document._id
			},
			document,
			{
				upsert: true
			})
			.then((result: mongodb.UpdateWriteOpResult) => this.get(document._id));
	}

	/**
	 * Finds the latest document that matches the _id provided.
	 * @param {string} _id Profile._id property.
	 * @returns {Profile} latest profile that matches the _id of the document inserted.
	 */
	public get(_id: string) {
		return this.collection.find({ _id: _id }).toArray()
			.then((profiles: Profile[]) => profiles.length > 0 ? profiles[0] : undefined);
	}
}

export default ProfileModule;
