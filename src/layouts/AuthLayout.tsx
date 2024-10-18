import { useState, useEffect } from 'react';
import { User } from "firebase/auth";
import { auth } from '../database/firebase'


interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> =  ({ children }) => {
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          if (user.isAnonymous) {
            console.log("User is signed in anonymously with UID:", user.uid);
          } else {
            console.log("User is signed in with account:", user.email);
          }
          setUser(user);
        } else {
          console.log("No user is signed in.");
          setUser(null);
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
          {user ? (
            children
          ) : (
            <div>
              <h2>No user is signed in.</h2>
            </div>
          )}
      </>
    );
  };
  
  export default AuthLayout;