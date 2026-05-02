import './style.css'

// 1. Definimos la fecha objetivo (Año, Mes [0-11], Día, Hora, Minuto)
// Nota: Julio es el mes 6 en JavaScript (Enero es 0)
const weddingDate = new Date(2026, 6, 25, 17, 0, 0).getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Cálculos de tiempo para días, horas, minutos y SEGUNDOS
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Inyectamos los valores en el HTML
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    // Si la fecha ya pasó
    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("countdown").innerHTML = "<p class='text-2xl font-bold'>¡Hoy es el gran día! 🥂</p>";
    }
};

// Ejecutamos la función cada 1 segundo (1000ms)
const timerInterval = setInterval(updateCountdown, 1000);

updateCountdown();

// --- Lógica del Formulario RSVP (Google Sheets) ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbxYyae-jkDnxXkUbOibkvZOxevbte_HqtpZFHS6i7cFmsjR4SeKtSex5yrSBPpq3vGx/exec'; 
const form = document.getElementById('rsvpForm');
const btn = document.getElementById('submitBtn');
const status = document.getElementById('formStatus');
const reservationMessage = document.getElementById('reservationMessage');
const selectAsistentes = document.getElementById('asistentes');
const selectAsistencia = document.getElementById('asistencia');

if (selectAsistencia && selectAsistentes) {
    selectAsistencia.addEventListener('change', (e) => {
        if (e.target.value === 'no') {
            selectAsistentes.disabled = true;
            selectAsistentes.required = false;
            selectAsistentes.value = "";
        } else {
            selectAsistentes.disabled = false;
            selectAsistentes.required = true;
        }
    });
}

// Extraer ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const guestId = urlParams.get('id');
let guestName = '';

const setupGenericForm = () => {
    selectAsistentes.innerHTML = '<option value="" disabled selected>Número de pases</option>';
    for (let i = 1; i <= 2; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectAsistentes.appendChild(option);
    }
};

if (guestId) {
    // Buscar datos del invitado
    fetch(`${scriptURL}?id=${guestId}`)
        .then(response => response.json())
        .then(data => {
            if (data.familia && data.pases) {
                // Mostrar mensaje elegante
                reservationMessage.innerHTML = `<p class="text-2xl">Pase reservado para: <br><span class="font-['Great_Vibes'] text-[#C9A06C] text-4xl">${data.familia}</span></p>`;
                
                // Guardar nombre
                guestName = data.familia;
                
                // Generar opciones de pases
                selectAsistentes.innerHTML = '<option value="" disabled selected>Número de pases</option>';
                for (let i = 1; i <= data.pases; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    selectAsistentes.appendChild(option);
                }
            } else {
                setupGenericForm();
            }
        })
        .catch(error => {
            console.error('Error al obtener datos del invitado:', error);
            setupGenericForm();
        });
} else {
    setupGenericForm();
}

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Cambiar estado del botón mientras envía
        btn.disabled = true;
        btn.innerText = 'Enviando confirmación...';
        status.classList.add('hidden');
        
        const formData = new FormData(form);
        if (guestId) {
            formData.append('id', guestId);
        }
        
        const data = Object.fromEntries(formData.entries());
        data.nombre = guestName || 'Invitado'; // Añadir el nombre oculto

        fetch(scriptURL, { 
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Con no-cors la respuesta es opaca, asumimos éxito si no hay error de red
            status.innerText = "¡Gracias! Tu confirmación ha sido registrada.";
            status.classList.remove('hidden', 'text-red-600');
            status.classList.add('text-green-600', 'font-bold');
            form.reset();
            btn.disabled = false;
            btn.innerText = 'Enviar Confirmación';
        })
        .catch(error => {
            status.innerText = "Hubo un error al enviar. Por favor intenta de nuevo.";
            status.classList.remove('hidden', 'text-green-600');
            status.classList.add('text-red-600', 'font-bold');
            console.error('Error!', error.message);
            btn.disabled = false;
            btn.innerText = 'Enviar Confirmación';
        });
    });
}

// --- Lógica del Sobre de Bienvenida ---
const seal = document.getElementById('wedding-seal');
const container = document.getElementById('envelope-container');
const flap = document.getElementById('envelope-flap');
const body = document.getElementById('envelope-body');
const text = document.getElementById('envelope-text');

if (seal && container && flap && body) {
    // Bloquear scroll al inicio
    document.body.style.overflow = 'hidden';

    seal.addEventListener('click', () => {
        // 1. Ocultar el sello y texto
        seal.style.opacity = '0';
        seal.style.pointerEvents = 'none';
        if (text) text.style.opacity = '0';

        // 2. Rotar la solapa hacia arriba (Añadiendo perspectiva para que sea 3D)
        container.style.perspective = '1000px';
        flap.style.transform = 'rotateX(180deg)';

        // 3. Deslizar el cuerpo hacia abajo y la solapa hacia arriba un momento después
        setTimeout(() => {
            // Al estar la solapa ya rotada 180° en el eje X, translateY(100%) lo mueve hacia arriba
            flap.style.transform = 'rotateX(180deg) translateY(100%)';
            body.style.transform = 'translateY(100%)';
        }, 500);

        // 4. Restaurar scroll y ocultar todo tras 1.5s
        setTimeout(() => {
            container.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1500);
    });
}