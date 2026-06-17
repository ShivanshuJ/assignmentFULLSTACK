// Documentation: The IITK ID card QR string typically contains a block of text with various student details. We need to isolate the 6-digit roll number.

// Raw QR data = 02.240071,1,MEQCICG10wcjQAauQ4N+sziBum0ssHnAwQ8+fL2Z+oU8KjJXAiBE1RB2XAaAp61WokAo0R+GNTfSO8uoCt5Bby6lDZ19IA==.iitkidcard

function extractRollNumber(qrString) {
    // Match all distinct 6-digit sequences
    const matches = qrString.match(/\b\d{6}\b/g);
    if (!matches) return null;

    // Find the first one that falls in the valid range
    const validRoll = matches.find(num => {
        const roll = Number(num);
        return roll >= 240001 && roll <= 240400;
    });

    return validRoll || null;
}

function isRegistered(rollNumber) {
    const roll = Number(rollNumber);
    return roll >= 240001 && roll <= 240400;
}

module.exports = { extractRollNumber, isRegistered };