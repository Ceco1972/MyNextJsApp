'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mouse follower */}
      <div 
        className="fixed w-6 h-6 bg-white rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Hero section */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome to
            </h1>
            <h2 className="text-7xl md:text-9xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              NEXT.JS
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the future of web development with React, TypeScript, and Tailwind CSS
            </p>
          </div>

          {/* Todo List Section */}
          <div className="mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-6 text-white">📝 Todo List</h3>
              
              {/* Add Todo Form */}
              <form onSubmit={addTodo} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo item..."
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Todo List */}
              <div className="space-y-3">
                {todos.length === 0 ? (
                  <p className="text-gray-300 text-center py-8">No todos yet. Add one above! ✨</p>
                ) : (
                  todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-3 p-4 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 ${
                        todo.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          todo.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/50 hover:border-white'
                        }`}
                      >
                        {todo.completed && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </button>
                      <span
                        className={`flex-1 text-left ${
                          todo.completed ? 'line-through text-gray-400' : 'text-white'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 px-2 py-1 rounded hover:bg-red-500/20"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Todo Stats */}
              {todos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/20 text-center text-gray-300">
                  <p>
                    {todos.filter(t => t.completed).length} of {todos.length} completed
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Built-in performance optimizations and automatic code splitting"
              },
              {
                icon: "🎨",
                title: "Beautiful UI",
                description: "Modern design with Tailwind CSS and responsive layouts"
              },
              {
                icon: "🔧",
                title: "Developer Experience",
                description: "Hot reload, TypeScript support, and excellent tooling"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              View Documentation
            </button>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "100K+", label: "Developers" },
              { number: "50M+", label: "Downloads" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-400">
        <div className="flex justify-center space-x-8 mb-4">
          <a href="#" className="hover:text-white transition-colors duration-300">GitHub</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Documentation</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Community</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Blog</a>
        </div>
        <p className="text-sm">Built with ❤️ using Next.js and Tailwind CSS</p>
      </footer>
    </div>
  );
}
