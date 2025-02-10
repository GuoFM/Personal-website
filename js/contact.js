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
                
                // 先重置表单
                document.getElementById('contact-form').reset();
                
                // 显示成功消息并跳转
                alert('Message sent successfully!');
                console.log('Attempting redirect...');
                
                // 使用完整的相对路径
                const redirectPath = './thank-you.html';
                console.log('Redirect path:', redirectPath);
                
                window.location.href = redirectPath;
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
};

// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact.js loaded and DOM ready');
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', sendEmail);
        console.log('Submit event handler attached');
    } else {
        console.error('Contact form not found');
    }
}); 