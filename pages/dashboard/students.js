import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { requestJson, deleteStudent, updateStudent } from '../../lib/api'; // Import new API functions

export default function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  // New state for editing
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedGoal, setEditedGoal] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  const fetchStudents = async () => {
    return requestJson('/students');
  };

  useEffect(() => {
    let isMounted = true;

    fetchStudents()
      .then((data) => {
        if (isMounted) {
          if (data === null) {
            setStudents([]);
            setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
          } else {
            setStudents(data);
            setError('');
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        if (isMounted) {
          setStudents([]);
          setError('Unable to load students. Make sure the Flask API is running on port 5000.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await requestJson('/students', {
        method: 'POST',
        body: JSON.stringify({ name, goal, status: 'Active' }),
      });
      setName('');
      setGoal('');
      const updatedStudents = await fetchStudents();
      setStudents(updatedStudents);
      setError('');
    } catch (error) {
      console.error("Error adding student:", error);
      setError('Unable to save the student right now. Check that the Flask API is available and try again.');
    }
  };

  // New: Handle Delete Student
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        const updatedStudents = await fetchStudents();
        setStudents(updatedStudents);
        setError('');
      } catch (error) {
        console.error("Error deleting student:", error);
        setError('Unable to delete the student right now. Check that the Flask API is available and try again.');
      }
    }
  };

  // New: Handle Edit Click
  const handleEditClick = (student) => {
    setEditingStudentId(student.id);
    setEditedName(student.name);
    setEditedGoal(student.goal);
    setEditedStatus(student.status);
  };

  // New: Handle Save Edit
  const handleSaveEdit = async (id) => {
    try {
      await updateStudent(id, { name: editedName, goal: editedGoal, status: editedStatus });
      setEditingStudentId(null); // Exit editing mode
      setEditedName('');
      setEditedGoal('');
      setEditedStatus('');
      const updatedStudents = await fetchStudents();
      setStudents(updatedStudents);
      setError('');
    } catch (error) {
      console.error("Error updating student:", error);
      setError('Unable to update the student right now. Check that the Flask API is available and try again.');
    }
  };

  // New: Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditedName('');
    setEditedGoal('');
    setEditedStatus('');
  };

  return (
    <DashboardLayout>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Students Management</h2>

      {error ? (
        <div style={{ marginBottom: '20px', padding: '14px 16px', backgroundColor: '#fff1f0', color: '#a8071a', border: '1px solid #ffa39e', borderRadius: '8px' }}>
          {error}
        </div>
      ) : null}

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#555' }}>Add New Student</h3>
        <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }} />
          <input type="text" placeholder="Goal (e.g., Weight Loss)" value={goal} onChange={(e) => setGoal(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Student</button>
        </form>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px 10px', color: '#666' }}>Name</th>
              <th style={{ padding: '12px 10px', color: '#666' }}>Goal</th>
              <th style={{ padding: '12px 10px', color: '#666' }}>Status</th>
              <th style={{ padding: '12px 10px', color: '#666', width: '150px' }}>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                  {editingStudentId === student.id ? (
                    <>
                      <td style={{ padding: '12px 10px' }}>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                        />
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <input
                          type="text"
                          value={editedGoal}
                          onChange={(e) => setEditedGoal(e.target.value)}
                          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                        />
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 10px', display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleSaveEdit(student.id)}
                          style={{ padding: '8px 12px', backgroundColor: '#52c41a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85em' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{ padding: '8px 12px', backgroundColor: '#f5222d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85em' }}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '12px 10px', fontWeight: '500' }}>{student.name}</td>
                      <td style={{ padding: '12px 10px', color: '#555' }}>{student.goal}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ backgroundColor: student.status === 'Active' ? '#e6ffed' : '#fff1f0', color: student.status === 'Active' ? '#389e0d' : '#cf1322', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: 'bold' }}>
                          {student.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleEditClick(student)}
                          style={{ padding: '8px 12px', backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85em' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          style={{ padding: '8px 12px', backgroundColor: '#f5222d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85em' }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px 10px', color: '#999', textAlign: 'center' }}> {/* colSpan updated */}
                  {error ? 'Student data is currently unavailable.' : 'No students found yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}