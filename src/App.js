import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      const chat = createChat({
        webhookUrl:
          "https://ianyian.app.n8n.cloud/webhook/99021e28-caeb-440d-880f-d600c8e37bed/chat",
        target: chatRef.current,
        theme: "light",
      });
      return () => {
        chat.unmount();
      };
    }
  }, []);

  return (
    <div className='App'>
      <div className='chat-container' ref={chatRef}></div>
    </div>
  );
}

export default App;
