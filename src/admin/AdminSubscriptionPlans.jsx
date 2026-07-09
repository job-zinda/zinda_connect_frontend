import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API, { getAdminPlansAPI, createAdminPlanAPI } from "../apis/Api";
import "../styles/AdminSubscriptionPlans.css";

export default function AdminSubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_months: "1",
    features: "", 
    badge_color: "#6c757d",
    is_free: false,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getAdminPlansAPI();
      setPlans(res.data || []);
    } catch (err) {
      console.error("Failed to load plans", err);
      toast.error("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
     ...formData, 
      [name]: type === 'checkbox'? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    if (!name) {
      toast.error("Plan name is required");
      return;
    }

    const priceDigits = String(formData.price).replace(/\D/g, "");
    const finalPrice = parseInt(priceDigits, 10);
    if (isNaN(finalPrice) || finalPrice < 0) {
      toast.error("Price must be a valid number");
      return;
    }

    const finalDuration = parseInt(formData.duration_months, 10);
    if (isNaN(finalDuration) || finalDuration < 1) {
      toast.error("Duration must be at least 1 month");
      return;
    }

 
    const featuresList = formData.features
     .split(',')
     .map(f => f.trim())
     .filter(f => f);

    const dataToSend = {
      name: name,
      price: Number(finalPrice), 
      duration_months: Number(finalDuration),
      features: featuresList, 
      badge_color: formData.badge_color,
      is_free: formData.is_free,
    };

    try {
      if (isEditing) {
        await API.put(`admin/plans/${editingId}/`, dataToSend);
        toast.success("Subscription plan updated successfully!");
      } else {
        await createAdminPlanAPI(dataToSend);
        toast.success("Subscription plan created successfully!");
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      console.error("Error saving plan:", err.response?.data);
      const backendErrors = err.response?.data;
      if (backendErrors) {
        const errorMsg = Object.entries(backendErrors)
         .map(([key, val]) => `${key}: ${Array.isArray(val)? val[0] : val}`)
         .join(" | ");
        toast.error(errorMsg);
      } else {
        toast.error("Failed to save subscription plan.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await API.delete(`admin/plans/${id}/`);
      toast.success("Plan deleted successfully!");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete plan.");
    }
  };

  const handleEditClick = (plan) => {
    setIsEditing(true);
    setEditingId(plan.id);
    setFormData({
      name: plan.name || "",
      price: String(plan.price || ""),
      duration_months: String(plan.duration_months || 1),
      features: Array.isArray(plan.features)? plan.features.join(', ') : (plan.features || ""),
      badge_color: plan.badge_color || "#6c757d",
      is_free: plan.is_free || false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ 
      name: "", 
      price: "", 
      duration_months: "1", 
      features: "",
      badge_color: "#6c757d",
      is_free: false 
    });
  };

  return (
    <div className="admin-manage-content">
      <div className="page-header">
        <h2>Subscription Plans Management</h2>
        <button className="add-btn" onClick={() => (showForm? resetForm() : setShowForm(true))}>
          {showForm? "View Plans" : "+ Add New Plan"}
        </button>
      </div>

      {showForm? (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3 className="form-header">{isEditing? "Edit Subscription Plan" : "Create Subscription Plan"}</h3>

          <div className="form-grid">
            <div className="form-control">
              <label>Plan Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                placeholder="e.g., Premium Monthly"
              />
            </div>

            <div className="form-control">
              <label>Price (₹)</label>
              <input
                className="form-input"
                type="text"
                name="price"
                value={formData.price}
                required
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({...formData, price: val });
                }}
                placeholder="e.g., 500"
              />
            </div>

            <div className="form-control">
              <label>Duration (in Months)</label>
              <input
                className="form-input"
                type="number"
                name="duration_months"
                value={formData.duration_months}
                required
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-control">
              <label>Badge Color</label>
              <input
                className="form-input"
                type="color"
                name="badge_color"
                value={formData.badge_color}
                onChange={handleChange}
              />
            </div>

            <div className="form-control" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="is_free"
                  checked={formData.is_free}
                  onChange={handleChange}
                />
                Is Free Plan
              </label>
            </div>

            <div className="form-control" style={{ gridColumn: '1 / -1' }}>
              <label>Features (Separate with commas)</label>
              <textarea
                className="form-textarea"
                name="features"
                rows="3"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g., Unlimited Likes, Profile Boost, Priority Support"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="action-btn action-btn-primary">
              {isEditing? "Update Plan" : "Create Plan"}
            </button>
            <button type="button" className="action-btn action-btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="table-card">
          {loading? (
            <p className="empty-state">Loading plans...</p>
          ) : plans.length === 0? (
            <p className="empty-state">
              No subscription plans available. Click "+ Add New Plan" to create one.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Type</th>
                  <th>Features</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td data-label="Plan Name">
                      <span style={{ 
                        display: 'inline-block', 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: plan.badge_color,
                        borderRadius: '50%',
                        marginRight: '8px'
                      }}></span>
                      {plan.name}
                    </td>
                    <td data-label="Price">₹{plan.price}</td>
                    <td data-label="Duration">{plan.duration_months} Month(s)</td>
                    <td data-label="Type">
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '11px',
                        backgroundColor: plan.is_free? '#6c757d' : '#2b8a3e',
                        color: 'white'
                      }}>
                        {plan.is_free? 'Free' : 'Premium'}
                      </span>
                    </td>
                    <td data-label="Features" style={{ fontSize: '12px' }}>
                      {Array.isArray(plan.features)? plan.features.join(', ') : plan.features}
                    </td>
                    <td data-label="Actions">
                      <div className="table-actions">
                        <button type="button" className="action-btn edit" onClick={() => handleEditClick(plan)}>
                          Edit
                        </button>
                        <button type="button" className="action-btn delete" onClick={() => handleDelete(plan.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}