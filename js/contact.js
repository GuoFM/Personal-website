function sendEmail(event) {
    event.preventDefault();
    
    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // 使用与模板完全匹配的参数名称
    const templateParams = {
        to_name: 'Fangming Guo',
        from_name: document.getElementById('name').value,
        to_email: 'fguo1996@cqu.edu.cn',
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    console.log('Sending with params:', templateParams);

    // 添加更多配置选项
    emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams, {
        publicKey: 'dcpWqWn-UOJacvOCG'
    })
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert('Message sent successfully!');
        btn.disabled = false;
        btn.textContent = 'Send Message';
        // 使用相对路径
        window.location.href = 'thank-you.html';
    })
    .catch(function(error) {
        console.error('FAILED...', error);
        // 显示更详细的错误信息
        if (error.text) {
            alert('Error: ' + error.text);
        } else {
            alert('Failed to send message: ' + error.message);
        }
        console.error('Full error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
    });

    return false;
} 