let pageUrls = {
    about: '?about',
    contact: '?contact',
    gallery: '?gallery'
};

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderGalleryPage() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <h1 class="title">Gallery</h1>
        <div class="gallery-grid">
            ${Array.from({ length: 9 }, (_, i) => `
                <div class="gallery-item">
                    <img data-src="https://picsum.photos/200/300?random=${i + 1}" class="gallery-img lazy-load" />
                </div>
            `).join('')}
        </div>`;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                fetch(src)
                    .then(response => response.blob())
                    .then(blob => {
                        img.src = URL.createObjectURL(blob);
                        observer.unobserve(img);
                    });
            }
        });
    });

    document.querySelectorAll('.gallery-img').forEach(img => observer.observe(img));

    // Modal
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close');

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Dodaj modal do HTML (przed </body>)
document.body.innerHTML += `
    <div id="modal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="modal-image">
    </div>`;



    function RenderContactPage() {
        document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <div id="name-error" class="error-message"></div>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <div id="email-error" class="error-message"></div>
            </div>
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message" required></textarea>
                <div id="message-error" class="error-message"></div>
            </div>
            <div>
                <label for="captcha">What is 2 + 3?</label>
                <input type="text" id="captcha" name="captcha" required>
                <div id="captcha-error" class="error-message"></div>
            </div>
            <button type="submit">Send</button>
        </form>`;
    
        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;
    
            // Walidacja
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const captcha = document.getElementById('captcha').value.trim();
    
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
            if (!name) {
                document.getElementById('name-error').textContent = 'Name is required';
                isValid = false;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('email-error').textContent = 'Valid email is required';
                isValid = false;
            }
            if (!message) {
                document.getElementById('message-error').textContent = 'Message is required';
                isValid = false;
            }
            if (captcha !== '5') {
                document.getElementById('captcha-error').textContent = 'CAPTCHA incorrect';
                isValid = false;
            }
    
            if (isValid) {
                alert('Form submitted successfully!');
                this.reset();
            }
        });
    }