import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const BasicDetails = ({ formData, profileType, handleInputChange, handleFileChange, handleNext, loading }) => {
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState(""); // ✅ NEW: error state

  const genderOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' }
  ];

  const relationOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' }
  ];

  const childTypeOptions = [
    { value: 'son', label: 'Son' },
    { value: 'daughter', label: 'Daughter' }
  ];

  const maritalStatusOptions = [
    { value: 'never_married', label: 'Never Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'awaiting_divorce', label: 'Awaiting Divorce' }
  ];

  const heightOptions = [
    { value: '137', label: `4' 6" (137 cm)` },
    { value: '140', label: `4' 7" (140 cm)` },
    { value: '142', label: `4' 8" (142 cm)` },
    { value: '145', label: `4' 9" (145 cm)` },
    { value: '147', label: `4' 10" (147 cm)` },
    { value: '150', label: `4' 11" (150 cm)` },
    { value: '152', label: `5' 0" (152 cm)` },
    { value: '155', label: `5' 1" (155 cm)` },
    { value: '157', label: `5' 2" (157 cm)` },
    { value: '160', label: `5' 3" (160 cm)` },
    { value: '163', label: `5' 4" (163 cm)` },
    { value: '165', label: `5' 5" (165 cm)` },
    { value: '168', label: `5' 6" (168 cm)` },
    { value: '170', label: `5' 7" (170 cm)` },
    { value: '173', label: `5' 8" (173 cm)` },
    { value: '175', label: `5' 9" (175 cm)` },
    { value: '178', label: `5' 10" (178 cm)` },
    { value: '180', label: `5' 11" (180 cm)` },
    { value: '183', label: `6' 0" (183 cm)` },
    { value: '185', label: `6' 1" (185 cm)` },
    { value: '188', label: `6' 2" (188 cm)` },
    { value: '190', label: `6' 3" (190 cm)` },
    { value: '193', label: `6' 4" (193 cm)` },
    { value: '196', label: `6' 5" (196 cm)` },
    { value: '198', label: `6' 6" (198 cm)` },
    { value: '200', label: `6' 7" (200 cm)` }
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
    valueContainer: (base) => ({...base, padding: '0' }),
    singleValue: (base) => ({...base, color: '#352b2f', fontSize: '16px' }),
    placeholder: (base) => ({...base, color: '#8d7d82', fontSize: '16px' }),
    menuPortal: (base) => ({...base, zIndex: 9999 })
  };

  useEffect(() => {
    if (formData.profile_picture) {
      if (formData.profile_picture instanceof File) {
        const objectUrl = URL.createObjectURL(formData.profile_picture);
        setPreview(objectUrl);
        setImageError(""); // ✅ image add cheyyumbo error pokum
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setPreview(formData.profile_picture);
        setImageError("");
      }
    } else {
      setPreview(null);
    }
  }, [formData.profile_picture]);

  // ✅ NEW: Form submit check
  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.profile_picture) {
      setImageError("Profile picture നിർബന്ധമാണ് *");
      return; // stop here
    }
    setImageError("");
    handleNext(e); // all ok, next page
  };

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFileChange(file);
  };

  return (
    <div className="form-container">
      <h2>Basic Details ({profileType === 'parent'? 'Parent Mode' : 'Self Mode'})</h2>

      <form onSubmit={onSubmit}> {/* ✅ onSubmit maatti */}

        {/* Profile Pic with Pencil Icon */}
        <div className="profile-pic-upload">
          <div className="avatar-wrapper" style={{border: imageError? "2px solid red" : "none", borderRadius: "50%"}}>
            <img
              src={preview &&!preview.includes("via.placeholder.com")? preview : defaultAvatar}
              alt="Profile Preview"
              className="avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <label htmlFor="profile-file-input" className="avatar-edit-btn">✏️</label>
          </div>
          <input type="file" accept="image/*" onChange={onFileSelect} id="profile-file-input" style={{ display: 'none' }} />

          {/* ✅ Error Message */}
          {imageError && <p style={{color: "red", fontSize: "13px", marginTop: "8px", textAlign: "center"}}>{imageError}</p>}
          {!formData.profile_picture && <p style={{fontSize: "12px", color: "#e91662", textAlign: "center"}}>* Profile Picture Required</p>}
        </div>

        {/* Parent Mode Fields */}
        {profileType === 'parent' && (
          <div className="parent-conditional-box">
            <div className="form-group">
              <label>Parent Name (നിങ്ങളുടെ പേര്)</label>
              <input
                type="text"
                name="parent_name"
                placeholder="Enter Parent's Full Name"
                value={formData.parent_name || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Relation</label>
              <Select
                options={relationOptions}
                value={relationOptions.find(opt => opt.value === formData.relation_type) || null}
                onChange={(opt) => handleInputChange({ target: { name: 'relation_type', value: opt? opt.value : '' }})}
                placeholder="Select Relation"
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </div>

            <div className="form-group">
              <label>Profile For</label>
              <Select
                options={childTypeOptions}
                value={childTypeOptions.find(opt => opt.value === formData.child_type) || null}
                onChange={(opt) => handleInputChange({ target: { name: 'child_type', value: opt? opt.value : '' }})}
                placeholder="Select Option"
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </div>

            <div className="form-group">
              <label>Child's Name</label>
              <input
                type="text"
                name="child_name"
                placeholder="Enter child name"
                value={formData.child_name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {/* Self Mode Fields */}
        {profileType === 'self' && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter Your Full Name"
              value={formData.full_name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Common Fields */}
        <div className="form-group">
          <label>Gender</label>
          <Select
            options={genderOptions}
            value={genderOptions.find(opt => opt.value === formData.gender) || null}
            onChange={(opt) => handleInputChange({ target: { name: 'gender', value: opt? opt.value : '' }})}
            placeholder="Select Gender"
            styles={selectStyles}
            menuPortalTarget={document.body}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Height</label>
          <Select
            options={heightOptions}
            value={heightOptions.find(opt => opt.value === formData.height) || null}
            onChange={(opt) => handleInputChange({ target: { name: 'height', value: opt? opt.value : '' }})}
            placeholder="Select Height"
            styles={selectStyles}
            menuPortalTarget={document.body}
          />
        </div>

        <div className="form-group">
          <label>Marital Status</label>
          <Select
            options={maritalStatusOptions}
            value={maritalStatusOptions.find(opt => opt.value === formData.marital_status) || null}
            onChange={(opt) => handleInputChange({ target: { name: 'marital_status', value: opt? opt.value : '' }})}
            placeholder="Select Marital Status"
            styles={selectStyles}
            menuPortalTarget={document.body}
          />
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-next" disabled={loading}>
            {loading? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDetails;