# CortexMind 

CortexMind is a full-stack AI-powered chat application that simulates the functionality of modern large language model (LLM) platforms like ChatGPT and DeepSeek. This is a project that demonstrates several full-stack development skills, including real-time message streaming, authentication, API integration, and data persistence.

---

## Screenshots

### Chat in Progress (Real-Time Streaming with Code Blocks)
<img width="883" height="898" src="https://github.com/user-attachments/assets/6430b5fa-5fef-4dab-b9e3-03f4ae5e3708" />

### Clean, Responsive Chat Interface (Empty State)
<img width="1916" height="902" src="https://github.com/user-attachments/assets/2a0bc066-271b-421d-b904-958e54f613ce" />

### Sidebar Displaying User Chat Sessions
<img width="547" height="694" src="https://github.com/user-attachments/assets/fac3e028-873a-444a-b0b6-729622cd6b82" />


When a user clicks on a chat session, a request is sent to the backend to fetch all messages for that session, populating the page with the existing chat history.

### Response Style Selector
<img width="819" height="374" src="https://github.com/user-attachments/assets/573c5e80-a52b-4b44-92e4-cadb085b4474" />


Controls the `temperature` parameter of the DeepSeek-chat model, allowing users to adjust response creativity and style. More information can be found here: [DeepSeek Parameter Settings](https://api-docs.deepseek.com/quick_start/parameter_settings)

---

## Project Tech Stack

- **Frontend:** React, Tailwind CSS, Zustand
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL
- **Authentication:** Auth0
- **AI Integration:** DeepSeek LLM API

---

## Key Features

- 🔹 **Real-Time AI Chat**  
  Integrates with DeepSeek's `deepseek-chat` model to stream conversational responses incrementally.

- 🔹 **Responsive UI**  
  Built with React and Tailwind CSS for a sleek and responsive chat interface.

- 🔹 **User Authentication**  
  Secure login and session handling powered by Auth0, with chat history tied to user accounts.

- 🔹 **Persistent Storage**  
  All messages and sessions are stored in PostgreSQL.

---

## How It Works

1. Users log in through Auth0.
2. Frontend sends prompts to the backend.
3. Backend communicates with DeepSeek’s API, streams responses in real-time, and updates the database.
4. Stored messages are retrieved from PostgreSQL per user session.

---

## What I Learned

- Building real-time, stream-based chat UX
- Managing auth workflows across frontend and backend
- Structuring scalable database schemas for user-generated content
- Handling full-stack API integrations (LLM, Auth0, database)

---

## Note

This project was created for portfolio and learning purposes. It is not intended for production use and may lack certain security or scalability optimizations.
