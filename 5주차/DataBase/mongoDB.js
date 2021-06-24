const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

const client = new MongoClient(url, {useUnifiedTopology:true});
const dbName = 'bingo';

exports.save = async(data) => {
  try {
    await client.connect();

    const database = client.db(dbName);
    const bingos = database.collection('bingos');
    const result = await bingos.insertOne(data);

    console.log(
      `${result.insertedCount} documents were inserted with the _id : ${result.insertedId}`
    );
  } finally {
    await client.close();
  }
}

exports.load = async() => {
  try {
    await client.connect();

    let database = client.db(dbName);
    database.collection('bingos').find({}).toArray((err, result) => {
      if (err) throw err;
      console.log(result)
    });
  } catch (error) {
    console.log(error)
  }
    
  
}