// App.js
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [pistachioCount, setPistachioCount] = useState(0);
  const [scenario1Data, setScenario1Data] = useState([]);
  const [scenario2Data, setScenario2Data] = useState([]);
  const [shells, setShells] = useState([]);
  const [timer, setTimer] = useState({ scenario1: 0, scenario2: 0 });
  const [crackedCount, setCrackedCount] = useState({ scenario1: 0, scenario2: 0 }); // Track cracked pistachios
  const [running, setRunning] = useState(false); // Track if simulation is running

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
  };

  // Simulate Scenario 1 with animations and retrieval
  const simulateScenario1 = () => {
    let start = performance.now();
    const data = [...scenario1Data];
    let cracked = 0;
    const interval = setInterval(() => {
      const index = data.findIndex((p) => !p.cracked);
      if (index !== -1) {
        // Crack the pistachio
        data[index].cracked = true;
        cracked++;

        // Update state and shuffle data to simulate O(n) retrieval
        setScenario1Data([...data]);
        shuffleArray(data);
        setCrackedCount((prev) => ({ ...prev, scenario1: cracked }));
      } else {
        clearInterval(interval);
        const end = performance.now();
        setTimer((prev) => ({ ...prev, scenario1: end - start }));
        setRunning(false);
      }
    }, 300); // Eating animation time remains consistent
  };

  // Simulate Scenario 2 with animations and retrieval
  const simulateScenario2 = () => {
    let start = performance.now();
    const nutStack = [...scenario2Data];
    const shellStack = [...shells];
    let cracked = 0;
    const interval = setInterval(() => {
      if (nutStack.length > 0) {
        // Crack the pistachio
        const pistachio = nutStack.pop();
        shellStack.push({ ...pistachio, cracked: true });
        cracked++;

        // Update state to reflect changes in stack
        setScenario2Data([...nutStack]);
        setShells([...shellStack]);
        setCrackedCount((prev) => ({ ...prev, scenario2: cracked }));
      } else {
        clearInterval(interval);
        const end = performance.now();
        setTimer((prev) => ({ ...prev, scenario2: end - start }));
        setRunning(false);
      }
    }, 300); // Eating animation time remains consistent
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
    setRunning(true);
    simulateScenario1();
    simulateScenario2();
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

      <div className="results">
        <p className={timer.scenario1 < timer.scenario2 ? 'highlight-green' : 'highlight-red'}>
          Scenario 1 Time: {timer.scenario1.toFixed(2)} ms ({crackedCount.scenario1} cracked)
        </p>
        <p className={timer.scenario2 < timer.scenario1 ? 'highlight-green' : 'highlight-red'}>
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
          <div className="pacman">🍴</div> {/* Visual Pacman eating animation */}
        </div>

        <div className="scenario">
          <h2>Scenario 2</h2>
          <div className="cup">
            {scenario2Data.map((pistachio, index) => (
              <div key={index} className="pistachio"></div>
            ))}
          </div>
          <div className="pacman">🍴</div> {/* Visual Pacman eating animation */}
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