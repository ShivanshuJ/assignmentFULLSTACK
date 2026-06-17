# QR Code Attendance System

This project is an automated attendance tracking system designed for IITK student ID cards. It extracts a 6-digit roll number from a QR code image, verifies that the student is within the registered batch range (240001–240400), and records their attendance.

It includes two interfaces:
1. **Web Dashboard:** A local browser-based interface to upload and scan images.
2. **Telegram Bot:** A bot interface for remote scanning (if Telegram is accessible, since its Banned by Indian Govt. as of now).

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* Git (optional, for cloning the repository)

## Installation & Setup

**1. Get the files**
Download the ZIP file and extract it, or clone the repository:
```bash
git clone https://github.com/ShivanshuJ/assignmentFULLSTACK.git
cd assignment2
```

**2. Install Dependencies**
Because the `node_modules` folder is not included in the repository, you must install the required packages (`express`, `multer`, `jimp`, `jsqr`, `dotenv`, `node-telegram-bot-api`). Run this command in your terminal:
```bash
npm install
```

**3. Set up Environment Variables**
The project requires a `.env` file to store sensitive data like API tokens.
* Locate the file named `.env.example`.
* Duplicate it and rename the copy to exactly `.env`.
* Open `.env` and add your Telegram Bot Token (if you intend to use the bot version):
```env
BOT_TOKEN=your_actual_token_here
```

## How to Run the Application

### Option A: Run the Web Dashboard
Use this method if you want a simple local interface to upload images.
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your web browser and go to: `http://localhost:3000`
3. Use the form to upload a photo of a QR code.

### Option B: Run the Telegram Bot
Use this method if you have set up your `.env` file and have access to Telegram.
1. Start the bot:
   ```bash
   node bot.js
   ```
2. Open Telegram, find your bot, and send the `/start` command.
3. Send a photo of the ID card to the bot.
4. Send `/report` to get current attendance stats, or `/export` to download a CSV file.

## Data Storage
Attendance data is saved locally in an `attendance.json` file. This file is created automatically the first time a valid roll number is marked present.
