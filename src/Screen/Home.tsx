import { useState } from "react";

export default function Home() {
  const [userName] = useState("Adaolisa");

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>Savings Goal</h1>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h2>Welcome {userName},</h2>
          <p className="tagline">Get closer to your goal with every pound</p>
        </div>

        <div className="motivation-card">
          <p>"Small consistent savings grow into significant wealth"</p>
        </div>

        <button className="primary-button">Get Started</button>

        <div className="goal-preview">
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "35%" }}></div>
            </div>
            <p className="progress-text">£1,250 saved of £3,500 goal</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// CSS Styles
const styles = `
  .home-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .app-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .app-header h1 {
    color: #5E35B1;
    font-size: 2.2rem;
    margin: 0;
    font-weight: 700;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .welcome-section h2 {
    font-size: 1.8rem;
    margin-bottom: 8px;
    color: #2D3748;
  }

  .tagline {
    font-size: 1.1rem;
    color: #4A5568;
    margin-top: 0;
    font-weight: 500;
  }

  .motivation-card {
    font-style: italic;
    margin: 30px 0;
    padding: 16px;
    background-color: #EDE7F6;
    border-radius: 10px;
    text-align: center;
    color: #5E35B1;
    font-size: 1rem;
  }

  .primary-button {
    background-color: #5E35B1;
    color: white;
    border: none;
    padding: 16px;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    margin: 20px 0;
    width: 100%;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .primary-button:hover {
    background-color: #7C4DFF;
  }

  .goal-preview {
    margin-top: 40px;
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .progress-container {
    text-align: center;
  }

  .progress-bar {
    height: 16px;
    background-color: #E2E8F0;
    border-radius: 8px;
    margin: 16px 0;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #7C4DFF;
    border-radius: 8px;
    transition: width 0.5s ease;
  }

  .progress-text {
    font-weight: 600;
    color: #5E35B1;
    margin-top: 8px;
    font-size: 0.95rem;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
