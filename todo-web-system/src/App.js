import React, { useState } from 'react';
import './App.css';
import SignUp from './SignUp';
import './SignUp.css';
import Login from './Login';
import './Login.css';
import PasswordRecovery from './PasswordRecovery';
import './PasswordRecovery.css';
import TaskCreation from './TaskCreation';
import './TaskCreation.css';
import TaskList from './TaskList';
import './TaskList.css';
import TaskEdit from './TaskEdit';
import './TaskEdit.css';

function App() {
  const [token, setToken] = useState('');

  return (
    <div className="App">
      {!token ? (
        <>
          <SignUp />
          <Login setToken={setToken} />
        </>
      ) : (
        <TaskList token={token} />
      )}
    </div>
  );
}

export default App;
