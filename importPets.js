const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. Load your service account key (make sure the path is correct)
const serviceAccount = require('./serviceAccountKey.json');

// 2. Initialize Firebase Admin SDK with your project's configuration
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'pet-adoption-69cf2.appspot.com' // Replace with your actual bucket name
});

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

async function uploadImageToStorage(imagePath, destinationPath) {
  try {
    await bucket.upload(imagePath, {
      destination: `PetAdopt/${destinationPath}`,
      public: true,
    });
    const [url] = await bucket.file(`PetAdopt/${destinationPath}`).getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    });
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function importPetsFromJson(jsonFilePath) {
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const pets = JSON.parse(jsonData);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [index, pet] of pets.entries()) {
      try {
        const docId = `${Date.now()}_${index}`; // More unique ID
        const petData = {
          id: docId,
          name: pet.name || '',
          category: pet.category || 'Dogs',
          breed: pet.breed || '',
          age: pet.age || '',
          sex: pet.sex || 'Male',
          weight: pet.weight || '',
          address: pet.address || '',
          about: pet.about || '',
          username: pet.username || 'Unknown',
          email: pet.email || 'no-email@example.com',
          userImage: pet.userImage || '',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Handle image upload
        if (pet.imageUrl) {
          if (pet.imageUrl.startsWith('http')) {
            petData.imageUrl = pet.imageUrl;
          } else {
            const absoluteImagePath = path.resolve(process.cwd(), pet.imageUrl);
            const fileName = `pet_${docId}${path.extname(pet.imageUrl)}`;
            const imageUrl = await uploadImageToStorage(absoluteImagePath, fileName);
            if (imageUrl) {
              petData.imageUrl = imageUrl;
            }
          }
        }

        await db.collection('Pets').doc(docId).set(petData);
        console.log(`✅ Added pet: ${pet.name} (ID: ${docId})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error adding pet ${pet.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nImport completed. Success: ${successCount}, Errors: ${errorCount}`);
  } catch (error) {
    console.error('Error processing JSON file:', error);
  }
}

// Get JSON file path from command line argument
const jsonFilePath = process.argv[2];
if (!jsonFilePath) {
  console.error('Usage: node importPets.js <path-to-json-file>');
  console.error('Example: node importPets.js pets_data.json');
  process.exit(1);
}

// Start the import
importPetsFromJson(jsonFilePath);