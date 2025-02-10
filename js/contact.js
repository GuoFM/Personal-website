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
                
                // 添加成功提示
                alert('Message sent successfully!');
                
                // 使用 setTimeout 确保提示显示后再跳转
                setTimeout(() => {
                    // 直接跳转到同一目录下的 thank-you.html
                    window.location.href = './thank-you.html';
                }, 500);
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