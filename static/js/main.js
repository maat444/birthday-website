document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

// ======================
// EFECTO CONFETTI EN BUCLE CONTINUO
// ======================

    // Configuración profesional del efecto confetti
    function lanzarConfettiProfesional() {
        // Duración de cada ráfaga (2 segundos)
        const duration = 4000;
        const animationEnd = Date.now() + duration;
    
        // Configuración base
        const defaults = {
            startVelocity: 25,
            spread: 360,
            ticks: 60,
            zIndex: 10000,
            colors: [
                '#FF00FF', '#FA8072', '#FFD700', '#88d8b0', 
                '#4169E1', '#ffeead', '#00FF7F', '#8A2BE2'
            ],
            shapes: ['circle', 'square']
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const confettiInterval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(confettiInterval);
            }

            const particleCount = 40 * (timeLeft / duration);

            // Lanzamiento desde ambos lados
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                scalar: randomInRange(0.8, 1.2)
            });

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                scalar: randomInRange(0.8, 1.2)
            });

            // Confettis especiales
            if (Math.random() > 0.7) {
                confetti({
                    ...defaults,
                    particleCount: 5,
                    startVelocity: 50,
                    scalar: 1.5,
                    shapes: ['circle']
                });
            }
        }, 200);
    }

    // Función para manejar el bucle cada 5 segundos
    function iniciarBucleConfetti() {
        // Primer lanzamiento inmediato
        lanzarConfettiProfesional();
    
        // Configurar intervalo para repetición cada 5 segundos
        const intervalo = 6000; // 5 segundos
        setInterval(lanzarConfettiProfesional, intervalo);
    }

    // Iniciar el bucle después de un pequeño retraso inicial
    setTimeout(iniciarBucleConfetti, 1000);

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Change slide every 3 seconds
    setInterval(nextSlide, 3000);

    // Optimized image loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
        // Music functionality - MODIFICADO
    const music = document.getElementById('bgMusic');
    const audioControl = document.getElementById('audioControl');
    let isAudioLoaded = false;
    
    if (music && audioControl) {
        const playIcon = audioControl.querySelector('.play-icon');
        const pauseIcon = audioControl.querySelector('.pause-icon');
        music.volume = 0.5;
    
        // Control de audio - solo se activa con clic directo
        audioControl.addEventListener('click', async function(e) {
            e.stopPropagation(); // Detiene la propagación
            e.preventDefault(); // Previene comportamiento por defecto
            try {
                if (!isAudioLoaded) {
                    await music.play();
                    await music.pause();
                    isAudioLoaded = true;
                }

                if (music.paused) {
                    await music.play();
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'inline';
                } else {
                    music.pause();
                    playIcon.style.display = 'inline';
                    pauseIcon.style.display = 'none';
                }
            } catch (error) {
                console.error('Error controlling audio:', error);
            }
        }, true); // Usamos captura en lugar de bubbling
    }
    
    // Autoplay modificado para ser más específico
    document.addEventListener('click', function initialPlay() {
        if (music && music.paused && !isAudioLoaded) {
            music.play().catch(() => {
                console.log('Autoplay prevented');
            });
        }
        // Removemos el listener después de la primera interacción
        document.removeEventListener('click', initialPlay);
    }, { once: true });
    
    // Soporte para gestos táctiles en el carrusel
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const SWIPE_THRESHOLD = 50;
        if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
            nextSlide();
        } else if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
            prevSlide();
        }
    }
});