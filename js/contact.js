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
                
                // 添加当前位置的调试信息
                console.log('Current location:', window.location.href);
                console.log('Attempting to redirect from:', window.location.pathname);
                
                setTimeout(() => {
                    try {
                        // 根据当前路径构建正确的相对路径
                        const currentPath = window.location.pathname;
                        let redirectPath;
                        
                        if (currentPath.includes('/contact/')) {
                            redirectPath = '../thank-you.html';
                        } else if (currentPath.includes('/contact')) {
                            redirectPath = './thank-you.html';
                        } else {
                            redirectPath = '/thank-you.html';
                        }
                        
                        console.log('Redirecting to:', redirectPath);
                        
                        // 尝试跳转
                        window.location.href = redirectPath;
                        
                        // 检查跳转是否成功
                        setTimeout(() => {
                            if (!window.location.href.includes('thank-you')) {
                                console.log('First redirect attempt failed, trying alternative...');
                                window.location.replace(redirectPath);
                            }
                        }, 500);
                        
                    } catch (error) {
                        console.error('Redirect error:', error);
                        alert('Redirect failed. Current path: ' + window.location.pathname);
                    }
                }, 1500);
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