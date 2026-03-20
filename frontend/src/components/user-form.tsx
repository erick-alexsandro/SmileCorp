'use client';
import { useState } from 'react';

export default function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    alert('User added!');
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-1" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-1" />
      <button type="submit" className="bg-blue-500 text-white p-2">Add User</button>
    </form>
  );
}