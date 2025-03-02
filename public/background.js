document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('background-canvas').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas when window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Reinitialize particles on resize
        particlesArray.length = 0;
        init();
    });
    
    // Neural network visualization parameters
    const particlesArray = [];
    const numberOfParticles = Math.min(100, Math.max(50, Math.floor(window.innerWidth / 20))); // Adjust number of particles based on screen size
    const maxDistance = Math.min(150, Math.max(100, window.innerWidth / 10)); // Adjust max connection distance based on screen size
    
    // Neon purple colors
    const purpleColors = {
        bright: 'rgba(186, 85, 255, 0.9)', // Bright neon purple
        medium: 'rgba(157, 78, 221, 0.8)', // Medium neon purple
        glow: 'rgba(157, 78, 221, 0.4)', // Glow effect
        dark: 'rgba(93, 63, 211, 0.6)', // Darker purple
    };
    
    // Create particles
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1.5;
            this.speedX = (Math.random() - 0.5) * 0.7;
            this.speedY = (Math.random() - 0.5) * 0.7;
            this.brightness = Math.random() * 0.4 + 0.6; // Randomize brightness for varied effect
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            // Create glow effect for particles
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            
            gradient.addColorStop(0, purpleColors.bright);
            gradient.addColorStop(0.5, purpleColors.medium);
            gradient.addColorStop(1, 'rgba(157, 78, 221, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Add a bright center
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Draw connections between particles
    function connect() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - distance/maxDistance;
                    
                    // Create glowing line effect
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = purpleColors.medium;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    
                    // Add a subtle glow with wider line
                    ctx.globalAlpha = opacity * 0.5;
                    ctx.strokeStyle = purpleColors.glow;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    
                    ctx.globalAlpha = 1; // Reset global alpha
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connect();
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
});