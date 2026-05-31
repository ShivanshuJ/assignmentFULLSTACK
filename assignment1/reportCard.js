const fs = require('fs');

// --- P1: Student Class ---
class Student {
    // P1a: Constructor
    constructor(name, stringScores) {
        this.name = name;
        this.scores = stringScores.map(score => Number(score)); 
    }

    // P1b: get average
    get average() {
        if (this.scores.length === 0) return 0;
        let sum = 0;
        for (let i = 0; i < this.scores.length; i++) {
            sum += this.scores[i];
        }
        return sum / this.scores.length;
    }

    // P1c: get letterGrade
    get letterGrade() {
        const avg = this.average;
        if (avg >= 90) return 'A';
        else if (avg >= 80) return 'B';
        else if (avg >= 70) return 'C';
        else if (avg >= 60) return 'D';
        else return 'F';
    }

    // P1d: summary() without Math.max/min
    summary() {
        if (this.scores.length === 0) return { highest: 0, lowest: 0 };
        
        let highest = this.scores[0];
        let lowest = this.scores[0];

        for (let i = 1; i < this.scores.length; i++) {
            if (this.scores[i] > highest) highest = this.scores[i];
            if (this.scores[i] < lowest) lowest = this.scores[i];
        }
        return { highest, lowest };
    }

    // P3b: Switch-based getRemark function
    getRemark(grade) {
        switch (grade) {
            case 'A': return 'Excellent work!';
            case 'B': return 'Good job!';
            case 'C': return 'Fair performance.';
            case 'D': return 'Needs improvement.';
            case 'F': return 'Failing. Please study more.';
            default: return 'Unknown grade.';
        }
    }

    // P3: Formatted Output
    generateReport() {

        const avg = this.average;
        const grade = this.letterGrade;
        const stats = this.summary();
        
        // P3b: Pass/fail ternary operator (>= 60)
        const status = avg >= 60 ? 'PASS' : 'FAIL';
        const remark = this.getRemark(grade);

        // P3c: Score breakdown (Destructuring and rest syntax)
        const [score1, score2, ...remaining] = this.scores;

        // P3a: Template literals ONLY (no string concatenation with +)
        console.log(`=================================`);
        console.log(` Student:   ${this.name}`);
        console.log(` Status:    ${status}`);
        console.log(` Breakdown: 1st: ${score1}, 2nd: ${score2}, Rest: [${remaining.join(', ')}]`);
        console.log(` Highest:   ${stats.highest}`);
        console.log(` Lowest:    ${stats.lowest}`);
        // P3a: Average formatted to 1 decimal
        console.log(` Average:   ${avg.toFixed(1)}`);
        console.log(` Grade:     ${grade} - ${remark}`);
        console.log(`=================================\n`);
    }
}

// --- P2 & BONUS: Execution Logic ---
const args = process.argv.slice(2);

// If the argument ends with '.json', run the Bonus logic
if (args.length === 1 && args[0].endsWith('.json')) {
    
    // BONUS: Read JSON via fs.readFileSync
    const filename = args[0];
    try {
        const rawData = fs.readFileSync(filename, 'utf-8');
        const studentsData = JSON.parse(rawData);
        
        let topPerformer = null;
        let highestAvg = -1;

        console.log(`\n    MULTI-STUDENT REPORT SYSTEM    \n`);

        studentsData.forEach(data => {
            // Enforcing P2b validation even inside the JSON loop
            if (data.scores.length < 3) {
                console.error(`Error: Student ${data.name} has less than 3 scores.`);
                process.exit(1);
            }

            const student = new Student(data.name, data.scores);
            student.generateReport();

            // BONUS: Identify the top performer
            if (student.average > highestAvg) {
                highestAvg = student.average;
                topPerformer = student.name;
            }
        });

        console.log(`🏆 TOP PERFORMER: ${topPerformer} with an average of ${highestAvg.toFixed(1)}! 🏆\n`);

    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
    }

} else {
    // P2 MODE: Standard CLI Input
    
    // P2b: Validate (1 name + at least 3 scores = min 4 arguments)
    if (args.length < 4) {
        console.error("Error: You must provide a name and at least 3 scores.");
        process.exit(1);
    }

    // P2a: Parse argv
    const studentName = args[0];
    const examScores = args.slice(1);

    const studentRecord = new Student(studentName, examScores);
    studentRecord.generateReport();
}