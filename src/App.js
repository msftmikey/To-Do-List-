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
      setError('Please a due date.');
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

  return (
    <div className="container">
      <div className='sidebar'>
        <form onSubmit={handleAddTask}>
          <div className='todo'>To-Do</div>
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
          <label htmlFor="due-date"></label>
          <input
            type="datetime-local"
            id="due-date"
            name="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button type="submit">Add Task</button>
          <Confetti active={isConfettiActive} config={{ angle: 90, spread: 360 }} />
          {error && <p className="error">{error}</p>}
        </form>
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
    </div>
  );
}

export default App;