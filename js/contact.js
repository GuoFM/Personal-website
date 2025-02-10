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
                
                document.getElementById('contact-form').reset();
                alert('Message sent successfully!');
                
                // 尝试新的跳转方式
                console.log('Attempting redirect...');
                const currentPath = window.location.pathname;
                console.log('Current path:', currentPath);
                
                // 创建一个链接并模拟点击
                const link = document.createElement('a');
                link.href = 'thank-you.html';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
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