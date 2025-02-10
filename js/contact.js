// 确保函数在全局作用域
window.sendEmail = function(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const btn = document.querySelector('.submit-btn');
    if (!btn) {
        console.error('Submit button not found');
        return false;
    }
    
    btn.disabled = true;
    btn.textContent = 'Sending...';
    console.log('Button disabled and text updated');

    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    console.log('Template params:', templateParams);

    try {
        if (!window.emailjs) {
            throw new Error('EmailJS not loaded');
        }
        
        console.log('Starting email send...');
        emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745';
                
                alert('Message sent successfully!');
                
                console.log('Attempting redirect...');
                // 尝试多种跳转方式
                try {
                    window.location.href = 'thank-you.html';
                    console.log('Redirect attempted');
                } catch (redirectError) {
                    console.error('Redirect failed:', redirectError);
                    // 备用跳转方式
                    window.location = 'thank-you.html';
                }
            })
            .catch(function(error) {
                console.error('EmailJS Error:', error);
                btn.disabled = false;
                btn.textContent = 'Send Message';
                btn.style.backgroundColor = '';
                alert('Failed to send message. Please try again.');
            });
    } catch (error) {
        console.error('Try-Catch Error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.backgroundColor = '';
        alert('An error occurred. Please try again.');
    }

    console.log('End of sendEmail function');
    return false;
};

// 添加页面加载完成的日志
console.log('Contact.js loaded'); 