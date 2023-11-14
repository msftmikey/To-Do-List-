import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Confetti from 'react-dom-confetti';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyAYpvMKZiXfi3CdTPUKHMwM9mVHNCJnX44",
  authDomain: "planner-a78ec.firebaseapp.com",
  projectId: "planner-a78ec",
  storageBucket: "planner-a78ec.appspot.com",
  messagingSenderId: "1049673576302",
  appId: "1:1049673576302:web:27f5d0f9ffa3e606f79b7f",
  measurementId: "G-QLGE7MT6QR"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const database = firebaseApp.database();

function formatDate(dateString) {
  // This adds hour, minute, and timezone
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
  const localDate = new Date(dateString); // Parse the input date string

  // Adjust for timezone offset if needed
  // const utcDate = new Date(dateString + 'Z'); // If the input date is in UTC
  // const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);

  return localDate.toLocaleDateString('en-US', options);
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();

    setIsConfettiActive(true);

    setTimeout(() => {
      setIsConfettiActive(false);
    }, 3000);

    if (!dueDate) {
      setError('Please enter a due date.');
      return;
    }

    const taskObject = { name: newTask, dueDate: new Date(dueDate).toISOString() };
    setTasks([...tasks, taskObject]);

    firebase.database().ref('tasks').push(taskObject);
    setNewTask('');
    setDueDate('');
    setError('');
  };

  const handleTaskOpen = (taskName, taskDueDate) => {
    // You can open a new window here and display task details as needed.
    // For simplicity, we'll use an alert in this example.
    alert(`Task: ${taskName}\nDue Date: ${taskDueDate}`);
  };

  useEffect(() => {
    // Reference to the 'tasks' node in Firebase Realtime Database
    const tasksRef = firebase.database().ref('tasks');

    // Set up a listener to retrieve tasks from Firebase
    tasksRef.on('value', (snapshot) => {
      const tasksData = snapshot.val();

      if (tasksData) {
        // Convert the tasks object to an array
        const tasksArray = Object.entries(tasksData).map(([taskId, taskData]) => ({
          id: taskId,
          ...taskData,
        }));

        setTasks(tasksArray);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      tasksRef.off('value');
    };
  }, []);

  const handleTaskDelete = (taskId) => {
    // Reference to the task to be deleted in Firebase Realtime Database
    const taskRef = firebase.database().ref(`tasks/${taskId}`);
    // Remove the task from Firebase
    taskRef.remove()
      .then(() => {
        // Update local state after successfully deleting the task from the database
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => {
        console.error("Error removing task: ", error);
      });
  };

  const [isSettingsOpen, setSettingsOpen] = useState(false);
    
  const openSettings = () => {
    setSettingsOpen(true);
  };
  
  const closeSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <div className="container">

      <div className='sidebar'>
        <div className='todo'>TO-DO</div>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            id="task"
            name="task"
            autoComplete='off'
            placeholder=' Enter task name'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            id="due-date"
            name="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button class="add_task" type="submit"><span>Add Task</span></button>
          <Confetti active={isConfettiActive} config={{ angle: 90, spread: 360 }} />
          {error && <p className="error">{error}</p>}
        </form>
        <div class="settings_button" onClick={openSettings}>
          <i id="settings" class="material-symbols-outlined">settings</i>
          <span class="settings_text">Settings</span>
        </div>
      </div>
      
      <div className='content'>
        <TransitionGroup component="ul" id="task-list">
          {tasks.map((task) => (
            <CSSTransition
            key={task.id}
            classNames="fade"
            timeout={300}
            >
              <li>
                <p><b>{task.name}</b><br></br> Due {formatDate(task.dueDate)}</p>
                <div class='open_button'><button id='open_in_new' class="material-symbols-outlined" onClick={() => handleTaskOpen(task.name, formatDate(task.dueDate))}>open_in_new</button></div>
                <div class='delete_button'><button id='delete' class="material-symbols-outlined" onClick={() => handleTaskDelete(task.id)}>delete</button></div>
              </li>
            </CSSTransition>    
          ))}
        </TransitionGroup>
      </div>

      {isSettingsOpen && (
        <div className='settings-overlay'>
          <div className='settings-content'>
            <span className='close-button' onClick={closeSettings}>
              &times;
            </span>
            <h2>Settings</h2>

            <div className='setting-item'>
              <span className='setting-name'>Setting 1</span>
              <label className='toggle'>
                <input type='checkbox' />
                <span className='slider'></span>
              </label>
            </div>

            <div className='setting-item'>
              <span className='setting-name'>Setting 2</span>
              <label className='toggle'>
                <input type='checkbox' />
                <span className='slider'></span>
              </label>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;