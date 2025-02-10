function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // 使用最简单的参数结构
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // 添加错误处理
    try {
        emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
            .then(function() {
                btn.textContent = 'Message Sent!';
                document.getElementById('contact-form').reset();
                // 使用相对路径，从当前页面位置（contact/index.html）返回上一级
                setTimeout(() => {
                    window.location.href = '../../thank-you.html';
                    console.log('Redirecting to: ../../thank-you.html');
                }, 1000);
            })
            .catch(function(error) {
                console.error('Error:', error);
                btn.disabled = false;
                btn.textContent = 'Send Message';
                alert('Failed to send message. Please try again.');
            });
    } catch (error) {
        console.error('Error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
        alert('An error occurred. Please try again.');
    }

    return false;
} 