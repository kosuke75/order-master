import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>ログイン状態を確認中...</p>; 
  }

  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
