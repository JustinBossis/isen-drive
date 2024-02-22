const { MongoClient, ObjectId} = require('mongodb');
const dbName = "isen_drive";
const client = new MongoClient(process.env.MONGODB_URI);

const Category = {

    getById : async function (categoryId) {
        try{
            await client.connect()
            const db = client.db(dbName);
            const categoriesCollection = db.collection('categories');
            return await categoriesCollection.findOne({_id: new ObjectId(categoryId)});
        }catch (e) {
            throw e;
        }finally {
            await client.close();
        }
    },

    getAll: async function () {
        try {
            await client.connect()
            const db = client.db(dbName);
            const categoriesCollection = db.collection('categories');
            const productsCollection = db.collection('products');
            let categories = await categoriesCollection.find().toArray();
            return await Promise.all(categories.map(async category => {
                category.size = await productsCollection.countDocuments({categoryId: new ObjectId(category._id)});
                return category;
            }));
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    delete : async function (categoryId) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const categoriesCollection = db.collection('categories');
            await categoriesCollection.deleteOne({_id: new ObjectId(categoryId)})
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    },

    update : async function (categoryId, data) {
        try {
            await client.connect()
            const db = client.db(dbName);
            const categoriesCollection = db.collection('categories');
            await categoriesCollection.updateOne({_id: new ObjectId(categoryId)}, {$set: data});
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
            const categoriesCollection = db.collection('categories');
            let category = await categoriesCollection.insertOne(data);
            return category.insertedId;
        } catch (e) {
            throw e;
        } finally {
            await client.close();
        }
    }

}

module.exports = Category;
