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
                // 使用完整的 URL 路径
                setTimeout(() => {
                    // 获取当前域名并拼接路径
                    const baseUrl = window.location.origin;
                    window.location.href = baseUrl + '/thank-you.html';
                    
                    // 添加调试信息
                    console.log('Redirecting to:', baseUrl + '/thank-you.html');
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