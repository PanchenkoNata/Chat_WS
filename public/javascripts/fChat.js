document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const btnSendMess = document.querySelector('.btnSendMess');

    socket.on('connected', (message) => {
        console.log(`front: on connected --- ${message}`);
        socket.emit('/chat/history/get');
    });

    btnSendMess.addEventListener('click', (event) => {
        event.preventDefault();
        // get message from input
        const messageContent = document.querySelector('.messageContent');
        let content = messageContent.value.trim();
                
        if (content !== '' && typeof(content) === 'string' ) {
            socket.emit('/chat/message/send', content);
            messageContent.value = '';
        }
    });

    socket.on('/chat/message/add', (message) => {
        const listHistory = document.querySelector('.chat-history');
        const messageData = document.createElement('li');
        messageData.innerHTML = `${message.user}: ${message.createdAt} <br/> ${message.content}`;
        listHistory.appendChild(messageData);
        console.log(`front: on /chat/message/add`);
    });

    socket.on('/chat/history/show', (messages) => {
        // console.log(`front: on /chat/history/show ${Object.keys(messages)}`);
        messages.forEach((message) => {
            console.log(`front: on /chat/history/show ${message}`);
            const listHistory = document.querySelector('.chat-history');
            const messageData = document.createElement('li');
            messageData.innerHTML = `${message.user}: ${message.createdAt} <br/> ${message.content}`;
            listHistory.appendChild(messageData);
        });
        console.log(`front: on /chat/history/show`);
    });
    
    // socket.emit('/chat/message/out', chatController.messageOut)
});
