require('dotenv').config(); // Load environment variables

const mongodb = require('mongodb');
const crypto = require('crypto');
const readline = require('readline');

// MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let db;

// Connect to MongoDB
mongodb.MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db('cybersecurity');
    console.log('Connected to MongoDB');
    promptForDecryption();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const promptForDecryption = () => {
  rl.question('Enter the filename you want to decrypt (or type "exit" to quit): ', (filename) => {
    if (filename.trim().toLowerCase() === 'exit') {
      console.log('Exiting the application...');
      rl.close();
      process.exit(0);
    } else {
      searchAndDecryptFile(filename.trim());
    }
  });
};

const searchAndDecryptFile = (filename) => {
  console.log(`Searching for file: ${filename}`);

  db.collection('encrypted_files').findOne({ filename })
    .then(doc => {
      if (!doc) {
        console.error(`File "${filename}" not found in the database.`);
        promptForDecryption();
        return;
      }

      const { encryptedData, secretKey, iv } = doc;

      if (!encryptedData || !secretKey || !iv) {
        console.error('Incomplete encryption details in the database.');
        promptForDecryption();
        return;
      }

      console.log("Decrypting file...");
      const decryptedData = decryptData(encryptedData, secretKey, iv);

      if (decryptedData) {
        console.log(`Decrypted data for "${filename}":\n${decryptedData}`);
      } else {
        console.error('Decryption failed. Please check encryption details.');
      }

      promptForDecryption();
    })
    .catch(err => {
      console.error('Error fetching data from MongoDB:', err.message);
      promptForDecryption();
    });
};

const decryptData = (encryptedData, secretKeyHex, ivHex) => {
  try {
    const algorithm = 'aes-256-ctr';
    const secretKey = Buffer.from(secretKeyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('Error during decryption:', err.message);
    return null;
  }
};
