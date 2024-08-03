document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quote-form');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Set minimum date for check-in and check-out to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = today;

    // Update check-out min date when check-in date changes
    checkInInput.addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        const minCheckOutDate = new Date(checkInDate);
        minCheckOutDate.setDate(minCheckOutDate.getDate() + 1);
        checkOutInput.min = minCheckOutDate.toISOString().split('T')[0];
        if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = minCheckOutDate.toISOString().split('T')[0];
        }
    });

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
    });

    // Form validation and submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            } else {
                clearError(input);
            }
        });

        // Check if check-out date is after check-in date
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);

        if (checkOutDate <= checkInDate) {
            showError(checkOutInput, 'Check-out date must be after check-in date');
            isValid = false;
        }

        // Validate email format
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        clearError(input);
        const error = document.createElement('div');
        error.className = 'error';
        error.innerText = message;
        input.parentNode.appendChild(error);
        input.classList.add('error-input');
    }

    function clearError(input) {
        const error = input.parentNode.querySelector('.error');
        if (error) {
            error.remove();
        }
        input.classList.remove('error-input');
    }

    function submitForm() {
        // Here you would typically send the form data to a server
        // For this example, we'll just show a success message
        const formData = new FormData(form);
        const quoteContainer = document.querySelector('.quote-container');
        quoteContainer.innerHTML = `
            <h2>Thank you for your quote request!</h2>
            <p>We've received the following information:</p>
            <ul>
                ${[...formData.entries()].map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
            </ul>
            <p>We'll get back to you with a personalized quote as soon as possible.</p>
        `;
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

