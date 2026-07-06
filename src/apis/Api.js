import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/auth/`
});

// ✅ Public API instance - auth ഇല്ലാത്ത endpoints ന്
const PublicAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/`
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
          refresh: refresh
        });
        localStorage.setItem("access", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// ===== AUTH APIs =====
export const registerAPI = (data) => API.post("register/", data);
export const loginAPI = (data) => API.post("login/", data);
export const getUserAPI = () => API.get("user/");
export const updateProfileTypeAPI = (data) => API.post("profile/update-type/", data);

export const getAdminProfileAPI = () => API.get('admin/profile/');
export const updateAdminProfileAPI = (formData) => API.put('admin/profile/update/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updatePasswordAPI = (data) => API.put("change-password/", data);

// ===== PROFILE APIs =====
export const getProfileAPI = () => API.get("profile/");
export const updateProfileAPI = (formData) =>
  API.patch("profile/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Password Reset
export const sendOTPAPI = (data) => API.post("forgot-password/send-otp/", data);
export const verifyOTPAPI = (data) => API.post("forgot-password/verify-otp/", data);
export const resetPasswordAPI = (data) => API.post("forgot-password/reset/", data);

// Multi-Step Profile
export const updateBasicDetailsAPI = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key !== 'profile_picture') {
      formData.append(key, data[key]);
    }
  });
  if (data.profile_picture) {
    formData.append('profile_picture', data.profile_picture);
  }
  return API.post("profile/basic-details/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateReligionAPI = (data) => API.post("profile/religion/", data);
export const updateEducationCareerAPI = (data) => API.post("profile/education/", data);
export const updateLocationAPI = (data) => API.post("profile/location/", data);
export const updatePersonalDetailsAPI = (data) => API.post("profile/personal-details/", data);

// ===== LIKE & FAVOURITE =====
export const likeProfileAPI = (profileId) => API.post("like-profile/", { profile_id: profileId });
export const unlikeProfileAPI = (profileId) => API.delete(`unlike-profile/${profileId}/`);
export const favouriteProfileAPI = (profileId) => API.post("favourite-profile/", { profile_id: profileId });
export const removeFavouriteAPI = (profileId) => API.delete(`remove-favourite/${profileId}/`);
export const getMyLikesAPI = () => API.get("my-likes/");
export const getMyFavouritesAPI = () => API.get("my-favourites/");
export const getLikedProfilesAPI = () => API.get("liked-profiles/");
export const getFavouriteProfilesAPI = () => API.get("favourite-profiles/");

// ===== PROFILES =====
export const getAllProfilesAPI = () => API.get("profiles/");
export const getPublicProfilesAPI = () => API.get("profiles/");
export const getProfileDetailsAPI = (id) => API.get(`profile/${id}/`);

// ===== BLOCK USER =====
export const getBlockedUsersAPI = () => API.get("block-user/");
export const unblockUserAPI = (blockedUserId) => API.delete("block-user/", { data: { blocked_user_id: blockedUserId } });
export const blockUserAPI = (userId) => API.post("block-user/", { blocked_user_id: userId });

// ===== PREFERENCES =====
export const getPreferencesAPI = () => API.get("preferences/");
export const updatePreferencesAPI = (data) => API.patch("preferences/", data);

// ===== SUPPORT =====
export const sendSupportMessageAPI = (formData) => API.post("support/", formData, { headers: { 'Content-Type': 'multipart/form-data' }});

// ===== NOTIFICATION SETTINGS =====
export const getNotificationsSettingsAPI = () => API.get("notifications/");
export const updateNotificationsAPI = (data) => API.put("notifications/", data);

// ===== SUBSCRIPTION =====
export const getSubscriptionAPI = () => API.get("subscription/");
export const cancelSubscriptionAPI = () => API.delete("subscription/");

// ===== REPORT PROBLEM =====
export const reportProblemAPI = (formData) => API.post("report-problem/", formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ===== COMMENTS & CHAT & USER NOTIFICATIONS =====
export const addCommentAPI = (data) => API.post("add-comment/", data);
export const getNotificationsAPI = () => API.get("user-notifications/");
export const markNotificationReadAPI = (id) => API.post(`notifications/${id}/read/`);
export const getAdminAPI = () => API.get("admin-user/");

// ===== CHAT APIs =====
export const getChatRoomsAPI = () => API.get("chat-rooms/");
export const createChatAPI = (userId) => API.post("chat/create/", { user_id: userId });
export const getMessagesAPI = (roomId) => API.get(`chat/${roomId}/messages/`);
export const sendMessageAPI = (data) => API.post("chat/send-message/", data);
export const sendVoiceMessageAPI = (formData) =>
  API.post("chat/send-voice/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const chatRequestActionAPI = (roomId, action) => API.post(`chat/request-action/${roomId}/`, { action });
export const deleteMessageAPI = (data) => API.delete(`chat/delete-message/`, { data });
export const sendImageMessageAPI = (formData) => API.post("chat/send-image/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// ===== ADMIN DASHBOARD =====
export const getAdminStatsAPI = () => API.get("admin/stats/");
export const getUserGrowthAPI = (days = 30) => API.get(`admin/user-growth/?days=${days}`);
export const getRecentRegistrationsAPI = () => API.get("admin/recent-registrations/");

// ===== ADMIN USERS MANAGEMENT =====
export const getAllUsersAPI = (params) => API.get("admin/users/", { params });
export const getUserDetailsAPI = (id) => API.get(`admin/users/${id}/`);
export const updateUserStatusAPI = (id, data) => API.patch(`admin/users/${id}/`, data);
export const deleteUserAPI = (id) => API.delete(`admin/users/${id}/`);
export const addUserAPI = (data) => API.post("admin/users/", data);
export const createUserByAdminAPI = (data) => API.post("admin/users/", data);

// ===== ADMIN PROFILES MANAGEMENT =====
export const getAllProfilesAdminAPI = (params) => API.get("admin/profiles/", { params });
export const approveProfileAPI = (id) => API.post(`admin/profiles/${id}/verify/`, { status: 'verified' });
export const rejectProfileAPI = (id, data) => API.post(`admin/profiles/${id}/verify/`, { status: 'rejected', ...data });
export const deleteProfileAPI = (id) => API.delete(`admin/profiles/${id}/`);
export const getAdminProfileDetailsAPI = (id) => API.get(`admin/profiles/${id}/`);

// ===== ADMIN MATCHES MANAGEMENT =====
export const getAllMatchesAPI = (params) => API.get("admin/matches/", { params });
export const getMatchStatsAPI = () => API.get("admin/matches/stats/");

// ===== BANNERS/ADS =====
export const getAllAdsAPI = () => API.get("admin/ads/");
export const deleteAdAPI = (id) => API.delete(`admin/ads/${id}/`);
export const updateAdAPI = (id, data) => API.patch(`admin/ads/${id}/`, data);

// ===== SETTINGS =====
export const getSiteSettingsAPI = () => API.get("admin/settings/");
export const updateSiteSettingsAPI = (data) => API.put("admin/settings/", data);

// ===== ID VERIFICATION =====
export const getAadhaarVerificationAPI = () => API.get("aadhaar-verification/");
export const submitAadhaarVerificationAPI = (formData) =>
  API.post("aadhaar-verification/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getAdminAadhaarListAPI = (params) => API.get("admin/aadhaar-verifications/", { params });
export const approveAadhaarAPI = (userId) => API.post(`admin/aadhaar-verification/${userId}/`, { status: 'approved' });
export const rejectAadhaarAPI = (userId, data) => API.post(`admin/aadhaar-verification/${userId}/`, { status: 'rejected', ...data });
export const getAadhaarDetailsAPI = (userId) => API.get(`admin/aadhaar-verification/${userId}/`);

export const getMyMatchesAPI = () => API.get("my-matches/");

// ===== ADMIN SUCCESS STORIES MANAGEMENT =====
export const getAdminStoriesAPI = () => API.get("admin/stories/");
export const createAdminStoryAPI = (data) => API.post("admin/stories/", data);
export const deleteAdminStoryAPI = (id) => API.delete(`admin/stories/${id}/`);

export const updateSuccessStoryAPI = (id, formData) => {
  const token = localStorage.getItem("access");
  return API.put(`admin/stories/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    }
  });
};

// ===== ADMIN SUBSCRIPTION PLANS MANAGEMENT =====
export const getAdminPlansAPI = () => API.get("admin/plans/");
export const createAdminPlanAPI = (data) => API.post("admin/plans/", data);
export const deleteAdminPlanAPI = (id) => API.delete(`admin/plans/${id}/`);

// ===== ADMIN PAYMENTS MANAGEMENT =====
export const getAdminPaymentsAPI = () => API.get("admin/payments/");

// ===== PUBLIC APIs =====
export const getPublicPlansAPI = () => PublicAPI.get("plans/");

// ✅ FIXED: Public Success Stories API - auth ഇല്ലാതെ call ചെയ്യാം
export const getSuccessStoriesAPI = () => PublicAPI.get("success-stories/");

export default API;
