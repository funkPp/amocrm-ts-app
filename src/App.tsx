import React from "react";
// import logo from './logo.svg';
import "./App.css";
import FetchGetLeads from "./components/FetchGetRequest";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <FetchGetLeads />
      </header>
    </div>
  );
}

export default App;
