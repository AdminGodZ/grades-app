document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loaderContainer = document.getElementById('loaderContainer');
    const loadingScreen = document.getElementById('loading-screen');
    const canvasContainer = document.getElementById('canvas-container');
    const progressRing = document.getElementById('progressRing');
    const loaderText = document.getElementById('loaderText');
    
    // Animation parameters
    const animationDuration = 7000; // 7 seconds 
    let animationProgress = 0;
    let animationInterval;
    let isAnimationRunning = false;
    const shapeDelay = 400; // 0.4 seconds between shapes
    
    // Three.js variables
    let scene, camera, renderer;
    let tetrahedron, cube, octahedron, dodecahedron, icosahedron;
    let solids = [];
    
    // Initialize Three.js scene
    function initThreeJS() {
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 600;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(450, 450);
        renderer.setClearColor(0x000000, 0);
        canvasContainer.appendChild(renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0x6a0dad, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xc496ff, 1);
        pointLight.position.set(100, 100, 100);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0x8a2be2, 1);
        pointLight2.position.set(-100, -100, 100);
        scene.add(pointLight2);
        
        // Create platonic solids
        createPlatonicSolids();
        
        // Add them to the scene in nested order
        nestPlatonicSolids();
        
        // Start animation loop
        animate();
    }
    
    function createPlatonicSolids() {
        // Materials with different purple hues
        const materials = [
            new THREE.MeshPhongMaterial({
                color: 0x6a0dad,
                transparent: true,
                opacity: 0,
                wireframe: true,
                emissive: 0x6a0dad,
                emissiveIntensity: 0.2,
                shininess: 80
            }),
            new THREE.MeshPhongMaterial({
                color: 0x8a2be2,
                transparent: true,
                opacity: 0,
                wireframe: true,
                emissive: 0x8a2be2,
                emissiveIntensity: 0.3,
                shininess: 80
            }),
            new THREE.MeshPhongMaterial({
                color: 0x9370db,
                transparent: true,
                opacity: 0,
                wireframe: true,
                emissive: 0x9370db,
                emissiveIntensity: 0.3,
                shininess: 80
            }),
            new THREE.MeshPhongMaterial({
                color: 0xa865c9,
                transparent: true,
                opacity: 0,
                wireframe: true,
                emissive: 0xa865c9,
                emissiveIntensity: 0.4,
                shininess: 80
            }),
            new THREE.MeshPhongMaterial({
                color: 0xc496ff,
                transparent: true,
                opacity: 0,
                wireframe: true,
                emissive: 0xc496ff,
                emissiveIntensity: 0.5,
                shininess: 80
            })
        ];
        
        // Create geometries
        const tetraGeo = new THREE.TetrahedronGeometry(45);
        const cubeGeo = new THREE.BoxGeometry(75, 75, 75);
        const octaGeo = new THREE.OctahedronGeometry(105);
        const dodecaGeo = new THREE.DodecahedronGeometry(135);
        const icosaGeo = new THREE.IcosahedronGeometry(180);
        
        // Create meshes
        tetrahedron = new THREE.Mesh(tetraGeo, materials[0]);
        cube = new THREE.Mesh(cubeGeo, materials[1]);
        octahedron = new THREE.Mesh(octaGeo, materials[2]);
        dodecahedron = new THREE.Mesh(dodecaGeo, materials[3]);
        icosahedron = new THREE.Mesh(icosaGeo, materials[4]);
        
        // Set initial scale to 0
        tetrahedron.scale.set(0, 0, 0);
        cube.scale.set(0, 0, 0);
        octahedron.scale.set(0, 0, 0);
        dodecahedron.scale.set(0, 0, 0);
        icosahedron.scale.set(0, 0, 0);
        
        // Store in array for easy access (inside to outside order)
        solids = [tetrahedron, cube, octahedron, dodecahedron, icosahedron];
    }
    
    function nestPlatonicSolids() {
        // Add all solids to the scene
        solids.forEach(solid => {
            scene.add(solid);
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (isAnimationRunning) {
            // Rotate solids in alternating directions
            tetrahedron.rotation.x += 0.01;
            tetrahedron.rotation.y += 0.01;
            
            cube.rotation.x -= 0.007;
            cube.rotation.y -= 0.007;
            
            octahedron.rotation.x += 0.005;
            octahedron.rotation.z += 0.005;
            
            dodecahedron.rotation.y -= 0.003;
            dodecahedron.rotation.z -= 0.003;
            
            icosahedron.rotation.x -= 0.002;
            icosahedron.rotation.y -= 0.002;
        }
        
        renderer.render(scene, camera);
    }
    
    // Function to display "Grades Tracker" text with animation
    function showAppText() {
        // Transition from "Loading" to "Grades Tracker"
        loaderText.style.opacity = '0';
        loaderText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            loaderText.textContent = 'Grades Tracker';
            loaderText.classList.add('grades-text');
            loaderText.style.opacity = '1';
            loaderText.style.transform = 'translateY(0)';
            
            // Add letter-by-letter shimmer effect
            addLetterShimmer();
        }, 400);
    }
    
    function addLetterShimmer() {
        // Get the current text
        const text = loaderText.textContent;
        loaderText.textContent = '';
        
        // Create spans for each letter
        for (let i = 0; i < text.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = text[i];
            letterSpan.style.display = 'inline-block';
            letterSpan.style.animation = `textShimmer 2s infinite alternate-reverse`;
            letterSpan.style.animationDelay = `${i * 0.1}s`; // Staggered animation
            loaderText.appendChild(letterSpan);
        }
    }
    
    // Start the animation
    function startAnimation() {
        animationProgress = 0;
        isAnimationRunning = true;
        
        // Reset animation states
        progressRing.style.strokeDashoffset = '376.8';
        loaderText.style.opacity = '0';
        loaderText.style.transform = 'translateY(20px)';
        
        // Reset all solids opacities
        solids.forEach(solid => {
            solid.material.opacity = 0;
            solid.scale.set(0, 0, 0);
        });
        
        // Fade in the container
        loaderContainer.style.animation = 'fadeIn 0.8s ease-in forwards';
        
        // Show loader text after a delay
        setTimeout(() => {
            loaderText.style.opacity = '1';
            loaderText.style.transform = 'translateY(0)';
        }, 800);
        
        // Grow and fade in each solid sequentially from inside to outside
        solids.forEach((solid, index) => {
            setTimeout(() => {
                // Animate scale and opacity from 0 to 1 over 400ms
                let startTime = Date.now();
                let targetOpacity = 0.8 - (index * 0.1); // Decreasing opacity for inner solids
                
                function growAndFadeIn() {
                    let elapsed = Date.now() - startTime;
                    let progress = Math.min(elapsed / 400, 1);
                    
                    // Cubic easing in-out for smoother growth
                    let easedProgress = progress < 0.5 ? 
                        4 * progress * progress * progress : 
                        1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
                    solid.scale.set(
                        easedProgress, 
                        easedProgress, 
                        easedProgress
                    );
                    solid.material.opacity = progress * targetOpacity;
                    
                    if (progress < 1) {
                        requestAnimationFrame(growAndFadeIn);
                    }
                }
                
                growAndFadeIn();
            }, 1000 + (index * shapeDelay)); // 0.4s between each shape
        });
        
        // Animate progress ring
        setTimeout(() => {
            animateProgressRing();
        }, 1800);
        
        // Show "Grades Tracker" text after loading completes
        setTimeout(() => {
            showAppText();
        }, animationDuration - 2200); // Show earlier relative to total duration
        
        // End animation sequence
        setTimeout(() => {
            endAnimation();
        }, animationDuration + 1000);
    }
    
    function animateProgressRing() {
        const circumference = 2 * Math.PI * 60;
        let progress = 0;
        const totalSteps = 100;
        const stepDuration = (animationDuration - 2000) / totalSteps;
        
        animationInterval = setInterval(() => {
            progress += 1;
            
            const dashoffset = circumference - (progress / 100) * circumference;
            progressRing.style.strokeDashoffset = dashoffset;
            
            if (progress >= 100) {
                clearInterval(animationInterval);
            }
        }, stepDuration);
    }
    
    function endAnimation() {
        // Fade out solids from outside to inside
        const reversedSolids = [...solids].reverse(); // Outermost to innermost
        
        // Hide text
        setTimeout(() => {
            loaderText.style.opacity = '0';
            loaderText.style.transform = 'translateY(20px)';
        }, 300);
        
        reversedSolids.forEach((solid, index) => {
            setTimeout(() => {
                // Animate scale and opacity to 0 over 400ms
                let startTime = Date.now();
                let startOpacity = solid.material.opacity;
                let startScale = solid.scale.x; // Assuming uniform scale
                
                function shrinkAndFadeOut() {
                    let elapsed = Date.now() - startTime;
                    let progress = Math.min(elapsed / 400, 1);
                    
                    // Better easing function for smoother animation
                    // Using cubic easing out for smoother finish
                    let easedProgress = 1 - Math.pow(1 - progress, 3);
                    
                    let scaleValue = startScale * (1 - easedProgress);
                    solid.scale.set(
                        scaleValue,
                        scaleValue,
                        scaleValue
                    );
                    solid.material.opacity = startOpacity * (1 - easedProgress);
                    
                    if (progress < 1) {
                        requestAnimationFrame(shrinkAndFadeOut);
                    }
                }
                
                shrinkAndFadeOut();
            }, index * shapeDelay); // 0.4s between each shape
        });
        
        // Fade out the container
        setTimeout(() => {
            loaderContainer.style.animation = 'fadeOut 0.8s ease-out forwards';
            isAnimationRunning = false;
            
            // Hide the loading screen completely
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    
                    // Properly dispose of Three.js resources
                    if (renderer) {
                        renderer.dispose();
                    }
                    
                    solids.forEach(solid => {
                        if (solid.geometry) solid.geometry.dispose();
                        if (solid.material) solid.material.dispose();
                    });
                    
                }, 500);
            }, 800);
        }, 1200);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (renderer) {
            // Make the canvas responsive for smaller screens
            const containerWidth = Math.min(450, window.innerWidth - 40);
            renderer.setSize(containerWidth, containerWidth);
            
            // Update camera aspect ratio
            if (camera) {
                camera.aspect = 1; // Keep it square
                camera.updateProjectionMatrix();
            }
        }
    });
    
    // Initialize Three.js scene
    initThreeJS();
    
    // Start the animation
    startAnimation();
});