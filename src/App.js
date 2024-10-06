import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import TaskManager from './Pages/Task';

const App = () => {
  return (
    <Router> 
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<TaskManager />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
