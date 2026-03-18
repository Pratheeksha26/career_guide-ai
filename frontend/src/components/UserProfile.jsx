import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaGraduationCap, 
  FaBriefcase, 
  FaCog,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    educationLevel: user?.educationLevel || 'undergraduate',
    careerInterests: user?.careerInterests?.join(', ') || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const educationLevels = [
    { value: 'school', label: 'School Student' },
    { value: 'undergraduate', label: 'Undergraduate Student' },
    { value: 'graduate', label: 'Graduate Student' },
    { value: 'professional', label: 'Working Professional' },
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileSave = async () => {
    try {
      const dataToSend = {
        ...profileData,
        careerInterests: profileData.careerInterests.split(',').map(s => s.trim()).filter(s => s),
        skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s),
      };
      
      await updateProfile(dataToSend);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  if (!user) {
    return (
      <div className="up-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="up-container">
      <div className="up-profile-card">
        <div className="up-header">
          <div className="up-avatar">
            <FaUser className="up-avatar-icon" />
          </div>
          <div className="up-user-info">
            <h2 className="up-user-name">{user.username}</h2>
            <p className="up-user-email">{user.email}</p>
            <div className="up-user-role">
              <span className="up-role-badge">{user.role}</span>
              <span className="up-member-since">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="up-actions">
            {!isEditing && !isChangingPassword && (
              <>
                <button
                  className="up-action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="up-action-icon" />
                  Edit Profile
                </button>
                <button
                  className="up-action-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <FaLock className="up-action-icon" />
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="up-edit-section">
            <h3 className="up-section-title">Edit Profile</h3>
            <div className="up-form">
              <div className="up-form-group">
                <label className="up-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="up-input"
                />
              </div>
              
              <div className="up-form-group">
                <label className="up-label">Education Level</label>
                <select
                  name="educationLevel"
                  value={profileData.educationLevel}
                  onChange={handleProfileChange}
                  className="up-select"
                >
                  {educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="up-form-group">
                <label className="up-label">Career Interests (comma separated)</label>
                <input
                  type="text"
                  name="careerInterests"
                  value={profileData.careerInterests}
                  onChange={handleProfileChange}
                  className="up-input"
                  placeholder="e.g., Software Engineering, Data Science, Marketing"
                />
              </div>
              
              <div className="up-form-group">
                <label className="up-label">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={profileData.skills}
                  onChange={handleProfileChange}
                  className="up-input"
                  placeholder="e.g., JavaScript, Python, Communication, Leadership"
                />
              </div>
              
              <div className="up-btn-group">
                <button
                  className="up-save-btn"
                  onClick={handleProfileSave}
                >
                  <FaSave className="up-btn-icon" />
                  Save Changes
                </button>
                <button
                  className="up-cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      username: user.username,
                      educationLevel: user.educationLevel,
                      careerInterests: user.careerInterests?.join(', ') || '',
                      skills: user.skills?.join(', ') || '',
                    });
                  }}
                >
                  <FaTimes className="up-btn-icon" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : isChangingPassword ? (
          <div className="up-edit-section">
            <h3 className="up-section-title">Change Password</h3>
            <div className="up-form">
              <div className="up-form-group">
                <label className="up-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="up-input"
                />
              </div>
              
              <div className="up-form-group">
                <label className="up-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="up-input"
                />
              </div>
              
              <div className="up-form-group">
                <label className="up-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="up-input"
                />
              </div>
              
              <div className="up-btn-group">
                <button
                  className="up-save-btn"
                  onClick={handlePasswordSave}
                >
                  <FaSave className="up-btn-icon" />
                  Change Password
                </button>
                <button
                  className="up-cancel-btn"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  <FaTimes className="up-btn-icon" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="up-details-section">
            <div className="up-details-grid">
              <div className="up-detail-item">
                <div className="up-detail-header">
                  <FaGraduationCap className="up-detail-icon" />
                  <h4 className="up-detail-title">Education Level</h4>
                </div>
                <p className="up-detail-value">
                  {educationLevels.find(l => l.value === user.educationLevel)?.label}
                </p>
              </div>
              
              <div className="up-detail-item">
                <div className="up-detail-header">
                  <FaBriefcase className="up-detail-icon" />
                  <h4 className="up-detail-title">Career Interests</h4>
                </div>
                <div className="up-tags">
                  {user.careerInterests?.map((interest, index) => (
                    <span key={index} className="up-tag">
                      {interest}
                    </span>
                  ))}
                  {(!user.careerInterests || user.careerInterests.length === 0) && (
                    <span className="up-empty-text">Not specified</span>
                  )}
                </div>
              </div>
              
              <div className="up-detail-item">
                <div className="up-detail-header">
                  <FaCog className="up-detail-icon" />
                  <h4 className="up-detail-title">Skills</h4>
                </div>
                <div className="up-tags">
                  {user.skills?.map((skill, index) => (
                    <span key={index} className="up-tag">
                      {skill}
                    </span>
                  ))}
                  {(!user.skills || user.skills.length === 0) && (
                    <span className="up-empty-text">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="up-footer">
          <button
            className="up-logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;