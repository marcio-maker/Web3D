// script.js

// Ensure all necessary GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // --- Three.js Setup for Full-Page Background ---
    let scene, camera, renderer, particles, particleMaterial;
    const moodCanvas = document.getElementById('mood-canvas');

    // Initialize Three.js scene
    function initThreeJS() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        renderer = new THREE.WebGLRenderer({ canvas: moodCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const particleCount = 700;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 150;
            positions[i + 1] = (Math.random() - 0.5) * 150;
            positions[i + 2] = (Math.random() - 0.5) * 150;

            velocities[i] = (Math.random() - 0.5) * 0.1;
            velocities[i + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i + 2] = (Math.random() - 0.5) * 0.1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        particleMaterial = new THREE.PointsMaterial({
            size: 0.8,
            transparent: true,
            opacity: 0.7,
            color: new THREE.Color(0x4fc3f7),
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, particleMaterial);
        scene.add(particles);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animateThreeJS();
    }

    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            const bounds = 75;
            if (positions[i] > bounds || positions[i] < -bounds) velocities[i] *= -1;
            if (positions[i + 1] > bounds || positions[i + 1] < -bounds) velocities[i + 1] *= -1;
            if (positions[i + 2] > bounds || positions[i + 2] < -bounds) velocities[i + 2] *= -1;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }

    initThreeJS(); 

// --- GSAP Animations for Hero Section ---

// Configuração inicial
gsap.set(".hero", { opacity: 0, y: 60 });
gsap.set(".hero h1", {
  opacity: 0,
  y: 30,
  rotationX: -40,
  perspective: 1000,
  transformOrigin: "center"
});

// Timeline para organizar as animações em sequência
const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

// Animação de entrada da seção hero
heroTimeline.to(".hero", {
  opacity: 1,
  y: 0,
  duration: 1.2
});

// Animação de entrada do título com rotação 3D
heroTimeline.to(".hero h1", {
  opacity: 1,
  y: 0,
  rotationX: 0,
  duration: 1.4
}, "-=0.7"); // sobreposição suave

// Rotação 3D de 90 graus em loop para o título
heroTimeline.to(".hero h1", {
  rotationY: 40, // Rotaciona 90 graus no eixo Y
  duration: 2,   // Duração da rotação
  ease: "power1.inOut", // Suaviza o início e o fim da rotação
  repeat: -1,    // Repete infinitamente
  yoyo: true     // Faz a animação ir e voltar (0 a 90, e 90 a 0)
});
// Parágrafo com animação em loop (mantido)
gsap.set(".hero p", { opacity: 0, xPercent: 100 });

const heroPTimeline = gsap.timeline({
    repeat: -1,
    delay: 1.5
});

heroPTimeline
    .fromTo(".hero p",
        { opacity: 0, xPercent: 100 },
        { opacity: 1, xPercent: 0, duration: 1.5, ease: "power2.out" }
    )
    .to(".hero p", { duration: 2 }) // Pausa visível
    .to(".hero p",
        { opacity: 0, xPercent: -100, duration: 1.5, ease: "power2.in" }
    )
    .to(".hero p", { xPercent: 100, duration: 0 }, 0);


    // --- VanillaTilt for project cards ---
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
        max: 18,
        speed: 600,
        glare: true,
        "max-glare": 0.4,
        gyroscope: true,
    });

    // --- GSAP ScrollTrigger Animations for Sections ---

    // Section Titles Animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.set(title, { opacity: 0, y: 20 }); // Ensure initial state is set
        ScrollTrigger.create({
            trigger: title,
            start: "top 90%",
            end: "bottom top", // Keep animating as you scroll past the element
            onEnter: () => {
                gsap.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)",
                });
            },
            onLeaveBack: () => {
                gsap.to(title, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: "power2.in"
                });
            },
            // markers: true // Enable for debugging if needed
        });
    });
// Terminal Typing Effect (Seção Sobre Mim) - Estilo "Carta escrita"
const terminalElement = document.querySelector('#sobre .terminal');
const terminalLines = document.querySelectorAll('#sobre .terminal-line');

// Define estado inicial
gsap.set(terminalElement, { opacity: 0, y: 30 });
terminalLines.forEach(line => gsap.set(line, { opacity: 0 }));

