function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // 确保参数名称与 EmailJS 模板中的变量名完全匹配
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_name: 'Fangming Guo',
        reply_to: document.getElementById('email').value
    };

    console.log('Attempting to send with params:', templateParams);

    emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            btn.disabled = false;
            btn.textContent = 'Send Message';
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset();
            window.location.href = '../thank-you.html';
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            btn.disabled = false;
            btn.textContent = 'Send Message';
            alert('Failed to send message. Error: ' + (error.text || error.message));
        });

    return false;
} 