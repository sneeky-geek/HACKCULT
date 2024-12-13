const express = require('express');
const mongodb = require('mongodb');
const crypto = require('crypto');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://tarunmuragodnavar123:mern123@cluster0.sjd1w.mongodb.net/cybersecurity?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const port = process.env.PORT || 3000;
let db;

mongodb.MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db('cybersecurity');
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const encryptData = (data) => {
  const algorithm = 'aes-256-ctr';
  const secretKey = crypto.randomBytes(32); // Randomly generated secret key
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { encrypted, secretKey: secretKey.toString('hex'), iv: iv.toString('hex') };
};

const addDifferentialPrivacyNoise = (encryptedData) => {
  const epsilon = process.env.PRIVACY_EPSILON || 1.0; // Privacy budget from environment
  const sensitivity = 1; // Sensitivity of the data (Assuming each individual change affects the result by 1)
  const noiseScale = sensitivity / epsilon; // Scale of noise based on privacy budget

  const noisyData = encryptedData.split('').map(char => {
    const noise = laplaceNoise(noiseScale); // Laplace noise function
    return String.fromCharCode(char.charCodeAt(0) + noise);
  }).join('');

  return noisyData;
};

// Simple Laplace noise generator (for demonstration)
const laplaceNoise = (scale) => {
  const u = Math.random() - 0.5; // Uniform random number in [-0.5, 0.5]
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};

const startServer = () => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    promptForFileInput();
  });
};

const promptForFileInput = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Please provide the file path (or type "exit" to quit): ', (filePath) => {
    if (!filePath) {
      console.log('File path is required.');
      promptForFileInput(); // Repeat prompt
    } else if (filePath.toLowerCase() === 'exit') {
      console.log('Exiting the application...');
      rl.close();
      process.exit(0); // Terminate the program
    } else {
      processFileInput(filePath);
    }
  });
};

const processFileInput = (filePath) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    let dataToEncrypt;

    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension === '.json') {
      try {
        dataToEncrypt = JSON.parse(fileContent.toString());
        dataToEncrypt = JSON.stringify(dataToEncrypt); // Convert JSON object back to a string for encryption
      } catch (jsonError) {
        console.error('Error parsing JSON file:', jsonError);
        return;
      }
    } else {
      dataToEncrypt = fileContent.toString('utf8'); // Treat non-JSON files as text
    }

    const { encrypted, secretKey, iv } = encryptData(dataToEncrypt);

    const noisyEncryptedData = addDifferentialPrivacyNoise(encrypted);

    db.collection('encrypted_files').insertOne({
      filename: path.basename(filePath),
      fileType: fileExtension,
      encryptedData: noisyEncryptedData,
      secretKey: secretKey,
      iv: iv,
      uploadDate: new Date()
    })
      .then(() => {
        console.log('File encrypted, noise added, and stored successfully in MongoDB.');
        promptForFileInput();
      })
      .catch(err => {
        console.error('Error storing data in MongoDB:', err);
      });
  });
};
//C:\Users\Lenovo\Desktop\2my.txt
//C:\Users\Lenovo\Desktop\financial_records.json