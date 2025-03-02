document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const subjectSelect = document.getElementById('subject');
    const gradeInput = document.getElementById('grade');
    const addButton = document.getElementById('add-grade');
    const gradesList = document.getElementById('grades-list');
    const newSubjectInput = document.getElementById('new-subject');
    const addSubjectButton = document.getElementById('add-subject');
    const subjectsList = document.getElementById('subjects-list');
    
    // Chart variables
    let gradeChart = null;
    
    // Load grades and subjects when page loads
    loadGrades();
    loadSubjects();
    
    // Add grade event listener
    addButton.addEventListener('click', () => {
        const subject = subjectSelect.value.trim();
        const grade = gradeInput.value.trim();
        
        if (!subject) {
            alert('Please select a subject');
            return;
        }
        
        if (!grade) {
            alert('Please enter a grade');
            return;
        }
        
        const gradeValue = parseFloat(grade);
        if (isNaN(gradeValue) || gradeValue < 1 || gradeValue > 6) {
            alert('Please enter a valid grade between 1 and 6');
            return;
        }
        
        addGrade(subject, grade);
        subjectSelect.value = '';
        gradeInput.value = '';
    });
    
    // Add subject event listener
    addSubjectButton.addEventListener('click', () => {
        const subject = newSubjectInput.value.trim();
        
        if (!subject) {
            alert('Please enter a subject name');
            return;
        }
        
        addSubject(subject);
        newSubjectInput.value = '';
    });
    
    // Function to load grades from API
    async function loadGrades() {
        try {
            const response = await fetch('/api/grades');
            const grades = await response.json();
            displayGrades(grades);
            
            // Update the chart if grades exist
            if (grades.length > 0) {
                createGradeChart(grades);
                document.getElementById('no-data-message').style.display = 'none';
                document.getElementById('grade-chart').style.display = 'block';
            } else {
                document.getElementById('no-data-message').style.display = 'block';
                document.getElementById('grade-chart').style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading grades:', error);
            gradesList.innerHTML = '<p class="empty-message">Failed to load grades. Please try again.</p>';
        }
    }
    
    // Function to add a new grade
    async function addGrade(subject, grade) {
        try {
            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subject, grade })
            });
            
            if (response.ok) {
                loadGrades(); // Reload the grades list
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add grade');
            }
        } catch (error) {
            console.error('Error adding grade:', error);
            alert('Failed to add grade. Please try again.');
        }
    }
    
    // Function to delete a grade
    async function deleteGrade(id) {
        try {
            const response = await fetch(`/api/grades/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadGrades(); // Reload the grades list
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete grade');
            }
        } catch (error) {
            console.error('Error deleting grade:', error);
            alert('Failed to delete grade. Please try again.');
        }
    }
    
    // Function to display grades in the UI
    function displayGrades(grades) {
        gradesList.innerHTML = '';
        
        if (grades.length === 0) {
            gradesList.innerHTML = '<p class="empty-message">No grades added yet.</p>';
            return;
        }
        
        // Sort grades by date (newest first)
        grades.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        grades.forEach(grade => {
            const gradeItem = document.createElement('div');
            gradeItem.className = 'grade-item';
            
            // Add a class based on grade value for color coding
            const gradeValue = parseFloat(grade.grade);
            let gradeClass = '';
            
            if (gradeValue >= 5.5) gradeClass = 'grade-excellent';
            else if (gradeValue >= 4.5) gradeClass = 'grade-good';
            else if (gradeValue >= 4) gradeClass = 'grade-satisfactory';
            else gradeClass = 'grade-failing';
            
            // Format date for display
            const gradeDate = new Date(grade.date);
            const formattedDate = gradeDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            gradeItem.innerHTML = `
                <div class="grade-info">
                    <div><strong>${grade.subject}</strong>: <span class="${gradeClass}">${grade.grade}</span></div>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.25rem;">${formattedDate}</div>
                </div>
                <button class="delete-btn" data-id="${grade.id}">Delete</button>
            `;
            
            gradesList.appendChild(gradeItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteGrade(id);
            });
        });
    }
    
    // Load subjects from API
    async function loadSubjects() {
        try {
            const response = await fetch('/api/subjects');
            const subjects = await response.json();
            
            // Populate the subject dropdown
            subjectSelect.innerHTML = '<option value="">Select a subject</option>';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
            
            // Display subjects in the management section
            displaySubjects(subjects);
        } catch (error) {
            console.error('Error loading subjects:', error);
            alert('Failed to load subjects. Please try again.');
        }
    }
    
    // Add a new subject
    async function addSubject(subject) {
        try {
            const response = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subject })
            });
            
            if (response.ok) {
                loadSubjects(); // Reload the subjects list
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add subject');
            }
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('Failed to add subject. Please try again.');
        }
    }
    
    // Delete a subject
    async function deleteSubject(subject) {
        try {
            const response = await fetch(`/api/subjects/${encodeURIComponent(subject)}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadSubjects(); // Reload the subjects list
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete subject');
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            alert('Failed to delete subject. Please try again.');
        }
    }
    
    // Display subjects in the management section
    function displaySubjects(subjects) {
        subjectsList.innerHTML = '';
        
        if (subjects.length === 0) {
            subjectsList.innerHTML = '<p class="empty-message">No subjects added yet.</p>';
            return;
        }
        
        // Sort subjects alphabetically
        subjects.sort();
        
        subjects.forEach(subject => {
            const subjectItem = document.createElement('div');
            subjectItem.className = 'subject-item';
            
            subjectItem.innerHTML = `
                <div class="subject-info">${subject}</div>
                <button class="delete-subject-btn" data-subject="${subject}">Delete</button>
            `;
            
            subjectsList.appendChild(subjectItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-subject-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const subject = e.target.getAttribute('data-subject');
                deleteSubject(subject);
            });
        });
    }
    
    // Function to create a chart for grade trends - Updated to show sequential grades
    function createGradeChart(grades) {
        // Get the canvas element
        const ctx = document.getElementById('grade-chart').getContext('2d');
        
        // Group grades by subject
        const subjectsMap = new Map();
        
        // Convert date strings to Date objects and organize by subject
        grades.forEach(grade => {
            const subject = grade.subject;
            const gradeValue = parseFloat(grade.grade);
            const date = new Date(grade.date);
            
            if (!subjectsMap.has(subject)) {
                subjectsMap.set(subject, []);
            }
            
            subjectsMap.get(subject).push({
                date: date,
                grade: gradeValue
            });
        });
        
        // Sort each subject's grades by date (oldest first)
        subjectsMap.forEach((grades, subject) => {
            grades.sort((a, b) => a.date - b.date);
        });
        
        // Find the maximum number of grades for any subject (for x-axis scaling)
        let maxGradeCount = 0;
        subjectsMap.forEach((grades) => {
            maxGradeCount = Math.max(maxGradeCount, grades.length);
        });
        
        // Create labels for x-axis (1, 2, 3, etc.)
        const xLabels = Array.from({length: maxGradeCount}, (_, i) => `Grade ${i+1}`);
        
        // Prepare datasets for chart
        const datasets = [];
        const colors = [
            { border: 'rgba(186, 85, 255, 1)', background: 'rgba(186, 85, 255, 0.2)' },
            { border: 'rgba(64, 224, 208, 1)', background: 'rgba(64, 224, 208, 0.2)' },
            { border: 'rgba(255, 105, 180, 1)', background: 'rgba(255, 105, 180, 0.2)' },
            { border: 'rgba(50, 205, 50, 1)', background: 'rgba(50, 205, 50, 0.2)' },
            { border: 'rgba(255, 215, 0, 1)', background: 'rgba(255, 215, 0, 0.2)' },
            { border: 'rgba(30, 144, 255, 1)', background: 'rgba(30, 144, 255, 0.2)' }
        ];
        
        let colorIndex = 0;
        
        subjectsMap.forEach((grades, subject) => {
            // Use cycling colors
            const color = colors[colorIndex % colors.length];
            colorIndex++;
            
            datasets.push({
                label: subject,
                data: grades.map(g => g.grade),
                borderColor: color.border,
                backgroundColor: color.background,
                tension: 0.4,
                pointBackgroundColor: color.border,
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            });
        });
        
        // If we already have a chart, destroy it
        if (gradeChart) {
            gradeChart.destroy();
        }
        
        // Create chart
        gradeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 6,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(186, 85, 255, 0.5)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                const index = context[0].dataIndex;
                                return `Grade ${index + 1}`;
                            },
                            label: function(context) {
                                const subject = context.dataset.label;
                                const value = context.parsed.y;
                                return `${subject}: ${value}`;
                            },
                            afterLabel: function(context) {
                                const dataset = context.dataset;
                                const currentValue = context.parsed.y;
                                const dataIndex = context.dataIndex;
                                
                                // If this is not the first grade, calculate improvement
                                if (dataIndex > 0) {
                                    const previousValue = dataset.data[dataIndex - 1];
                                    const difference = (currentValue - previousValue).toFixed(1);
                                    const sign = difference > 0 ? '+' : '';
                                    return `Change: ${sign}${difference}`;
                                }
                                return '';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
});