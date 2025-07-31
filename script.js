
           const API_KEY = 'AIzaSyCCGD7gAhS_3yzHtLUFthB3ooRvUgrRx6U';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const chatmessage = document.getElementById('chat-message');
  const userInput = document.getElementById('user-input');
  const sendbutton = document.getElementById('send-button');

  async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
  }

  function cleanMarkdown(text) {
    return text
      .replace(/#{1,6}\s?/g, '')   // remove markdown headers
      .replace(/\*\*/g, '')        // remove bold formatting
      .replace(/\n{3,}/g, '\n\n')  // replace 3+ newlines with 2
      .trim();                     // trim start and end whitespace
  }

  function addMessage(message, isUser) {
    const messageElement = document.createElement("div");
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'userimg.png' : 'bot.jpeg';
    profileImage.alt = isUser ? 'user' : 'bot';

    const messageContent = document.createElement("div");
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    if (isUser) {
      messageElement.appendChild(messageContent);
      messageElement.appendChild(profileImage);
    } else {
      messageElement.appendChild(profileImage);
      messageElement.appendChild(messageContent);
    }

    chatmessage.appendChild(messageElement);
    chatmessage.scrollTop = chatmessage.scrollHeight;
  }

  async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if (userMessage) {
      addMessage(userMessage, true);
      userInput.value = '';
      sendbutton.disabled = true;
      userInput.disabled = true;

      try {
        const botmessage = await generateResponse(userMessage);
        addMessage(cleanMarkdown(botmessage), false);
      } catch (error) {
        console.error(error);
        addMessage('Sorry, I am unable to respond. Please try later.', false);
      } finally {
        sendbutton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
      }
    }
  }

  sendbutton.addEventListener('click', handleUserInput);

  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  });


     function deleteMessage() {
      const msg = document.getElementById('message');
      msg.classList.add('fade-out');

      // Wait for animation to finish before removing
      setTimeout(() => {
        msg.remove();
      }, 400);
    }