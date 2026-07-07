import React, { useState, useEffect } from "react";
import { getSuccessStoriesAPI, API_BASE_URL } from "../apis/Api";

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSuccessStoriesAPI()
      .then(res => setStories(res.data || []))
      .catch(err => {
        console.log("Stories fetch error:", err);
        setError("Failed to load stories. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/400x300";
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  if (error) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: '#e91e63', fontSize: '16px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#e91662', marginBottom: '15px', textAlign: 'center' }}>
        Success Stories
      </h1>
      <p style={{ fontSize: '16px', color: '#868e96', textAlign: 'center', marginBottom: '50px' }}>
        Real couples who found their happily ever after on Zinda Connect
      </p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#868e96' }}>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#868e96' }}>No success stories yet. Be the first!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {stories.map((story) => (
            <div key={story.id} style={{
              background: '#fff', borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', height: '200px' }}>
                <img
                  src={getImageUrl(story.image_one)}
                  alt="Partner 1"
                  style={{ width: '50%', objectFit: 'cover' }}
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x300"}
                />
                <img
                  src={getImageUrl(story.image_two)}
                  alt="Partner 2"
                  style={{ width: '50%', objectFit: 'cover' }}
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x300"}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#212529' }}>
                  {story.partner_one_name && story.partner_two_name
                    ? `${story.partner_one_name} & ${story.partner_two_name}`
                    : story.couple_name || "Happy Couple"}
                </h3>
                <p style={{ fontSize: '14px', color: '#868e96', marginBottom: '12px' }}>
                  Married on {story.marriage_date || "Recently"}
                  {story.location && ` • ${story.location}`}
                </p>
                <p style={{ fontSize: '14px', color: '#495057', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{story.story_text || story.content || story.title}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}