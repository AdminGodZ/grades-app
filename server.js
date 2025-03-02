const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const GRADES_FILE = path.join(DATA_DIR, 'grades.json');
const SUBJECTS_FILE = path.join(DATA_DIR, 'subjects.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure grades file exists
if (!fs.existsSync(GRADES_FILE)) {
    fs.writeFileSync(GRADES_FILE, JSON.stringify([]));
}

// Ensure subjects file exists with default subjects
if (!fs.existsSync(SUBJECTS_FILE)) {
    const defaultSubjects = [
        "Mathematics",
        "Science",
        "English",
        "History",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "Art",
        "Music",
        "Physical Education",
        "Foreign Language",
        "Economics",
        "Geography"
    ];
    fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(defaultSubjects, null, 2));
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API routes
// Get all grades
app.get('/api/grades', (req, res) => {
    try {
        const gradesData = fs.readFileSync(GRADES_FILE, 'utf8');
        const grades = JSON.parse(gradesData || '[]');
        res.json(grades);
    } catch (error) {
        console.error('Error reading grades:', error);
        res.status(500).json({ error: 'Failed to load grades' });
    }
});

// Add a new grade
app.post('/api/grades', (req, res) => {
    try {
        const { subject, grade } = req.body;
        
        if (!subject || !grade) {
            return res.status(400).json({ error: 'Subject and grade are required' });
        }
        
        // Validate grade (must be between 1 and 6)
        const gradeValue = parseFloat(grade);
        if (isNaN(gradeValue) || gradeValue < 1 || gradeValue > 6) {
            return res.status(400).json({ error: 'Grade must be between 1 and 6' });
        }
        
        const gradesData = fs.readFileSync(GRADES_FILE, 'utf8');
        const grades = JSON.parse(gradesData || '[]');
        
        const newGrade = {
            id: uuidv4(),
            subject,
            grade: gradeValue.toFixed(1), // Format to one decimal place
            date: new Date().toISOString()
        };
        
        grades.push(newGrade);
        fs.writeFileSync(GRADES_FILE, JSON.stringify(grades, null, 2));
        
        res.status(201).json(newGrade);
    } catch (error) {
        console.error('Error adding grade:', error);
        res.status(500).json({ error: 'Failed to add grade' });
    }
});

// Delete a grade
app.delete('/api/grades/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const gradesData = fs.readFileSync(GRADES_FILE, 'utf8');
        let grades = JSON.parse(gradesData || '[]');
        
        const initialLength = grades.length;
        grades = grades.filter(grade => grade.id !== id);
        
        if (grades.length === initialLength) {
            return res.status(404).json({ error: 'Grade not found' });
        }
        
        fs.writeFileSync(GRADES_FILE, JSON.stringify(grades, null, 2));
        
        res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
        console.error('Error deleting grade:', error);
        res.status(500).json({ error: 'Failed to delete grade' });
    }
});

// Get all subjects
app.get('/api/subjects', (req, res) => {
    try {
        const subjectsData = fs.readFileSync(SUBJECTS_FILE, 'utf8');
        const subjects = JSON.parse(subjectsData || '[]');
        res.json(subjects);
    } catch (error) {
        console.error('Error reading subjects:', error);
        res.status(500).json({ error: 'Failed to load subjects' });
    }
});

// Add a new subject
app.post('/api/subjects', (req, res) => {
    try {
        const { subject } = req.body;
        
        if (!subject) {
            return res.status(400).json({ error: 'Subject name is required' });
        }
        
        const subjectsData = fs.readFileSync(SUBJECTS_FILE, 'utf8');
        const subjects = JSON.parse(subjectsData || '[]');
        
        // Check if subject already exists
        if (subjects.includes(subject)) {
            return res.status(400).json({ error: 'Subject already exists' });
        }
        
        subjects.push(subject);
        fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(subjects, null, 2));
        
        res.status(201).json({ message: 'Subject added successfully', subjects });
    } catch (error) {
        console.error('Error adding subject:', error);
        res.status(500).json({ error: 'Failed to add subject' });
    }
});

// Delete a subject
app.delete('/api/subjects/:subject', (req, res) => {
    try {
        const subjectToDelete = req.params.subject;
        
        const subjectsData = fs.readFileSync(SUBJECTS_FILE, 'utf8');
        let subjects = JSON.parse(subjectsData || '[]');
        
        // Check if the subject is in use
        const gradesData = fs.readFileSync(GRADES_FILE, 'utf8');
        const grades = JSON.parse(gradesData || '[]');
        
        const isSubjectInUse = grades.some(grade => grade.subject === subjectToDelete);
        
        if (isSubjectInUse) {
            return res.status(400).json({ error: 'Cannot delete subject that is in use' });
        }
        
        // Remove the subject
        const initialLength = subjects.length;
        subjects = subjects.filter(subject => subject !== subjectToDelete);
        
        if (subjects.length === initialLength) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        
        fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(subjects, null, 2));
        
        res.json({ message: 'Subject deleted successfully', subjects });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ error: 'Failed to delete subject' });
    }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});