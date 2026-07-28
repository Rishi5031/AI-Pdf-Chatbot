import { useState } from "react";
import api from "../services/api";

function ChatBox() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);

  const askQuestion = async () => {
    const response = await api.post("/api/chat", {
      question,
    });

    setResults(response.data.results);
  };

  return (
    <div>
      <h2>Ask a Question</h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askQuestion}>
        Search
      </button>

      <hr />

      {results.map((doc, index) => (
        <div key={index}>
          <p>{doc.answer}</p>

          <small>
            Page {doc.metadata.page + 1}
          </small>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default ChatBox;