function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // 使用最基本的参数
    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // 使用基本的发送方法
    emailjs.sendForm('service_rnfrnsd', 'template_z8q3z8c', event.target)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Message sent successfully!');
            event.target.reset();
            window.location.href = 'thank-you.html';
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            alert('Failed to send message: ' + error.message);
            btn.disabled = false;
            btn.textContent = 'Send Message';
        });

    return false;
} 