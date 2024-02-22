const { MongoClient, ObjectId} = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = "isen_drive";
const client = new MongoClient(url);

async function getCategories(){
    const db = client.db(dbName);
    const categoriesCollection = db.collection('categories');
    const productsCollection = db.collection('products');
    let categories = await categoriesCollection.find().toArray();
    return await Promise.all(categories.map(async category => {
        category.size = await productsCollection.countDocuments({categoryId: new ObjectId(category._id)});
        return category;
    }));
}

client.connect().then(() =>
    getCategories()
        .then(console.log)
        .catch(console.error).finally(() => client.close())
)


