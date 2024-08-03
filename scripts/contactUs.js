document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const submitButton = form.querySelector('button[type="submit"]');
    let submissionCount = 0;
    const maxSubmissions = 5;
    const submissionResetTime = 3600000; // 1 hour in milliseconds

    // Generate CSRF token
    function generateCSRFToken() {
        return Math.random().toString(36).substr(2);
    }

    // Set CSRF token
    const csrfToken = generateCSRFToken();
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                showError(input, `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`);
                isValid = false;
            } else {
                clearError(input);
            }
        });

        const email = document.getElementById('email');
        if (email.value.trim() !== '' && !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = message;
        input.classList.add('error');
    }

    function clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = '';
        input.classList.remove('error');
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function submitForm() {
        if (submissionCount >= maxSubmissions) {
            showError(submitButton, `You've reached the maximum number of submissions. Please try again later.`);
            return;
        }

        const formData = new FormData(form);
        formData.append('csrf_token', csrfToken);

        fetch('contactUs.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                form.reset();
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
                submissionCount++;
                updateSubmitButton();
                if (submissionCount === 1) {
                    setTimeout(resetSubmissionCount, submissionResetTime);
                }
            } else {
                throw new Error(data.message || 'An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(submitButton, error.message);
        });
    }

    function updateSubmitButton() {
        submitButton.textContent = `Send Message (${maxSubmissions - submissionCount} left)`;
        if (submissionCount >= maxSubmissions) {
            submitButton.disabled = true;
        }
    }

    function resetSubmissionCount() {
        submissionCount = 0;
        updateSubmitButton();
        submitButton.disabled = false;
    }

    // Smooth scrolling for mobile devices
    const contactLink = document.querySelector('a[href="/page/contactUs.html"]');
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) { // Adjust this value based on your mobile breakpoint
                e.preventDefault();
                const contactForm = document.querySelector('.contact-form');
                contactForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});