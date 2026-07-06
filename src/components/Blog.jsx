import React from "react";

export default function Blog() {
  const posts = [
    { id: 1, title: '10 Tips for Creating an Attractive Matrimonial Profile', date: '15 Jan 2026', excerpt: 'Learn how to make your profile stand out...' },
    { id: 2, title: 'First Meeting: Questions to Ask Your Potential Partner', date: '10 Jan 2026', excerpt: 'Important conversations before commitment...' },
    { id: 3, title: 'How to Handle Family Expectations in Arranged Marriage', date: '05 Jan 2026', excerpt: 'Balancing tradition with personal choice...' }
  ];

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#e91662', marginBottom: '15px' }}>
        Zinda Connect Blog
      </h1>
      <p style={{ fontSize: '16px', color: '#868e96', marginBottom: '50px' }}>
        Relationship advice, marriage tips, and success insights
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ 
            padding: '25px', background: '#fff', borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', cursor: 'pointer'
          }}>
            <p style={{ fontSize: '12px', color: '#e91662', marginBottom: '8px' }}>{post.date}</p>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#212529' }}>
              {post.title}
            </h3>
            <p style={{ fontSize: '15px', color: '#495057', lineHeight: '1.7' }}>{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}