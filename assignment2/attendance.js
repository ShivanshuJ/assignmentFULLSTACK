const fs = require('fs');
const FILE_PATH = 'attendance.json';

let store = {};

// Init store
try {
    if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        store = JSON.parse(data);
    }
} catch (error) {
    console.error("Error reading attendance.json. Starting fresh.", error);
    store = {};
}

function markPresent(rollNumber) {
    if (store[rollNumber]) {
        return { 
            success: false, 
            reason: 'already_marked', 
            timestamp: store[rollNumber] 
        };
    }

    const timestamp = new Date().toISOString();
    store[rollNumber] = timestamp;
    
    fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2));
    return { success: true };
}

function getStats() {
    const rollNumbers = Object.keys(store).sort();
    return {
        total: rollNumbers.length,
        rollNumbers: rollNumbers
    };
}

// Exporting store directly helps with the CSV bonus task
function getStore() {
    return store;
}

module.exports = { markPresent, getStats, getStore };