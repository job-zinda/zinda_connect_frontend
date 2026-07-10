import React from 'react';
import Select from 'react-select';

const PersonalDetails = ({ formData, handleInputChange, handleFinalSubmit, handleBack, loading, setFormData }) => {
  const familyTypeOptions = [
    { value: 'nuclear', label: 'Nuclear Family' },
    { value: 'joint', label: 'Joint Family' },
    { value: 'single_parent', label: 'Single Parent Family' },
    { value: 'blended', label: 'Blended Family' }
  ];

  const availableInterests = ['Travel', 'Reading', 'Yoga', 'Music', 'Cooking', 'Fitness', 'Photography', 'Gardening'];

  const handleInterestToggle = (interest) => {
    const currentInterests = formData.interests? [...formData.interests] : [];
    let updatedInterests;

    if (currentInterests.includes(interest)) {
      updatedInterests = currentInterests.filter(item => item!== interest);
    } else {
      updatedInterests = [...currentInterests, interest];
    }

    if (setFormData) {
      setFormData({...formData, interests: updatedInterests });
    } else {
      handleInputChange({ target: { name: 'interests', value: updatedInterests } });
    }
  };

  const selectStyles = {
    control: (base, state) => ({
     ...base,
      minHeight: '42px',
      border: 'none',
      borderBottom: state.isFocused? '1.5px solid #e91662' : '1.5px solid rgba(233, 22, 98, 0.15)',
      borderRadius: 0,
      boxShadow: 'none',
      background: 'transparent'
    }),
    menuPortal: (base) => ({...base, zIndex: 9999 })
  };

  return (
    <div className="form-container">
      <h2>Personal Details</h2>

      <form onSubmit={handleFinalSubmit}>

        <div className="form-group">
          <label>Father's Name</label>
          <input type="text" name="father_name" placeholder="Father's Name" value={formData.father_name || ''} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Mother's Name</label>
          <input type="text" name="mother_name" placeholder="Mother's Name" value={formData.mother_name || ''} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Family Type</label>
          <Select
            options={familyTypeOptions}
            value={familyTypeOptions.find(opt => opt.value === formData.family_type)}
            onChange={(opt) => handleInputChange({ target: { name: 'family_type', value: opt? opt.value : '' } })}
            placeholder="Select Family Type"
            styles={selectStyles}
            menuPortalTarget={document.body}
            isClearable
          />
        </div>

        <div className="form-group">
          <label>Siblings</label>
          <input type="number" name="siblings" placeholder="Number of siblings" value={formData.siblings || ''} onChange={handleInputChange} />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '10px', display: 'block' }}>Interests & Hobbies</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableInterests.map((interest) => {
              const isSelected = formData.interests?.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: isSelected? '1px solid #e91662' : '1px solid rgba(233, 22, 98, 0.15)',
                    backgroundColor: isSelected? '#fff1f5' : '#ffffff',
                    color: isSelected? '#e91662' : '#8d7d82',
                    fontWeight: isSelected? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {interest} {isSelected? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label>About Me</label>
          <textarea name="about_me" placeholder="Write about yourself" value={formData.about_me || ''} onChange={handleInputChange} rows="4" />
        </div>

        <div className="btn-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-back" onClick={handleBack} disabled={loading}>Back</button>
          <button type="submit" className="btn-next" disabled={loading}>{loading? 'Submitting...' : 'Save Details'}</button>
        </div>

      </form>
    </div>
  );
};

export default PersonalDetails;