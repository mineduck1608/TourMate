"use client"

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export default function Page() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("User" + Math.floor(Math.random() * 1000));
  const [message, setMessage] = useState("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7147/chatHub")
      .withAutomaticReconnect()
      .build();

    connect.start()
      .then(() => console.log("Connected to SignalR"))
      .catch(e => console.log("Connection failed: ", e));

    connect.on("ReceiveMessage", (user, message) => {
      setMessages((messages) => [...messages, { user, message }]);
    });

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection && message) {
      try {
        await connection.invoke("SendMessage", user, message);
        setMessage("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat App</h1>
      <div
        style={{
          border: "1px solid black",
          height: 300,
          overflowY: "scroll",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.user}:</b> {m.message}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage} style={{ width: "18%" }}>
        Send
      </button>
    </div>
  );
}
