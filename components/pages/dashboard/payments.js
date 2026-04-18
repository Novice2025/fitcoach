import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { requestJson } from '../../lib/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');

  const fetchPayments = async () => {
    return requestJson('/payments');
  };

  useEffect(() => {
    let isMounted = true;

    fetchPayments()
      .then((data) => {
        if (isMounted) {
          setPayments(data);
          setError('');
        }
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        if (isMounted) {
          setPayments([]);
          setError('Unable to load payments. Make sure the Flask API is running on port 5000.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      await requestJson('/payments', {
        method: 'POST',
        body: JSON.stringify({ student_name: studentName, amount, status }),
      });
      setStudentName('');
      setAmount('');
      setStatus('Pending');
      const updatedPayments = await fetchPayments();
      setPayments(updatedPayments);
      setError('');
    } catch (error) {
      console.error("Error adding payment:", error);
      setError('Unable to save the payment right now. Check that the Flask API is available and try again.');
    }
  };

  return (
    <DashboardLayout>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>💰 Payments Management</h2>

      {error ? (
        <div style={{ marginBottom: '20px', padding: '14px 16px', backgroundColor: '#fff1f0', color: '#a8071a', border: '1px solid #ffa39e', borderRadius: '8px' }}>
          {error}
        </div>
      ) : null}

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#555' }}>Add New Payment</h3>
        <form onSubmit={handleAddPayment} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }} />
          <input type="text" placeholder="Amount (e.g., 150.00)" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }}>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Payment</button>
        </form>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px 10px', color: '#666' }}>Student</th>
              <th style={{ padding: '12px 10px', color: '#666' }}>Amount</th>
              <th style={{ padding: '12px 10px', color: '#666' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '500' }}>{p.student_name}</td>
                  <td style={{ padding: '12px 10px' }}>R$ {parseFloat(p.amount).toFixed(2)}</td> {/* Changed here */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ backgroundColor: p.status === 'Paid' ? '#e6ffed' : p.status === 'Pending' ? '#fffbe6' : '#fff1f0', color: p.status === 'Paid' ? '#389e0d' : p.status === 'Pending' ? '#d4b106' : '#cf1322', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: 'bold' }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '20px 10px', color: '#999', textAlign: 'center' }}>
                  {error ? 'Payment data is currently unavailable.' : 'No payments found yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}