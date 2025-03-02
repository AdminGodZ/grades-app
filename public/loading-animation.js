document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingAnimation = document.getElementById('loading-animation');
    
    // SVG for an evil transformer-like face that builds itself
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff0000"/>
                <stop offset="100%" stop-color="#ff7700"/>
            </linearGradient>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#333333"/>
                <stop offset="50%" stop-color="#666666"/>
                <stop offset="100%" stop-color="#222222"/>
            </linearGradient>
        </defs>
        
        <!-- Face base -->
        <path class="face-part" d="M100,20 L60,50 L60,150 L100,180 L140,150 L140,50 Z" fill="url(#metalGradient)" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0s" fill="freeze"/>
        </path>
        
        <!-- Left eye socket -->
        <path class="face-part" d="M70,70 L90,60 L90,80 L70,90 Z" fill="#111111" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.5s" fill="freeze"/>
        </path>
        
        <!-- Right eye socket -->
        <path class="face-part" d="M130,70 L110,60 L110,80 L130,90 Z" fill="#111111" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.5s" fill="freeze"/>
        </path>
        
        <!-- Left eye -->
        <circle class="face-part" cx="80" cy="75" r="6" fill="url(#eyeGlow)" filter="url(#glow)" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.9s" fill="freeze"/>
            <animate attributeName="r" from="0" to="6" dur="0.3s" begin="0.9s" fill="freeze"/>
        </circle>
        
        <!-- Right eye -->
        <circle class="face-part" cx="120" cy="75" r="6" fill="url(#eyeGlow)" filter="url(#glow)" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.9s" fill="freeze"/>
            <animate attributeName="r" from="0" to="6" dur="0.3s" begin="0.9s" fill="freeze"/>
        </circle>
        
        <!-- Mouth parts - evil grin -->
        <path class="face-part" d="M80,120 L90,110 L110,110 L120,120 L110,130 L90,130 Z" fill="#111111" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="1.2s" fill="freeze"/>
        </path>
        
        <!-- Teeth -->
        <path class="face-part" d="M85,120 L88,115 L92,115 L95,120 L92,125 L88,125 Z" fill="#999999" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.7s" fill="freeze"/>
        </path>
        <path class="face-part" d="M105,120 L108,115 L112,115 L115,120 L112,125 L108,125 Z" fill="#999999" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.7s" fill="freeze"/>
        </path>
        
        <!-- Helmet details -->
        <path class="face-part" d="M60,50 L40,60 L60,70" stroke="#8a2be2" stroke-width="2" fill="none" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="2s" fill="freeze"/>
        </path>
        <path class="face-part" d="M140,50 L160,60 L140,70" stroke="#8a2be2" stroke-width="2" fill="none" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="2s" fill="freeze"/>
        </path>
        
        <!-- Final glowing effect -->
        <path class="face-part" d="M100,20 L60,50 L60,150 L100,180 L140,150 L140,50 Z" stroke="#8a2be2" stroke-width="2" fill="none" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="2.4s" fill="freeze"/>
            <animate attributeName="stroke-width" from="0" to="3" dur="0.5s" begin="2.4s" fill="freeze"/>
        </path>
        
        <!-- Evil laugh text -->
        <text x="100" y="160" text-anchor="middle" fill="#8a2be2" font-family="Arial" font-weight="bold" font-size="12" opacity="0">
            ANALYZING YOUR GRADES
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="2.9s" fill="freeze"/>
        </text>
    </svg>
    `;
    
    // Set the SVG content
    loadingAnimation.innerHTML = svg;
    
    // Hide loading screen after 4 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 4000);
});