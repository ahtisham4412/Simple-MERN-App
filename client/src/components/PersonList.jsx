import React from 'react';

const PersonList = ({ people, onEdit, onDelete }) => {
  // Fix: Check if people is defined and is an array before mapping
  if (!people || !Array.isArray(people)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No people data available or still loading...</p>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No people found. Add someone to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>People List</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {people.map((person) => (
          <div 
            key={person.id || person._id} 
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{person.name}</h3>
            <p><strong>Email:</strong> {person.email}</p>
            {person.phone && <p><strong>Phone:</strong> {person.phone}</p>}
            {person.department && <p><strong>Department:</strong> {person.department}</p>}
            
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => onEdit(person)}
                style={{
                  marginRight: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(person.id || person._id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonList;
