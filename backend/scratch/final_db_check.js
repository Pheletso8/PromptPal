const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://pheletsomarumoloe8_db_user:XH1b3PkFJpja6ubD@cluster3.pqgrubh.mongodb.net/?appName=Cluster3';

async function checkDb() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to Atlas');
    const configs = await mongoose.connection.db.collection('platformconfigs').find({}).toArray();
    console.log('Configs found:', configs.length);
    configs.forEach(c => {
      console.log(`ID: ${c._id}, Maintenance: ${c.maintenanceMode}, UpdatedAt: ${c.updatedAt}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDb();
