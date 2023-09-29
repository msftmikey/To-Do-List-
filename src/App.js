import React, { useState, useEffect } from 'react';
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

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!dueDate) {
      setError('Please enter a due date.');
      return;
    }

    const taskObject = { name: newTask, dueDate };
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
      <h1>To-Do List</h1>
      <form onSubmit={handleAddTask}>
        <label htmlFor="task">Task:</label>
        <input
          type="text"
          id="task"
          name="task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <label htmlFor="due-date">Due Date:</label>
        <input
          type="date"
          id="due-date"
          name="due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Task</button>
        {error && <p className="error">{error}</p>}
      </form>
      <ul id="task-list">
  {tasks.map((task) => (
    <li key={task.id}>
      {task.name} -- {task.dueDate}
      <button onClick={() => handleTaskOpen(task.name, task.dueDate)}>Open Task</button>
      <button onClick={() => handleTaskDelete(task.id)}>Delete Task</button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;