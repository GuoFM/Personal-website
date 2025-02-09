function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const templateParams = {
        to_name: "Fangming Guo",
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        reply_to: document.getElementById('email').value
    };

    emailjs.send('service_rnfrnsd', 'service_rnfrnsd', templateParams)
        .then(function(response) {
            window.location.href = '/thank-you.html';
        }, function(error) {
            alert('Sorry, there was an error. Please try again.');
            btn.disabled = false;
            btn.textContent = 'Send Message';
        });

    return false;
} 