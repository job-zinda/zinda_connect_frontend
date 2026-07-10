import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaHeadset, FaExternalLinkAlt, FaCheck, FaTimes } from "react-icons/fa";
import { getSubscriptionAPI, cancelSubscriptionAPI, getPublicPlansAPI, createPaymentOrderAPI, verifyPaymentAPI } from "../apis/Api"; 
import { toast } from "react-toastify";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Subscription() {
  const navigate = useNavigate();
  const [subData, setSubData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    fetchSubscriptionAndPlans();
  }, []);

  const fetchSubscriptionAndPlans = async () => {
    try {
      setLoading(true);
      const [subRes, plansRes] = await Promise.all([
        getSubscriptionAPI(),
        getPublicPlansAPI()
      ]);
      setSubData(subRes.data);
      setAvailablePlans(plansRes.data || []);
    } catch (error) {
      console.error("Subscription fetch failed:", error);
      toast.error("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your active subscription?")) return;
    try {
      await cancelSubscriptionAPI();
      toast.success("Subscription cancelled successfully.");
      fetchSubscriptionAndPlans();
    } catch (error) {
      toast.error("Failed to cancel subscription.");
    }
  };

  const handleChangePlan = () => {
    setShowPlansModal(true);
  };

  const handlePayment = async (plan) => {
    setIsProcessingPayment(true);
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const orderRes = await createPaymentOrderAPI({ plan_id: plan.id }); 

      const { order_id, amount, currency, key, plan_name } = orderRes.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Zinda Connect",
        description: `${plan_name} Subscription`,
        order_id: order_id,
        handler: async function (response) {
          try {
            await verifyPaymentAPI({ 
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan_id: plan.id
            });

            toast.success("Plan changed successfully!");
            setShowPlansModal(false);
            fetchSubscriptionAndPlans();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: subData?.user_name || "",
          email: subData?.email || "",
          contact: subData?.phone || ""
        },
        theme: { color: "#E91E63" },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Failed to initiate payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleHelpCenter = () => {
    navigate('/help-support');
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#6c757d" }}>
        <p>Loading subscription...</p>
      </div>
    );
  }

  const isCurrentPlan = (planId) => {
    if (!subData?.is_active) return false;
    return subData?.plan_id === planId || subData?.plan?.id === planId;
  };

  return (
    <div className="settings-content" style={{ flex: 1 }}>
      <div className="subscription-container-page" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="settings-header" style={{ marginBottom: "25px" }}>
          <h1>My Subscription</h1>
          <p style={{ color: "#6c757d" }}>Manage your premium subscription</p>
        </div>

        <div className="settings-card" style={{ marginBottom: "30px", background: "#fff", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ color: "#ffc107", fontSize: "28px", display: "flex" }}><FaCrown /></div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px" }}>
                  {subData?.is_active? subData.plan_name : "Free Tier Member"}
                </h3>
                <p style={{ margin: "4px 0 0 0", color: "#6c757d", fontSize: "14px" }}>
                  {subData?.is_active? `Expires on: ${subData.expires_at}` : "Limited features enabled"}
                </p>
              </div>
            </div>
            <span style={{ background: subData?.is_active? "#2b8a3e" : "#6c757d", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
              {subData?.is_active? "Active Premium" : "Free Plan"}
            </span>
          </div>

          {!subData?.is_active && (
            <div style={{ marginTop: "20px", padding: "20px", background: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107", textAlign: "center" }}>
              <FaCrown style={{ fontSize: "40px", color: "#f59e0b", marginBottom: "10px" }} />
              <h4 style={{ color: "#92400e", marginBottom: "8px" }}>Upgrade to Premium</h4>
              <p style={{ color: "#92400e", fontSize: "14px", marginBottom: "15px" }}>
                Unlock verified badge, unlimited matches & priority support
              </p>
              <button
                onClick={handleChangePlan}
                style={{ background: "#e91e63", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
              >
                View Plans
              </button>
            </div>
          )}

          {subData?.is_active && (
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={handleCancelSubscription}
                style={{ background: "#dc3545", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
              >
                Cancel Subscription
              </button>
              <button
                onClick={handleChangePlan}
                style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
              >
                Change Plan
              </button>
            </div>
          )}
        </div>

        {subData?.is_active && subData?.features && (
          <div style={{ background: "#fff", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ marginBottom: "20px" }}>Your Premium Benefits</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {subData.features.map((feature, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                  <div style={{ color: "#2b8a3e", fontSize: "18px", marginTop: "2px" }}>✓</div>
                  <span style={{ fontSize: "14px", color: "#495057" }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ fontSize: "26px", color: "#e91e63", display: "flex" }}><FaHeadset /></div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Need Help Regarding Billing?</h3>
              <p style={{ margin: "4px 0 0 0", color: "#6c757d", fontSize: "14px" }}>Contact our priority payment support line.</p>
            </div>
          </div>
          <button
            onClick={handleHelpCenter}
            style={{ padding: "10px 18px", borderRadius: "6px", border: "1px solid #dee2e6", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}
          >
            Help Center <FaExternalLinkAlt size={12} />
          </button>
        </div>
      </div>

      {showPlansModal && (
        <div className="modal-overlay" onClick={() => setShowPlansModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", maxWidth: "1000px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <h2 style={{ margin: 0 }}>Choose Your Plan</h2>
              <button onClick={() => setShowPlansModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#666" }}>
                <FaTimes />
              </button>
            </div>

            {availablePlans.length === 0? (
              <p style={{ color: "#868e96", textAlign: "center", padding: "20px" }}>No plans available</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {availablePlans.map((plan) => (
                  <div key={plan.id} style={{
                    border: `2px solid ${isCurrentPlan(plan.id)? '#2b8a3e' : plan.badge_color || '#e0e0e0'}`,
                    padding: "25px",
                    borderRadius: "10px",
                    textAlign: "center",
                    background: isCurrentPlan(plan.id)? "#f0fdf4" : "#f8f9fa",
                    position: "relative"
                  }}>
                    {isCurrentPlan(plan.id) && (
                      <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#2b8a3e", color: "#fff", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                        CURRENT
                      </div>
                    )}
                    <h4 style={{ fontSize: "20px", margin: "0 0 10px 0", color: "#212529" }}>{plan.name}</h4>
                    <p style={{ fontSize: "32px", fontWeight: "bold", margin: "15px 0", color: "#e91e63" }}>₹{plan.price}</p>
                    <div style={{ background: "#fff", padding: "10px", borderRadius: "6px", margin: "15px 0", fontSize: "14px", border: "1px solid #eee" }}>
                      <strong>Validity:</strong> {plan.duration_months} Months
                    </div>
                    <div style={{ minHeight: "100px", textAlign: "left", margin: "15px 0" }}>
                      {Array.isArray(plan.features) && plan.features.length > 0? (
                        plan.features.map((feature, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: "8px 0", fontSize: "14px", color: "#495057" }}>
                            <FaCheck color="#2b8a3e" size={14} style={{ marginTop: "2px", flexShrink: 0 }} />
                            <span>{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "#868e96", fontSize: "14px", textAlign: "center" }}>No features listed</p>
                      )}
                    </div>
                    <button
                      onClick={() => handlePayment(plan)}
                      disabled={isCurrentPlan(plan.id) || isProcessingPayment}
                      style={{
                        background: isCurrentPlan(plan.id)? "#6c757d" : "#e91e63",
                        color: "#fff",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "6px",
                        width: "100%",
                        cursor: (isCurrentPlan(plan.id) || isProcessingPayment)? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "15px"
                      }}
                    >
                      {isCurrentPlan(plan.id)? "Current Plan" : isProcessingPayment? "Processing..." : "Select Plan"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}