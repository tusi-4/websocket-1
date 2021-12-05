{
  'use strict';
  
  const socket = io();

  socket.on('message', ({ author, content }) => addMessage(author, content));
  socket.on('newUser', ({ author, content }) => addMessage(author, content));

  const loginForm = document.getElementById('welcome-form'),
  messagesSection = document.getElementById('messages-section'),
  messagesList = document.getElementById('messages-list'),
  addMessageForm = document.getElementById('add-messages-form'),
  userNameInput = document.getElementById('username'),
  messageContentInput = document.getElementById('message-content');

  let userName = '';

  function login(event){
    event.preventDefault();
    if(userNameInput.value == ''){
      alert('Please type in your name!');
    } else {
      userName = userNameInput.value;
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
      socket.emit('login', { name: userName, id: socket.id})
    }
  }

  loginForm.addEventListener('submit', login);

  function addMessage(author, content){
    const message = document.createElement('li');
    message.classList.add('message', 'message--received');
    if(author == userName){
      message.classList.add('message--self');
    }
    message.innerHTML = `
      <h3 class="message__author">${author == userName ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  }

  function sendMessage(event){
    event.preventDefault();
    if(messageContentInput.value == ''){
      alert('Please write your message!');
    } else {
      addMessage(userName, messageContentInput.value);
      socket.emit('message', { author: userName, content: messageContentInput.value });
      messageContentInput.value = '';
    }
  }

  addMessageForm.addEventListener('submit', sendMessage);

}