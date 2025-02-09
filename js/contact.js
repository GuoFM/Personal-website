function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const messageContent = document.getElementById('message').value;
    console.log('Message content:', messageContent);

    const templateParams = {
        to_name: "Fangming Guo",
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: messageContent,
        reply_to: document.getElementById('email').value
    };

    console.log('Template params:', templateParams);

    emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            window.location.href = '/thank-you.html';
        }, function(error) {
            console.log('FAILED...', error);
            alert('Error: ' + error.text);
            btn.disabled = false;
            btn.textContent = 'Send Message';
        });

    return false;
} 