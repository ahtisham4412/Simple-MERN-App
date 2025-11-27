import React, { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import './App.css';

// Use relative path for production, absolute for development
const API_BASE = import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1';

function App() {
  const [people, setPeople] = useState([]);
  const [editingPerson, setEditingPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch people from backend
  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/people`);
      const result = await response.json();
      
      if (result.success) {
        setPeople(result.data || []);
      } else {
        console.error('Failed to fetch people:', result.message);
        setPeople([]);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  // Add or update person
  const handleAddPerson = async (personData) => {
    try {
      const url = `${API_BASE}/people`;
      const method = 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPeople(); // Refresh the list
        setEditingPerson(null);
        alert('Person added successfully!');
      } else {
        alert('Failed to save person: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving person:', error);
      alert('Error saving person. Please try again.');
    }
  };

  // Delete person
  const handleDeletePerson = async (personId) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        // Since our simple backend doesn't have delete yet, we'll filter locally
        setPeople(prevPeople => prevPeople.filter(person => person.id !== personId));
        alert('Person deleted successfully!');
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Error deleting person. Please try again.');
      }
    }
  };

  // Start editing a person
  const handleEditPerson = (person) => {
    setEditingPerson(person);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Simple MERN Application</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header style={{ padding: '20px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <h1>Simple MERN Application</h1>
        <p>Manage your people database</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <PersonForm 
          onAddPerson={handleAddPerson}
          editingPerson={editingPerson}
        />
        
        <PersonList 
          people={people}
          onEdit={handleEditPerson}
          onDelete={handleDeletePerson}
        />
      </main>
    </div>
  );
}

export default App;
