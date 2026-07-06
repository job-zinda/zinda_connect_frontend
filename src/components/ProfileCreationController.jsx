import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import API, { 
  updateBasicDetailsAPI, 
  updateReligionAPI, 
  updateEducationCareerAPI, 
  updateLocationAPI,
  updatePersonalDetailsAPI 
} from '../apis/Api'; 

import BasicDetails from './BasicDetails';
import ReligionCommunity from './ReligionCommunity';
import EducationCareer from './EducationCareer';
import LocationDetails from './LocationDetails';
import PersonalDetails from './PersonalDetails';
import CreateProfileForModal from './CreateProfileForModal';

import '../styles/ProfileForm.css';

const ProfileCreationController = () => {
  const { type } = useParams();
  const navigate = useNavigate(); 
  const profileTypeFromQuery = type || 'self';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false); 
  
  const [formData, setFormData] = useState({
    profile_type: profileTypeFromQuery,
    parent_name: '', 
    relation_type: '',
    child_type: '',
    child_name: '',
    full_name: '',
    gender: '', 
    date_of_birth: '',
    height: '170', 
    marital_status: '', 
    profile_picture: null,
    religion: '', 
    caste: '',  
    mother_tongue: '',
    education: '', 
    occupation: '', 
    company: '', 
    annual_income: '', 
    country: '', 
    state: '', 
    district: '', 
    city: '',
    father_name: '', 
    mother_name: '', 
    family_type: '', 
    siblings: '', 
    about_me: '',
    interests: []
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await API.get('profile/');
        if (response.data && response.data.profile) {
          setFormData(prev => ({ 
            ...prev, 
            ...response.data.profile,
            profile_type: response.data.profile.profile_type || profileTypeFromQuery 
          }));
          if (response.data.current_step) {
            setStep(response.data.current_step);
          }
        } else {
          setFormData(prev => ({ ...prev, profile_type: profileTypeFromQuery }));
        }
      } catch (error) {
        console.log("No profile found for new user, setting step to 1.");
        setFormData(prev => ({ ...prev, profile_type: profileTypeFromQuery }));
        setStep(1); 
      }
    };
    loadProfileData();
  }, [profileTypeFromQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (file) => {
    setFormData({ ...formData, profile_picture: file });
  };
  
  const handleNextStep = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      let res;
      switch (step) {
        case 1:
          let basicData = {
            profile_type: formData.profile_type,
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            height: formData.height,
            marital_status: formData.marital_status,
            profile_picture: formData.profile_picture
          };

          if (formData.profile_type === 'parent') {
            basicData.parent_name = formData.parent_name;
            basicData.relation_type = formData.relation_type;
            basicData.child_type = formData.child_type;
            basicData.child_name = formData.child_name;
            basicData.full_name = formData.child_name;
          } else {
            basicData.full_name = formData.full_name;
          }

          res = await updateBasicDetailsAPI(basicData);
          break;

        case 2:
          res = await updateReligionAPI({ 
            religion: formData.religion, 
            caste: formData.caste, 
            mother_tongue: formData.mother_tongue 
          });
          break;

        case 3:
          res = await updateEducationCareerAPI({ 
            education: formData.education, 
            occupation: formData.occupation, 
            company: formData.company, 
            annual_income: formData.annual_income 
          });
          break;

        case 4:
          res = await updateLocationAPI({ 
            country: formData.country, 
            state: formData.state, 
            district: formData.district, 
            city: formData.city 
          });
          break;

        default:
          return;
      }
      
      if (res && res.data && res.data.step) {
        setStep(res.data.step);
      } else {
        setStep(step + 1);
      }
    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);
      alert("API Error! Please check your fields and backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const finalPayload = {
        father_name: formData.father_name, 
        mother_name: formData.mother_name, 
        family_type: formData.family_type,
        siblings: formData.siblings,
        about_me: formData.about_me,
        interests: formData.interests || []
      };
      
      await updatePersonalDetailsAPI(finalPayload);
      alert("Profile completed successfully!");
      navigate('/'); 
      
    } catch (err) {
      console.error("Final submission failed", err);
      alert("Failed to submit final profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalTypeSelect = (selectedType) => {
    setShowModeModal(false); 
    setFormData(prev => ({ ...prev, profile_type: selectedType }));
    navigate(`/create-profile/${selectedType}`);
  };

  const stepsList = [
    { id: 1, label: 'Basic Details' },
    { id: 2, label: 'Religion & Community' },
    { id: 3, label: 'Education & Career' },
    { id: 4, label: 'Location' },
    { id: 5, label: 'Personal Details' }
  ];

  return (
    <div className="profile-creation-layout">
      {/* SIDEBAR */}
      <div className="profile-sidebar">
        <ul className="step-list">
          {stepsList.map((s) => (
            <li key={s.id} className={`step-item ${step === s.id ? 'active' : ''}`}>
              <span className="step-number">{s.id}</span>
              <span className="step-label">{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button 
            type="button" 
            onClick={() => setShowModeModal(true)} 
            className="change-mode-btn"
          >
            <span>⬅</span> Change Profile Mode
          </button>
        </div>
      </div>

      {/* FORM CONTENT WINDOW */}
      <div className="profile-form-window">
        {step === 1 && (
          <BasicDetails 
            formData={formData} 
            profileType={formData.profile_type} 
            handleInputChange={handleInputChange} 
            handleFileChange={handleFileChange}
            handleNext={handleNextStep} 
            loading={loading}
          />
        )}
        {step === 2 && (
          <ReligionCommunity 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleNext={handleNextStep} 
            handleBack={handleBackStep}
            loading={loading}
          />
        )}
        {step === 3 && (
          <EducationCareer 
            formData={formData} 
            setFormData={setFormData} 
            handleInputChange={handleInputChange} 
            handleNext={handleNextStep} 
            handleBack={handleBackStep}
            loading={loading}
          />
        )}
        {step === 4 && (
          <LocationDetails 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleNext={handleNextStep} 
            handleBack={handleBackStep}
            loading={loading}
          />
        )}
        {step === 5 && (
          <PersonalDetails 
            formData={formData} 
            setFormData={setFormData}
            handleInputChange={handleInputChange} 
            handleFinalSubmit={handleFinalSubmit} 
            handleBack={handleBackStep}
            loading={loading}
          />
        )}
      </div>

      {showModeModal && (
        <CreateProfileForModal 
          onClose={() => setShowModeModal(false)} 
          onNext={handleModalTypeSelect} 
        />
      )}
    </div>
  );
};

export default ProfileCreationController;

