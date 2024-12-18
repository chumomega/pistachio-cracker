// App.js
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [pistachioCount, setPistachioCount] = useState(0);
  const [scenario1Data, setScenario1Data] = useState([]);
  const [scenario2Data, setScenario2Data] = useState([]);
  const [shells, setShells] = useState([]);
  const [timer, setTimer] = useState({ scenario1: 0, scenario2: 0 });
  const [crackedCount, setCrackedCount] = useState({ scenario1: 0, scenario2: 0 });
  const [running, setRunning] = useState(false);
  const [timeoutMessage, setTimeoutMessage] = useState(false);

  // Initialize pistachios
  const initializePistachios = () => {
    const pistachios = Array.from({ length: pistachioCount }, (_, i) => ({
      id: i,
      cracked: false,
    }));
    setScenario1Data([...pistachios]);
    setScenario2Data([...pistachios]);
    setShells([]);
    setTimer({ scenario1: 0, scenario2: 0 });
    setCrackedCount({ scenario1: 0, scenario2: 0 });
    setRunning(false);
    setTimeoutMessage(false);
  };

  const simulateScenario1 = async () => {
    let start = performance.now();
    const data = [...scenario1Data];
    let cracked = 0;

    for (let i = 0; i < pistachioCount; i++) {
      const retrievalDelay = cracked * 10;
      await new Promise((resolve) => setTimeout(resolve, retrievalDelay));

      const index = data.findIndex((p) => !p.cracked);
      if (index !== -1) {
        data[index].cracked = true;
        cracked++;
        shuffleArray(data);
        setScenario1Data([...data]);
        setCrackedCount((prev) => ({ ...prev, scenario1: cracked }));
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const end = performance.now();
    setTimer((prev) => ({ ...prev, scenario1: end - start }));
  };

  const simulateScenario2 = async () => {
    let start = performance.now();
    const nutStack = [...scenario2Data];
    const shellStack = [...shells];
    let cracked = 0;

    for (let i = 0; i < pistachioCount; i++) {
      const pistachio = nutStack.pop();
      if (pistachio) {
        shellStack.push({ ...pistachio, cracked: true });
        cracked++;
        setScenario2Data([...nutStack]);
        setShells([...shellStack]);
        setCrackedCount((prev) => ({ ...prev, scenario2: cracked }));
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const end = performance.now();
    setTimer((prev) => ({ ...prev, scenario2: end - start }));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleSimulate = async () => {
    setRunning(true);
    const timeout = setTimeout(() => {
      setRunning(false);
      setTimeoutMessage(true);
    }, 60000); // Timeout after 60 seconds

    await Promise.all([simulateScenario1(), simulateScenario2()]);
    clearTimeout(timeout);
    setRunning(false);
  };

  const getResultClass = (scenario) => {
    if (!running && timer[scenario] > 0) {
      if (
        (timer.scenario1 > 0 && timer.scenario2 > 0 && timer[scenario] <= Math.min(timer.scenario1, timer.scenario2)) ||
        (timer.scenario1 === 0 && scenario === 'scenario2') ||
        (timer.scenario2 === 0 && scenario === 'scenario1')
      ) {
        return 'highlight-green';
      }
    }
    return 'highlight-red';
  };

  return (
    <div className="App">
      <h1>Pistachio Simulator</h1>
      <div className="input-section">
        <label htmlFor="pistachioCount">Number of Pistachios:</label>
        <input
          id="pistachioCount"
          type="number"
          value={pistachioCount}
          onChange={(e) => setPistachioCount(Number(e.target.value))}
          min="1"
        />
        <button onClick={initializePistachios} disabled={running}>Initialize</button>
        <button onClick={handleSimulate} disabled={running || pistachioCount === 0}>Simulate</button>
      </div>

      {timeoutMessage && <p className="timeout">Simulation timed out after 60 seconds!</p>}

      <div className="results">
        <p className={getResultClass('scenario1')}>
          Scenario 1 Time: {timer.scenario1.toFixed(2)} ms ({crackedCount.scenario1} cracked)
        </p>
        <p className={getResultClass('scenario2')}>
          Scenario 2 Time: {timer.scenario2.toFixed(2)} ms ({crackedCount.scenario2} cracked)
        </p>
      </div>

      <div className="simulation">
        <div className="scenario">
          <h2>Scenario 1</h2>
          <div className="cup">
            {scenario1Data.map((pistachio) => (
              <div
                key={pistachio.id}
                className={`pistachio ${pistachio.cracked ? 'cracked' : ''}`}
              ></div>
            ))}
          </div>
          <div className="pacman">😋</div>
        </div>

        <div className="scenario">
          <h2>Scenario 2</h2>
          <div className="cup">
            {scenario2Data.map((pistachio, index) => (
              <div key={index} className="pistachio"></div>
            ))}
          </div>
          <div className="pacman">😋</div>
          <h3>Shell Pile</h3>
          <div className="cup">
            {shells.map((shell, index) => (
              <div key={index} className="pistachio cracked"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;