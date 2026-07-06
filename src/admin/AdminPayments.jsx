// src/admin/AdminPayments.jsx
import React, { useState, useEffect } from 'react';
import { getAdminPaymentsAPI } from "../apis/Api";
import '../styles/AdminManage.css';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAdminPaymentsAPI();
      setPayments(res.data || []);
    } catch (err) {
      console.error("Failed to load payment history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-manage-page">
      <div className="page-header">
        <h2>Payments Management</h2>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#868e96" }}>
            <p>No transactions found. Live payments will appear here automatically once users subscribe.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.user_name || payment.user?.full_name}</td>
                  <td className="bold-text">{payment.plan_name}</td>
                  <td>₹{payment.amount}</td>
                  <td><code>{payment.transaction_id}</code></td>
                  <td><span className={`status-badge ${payment.status?.toLowerCase()}`}>{payment.status}</span></td>
                  <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}