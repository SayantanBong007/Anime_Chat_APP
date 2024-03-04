/*******************************************/
/*          Socket.IO Client Setup          */
/*******************************************/

// Initializing Socket.IO client-side connection
const socket = io();

/*******************************************/
/*           Variables Declaration         */
/*******************************************/

let name;
let textArea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

/*******************************************/
/*             User Name Input             */
/*******************************************/

// Prompting the user to enter their name
do {
  name = prompt("Please Enter Your Name:");
} while (!name);

/*******************************************/
/*          Text Area Event Listener        */
/*******************************************/

// Event listener for detecting 'Enter' key press in the text area
textArea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

/*******************************************/
/*            Send Message Function        */
/*******************************************/

// Function to send a message to the server
function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };

  // Appending the outgoing message to the message area
  appendMessage(msg, "outgoing");

  // Clearing the text area after sending the message
  textArea.value = "";

  // Scrolling to the bottom of the message area
  scrollToBottom();

  // Sending the message to the server
  socket.emit("message", msg);
}

/*******************************************/
/*          Append Message Function        */
/*******************************************/

// Function to append a message to the message area
function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>`;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

/*******************************************/
/*          Receive Message Handler         */
/*******************************************/

// Handling incoming messages from the server
socket.on("message", (msg) => {
  // Appending the incoming message to the message area
  appendMessage(msg, "incoming");

  // Scrolling to the bottom of the message area
  scrollToBottom();
});

/*******************************************/
/*          Scroll to Bottom Function      */
/*******************************************/

// Function to scroll to the bottom of the message area
function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

/*******************************************/
/*     Typing Indicator Functionality      */
/*******************************************/

// Get reference to typing indicator element
const typingIndicator = document.getElementById("typing-indicator");

// Get reference to message input field
const messageInput = document.getElementById("textarea");

// Typing indicator timeout duration in milliseconds
const TYPING_TIMEOUT = 2000; // 2 seconds

// Variable to store typing timeout
let typingTimeout;

// Function to display typing indicator UI for other users
function showTypingIndicator() {
  typingIndicator.style.display = "block";
}

// Function to hide typing indicator UI for other users
function hideTypingIndicator() {
  typingIndicator.style.display = "none";
}

// Listen for input events on message input field
messageInput.addEventListener("input", () => {
  // Clear any previous typing timeout
  clearTimeout(typingTimeout);

  // Set a timeout to emit stop typing event and hide typing indicator after TYPING_TIMEOUT milliseconds
  typingTimeout = setTimeout(() => {
    socket.emit("stopTyping");
    hideTypingIndicator();
  }, TYPING_TIMEOUT);

  // Emit typing event when user starts typing
  socket.emit("typing");
});

// Listen for typing event from other users
socket.on("userTyping", (userId) => {
  // Display typing indicator UI for other users
  showTypingIndicator();
});

// Listen for stop typing event from other users
socket.on("userStoppedTyping", (userId) => {
  // Hide typing indicator UI for other users
  hideTypingIndicator();
});