ScrollTrigger.create({
    trigger: terminalElement,
    start: "top 80%",
    onEnter: () => {
        gsap.to(terminalElement, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Anima cada linha em sequência
        function typeLine(index) {
            if (index >= terminalLines.length) return;

            const line = terminalLines[index];
            const originalText = line.textContent.trim();
            line.innerHTML = '';

            const span = document.createElement('span');
            span.className = 'visible-text';
            line.appendChild(span);

            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            line.appendChild(cursor);

            gsap.to(line, { opacity: 1, duration: 0.4 });

            let i = 0;
            function typeChar() {
                if (i <= originalText.length) {
                    span.textContent = originalText.slice(0, i);
                    i++;
                    // Ritmo irregular: mais humano
                    const delay = Math.random() * 80 + 30;
                    setTimeout(typeChar, delay);
                } else {
                    cursor.remove();
                    setTimeout(() => typeLine(index + 1), 500);
                }
            }

            typeChar();
        }

        typeLine(0);
    },

    onLeaveBack: () => {
        gsap.to(terminalElement, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.in"
        });

        terminalLines.forEach(line => {
            const span = line.querySelector('.visible-text');
            const cursor = line.querySelector('.cursor');
            if (span) span.textContent = "";
            if (!cursor) {
                const newCursor = document.createElement('span');
                newCursor.className = 'cursor';
                newCursor.textContent = '|';
                line.appendChild(newCursor);
            }
            gsap.set(line, { opacity: 0 });
        });
    },
});


    // Project Card Grid Animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.set(card, { opacity: 0, scale: 0.9, y: 20 }); // Ensure initial state is set
        ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            end: "bottom top",
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    delay: i * 0.15,
                    ease: "back.out(1.7)"
                });
            },
            onLeaveBack: () => {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.9,
                    y: 20,
                    duration: 0.5,
                    ease: "power1.in"
                });
            },
            // markers: true
        });
    });

    // Skills Container Animation
    const skillsContainer = document.querySelector(".skills-container");
    if (skillsContainer) {
        gsap.set(skillsContainer, { opacity: 0, y: 30 }); // Ensure initial state is set
        ScrollTrigger.create({
            trigger: skillsContainer,
            start: "top 80%",
            end: "bottom top",
            onEnter: () => {
                gsap.to(skillsContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                });
                // Animate skill bars when container enters
                gsap.utils.toArray('.skill-progress').forEach(bar => {
                    gsap.to(bar, {
                        width: bar.dataset.width,
                        duration: 1.8,
                        ease: "power3.out"
                    });
                });
            },
            onLeaveBack: () => {
                gsap.to(skillsContainer, {
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    ease: "power2.in"
                });
                // Reset skill bars when container leaves
                gsap.utils.toArray('.skill-progress').forEach(bar => {
                    gsap.to(bar, {
                        width: '0%',
                        duration: 0.6,
                        ease: "power2.in"
                    });
                });
            },
            // markers: true
        });
    }

    // Animate Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -50 : 50 }); // Ensure initial state is set
        ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            end: "bottom top",
            onEnter: () => {
                gsap.to(item, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    delay: i * 0.3,
                    ease: "power3.out",
                });
            },
            onLeaveBack: () => {
                gsap.to(item, {
                    opacity: 0,
                    x: i % 2 === 0 ? -50 : 50,
                    duration: 0.6,
                    ease: "power2.in"
                });
            },
            // markers: true
        });
    });

    // Blueprint Form Animation (Seção Contato)
    const blueprintForm = document.querySelector(".blueprint-form");
    if (blueprintForm) {
        gsap.set(blueprintForm, { opacity: 0, y: 50 }); // Ensure initial state is set
        ScrollTrigger.create({
            trigger: blueprintForm,
            start: "top bottom", // Alterado para "top bottom" para acionar mais cedo
            end: "bottom top",
            onEnter: () => {
                gsap.to(blueprintForm, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.utils.toArray(".form-group").forEach((group, i) => {
                            gsap.from(group, {
                                opacity: 0,
                                y: 20,
                                duration: 0.6,
                                delay: i * 0.2,
                                ease: "back.out(1.2)"
                            });
                        });
                    }
                });
            },
            onLeaveBack: () => {
                gsap.to(blueprintForm, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: "power2.in"
                });
                gsap.utils.toArray(".form-group").forEach((group, i) => {
                    gsap.to(group, {
                        opacity: 0,
                        y: 20,
                        duration: 0.4,
                        delay: (gsap.utils.toArray(".form-group").length - 1 - i) * 0.1, // Reverse stagger
                        ease: "power1.in"
                    });
                });
            },
            // markers: true
        });
    }

    // Social Links Animation
    const socialLinks = document.querySelector(".social-links");
    if (socialLinks) {
        gsap.set(socialLinks, { opacity: 0, y: 30 }); // Ensure initial state is set
        ScrollTrigger.create({
            trigger: socialLinks,
            start: "top bottom", // Alterado para "top bottom" para acionar mais cedo
            end: "bottom top",
            onEnter: () => {
                gsap.to(socialLinks, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(socialLinks, {
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    ease: "power2.in"
                });
            },
            // markers: true
        });
    }

    // Parallax effect for sections (adding to each section)
    gsap.utils.toArray('section').forEach((section, i) => {
        // Excluir o 'mood-selector' do parallax se ele for uma seção
        if (section.id && section.id !== 'mood-selector') {
            gsap.fromTo(section, {
                yPercent: i * 15, // Mais suave para não deslocar tanto
                z: i * -50, // Mais suave no Z-depth
            }, {
                yPercent: 0,
                z: 0,
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    // markers: true, // Enable for debugging if needed
                },
                ease: "none"
            });
        }
    });

    // Navigation Dots
    const sections = gsap.utils.toArray('section');
    const navDots = gsap.utils.toArray('.nav-dot');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    navDots.forEach(dot => dot.classList.remove('active'));
                    const targetSectionId = section.id;
                    const correspondingDot = document.querySelector(`.nav-dot[data-section="${targetSectionId}"]`);
                    if (correspondingDot) {
                        correspondingDot.classList.add('active');
                    }
                }
            }
        });
    });

    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = dot.getAttribute('data-section');
            const section = document.getElementById(target);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Mood Selector Particle and Text Color Control ---
    window.setMood = function(mood) {
        document.body.className = '';
        const moodSelector = document.getElementById('mood-selector');
        moodSelector.className = 'mood-selector';

        if (mood) {
            document.body.classList.add(mood);
            moodSelector.classList.add(`${mood}-text`);
        }

        let colorTarget, speedMultiplier;
        switch (mood) {
            case 'calmo':
                colorTarget = new THREE.Color('#a1c4fd');
                speedMultiplier = 0.4;
                break;
            case 'criativo':
                colorTarget = new THREE.Color('#a6c1ee');
                speedMultiplier = 1.8;
                break;
            case 'cansado':
                colorTarget = new THREE.Color('#434343');
                speedMultiplier = 0.2;
                break;
            case 'feliz':
                colorTarget = new THREE.Color('#fddb92');
                speedMultiplier = 2.5;
                break;
            case 'reflexivo':
                colorTarget = new THREE.Color('#355c7d');
                speedMultiplier = 0.6;
                break;
            default:
                colorTarget = new THREE.Color(0x4fc3f7);
                speedMultiplier = 1.0;
        }

        gsap.to(particleMaterial.color, {
            r: colorTarget.r,
            g: colorTarget.g,
            b: colorTarget.b,
            duration: 1.5,
            ease: "power2.inOut"
        });

        const velocitiesAttribute = particles.geometry.attributes.velocity;
        const velocities = velocitiesAttribute.array;
        for (let i = 0; i < velocities.length; i++) {
            velocities[i] = (velocities[i] / Math.abs(velocities[i] || 1)) * (Math.random() * 0.1 + 0.05) * speedMultiplier;
        }
        velocitiesAttribute.needsUpdate = true;
    };

    // Anime.js for modern button animation
    const formSubmitButton = document.querySelector('.form-submit');
    if (formSubmitButton) {
        formSubmitButton.addEventListener('mouseenter', () => {
            anime({
                targets: formSubmitButton,
                scale: [1, 1.05],
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        formSubmitButton.addEventListener('mouseleave', () => {
            anime({
                targets: formSubmitButton,
                scale: [1.05, 1],
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    }

    // Set initial mood to default accent blue
    setMood('');
});
