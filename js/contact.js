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

    // 获取表单数据
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_email: 'fguo1996@cqu.edu.cn'  // 添加接收者邮箱
    };

    try {
        if (!window.emailjs) {
            throw new Error('EmailJS not loaded');
        }
        
        console.log('Starting email send...');
        emailjs.send(
            'service_rnfrnsd',  // 您的 EmailJS service ID
            'template_z8q3z8c', // 您的 EmailJS template ID
            templateParams
        )
        .then(
            function(response) {
                console.log("SUCCESS", response);
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745';
                
                // 清空表单
                document.getElementById('contact-form').reset();
                
                // 显示成功消息
                alert('Message sent successfully! Thank you for your message.');
                
                // 延迟跳转，确保用户看到成功消息
                setTimeout(() => {
                    window.location.href = './thank-you.html';
                }, 1000);
            },
            function(error) {
                console.log("FAILED", error);
                btn.disabled = false;
                btn.textContent = 'Send Message';
                btn.style.backgroundColor = '';
                alert('Failed to send message. Please try again or contact directly via email.');
            }
        );
    } catch (error) {
        console.error('Try-Catch Error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.backgroundColor = '';
        alert('An error occurred. Please try again or contact directly via email.');
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