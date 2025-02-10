function sendEmail(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const btn = document.querySelector('.submit-btn');
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
        console.log('Starting email send...');
        emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745';
                
                alert('Message sent successfully!');
                
                console.log('Attempting immediate redirect');
                window.location = 'thank-you.html';
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
} 