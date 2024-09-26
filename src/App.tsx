import { useState } from "react";
import { ItemSuggestion } from "./components/ItemSuggestion";
import { getHistoric, setHistoric } from "./storage/historic";

type ProgressType = 'pending' | 'started' | 'done';

function App() {
  const [progress, setProgress] = useState<ProgressType>('pending');
  const [textarea, setTextarea] = useState<string>('');
  const [chat, setChat] = useState<string[]>([]);

  function resetChat() {
    setProgress('pending');
    setChat([]);
  }

  function handleSubmitChat() {
    const message = textarea.trim(); 
    if (!message) return; 

    setTextarea(''); 

    if (progress === 'pending') {
      setHistoric(message)
      setChat(prevChat => [...prevChat, message, 'Aqui será a pergunta gerada por uma IA.']);
      setProgress('started');
    } else if (progress === 'started') {
      setChat(prevChat => [...prevChat, message, 'Aqui será o feedback gerado por uma IA.']);
      setProgress('done');
    }
  }

  return (
    <div className="container">
      <div className="sidebar">
        <details open className="suggestion">
          <summary>Tópicos Sugeridos</summary>
          <ItemSuggestion title="HTML" onClick={() => setTextarea('HTML')} />
          <ItemSuggestion title="CSS" onClick={() => setTextarea('CSS')} />
          <ItemSuggestion title="JavaScript" onClick={() => setTextarea('JavaScipt')}  />
          <ItemSuggestion title="TypeScript" onClick={() => setTextarea('TypeScript')} />
        </details>

        <details open className="historic">
          <summary>Histórico</summary>

          {
            getHistoric().map(item => (
              <ItemSuggestion title={item} onClick={() => setTextarea(item)}/>
            ))
          }
          
        </details>
      </div>

      <div className="content">
        {progress === 'pending' && (
          <div className="box-home">
            <span>Olá, eu sou o</span>
            <h1>teach<span>.me</span></h1>
            <p>
              Estou aqui para te ajudar nos seus estudos.
              Selecione um dos tópicos sugeridos ao lado
              ou digite um tópico que deseja estudar para
              começarmos.
            </p>
          </div>
        )}

        {progress !== 'pending' && (
          <div className="box-chat">
            <h1>Você está estudando sobre <span>{chat[0]}</span></h1>

            {progress === 'started' && chat.length > 1 && (
              <div className="question">
                <h2><img src="./assets/question.svg" alt="Pergunta" /></h2>
                <p>{chat[1]}</p>
              </div>
            )}

            {progress === 'done' && chat.length > 2 && (
              <div className="answer">
                <h2>Sua Resposta</h2>
                <p>{chat[2]}</p>
              </div>
            )}

            {progress === 'done' && chat.length > 3 && (
              <div className="feedback">
                <h2>Feedback teach<span>.me</span></h2>
                <p>{chat[3]}</p>
                <div className="actions">
                  <button onClick={resetChat}>Estudar novo tópico</button>
                </div>
              </div>
            )}
          </div>
        )}

        {progress !== 'done' && (
          <div className="box-input">
            <textarea 
              value={textarea}
              onChange={element => setTextarea(element.target.value)}
              placeholder={progress === 'started' ? "Insira sua resposta..." : "Insira o tema que deseja estudar"}
            />
            <button onClick={handleSubmitChat}>
              {progress === 'pending' ? 'Enviar Pergunta' : "Enviar Resposta"}
            </button>
          </div>
        )}

        <footer className="box-footer">
          <p>teach<span>.me</span></p>
        </footer>
      </div>
    </div>
  );
}

export default App;
