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
                
                // 直接跳转到感谢页面
                window.location.href = window.location.href.replace('contact/', 'thank-you.html');
                
                // 如果上面的跳转失败，打印错误信息并尝试其他方式
                setTimeout(() => {
                    if (window.location.href.includes('contact')) {
                        console.log('First redirect failed, trying alternative...');
                        // 尝试其他跳转方式
                        window.location.href = '../thank-you.html';
                        
                        // 如果还是失败，提供一个链接让用户手动点击
                        setTimeout(() => {
                            if (window.location.href.includes('contact')) {
                                alert('Redirect failed. Please click OK to go to the thank you page.');
                                window.location.href = '../thank-you.html';
                            }
                        }, 500);
                    }
                }, 100);
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