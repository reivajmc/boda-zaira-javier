import './style.css'

// 1. Definimos la fecha objetivo (Año, Mes [0-11], Día, Hora, Minuto)
// Nota: Julio es el mes 6 en JavaScript (Enero es 0)
const weddingDate = new Date(2026, 6, 25, 0, 0, 0).getTime();

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
// TODO: ¡Reemplaza esta URL con la que obtengas de Google Apps Script!
const scriptURL = 'https://script.google.com/macros/s/AKfycbzd9zNRglNBm_eubDmhU2xsJRp650m3FSc4H89TFrXig5ELsL7E3BKDSiMrAV_-zCD2Ww/exec'; 
const form = document.getElementById('rsvpForm');
const btn = document.getElementById('submitBtn');
const status = document.getElementById('formStatus');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Cambiar estado del botón mientras envía
        btn.disabled = true;
        btn.innerText = 'Enviando...';
        status.classList.add('hidden');
        
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                status.innerText = "¡Gracias! Tu confirmación ha sido enviada.";
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