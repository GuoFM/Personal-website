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
        console.log('Attempting to send email...');
        emailjs.send('service_rnfrnsd', 'template_z8q3z8c', templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#28a745';
                
                console.log('Resetting form...');
                document.getElementById('contact-form').reset();
                
                console.log('Showing success alert...');
                alert('Message sent successfully!');
                
                console.log('Setting up redirect...');
                setTimeout(() => {
                    console.log('Attempting to redirect...');
                    window.location.href = './thank-you.html';
                    console.log('Redirect command executed');
                }, 500);
                
                console.log('All success handlers completed');
            })
            .catch(function(error) {
                console.error('Error sending email:', error);
                btn.disabled = false;
                btn.textContent = 'Send Message';
                btn.style.backgroundColor = '';
                alert('Failed to send message. Please try again.');
            });
    } catch (error) {
        console.error('Caught error:', error);
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.backgroundColor = '';
        alert('An error occurred. Please try again.');
    }

    return false;
} 