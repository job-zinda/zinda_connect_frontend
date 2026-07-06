import React from 'react';
import Select from 'react-select';

const ReligionCommunity = ({ formData, handleInputChange, handleNext, handleBack, loading }) => {
  const religionOptions = [
    { value: 'Hindu', label: 'Hindu' },
    { value: 'Christian', label: 'Christian' },
    { value: 'Muslim', label: 'Muslim' },
    { value: 'Sikh', label: 'Sikh' },
    { value: 'Buddhist', label: 'Buddhist' },
    { value: 'Jain', label: 'Jain' },
    { value: 'Other', label: 'Other' }
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      border: 'none',
      borderBottom: '1.5px solid rgba(233, 22, 98, 0.15)',
      borderRadius: 0,
      boxShadow: 'none',
      background: 'transparent',
      '&:hover': { borderBottom: '1.5px solid rgba(233, 22, 98, 0.3)' }
    }),
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      border: 'none',
      borderBottom: state.isFocused ? '1.5px solid #e91662' : '1.5px solid rgba(233, 22, 98, 0.15)',
      borderRadius: 0,
      boxShadow: 'none',
      background: 'transparent'
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  return (
    <div className="form-container">
      <h2>Religion & Community</h2>
      <form onSubmit={handleNext}>
        <div className="form-group">
          <label>Religion</label>
          <Select
            options={religionOptions}
            value={religionOptions.find(opt => opt.value === formData.religion)}
            onChange={(opt) => handleInputChange({ target: { name: 'religion', value: opt.value } })}
            placeholder="Select Religion"
            styles={selectStyles}
            menuPortalTarget={document.body}
            isClearable
          />
        </div>

        <div className="form-group">
          <label>Caste / Community</label>
          <input
            type="text"
            name="caste"
            placeholder="Caste / Community"
            value={formData.caste || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Mother Tongue</label>
          <input
            type="text"
            name="mother_tongue"
            placeholder="Mother Tongue"
            value={formData.mother_tongue || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="btn-group">
          <button type="button" className="btn-back" onClick={handleBack}>
            Back
          </button>
          <button type="submit" className="btn-next" disabled={loading}>
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReligionCommunity;