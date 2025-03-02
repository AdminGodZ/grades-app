document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const subjectSelect = document.getElementById('subject');
    const gradeInput = document.getElementById('grade');
    const addButton = document.getElementById('add-grade');
    const gradesList = document.getElementById('grades-list');
    
    // Load grades when page loads
    loadGrades();
    
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
    
    // Function to load grades from API
    async function loadGrades() {
        try {
            const response = await fetch('/api/grades');
            const grades = await response.json();
            displayGrades(grades);
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
});