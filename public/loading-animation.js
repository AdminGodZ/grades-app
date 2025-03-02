document.addEventListener('DOMContentLoaded', () => {
    const loaderContainer = document.getElementById('loaderContainer');
    const loadingScreen = document.getElementById('loading-screen');
    const progressRing = document.getElementById('progressRing');
    const loaderText = document.getElementById('loaderText');
    const circles = document.querySelectorAll('.circle');
    const mainCircles = document.querySelectorAll('.circle-container > .circle');
    const innerCircles = document.querySelectorAll('.circle-inner');
    const outerCircles = document.querySelectorAll('.circle-outer');
    const dotTrailsContainer = document.getElementById('dotTrailsContainer');
    
    // Animation timeline
    const animationDuration = 6000; // 6 seconds
    let timeElapsed = 0;
    let animationInterval;
    
    // Start the animation
    startAnimation();
    
    // Animation functions
    function startAnimation() {
        timeElapsed = 0;
        
        // Reset animation states
        progressRing.style.strokeDashoffset = '251.2';
        loaderText.style.opacity = '0';
        loaderText.style.transform = 'translateY(20px)';
        
        // Fade in the container
        loaderContainer.style.animation = 'fadeIn 0.8s ease-in forwards';
        
        // Show loader text after a delay
        setTimeout(() => {
            loaderText.style.opacity = '1';
            loaderText.style.transform = 'translateY(0)';
        }, 800);
        
        // Animate main circle dots sequentially
        mainCircles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.transition = 'opacity 0.4s ease-in-out';
                circle.style.opacity = '1';
            }, 1000 + (index * 100));
        });
        
        // Animate inner circle dots with a different sequence
        innerCircles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.transition = 'opacity 0.4s ease-in-out';
                circle.style.opacity = '0.8';
            }, 1400 + (index * 80));
        });
        
        // Animate outer circle dots with a wave effect
        outerCircles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.transition = 'opacity 0.4s ease-in-out';
                circle.style.opacity = '0.6';
            }, 1600 + (index * 60));
        });
        
        // Animate progress ring
        setTimeout(() => {
            animateProgressRing();
        }, 1800);
        
        // End animation sequence
        setTimeout(() => {
            endAnimation();
        }, animationDuration);
    }
    
    function animateProgressRing() {
        const circumference = 2 * Math.PI * 40;
        let progress = 0;
        const totalSteps = 100;
        const stepDuration = (animationDuration - 2000) / totalSteps;
        
        animationInterval = setInterval(() => {
            progress += 1;
            timeElapsed += stepDuration;
            
            const dashoffset = circumference - (progress / 100) * circumference;
            progressRing.style.strokeDashoffset = dashoffset;
            
            if (progress >= 100) {
                clearInterval(animationInterval);
            }
        }, stepDuration);
    }
    
    function endAnimation() {
        // Hide outer dots first
        outerCircles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.opacity = '0';
            }, index * 40);
        });
        
        // Then hide inner dots
        setTimeout(() => {
            innerCircles.forEach((circle, index) => {
                setTimeout(() => {
                    circle.style.opacity = '0';
                }, index * 50);
            });
        }, 300);
        
        // Finally hide main dots in reverse order
        setTimeout(() => {
            mainCircles.forEach((circle, index) => {
                setTimeout(() => {
                    circle.style.opacity = '0';
                }, (mainCircles.length - index) * 60);
            });
        }, 600);
        
        // Hide text
        setTimeout(() => {
            loaderText.style.opacity = '0';
            loaderText.style.transform = 'translateY(20px)';
        }, 300);
        
        // Fade out the container
        setTimeout(() => {
            loaderContainer.style.animation = 'fadeOut 0.8s ease-out forwards';
            
            // Hide the loading screen completely
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 800);
        }, 1200);
    }
    
    // Add subtle dot trail effect for main circle dots
    function createDotTrails() {
        mainCircles.forEach((dot, index) => {
            if (index % 2 === 0) { // Only for alternating dots
                const trailCount = 3;
                for (let i = 0; i < trailCount; i++) {
                    const trail = document.createElement('div');
                    trail.classList.add('dot-trail');
                    dotTrailsContainer.appendChild(trail);
                    
                    // Position trail relative to its parent dot
                    const dotRect = dot.getBoundingClientRect();
                    const containerRect = loaderContainer.getBoundingClientRect();
                    
                    const relX = dotRect.left - containerRect.left + dot.offsetWidth / 2;
                    const relY = dotRect.top - containerRect.top + dot.offsetHeight / 2;
                    
                    trail.style.left = `${relX}px`;
                    trail.style.top = `${relY}px`;
                    trail.style.opacity = 0.7 - (i * 0.2);
                    
                    // Clean up trails after animation
                    setTimeout(() => {
                        trail.remove();
                    }, 300);
                }
            }
        });
    }
    
    // Periodically create trail effects when animation is running
    setInterval(() => {
        if (timeElapsed > 0 && timeElapsed < animationDuration) {
            createDotTrails();
        }
    }, 400);
});