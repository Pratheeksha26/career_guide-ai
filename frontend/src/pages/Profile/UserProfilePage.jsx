import React, { useEffect } from 'react';
import UserProfile from '../../components/UserProfile';

const UserProfilePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <UserProfile />;
};

export default UserProfilePage;
