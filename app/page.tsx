"use client"
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  /// function to call the openai router and process the streaming response
  async function retriveResponse() {
    /// call the route 
    const response: any = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        question
      }),
      next: { revalidate: 0 }
    })

    let resptext = "";
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    /// procees the stream
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      resptext += value;
      setAnswer(resptext);
    }
  }

  return (
    <div>
      <label htmlFor="Ask your question"></label>
      <input type="text" value={question} onChange={(e)=>setQuestion(e.target.value)}/>
      <button onClick={retriveResponse}>Stream Respone</button>
      <br />
      <p>{answer}</p>
    </div>
  );
}
