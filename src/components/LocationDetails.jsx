import React from 'react';

const COUNTRIES = ["India"];

const STATES_DISTRICTS = {
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", 
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", 
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", 
    "Tirunelveli", "Vellore", "Erode", "Thanjavur"
  ],
  "Karnataka": [
    "Bangalore Urban", "Bengaluru Urban", "Mysore", "Mysuru", "Mangalore", "Mangaluru", 
    "Hubli", "Belgaum", "Belagavi", "Gulbarga", "Kalaburagi", "Davanagere", "Shimoga", "Shivamogga"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", 
    "Amravati", "Kolhapur", "Thane"
  ],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Noida"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurgaon", "Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"],
};

const DISTRICT_CITIES = {
  "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara", "Attingal", "Varkala", "Nedumangad"],
  "Ernakulam": ["Kochi", "Aluva", "Angamaly", "Perumbavoor", "Muvattupuzha", "Kothamangalam"],
  "Kozhikode": ["Kozhikode", "Vadakara", "Koyilandy", "Feroke", "Mukkam"],
  "Thrissur": ["Thrissur", "Chalakudy", "Kodungallur", "Irinjalakuda", "Guruvayur"],
  "Kannur": ["Kannur", "Thalassery", "Payyanur", "Kuthuparamba", "Mattannur"],
  "Kollam": ["Kollam", "Punalur", "Karunagappally", "Kottarakkara"],
  "Palakkad": ["Palakkad", "Ottapalam", "Shoranur", "Mannarkkad", "Chittur"],
  "Malappuram": ["Malappuram", "Manjeri", "Tirur", "Ponnani", "Perinthalmanna", "Kondotty"],
  "Alappuzha": ["Alappuzha", "Cherthala", "Kayamkulam", "Haripad", "Mavelikkara"],
  "Kottayam": ["Kottayam", "Changanassery", "Pala", "Vaikom", "Ettumanoor"],
  "Pathanamthitta": ["Pathanamthitta", "Thiruvalla", "Adoor", "Pandalam", "Ranni"],
  "Idukki": ["Idukki", "Thodupuzha", "Munnar", "Kattappana", "Adimali"],
  "Wayanad": ["Kalpetta", "Mananthavady", "Sulthan Bathery", "Vythiri"],
  "Kasaragod": ["Kasaragod", "Kanhangad", "Nileshwar", "Kumbla"],
  "Chennai": ["Chennai", "Tambaram", "Avadi", "Pallavaram"],
  "Bangalore Urban": ["Bangalore", "Bengaluru", "Yelahanka", "Whitefield", "Electronic City"],
  "Mumbai": ["Mumbai", "Andheri", "Bandra", "Borivali", "Dadar", "Thane"],
  "New Delhi": ["New Delhi", "Dwarka", "Rohini", "Karol Bagh", "Connaught Place"],
};

const LocationDetails = ({ formData, handleInputChange, handleNext, handleBack, loading }) => {
  
  const handleCountryChange = (e) => {
    const { value } = e.target;
    handleInputChange({ target: { name: 'country', value } });
    
    if (!COUNTRIES.includes(value)) {
      handleInputChange({ target: { name: 'state', value: '' } });
      handleInputChange({ target: { name: 'district', value: '' } });
      handleInputChange({ target: { name: 'city', value: '' } });
    }
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    handleInputChange({ target: { name: 'state', value } });
    
    if (!Object.keys(STATES_DISTRICTS).includes(value)) {
      handleInputChange({ target: { name: 'district', value: '' } });
      handleInputChange({ target: { name: 'city', value: '' } });
    }
  };

  const handleDistrictChange = (e) => {
    const { value } = e.target;
    handleInputChange({ target: { name: 'district', value } });
    
    const validDistricts = formData.state ? STATES_DISTRICTS[formData.state] || [] : [];
    if (!validDistricts.includes(value)) {
      handleInputChange({ target: { name: 'city', value: '' } });
    }
  };

  const states = Object.keys(STATES_DISTRICTS).sort();
  const districts = formData.state && STATES_DISTRICTS[formData.state] ? STATES_DISTRICTS[formData.state] : [];
  const cities = formData.district && DISTRICT_CITIES[formData.district] ? DISTRICT_CITIES[formData.district] : [];

  return (
    <div className="form-container">
      <h2>Location</h2>
      <form onSubmit={handleNext}>
        <div className="form-group">
          <label>Country</label>
          <input 
            type="text" 
            name="country" 
            placeholder="Select or type country" 
            value={formData.country || ''} 
            onChange={handleCountryChange} 
            list="country-list"
            required
            autoComplete="off"
          />
          <datalist id="country-list">
            {COUNTRIES.map(country => (
              <option key={country} value={country} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>State</label>
          <input 
            type="text" 
            name="state" 
            placeholder="Select or type state" 
            value={formData.state || ''} 
            onChange={handleStateChange} 
            list="state-list"
            required
            disabled={!formData.country}
            autoComplete="off"
          />
          <datalist id="state-list">
            {states.map(state => (
              <option key={state} value={state} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>District</label>
          <input 
            type="text" 
            name="district" 
            placeholder="Select or type district" 
            value={formData.district || ''} 
            onChange={handleDistrictChange} 
            list="district-list"
            required
            disabled={!formData.state}
            autoComplete="off"
          />
          <datalist id="district-list">
            {districts.map(district => (
              <option key={district} value={district} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            name="city" 
            placeholder="Select or type city" 
            value={formData.city || ''} 
            onChange={handleInputChange} 
            list="city-list"
            required
            disabled={!formData.district}
            autoComplete="off"
          />
          <datalist id="city-list">
            {cities.map(city => (
              <option key={city} value={city} />
            ))}
          </datalist>
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            {formData.district && "You can select your city from the list or you can type"}
          </small>
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

export default LocationDetails;

