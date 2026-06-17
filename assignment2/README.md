# QR Code Attendance System (Assignment 2)

## Overview
This is a Telegram bot designed to automate attendance tracking using IITK ID card QR codes. Volunteers can send a photo of an ID card to the bot. The bot then decodes the QR, extracts the student's 6-digit roll number, verifies it falls within the 2024 batch registered range (240001–240400), and records their attendance in a local JSON store. It handles duplicates and provides an attendance summary via the `/report` command.

## Setup Instructions

1. **Install Dependencies:**
   Ensure you have Node.js installed, then run the following command in the project directory:
   ```bash
   npm install

2. **Environment Variables**
    Create a file named .env in the root of this project folder.
    Copy the contents of .env.example into .env and replace your_token_here with your actual Telegram Bot Token from BotFather.

    BOT_TOKEN=your_actual_telegram_bot_token


NOTE: This was supposed to be a Telegram Bot but due to the banning of telegram in india by the government, I made some changes and used the files i made for bot to make another web interface which could be used for the same.
Note that the program files are for bot too so in case telegram activates again, I can use them there.

- To use the web interface, make sure to have express and multer installed and then run the command   
   'node server.js'
   and it will give the web interface link of the local host (for now its on local host, i havent hosted it on a website)

- use that url on your browser and feel free to use the QR based attendance system.

