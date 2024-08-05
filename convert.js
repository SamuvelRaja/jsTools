const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputFolder = './assets/input'; // Input folder containing the images
const outputFolder = './assets/webp';; // Output folder to save the WebP images

// Create output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Function to convert images to WebP
const convertImagesToWebP = async () => {
  try {
    const files = fs.readdirSync(inputFolder);

    for (const file of files) {
      const inputFilePath = path.join(inputFolder, file);
      const outputFilePath = path.join(outputFolder, `${path.parse(file).name}.webp`);

      await sharp(inputFilePath)
        .rotate() // Automatically rotate the image based on EXIF data
        .webp({ quality: 80 })
        .toFile(outputFilePath);

      console.log(`Converted ${file} to WebP format.`);
    }
  } catch (error) {
    console.error('Error converting images:', error);
  }
};

// Run the conversion
convertImagesToWebP();
