const express = require('express');
const multer = require('multer');
const path = require('path');
const { decodeQR } = require('./qr.js');
const { extractRollNumber, isRegistered } = require('./parser.js');
const { markPresent, getStats } = require('./attendance.js');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
// Serve static HTML frontend
app.use(express.static('public'));

// Endpoint to handle QR Image Uploads
app.post('/scan', upload.single('qrImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    try {
        const qrData = await decodeQR(req.file.path);
        const rollNumber = extractRollNumber(qrData);

        if (!rollNumber) {
            return res.json({ success: false, message: 'No valid roll number detected in QR.' });
        }

        if (!isRegistered(rollNumber)) {
            return res.json({ success: false, message: `Roll ${rollNumber} is outside the 2024 batch range.` });
        }

        const result = markPresent(rollNumber);
        if (result.success) {
            return res.json({ success: true, message: `Successfully marked Present: ${rollNumber}`, roll: rollNumber });
        } else {
            return res.json({ success: false, message: `Roll ${rollNumber} is already marked present.` });
        }
    } catch (error) {
        return res.json({ success: false, message: 'Failed to parse image or decode QR.' });
    }
});

// Endpoint to fetch current stats
app.get('/stats', (req, res) => {
    res.json(getStats());
});

app.listen(3000, () => console.log('Attendance web interface running on http://localhost:3000'));