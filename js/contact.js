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
                // 显示成功提示
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745'; // 变成绿色
                document.getElementById('contact-form').reset();
                
                // 显示成功提示框
                alert('Message sent successfully! Redirecting to thank you page...');
                
                // 延迟后尝试跳转
                setTimeout(() => {
                    try {
                        // 尝试多种跳转方式
                        window.location.replace('../thank-you.html');
                        // 如果上面的不成功，尝试这个
                        if(!window.location.href.includes('thank-you')) {
                            window.open('../thank-you.html', '_self');
                        }
                    } catch (error) {
                        console.error('Redirect error:', error);
                        alert('Message sent successfully! But redirect failed. Please go back to home page.');
                    }
                }, 1500); // 延长等待时间到1.5秒
            })
            .catch(function(error) {
                console.error('Error:', error);
                btn.disabled = false;
                btn.textContent = 'Send Message';
                btn.style.backgroundColor = ''; // 恢复原始颜色
                alert('Failed to send message. Please try again.');
            });
    } catch (error) {
        console.error('Error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.backgroundColor = ''; // 恢复原始颜色
        alert('An error occurred. Please try again.');
    }

    return false;
} 