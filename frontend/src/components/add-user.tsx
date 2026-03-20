'use client';

export default function AddUser() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New User', email: 'test@smilecorp.com' }),
    });
    
    window.location.reload(); // Refresh to see the new data
  };

  return <button onClick={handleSubmit}>Add Test User</button>;
}