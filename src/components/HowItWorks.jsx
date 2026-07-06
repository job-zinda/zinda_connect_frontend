import React from "react";

export default function HowItWorks() {
  const steps = [
    { num: '1', title: 'Create Profile', desc: 'Sign up and build your detailed matrimonial profile with photos and preferences.' },
    { num: '2', title: 'Get Verified', desc: 'Complete verification to unlock premium features and build trust.' },
    { num: '3', title: 'Find Matches', desc: 'Browse thousands of profiles and get AI-powered match suggestions.' },
    { num: '4', title: 'Connect & Chat', desc: 'Send interests, chat securely, and get to know your potential partner.' },
    { num: '5', title: 'Meet & Marry', desc: 'Take your relationship forward with family meetings and plan your future.' }
  ];

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#e91662', marginBottom: '15px', textAlign: 'center' }}>
        How Zinda Connect Works
      </h1>
      <p style={{ fontSize: '16px', color: '#868e96', textAlign: 'center', marginBottom: '50px' }}>
        Your journey to finding true love in 5 simple steps
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ 
              minWidth: '50px', height: '50px', background: '#e91662', color: '#fff', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: 700 
            }}>
              {step.num}
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#212529' }}>{step.title}</h3>
              <p style={{ fontSize: '15px', color: '#495057', lineHeight: '1.7' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}