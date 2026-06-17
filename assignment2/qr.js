const { Jimp } = require('jimp');
const jsQR = require('jsqr');

async function decodeQR(imagePath) {
    const image = await Jimp.read(imagePath);
    
    // jsQR expects a Uint8ClampedArray
    const pixelData = new Uint8ClampedArray(image.bitmap.data);
    const result = jsQR(pixelData, image.bitmap.width, image.bitmap.height);
    
    if (!result) {
        throw new Error('No QR code found');
    }
    
    return result.data;
}

// Standalone test guard
if (require.main === module) {
    // Replace 'test.png' with a photo of an ID card to test locally
    decodeQR('test.png')
        .then(data => console.log('Extracted Data:', data))
        .catch(console.error);
}

module.exports = { decodeQR };