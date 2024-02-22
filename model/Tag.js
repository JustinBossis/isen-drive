const { MongoClient, ObjectId} = require('mongodb');
const dbName = "isen_drive";
const client = new MongoClient(process.env.MONGODB_URI);

const Tag = {

    getById : async function (tagId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const tagsCollection = db.collection('tags');
            return await tagsCollection.findOne({_id: new ObjectId(tagId)});
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    getByProduct : async function (product) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const tagsCollection = db.collection('tags');
            return await tagsCollection.find({_id: { $in : product.tags}}).toArray();
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    getAll : async function () {
        try {
            await client.connect()
            const db = client.db(dbName);
            const tagsCollection = db.collection('tags');
            const productsCollection = db.collection('products');
            let tags = await tagsCollection.find().toArray();
            return await Promise.all(tags.map(async tag => {
                tag.size = await productsCollection.countDocuments({tags: new ObjectId(tag._id)});
                return tag;
            }));
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    delete : async function (tagId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const tagsCollection = db.collection('tags');
            await tagsCollection.deleteOne({_id: new ObjectId(tagId)})
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    update : async function (tagId, data) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const tagsCollection = db.collection('tags');
            await tagsCollection.updateOne({_id: new ObjectId(tagId)}, {$set: data});
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },
    insert : async function (data) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const tagsCollection = db.collection('tags');
            let tag = await tagsCollection.insertOne(data);
            return tag.insertedId;
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    }

}

module.exports = Tag;
