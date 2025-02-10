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
                // 显示成功提示
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745';
                document.getElementById('contact-form').reset();
                
                // 显示成功提示框
                alert('Message sent successfully!');
                
                // 打印详细的调试信息
                console.log('=== Debug Information ===');
                console.log('1. Current URL:', window.location.href);
                console.log('2. Current Path:', window.location.pathname);
                console.log('3. Current Origin:', window.location.origin);
                
                // 尝试不同的跳转路径
                const paths = {
                    absolute: '/thank-you.html',
                    relative: '../thank-you.html',
                    full: window.location.origin + '/thank-you.html'
                };
                
                console.log('4. Trying paths:', paths);
                
                // 使用完整路径跳转
                console.log('5. Attempting to redirect to:', paths.full);
                window.location.href = paths.full;
                
                // 检查跳转是否成功
                setTimeout(() => {
                    console.log('6. Current location after redirect:', window.location.href);
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