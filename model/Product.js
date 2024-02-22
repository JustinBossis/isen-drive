const { ObjectId, MongoClient} = require('mongodb');
const dbName = "isen_drive";
const client = new MongoClient(process.env.MONGODB_URI);

const Product = {

    getByCategory: async function (categoryId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const productsCollection = db.collection('products');
            return await productsCollection.find({categoryId: new ObjectId(categoryId)}).toArray();
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    getByTag : async function (tagId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const productsCollection = db.collection('products');
            return await productsCollection.find({tags: new ObjectId(tagId)}).toArray();
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    getById : async function (productId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const productsCollection = db.collection('products');
            return await productsCollection.findOne({_id: new ObjectId(productId)});
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    delete : async function (productId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const productsCollection = db.collection('products');
            await productsCollection.deleteOne({_id: new ObjectId(productId)})
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    update : async function (productId, data) {
        if (!Array.isArray(data.tags)) {
            data.tags = [data.tags];
        }
        data.tags = data.tags.map(tag => new ObjectId(tag));
        data.categoryId = new ObjectId(data.categoryId)
        try {
            await client.connect()
            const db = client.db(dbName);
            const productsCollection = db.collection('products');
            await productsCollection.updateOne({_id: new ObjectId(productId)}, {$set: data});
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },
    insert : async function (data) {
        if (!Array.isArray(data.tags)) {
            data.tags = [data.tags];
        }
        data.tags = data.tags.map(tag => new ObjectId(tag));
        data.categoryId = new ObjectId(data.categoryId)
        try {
            await client.connect()
            const db = client.db(dbName);
            const productsCollection = db.collection('products');
            let products = await productsCollection.insertOne(data);
            return products.insertedId;
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    }

}

module.exports = Product;
