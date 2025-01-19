import React, { useState, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid';
    import { format, isPast } from 'date-fns';
    import { ToastContainer, toast } from 'react-toastify';
    import { FaTrash, FaClock, FaBell } from 'react-icons/fa';

    function App() {
      const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
      });
      const [newTodo, setNewTodo] = useState('');
      const [newDeadline, setNewDeadline] = useState('');
      const [newReminder, setNewReminder] = useState('');
      const [editingTodoId, setEditingTodoId] = useState(null);
      const [editedTodoText, setEditedTodoText] = useState('');
      const [editedDeadline, setEditedDeadline] = useState('');
      const [editedReminder, setEditedReminder] = useState('');

      useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]);

      useEffect(() => {
        const interval = setInterval(() => {
          todos.forEach(todo => {
            if (todo.reminder && !todo.reminderSent && !isPast(new Date(todo.reminder))) {
              const now = new Date();
              const reminderTime = new Date(todo.reminder);
              if (Math.abs(reminderTime - now) <= 60000) {
                toast.info(`Reminder: ${todo.text}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 5000,
                });
                setTodos(prevTodos =>
                  prevTodos.map(t =>
                    t.id === todo.id ? { ...t, reminderSent: true } : t
                  )
                );
              }
            }
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [todos]);

      const addTodo = () => {
        if (newTodo.trim() === '') return;
        const newTodoItem = {
          id: uuidv4(),
          text: newTodo,
          deadline: newDeadline,
          reminder: newReminder,
          reminderSent: false,
        };
        setTodos([...todos, newTodoItem]);
        setNewTodo('');
        setNewDeadline('');
        setNewReminder('');
      };

      const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
      };

      const startEditTodo = (todo) => {
        setEditingTodoId(todo.id);
        setEditedTodoText(todo.text);
        setEditedDeadline(todo.deadline);
        setEditedReminder(todo.reminder);
      };

      const cancelEditTodo = () => {
        setEditingTodoId(null);
      };

      const saveEditTodo = (id) => {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, text: editedTodoText, deadline: editedDeadline, reminder: editedReminder } : todo
        ));
        setEditingTodoId(null);
      };

      const handleDeadlineChange = (e) => {
        setNewDeadline(e.target.value);
      };

      const handleReminderChange = (e) => {
        setNewReminder(e.target.value);
      };

      const handleEditDeadlineChange = (e) => {
        setEditedDeadline(e.target.value);
      };

      const handleEditReminderChange = (e) => {
        setEditedReminder(e.target.value);
      };

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
              To-Do List
            </h1>
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Add a new to-do..."
                className="border p-2 mb-2 rounded"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <input
                type="datetime-local"
                className="border p-2 mb-2 rounded"
                value={newDeadline}
                onChange={handleDeadlineChange}
              />
              <input
                type="datetime-local"
                className="border p-2 mb-2 rounded"
                value={newReminder}
                onChange={handleReminderChange}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={addTodo}
              >
                Add To-Do
              </button>
            </div>
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded shadow"
                >
                  {editingTodoId === todo.id ? (
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        className="border p-1 mb-1 rounded w-full"
                        value={editedTodoText}
                        onChange={(e) => setEditedTodoText(e.target.value)}
                      />
                      <input
                        type="datetime-local"
                        className="border p-1 mb-1 rounded w-full"
                        value={editedDeadline}
                        onChange={handleEditDeadlineChange}
                      />
                      <input
                        type="datetime-local"
                        className="border p-1 mb-1 rounded w-full"
                        value={editedReminder}
                        onChange={handleEditReminderChange}
                      />
                      <div className="flex justify-end">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                          onClick={() => saveEditTodo(todo.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded"
                          onClick={cancelEditTodo}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-gray-800">{todo.text}</p>
                        {todo.deadline && (
                          <p className="text-gray-600 text-sm flex items-center">
                            <FaClock className="mr-1" />
                            Deadline: {format(new Date(todo.deadline), 'MMM dd, yyyy hh:mm a')}
                          </p>
                        )}
                        {todo.reminder && (
                          <p className="text-gray-600 text-sm flex items-center">
                            <FaBell className="mr-1" />
                            Reminder: {format(new Date(todo.reminder), 'MMM dd, yyyy hh:mm a')}
                          </p>
                        )}
                      </div>
                      <div className="flex">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => startEditTodo(todo)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <ToastContainer />
        </div>
      );
    }

    export default App;
