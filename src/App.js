import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react"; 
import axios from "axios"; 
const QAComponent = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const openApiKey = "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"; // It's best practice not to hardcode your API key
  const [image, setImage] = useState('');

  async function generateImage(prompt) {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: 'POST',
      headers:   
   {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${openApiKey}`, 
      },
      body: JSON.stringify({
        prompt: question.length >0 ? question : 'car',
      
        size: "1024x1024", 
        n: 1, 
      }),
    });
  
    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }
  
    const data = await response.json();
    if(data.length>0)
    {
      setImage(data.data[0]);
    }
    return data.data; 
  }



  const getAnswer = async () => {
    setLoading(true);
    setAnswer('');
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: question }], // Use the question state here
        },
        {
          headers: {
            'Authorization': `Bearer ${openApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      setAnswer(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(question.length>0)
    {
      generateImage(question);
      console.log(image);
    } 
  },[question])

  return (
    <div>
      <h1>Question & Answer</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question"
      />
      <button onClick={getAnswer} disabled={loading}>
        {loading ? 'Loading...' : 'Get Answer'}
      </button>
      {answer && <div style={{ marginTop: '20px' }}><strong>Answer:</strong> {answer}</div>}
    <img height={100} width={100} src={image}></img>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <QAComponent />
    </div>
  );
}

export default App;