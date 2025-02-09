function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // 构建邮件内容
    const mailtoLink = `mailto:fguo1996@cqu.edu.cn?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
        `From: ${data.name} (${data.email})\n\n${data.message}`
    )}`;

    // 打开默认邮件客户端
    window.location.href = mailtoLink;
    
    // 清空表单
    event.target.reset();
    
    return false;
} 