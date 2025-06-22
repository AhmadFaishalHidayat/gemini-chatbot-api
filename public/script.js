const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  // Show a "thinking" message while we wait for the response
  const thinkingMessage = appendMessage("bot", "Gemini is thinking...");

  try {
    // Send the user message to the backend API
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Update the "thinking" message with the actual response
    thinkingMessage.textContent = data.replay;
  } catch (error) {
    console.error("Error fetching chat response:", error);
    // Update the "thinking" message to show an error
    thinkingMessage.textContent =
      "Sorry, something went wrong. Please try again.";
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  // Return the element so we can reference it later
  return msg;
}
