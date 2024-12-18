// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [pistachioCount, setPistachioCount] = useState(0);
  const [scenario1Data, setScenario1Data] = useState([]);
  const [scenario2Data, setScenario2Data] = useState([]);
  const [shells, setShells] = useState([]);
  const [timer, setTimer] = useState({ scenario1: 0, scenario2: 0 });
  const [isSimulating, setIsSimulating] = useState(false);

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
    setIsSimulating(false);
  };

  // Simulate Scenario 1
  const simulateScenario1 = () => {
    let start = performance.now();
    const data = [...scenario1Data];
    while (data.some(p => !p.cracked)) {
      const index = data.findIndex(p => !p.cracked);
      if (index !== -1) {
        data[index].cracked = true;
        shuffleArray(data);
      }
    }
    setScenario1Data(data);
    const end = performance.now();
    return end - start;
  };

  // Simulate Scenario 2
  const simulateScenario2 = () => {
    let start = performance.now();
    const nutStack = [...scenario2Data];
    const shellStack = [...shells];
    while (nutStack.length > 0) {
      const pistachio = nutStack.pop();
      shellStack.push({ ...pistachio, cracked: true });
    }
    setScenario2Data([]);
    setShells(shellStack);
    const end = performance.now();
    return end - start;
  };

  // Shuffle array helper
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Handle simulation
  const handleSimulate = () => {
    setIsSimulating(true);
    const scenario1Time = simulateScenario1();
    const scenario2Time = simulateScenario2();
    setTimer({ scenario1: scenario1Time, scenario2: scenario2Time });
    setIsSimulating(false);
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
        <button onClick={initializePistachios}>Initialize</button>
        <button onClick={handleSimulate} disabled={isSimulating}>Simulate</button>
      </div>

      <div className="results">
        <p>Scenario 1 Time: {timer.scenario1.toFixed(2)} ms</p>
        <p>Scenario 2 Time: {timer.scenario2.toFixed(2)} ms</p>
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
        </div>

        <div className="scenario">
          <h2>Scenario 2</h2>
          <div className="cup">
            {scenario2Data.map((pistachio, index) => (
              <div key={index} className="pistachio"></div>
            ))}
          </div>
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