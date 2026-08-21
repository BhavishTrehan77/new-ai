"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VivaPage() {
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  // 1. Hoisting Example
  // In JS, function declarations and var declarations are hoisted.
  const demonstrateHoisting = () => {
    addLog("--- Demonstrating Hoisting ---");
    
    // We can call hoistedFunction before it's defined because of hoisting
    hoistedFunction();
    
    // var is hoisted but initialized as undefined
    addLog(`Value of hoistedVar before initialization: ${hoistedVar}`); 
    
    var hoistedVar = "I am hoisted!";
    addLog(`Value of hoistedVar after initialization: ${hoistedVar}`);
    
    function hoistedFunction() {
      addLog("I am a hoisted function! I was called before my declaration.");
    }
  };

  // 2. Closures Example
  // A closure gives you access to an outer function's scope from an inner function.
  const demonstrateClosure = () => {
    addLog("--- Demonstrating Closures ---");
    
    function makeCounter() {
      let count = 0; // count is enclosed
      return function() {
        count += 1;
        return count;
      };
    }

    const counter = makeCounter(); // makeCounter executes and returns the inner function
    addLog(`Counter first call: ${counter()}`); // 1
    addLog(`Counter second call: ${counter()}`); // 2
    addLog("The inner function remembers the 'count' variable even after makeCounter finished execution. That's a closure!");
  };

  // 3. Event Loop Example
  // JS is single-threaded. The Event Loop manages the execution of code, collecting and processing events.
  const demonstrateEventLoop = () => {
    addLog("--- Demonstrating Event Loop ---");
    addLog("1. Sync execution starts (Call Stack)");

    setTimeout(() => {
      addLog("4. setTimeout callback executes (Macrotask Queue / Callback Queue)");
    }, 0);

    Promise.resolve().then(() => {
      addLog("3. Promise .then executes (Microtask Queue)");
    });

    addLog("2. Sync execution ends. Now Event loop will check Microtasks, then Macrotasks.");
  };

  // 4 & 5. Promises vs Callbacks & Async/Await
  const demonstratePromisesAndAsync = async () => {
    addLog("--- Demonstrating Promises vs Callbacks vs Async/Await ---");
    
    // Callback approach
    const simulateCallback = (callback) => {
      setTimeout(() => {
        callback("Callback result data");
      }, 500);
    };

    simulateCallback((data) => {
      addLog(`Callback result: ${data}`);
    });

    // Promise approach
    const simulatePromise = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Promise result data");
        }, 1000);
      });
    };

    simulatePromise().then((data) => {
      addLog(`Promise .then() result: ${data}`);
    });

    // Async/Await approach
    addLog("Waiting for async/await result...");
    try {
      const asyncData = await simulatePromise();
      addLog(`Async/Await result: ${asyncData}`);
      addLog("Notice how async/await makes asynchronous code look synchronous and easier to read!");
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333", fontWeight: "bold" }}>JavaScript Viva Concepts Demo</h1>
      <p style={{ marginBottom: "2rem", color: "#666", lineHeight: "1.5" }}>
        This page is created specifically for your Viva to easily demonstrate the requested JavaScript concepts. 
        Click the buttons below to run the code and explain the output in the console log area.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <button onClick={demonstrateHoisting} style={btnStyle}>1. Hoisting</button>
        <button onClick={demonstrateClosure} style={btnStyle}>2. Closures</button>
        <button onClick={demonstrateEventLoop} style={btnStyle}>3. Event Loop</button>
        <button onClick={demonstratePromisesAndAsync} style={btnStyle}>4 & 5. Promises & Async/Await</button>
        <button onClick={() => setLogs([])} style={{ ...btnStyle, backgroundColor: "#ef4444" }}>Clear Logs</button>
      </div>

      <div style={{ backgroundColor: "#1e1e1e", color: "#4ade80", padding: "1rem", borderRadius: "8px", minHeight: "350px", fontFamily: "monospace" }}>
        <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "0.5rem", marginBottom: "1rem", color: "#fff" }}>Output Log:</h3>
        {logs.length === 0 ? (
          <span style={{ color: "#888" }}>Waiting for actions...</span>
        ) : (
          logs.map((log, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ marginBottom: "0.5rem" }}
            >
              {`> ${log}`}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.2s"
};
