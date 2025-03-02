document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Set up AdminGod loading animation
    const text = document.getElementById('adminGodText');
    const star = document.getElementById('star');
    const underline = document.getElementById('underline');
    const glow = document.getElementById('glow');
    const particles = document.getElementById('particles');
    const starTrail = document.getElementById('starTrail');
    
    // Trail effect variables
    let trailParticles = [];
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = `${Math.random() * 6 + 2}px`;
        particle.style.height = particle.style.width;
        particles.appendChild(particle);
    }

    // Animation timeline
    setTimeout(() => {
        // Fade in text
        text.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        text.style.opacity = '1';
        text.style.transform = 'scale(1)';
        
        // Start star animation
        setTimeout(() => {
            // Position star
            const textRect = text.getBoundingClientRect();
            star.style.opacity = '1';
            // Position star above the text
            star.style.left = `${textRect.left + textRect.width / 2}px`;
            star.style.top = `-50px`;
            
            // Rotate star
            star.querySelector('.star-inner').style.animation = 'rotateStar 0.8s linear infinite';
            
            // Trajectory variables
            let starPosY = -50;
            let starPosX = textRect.left + textRect.width / 2;
            const targetY = textRect.top + textRect.height / 2;
            const targetX = starPosX; // For vertical drop
            const moveSpeedY = 6; // Vertical speed
            const moveSpeedX = 0.5; // Small horizontal drift
            
            // Create trail particles
            const maxTrailParticles = 20;
            
            for (let i = 0; i < maxTrailParticles; i++) {
                const trailParticle = document.createElement('div');
                trailParticle.classList.add('trail-particle');
                starTrail.appendChild(trailParticle);
                trailParticles.push({
                    element: trailParticle,
                    opacity: 0,
                    size: Math.random() * 15 + 5,
                    x: 0,
                    y: 0
                });
            }
            
            // Move star towards text like a meteor
            const moveStarFrame = () => {
                starPosY += moveSpeedY;
                starPosX -= moveSpeedX;
                star.style.top = `${starPosY}px`;
                star.style.left = `${starPosX}px`;
                
                // Create trail effect
                for (let i = 0; i < trailParticles.length; i++) {
                    const particle = trailParticles[i];
                    if (particle.opacity <= 0) {
                        // Reuse particle at current star position
                        particle.x = starPosX;
                        particle.y = starPosY;
                        particle.opacity = 0.8 - (i * 0.03);
                        particle.element.style.width = `${particle.size}px`;
                        particle.element.style.height = `${particle.size}px`;
                        particle.element.style.left = `${particle.x}px`;
                        particle.element.style.top = `${particle.y}px`;
                        particle.element.style.opacity = particle.opacity;
                    } else {
                        // Fade out existing particles
                        particle.opacity -= 0.05;
                        particle.element.style.opacity = particle.opacity;
                    }
                }
                
                // Check for collision
                if (starPosY >= targetY) {
                    // Collision effects
                    starExplosion();
                    return;
                }
                
                requestAnimationFrame(moveStarFrame);
            };
            
            requestAnimationFrame(moveStarFrame);
        }, 1200);
        
    }, 500);
    
    // Star explosion and text glow effect
    function starExplosion() {
        // Hide star and trail
        star.style.opacity = '0';
        star.querySelector('.star-inner').style.animation = 'none';
        
        // Clear all trail particles
        trailParticles.forEach(particle => {
            particle.element.style.opacity = '0';
        });
        
        // Text glow effect
        text.style.textShadow = `
            0 0 10px #9900ff,
            0 0 20px #9900ff,
            0 0 30px #9900ff,
            0 0 40px #9900ff,
            0 0 70px #9900ff
        `;
        
        // Activate glow
        glow.style.opacity = '1';
        glow.style.animation = 'pulseGlow 1s ease-in-out infinite';
        
        // Animate particles
        const allParticles = document.querySelectorAll('.particle');
        const textRect = text.getBoundingClientRect();
        const centerX = textRect.left + textRect.width / 2;
        const centerY = textRect.top + textRect.height / 2;
        
        allParticles.forEach((particle, index) => {
            // Random position around text
            const angle = Math.random() * Math.PI * 2;
            const initialDistance = Math.random() * 20 + 10;
            const finalDistance = Math.random() * 150 + 100;
            const duration = Math.random() * 1500 + 1000;
            
            const startX = centerX + Math.cos(angle) * initialDistance;
            const startY = centerY + Math.sin(angle) * initialDistance;
            const endX = centerX + Math.cos(angle) * finalDistance;
            const endY = centerY + Math.sin(angle) * finalDistance;
            
            // Set initial position
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.opacity = '1';
            
            // Animate to final position
            setTimeout(() => {
                particle.style.transition = `left ${duration}ms ease-out, top ${duration}ms ease-out, opacity ${duration}ms ease-out`;
                particle.style.left = `${endX}px`;
                particle.style.top = `${endY}px`;
                particle.style.opacity = '0';
            }, 10);
        });
        
        // Show underline
        setTimeout(() => {
            const textWidth = text.offsetWidth;
            underline.style.transition = 'width 0.8s ease-in-out';
            underline.style.width = `${textWidth + 20}px`;
            
            // Final fade out
            setTimeout(() => {
                const elements = [text, underline, glow];
                elements.forEach(el => {
                    el.style.transition = 'opacity 1.5s ease-out';
                    el.style.opacity = '0';
                });
                
                // Complete the loading animation
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 1500);
            }, 2000);
        }, 400);
    }
});