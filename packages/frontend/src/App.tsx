import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/publish", {
        message,
      });

      setLog((prev) => [
        ...prev,
        `a message is sent: ${message} Id: ${res.data.messageId}`,
      ]);
      setMessage("");
    } catch (e) {
      setLog((prev) => [
        ...prev,
        `failed to send a message: ${message} / error: ${e}`,
      ]);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Pub/Sub send a message</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="enter a message"
        style={{ width: 300, marginRight: 8 }}
      />
      <button onClick={handleSend}>Send</button>
      <div style={{ marginTop: 24 }}>
        <h2>Log</h2>
        <ul>
          {log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
