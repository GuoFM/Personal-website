function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
            .then(function() {
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745';
                document.getElementById('contact-form').reset();
                
                alert('Message sent successfully!');
                
                // 简化跳转逻辑
                try {
                    // 直接跳转到根目录的 thank-you.html
                    window.location.replace('/thank-you.html');
                } catch (error) {
                    console.error('Redirect failed:', error);
                    // 如果直接跳转失败，尝试使用相对路径
                    window.location.href = '../thank-you.html';
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
                btn.disabled = false;
                btn.textContent = 'Send Message';
                btn.style.backgroundColor = '';
                alert('Failed to send message. Please try again.');
            });
    } catch (error) {
        console.error('Error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.backgroundColor = '';
        alert('An error occurred. Please try again.');
    }

    return false;
} 