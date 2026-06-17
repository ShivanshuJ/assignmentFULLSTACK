require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const { decodeQR } = require('./qr.js');
const { extractRollNumber, isRegistered } = require('./parser.js');
const { markPresent, getStats, getStore } = require('./attendance.js');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Send a photo of an ID card QR code to mark attendance.");
});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    let imagePath = null;

    try {
        // Get the highest resolution image
        const photo = msg.photo[msg.photo.length - 1];
        imagePath = await bot.downloadFile(photo.file_id, __dirname);

        const qrData = await decodeQR(imagePath);
        const rollNumber = extractRollNumber(qrData);

        if (!rollNumber) {
            return bot.sendMessage(chatId, "QR code found, but no valid roll number detected.");
        }

        if (!isRegistered(rollNumber)) {
            return bot.sendMessage(chatId, `Roll number ${rollNumber} is out of the registered range.`);
        }

        const result = markPresent(rollNumber);
        if (result.success) {
            bot.sendMessage(chatId, `✅ Present: ${rollNumber}`);
        } else {
            bot.sendMessage(chatId, `⚠️ Already marked: ${rollNumber} (at ${result.timestamp})`);
        }

    } catch (error) {
        if (error.message === 'No QR code found') {
            bot.sendMessage(chatId, "No QR code detected in the image.");
        } else {
            bot.sendMessage(chatId, "An error occurred while processing the image.");
            console.error(error);
        }
    } finally {
        // Always clean up the downloaded image file
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
});

bot.onText(/\/report/, (msg) => {
    const stats = getStats();
    const reply = `Total Present: ${stats.total}\n\nRoll Numbers:\n${stats.rollNumbers.join('\n')}`;
    bot.sendMessage(msg.chat.id, reply);
});

// BONUS: CSV Export
bot.onText(/\/export/, (msg) => {
    const store = getStore();
    const rows = Object.keys(store).map(roll => `${roll},${store[roll]}`);
    const csvContent = "RollNumber,Timestamp\n" + rows.join('\n');

    const tempFilePath = path.join(__dirname, 'attendance_export.csv');
    fs.writeFileSync(tempFilePath, csvContent);

    bot.sendDocument(msg.chat.id, tempFilePath).then(() => {
        fs.unlinkSync(tempFilePath); 
    });
});