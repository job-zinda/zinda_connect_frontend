import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import "../styles/adminDashboard.css";

import AdminSidebar from "./AdminSidebar";
import AdminUsers from "./AdminUsers";
import AdminMatches from "./AdminMatches";
import AdminProfiles from "./AdminProfiles";
import AdminVerification from "./AdminVerification";
import AdminBanners from "./AdminBanners";
import AdminSettings from "./AdminSettings";
import AdminStories from "./AdminStories";
import AdminSubscriptionPlans from "./AdminSubscriptionPlans";
import AdminPayments from "./AdminPayments";
import {
  FaUsers,
  FaHeart,
  FaComments,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import {
  getAdminStatsAPI,
  getRecentRegistrationsAPI,
} from "../apis/Api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function StatCard({ title, value, percentage, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
        <div className="stat-trend">▲ {percentage} <span>vs last month</span></div>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    if (activeTab === "Dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes] = await Promise.all([
        getAdminStatsAPI(),
        getRecentRegistrationsAPI(),
      ]);
      setStats(statsRes.data || {});
      setRecentUsers(recentRes.data || []);
      setCurrentStoryIndex(0);
    } catch (err) {
      console.log("Dashboard Data Fetching Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const nextStory = (totalStories) => {
    setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % totalStories);
  };

  const prevStory = (totalStories) => {
    setCurrentStoryIndex((prevIndex) => (prevIndex - 1 + totalStories) % totalStories);
  };

  const handleMessageClick = (msg) => {
    const roomId = msg.room_id || msg.room || msg.chat_room_id;
    if (roomId) {
      navigate(`/chat?room_id=${roomId}`);
    }
  };

  const getMessageData = (msg) => {
    const senderName = msg.sender_name || msg.sender?.full_name || msg.sender?.username || msg.user_name || "Unknown";
    const senderImg = msg.sender_image || msg.sender?.profile_picture || msg.sender?.image || msg.user_image;
    const messageText = msg.message_text || msg.message || msg.content || msg.text || "Sent a message";
    const timestamp = msg.timestamp || msg.created_at || msg.time;
    const roomId = msg.room_id || msg.room || msg.chat_room_id;

    return { senderName, senderImg, messageText, timestamp, roomId };
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")? path : `${API_BASE_URL}${path}`;
  };

  const chartData = {
    labels: stats.user_growth_labels || [],
    datasets: [{
      label: 'New Users',
      data: stats.user_growth_data || [],
      fill: true,
      backgroundColor: 'rgba(233, 30, 99, 0.15)',
      borderColor: '#e91e63',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#f1f3f5',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#868e96',
          font: { size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7
        }
      },
     y: {
      beginAtZero: true,
      suggestedMax: (stats.total_users || 10) + 5
    }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Users": return <AdminUsers />;
      case "Matches": return <AdminMatches />;
      case "Profiles": return <AdminProfiles />;
      case "Verification": return <AdminVerification />;
      case "Banners": return <AdminBanners />;
      case "Settings": return <AdminSettings />;
      case "Success Stories": return <AdminStories />;
      case "Subscription Plans": return <AdminSubscriptionPlans />;
      case "Payments": return <AdminPayments />;
      case "Dashboard":
      default:
        const displayMatches = stats.recent_matches || [];
        const displayMessages = stats.recent_messages || stats.recent_admin_messages || [];
        const displayStories = stats.success_stories || [];
        const verifiedCount = stats.verified_profiles?? 0;
        const pendingCount = stats.pending_profiles?? 0;
        const rejectedCount = stats.rejected_profiles?? 0;
        const totalProfilesCount = verifiedCount + pendingCount + rejectedCount;

        return (
          <>
            <div className="admin-header">
              <h1 style={{color: '#ffff'}}>Dashboard</h1>
              <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', color: '#ffff'}}>Admin Panel</span>
            </div>

            {loading? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#868e96' }}>Loading Dashboard Data...</p>
            ) : (
              <>

                <div className="stats-grid">
                  <StatCard
                    title="Total Users"
                    value={stats.total_users?? 0}
                    percentage="+18.6%"
                    icon={<FaUsers />}
                  />

                  <StatCard
                    title="Active Matches"
                    value={stats.active_matches?? stats.total_matches?? 0}
                    percentage="+12.4%"
                    icon={<FaHeart />}
                  />

                  <StatCard
                    title="Messages"
                    value={stats.messages_sent?? stats.total_messages?? 0}
                    percentage="+22.1%"
                    icon={<FaComments />}
                  />

                  <StatCard
                    title="Revenue"
                    value={`₹${stats.revenue?? stats.total_revenue?? 0}`}
                    percentage="+20.8%"
                    icon={<FaIndianRupeeSign />}
                  />
                </div>

                <div className="dashboard-row">
                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>User Growth</h3>
                      <select style={{ fontSize: '11px', padding: '2px 8px', color: '#868e96', border: '1px solid #f1f3f5', borderRadius: '6px' }}>
                        <option>Last 30 Days</option>
                      </select>
                    </div>

                    <div style={{ height: '180px', padding: '10px 0' }}>
                      {stats.user_growth_data?.length > 0? (
                        <Line data={chartData} options={chartOptions} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#868e96' }}>
                          No data available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Recent Registrations</h3>
                      <button className="view-all-btn" onClick={() => setActiveTab("Users")}>View All</button>
                    </div>
                    <div className="list-container" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {recentUsers.length > 0? (
                        recentUsers.map((user) => (
                          <div key={user.id} className="item-row">
                            <div className="user-meta">
                              {user.profile_picture || user.image? (
                                <img src={getImageUrl(user.profile_picture || user.image)} alt={user.full_name} className="avatar-placeholder" style={{ objectFit: 'cover' }} />
                              ) : (
                                <div className="avatar-placeholder">{user.full_name?.charAt(0) || user.username?.charAt(0) || "U"}</div>
                              )}
                              <div className="item-details">
                                <p>{user.full_name || user.username || "Unknown User"}</p>
                                <span>{user.district || user.location || "Kerala, India"}</span>
                              </div>
                            </div>
                            <span className="item-time">
                              {user.date_joined? new Date(user.date_joined).toLocaleDateString() : "Just now"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '12px', color: '#868e96', textAlign: 'center', padding: '20px' }}>No recent registrations found</p>
                      )}
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Profile Verification</h3>
                      <button className="view-all-btn" onClick={() => setActiveTab("Verification")}>View All</button>
                    </div>
                    <div className="pie-section">
                      <div className="circle-chart">
                        <div>
                          <strong style={{ fontSize: '16px' }}>{totalProfilesCount}</strong>
                          <br/>
                          <span style={{ fontSize: '10px', color: '#868e96' }}>Total</span>
                        </div>
                      </div>
                      <div className="chart-labels">
                        <div><span className="dot" style={{ backgroundColor: '#2b8a3e' }}></span>Verified: {verifiedCount}</div>
                        <div><span className="dot" style={{ backgroundColor: '#fd7e14' }}></span>Pending: {pendingCount}</div>
                        <div><span className="dot" style={{ backgroundColor: '#e91e63' }}></span>Rejected: {rejectedCount}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-row">
                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Recent Matches</h3>
                      <button className="view-all-btn" onClick={() => setActiveTab("Matches")}>View All</button>
                    </div>
                    <div className="list-container" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {displayMatches.length > 0? (
                        displayMatches.map((m) => (
                          <div key={m.id} className="item-row" style={{ padding: '8px 0' }}>
                            <div className="user-meta" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                {m.user_one_img? (
                                  <img src={getImageUrl(m.user_one_img)} alt="" className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <div className="avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '11px' }}>{m.user_one_name?.charAt(0)}</div>
                                )}
                                <span style={{ fontSize: '12px', fontWeight: '500', maxWidth: '65px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.user_one_name}</span>
                              </div>
                              <span style={{ color: '#e91e63', fontSize: '14px', padding: '0 4px' }}>❤️</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '12px', fontWeight: '500', maxWidth: '65px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{m.user_two_name}</span>
                                {m.user_two_img? (
                                  <img src={getImageUrl(m.user_two_img)} alt="" className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <div className="avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '11px' }}>{m.user_two_name?.charAt(0)}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '12px', color: '#868e96', textAlign: 'center', padding: '20px' }}>No reciprocal matches yet</p>
                      )}
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Recent Messages</h3>
                      <button className="view-all-btn" onClick={() => navigate('/chat')}>View All</button>
                    </div>
                    <div className="list-container" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {displayMessages.length > 0? (
                        displayMessages.map((msg) => {
                          const { senderName, senderImg, messageText, timestamp, roomId } = getMessageData(msg);
                          return (
                            <div
                              key={msg.id || msg._id}
                              className="item-row"
                              onClick={() => handleMessageClick({ room_id: roomId })}
                              style={{ cursor: roomId? 'pointer' : 'default' }}
                            >
                              <div className="user-meta">
                                {senderImg? (
                                  <img
                                    src={getImageUrl(senderImg)}
                                    alt={senderName}
                                    className="avatar-placeholder"
                                    style={{ objectFit: 'cover', width: '40px', height: '40px', borderRadius: '50%' }}
                                  />
                                ) : (
                                  <div className="avatar-placeholder" style={{ width: '40px', height: '40px', borderRadius: '50%' }}>
                                    {senderName?.charAt(0) || "U"}
                                  </div>
                                )}
                                <div className="item-details">
                                  <p>{senderName}</p>
                                  <span style={{ display: 'block', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {messageText}
                                  </span>
                                </div>
                              </div>
                              <span className="item-time">
                                {timestamp? new Date(timestamp).toLocaleDateString() : "Just now"}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ fontSize: '12px', color: '#868e96', textAlign: 'center', padding: '20px' }}>No recent messages</p>
                      )}
                    </div>
                  </div>

                  <div className="panel-card">
                    <div className="panel-header">
                      <h3>Success Stories</h3>
                      {displayStories.length > 1 && (
                        <div className="story-nav-buttons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => prevStory(displayStories.length)} style={{ background: '#f1f3f5', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>◀</button>
                          <span style={{ fontSize: '12px', color: '#868e96', fontWeight: '500' }}>{currentStoryIndex + 1}/{displayStories.length}</span>
                          <button onClick={() => nextStory(displayStories.length)} style={{ background: '#f1f3f5', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>▶</button>
                        </div>
                      )}
                    </div>
                    <div className="story-box">
                      {displayStories.length > 0? (
                        <>
                          <div className="story-body">
                            <div className="story-images">
                              {displayStories[currentStoryIndex].image_one && (
                                <img src={getImageUrl(displayStories[currentStoryIndex].image_one)} alt="Partner 1" className="story-image" />
                              )}
                              {displayStories[currentStoryIndex].image_two && (
                                <img src={getImageUrl(displayStories[currentStoryIndex].image_two)} alt="Partner 2" className="story-image" />
                              )}
                            </div>
                            <p className="story-text">
                              "{displayStories[currentStoryIndex].story_text || displayStories[currentStoryIndex].content || displayStories[currentStoryIndex].title}"
                            </p>
                          </div>
                          <div className="story-footer">
                            <p className="story-author">
                              {displayStories[currentStoryIndex].partner_one_name? `${displayStories[currentStoryIndex].partner_one_name} & ${displayStories[currentStoryIndex].partner_two_name}` : (displayStories[currentStoryIndex].couple_name || "Happy Couple")}
                            </p>
                            <p className="story-date">
                              Married on {displayStories[currentStoryIndex].marriage_date || "Recent"}
                              {displayStories[currentStoryIndex].location? ` • ${displayStories[currentStoryIndex].location}` : ""}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#868e96', textAlign: 'center', padding: '20px' }}>No success stories added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
}