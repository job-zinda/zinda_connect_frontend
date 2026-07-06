
import React from 'react';
import Select from 'react-select';

const EducationCareer = ({ formData, setFormData, handleInputChange, handleNext, handleBack, loading }) => {


  const incomeOptions = [
    { value: '20000-50000', label: '₹20,000 - ₹50,000' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000-200000', label: '₹1,00,000 - ₹2,00,000' },
    { value: '200000-300000', label: '₹2,00,000 - ₹3,00,000' },
    { value: '300000-500000', label: '₹3,00,000 - ₹5,00,000' },
    { value: '500000-1000000', label: '₹5,00,000 - ₹10,00,000' },
    { value: '1000000+', label: 'Above ₹10,00,000' }
  ];

  const selectStyles = {
    control: (base, state) => ({
    ...base,
      minHeight: '42px',
      border: 'none',
      borderBottom: state.isFocused? '2px solid #e91662' : '2px solid #e0e0e0',
      borderRadius: 0,
      boxShadow: 'none',
      background: 'transparent',
      padding: '0'
    }),
    valueContainer: (base) => ({
    ...base,
      padding: '0'
    }),
    singleValue: (base) => ({
    ...base,
      color: '#352b2f',
      fontSize: '16px'
    }),
    placeholder: (base) => ({
    ...base,
      color: '#8d7d82',
      fontSize: '16px'
    }),
    menuPortal: (base) => ({...base, zIndex: 9999 })
  };

  return (
    <div className="form-container">
      <h2>Education & Career Details</h2>

      <form onSubmit={handleNext}>

        {/* Education Field */}
        <div className="form-group">
          <label>Education (വിദ്യാഭ്യാസം)</label>
          <input
            type="text"
            name="education"
            placeholder="e.g., B.Tech, M.Com, MCA"
            value={formData.education || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Profession Field */}
        <div className="form-group">
          <label>Profession / Occupation</label>
          <input
            type="text"
            name="occupation"
            placeholder="e.g., Software Engineer, Teacher"
            value={formData.occupation || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Company Field */}
        <div className="form-group">
          <label>Company / Business</label>
          <input
            type="text"
            name="company"
            placeholder="Company or Business Name"
            value={formData.company || ''}
            onChange={handleInputChange}
          />
        </div>

        {/*  Monthly Income Select*/}
        <div className="form-group">
          <label>Monthly Income Range</label>
          <Select
            options={incomeOptions}
            value={incomeOptions.find(opt => opt.value === formData.annual_income) || null}
            onChange={(opt) => handleInputChange({ target: { name: 'annual_income', value: opt? opt.value : '' }})}
            placeholder="Select Income Range"
            styles={selectStyles}
            menuPortalTarget={document.body}
          />
        </div>

        <div className="btn-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </button>

          <button
            type="submit"
            className="btn-next"
            disabled={loading}
          >
            {loading? 'Saving...' : 'Next'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EducationCareer;