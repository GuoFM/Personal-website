function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // 简化模板参数，只使用必要的字段
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        subject: document.getElementById('subject').value
    };

    console.log('Sending with params:', templateParams);

    emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Message sent successfully!');
            window.location.href = 'thank-you.html';
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            alert('Failed to send message. Please try again later.');
            console.error('Full error:', error);
            btn.disabled = false;
            btn.textContent = 'Send Message';
        });

    return false;
} 