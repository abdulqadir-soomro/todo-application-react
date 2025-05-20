import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useDispatch } from 'react-redux';
import { setUser, setError, setLoading, logout } from '../features/authSlice';
import { toast } from 'react-toastify';

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return {
        title: 'Email Already Registered',
        message: 'This email is already registered. Please login instead.',
        type: 'error',
        icon: '⚠️'
      };
    case 'auth/invalid-email':
      return {
        title: 'Invalid Email Format',
        message: 'Please enter a valid email address (e.g., user@example.com)',
        type: 'error',
        icon: '❌'
      };
    case 'auth/operation-not-allowed':
      return {
        title: 'Operation Not Allowed',
        message: 'Email/password accounts are not enabled. Please contact support.',
        type: 'error',
        icon: '🚫'
      };
    case 'auth/weak-password':
      return {
        title: 'Weak Password',
        message: 'Password should be at least 6 characters long and include numbers and special characters.',
        type: 'error',
        icon: '🔒'
      };
    case 'auth/user-disabled':
      return {
        title: 'Account Disabled',
        message: 'This account has been disabled. Please contact support.',
        type: 'error',
        icon: '🚫'
      };
    case 'auth/user-not-found':
      return {
        title: 'Account Not Found',
        message: 'No account found with this email. Please check your email or sign up.',
        type: 'error',
        icon: '🔍'
      };
    case 'auth/wrong-password':
      return {
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect. Please try again or use "Forgot Password".',
        type: 'error',
        icon: '🔑'
      };
    case 'auth/too-many-requests':
      return {
        title: 'Too Many Attempts',
        message: 'Too many failed login attempts. Please try again after a few minutes.',
        type: 'error',
        icon: '⏰'
      };
    default:
      return {
        title: 'Error',
        message: 'An error occurred. Please try again.',
        type: 'error',
        icon: '❌'
      };
  }
};

const ErrorToast = ({ title, message, icon }) => (
  <div className="flex items-start gap-3">
    <span className="text-xl">{icon}</span>
    <div>
      <h4 className="font-bold text-red-600 mb-1">{title}</h4>
      <p className="text-gray-700">{message}</p>
    </div>
  </div>
);

const SuccessToast = ({ message }) => (
  <div className="flex items-center gap-2">
    <span className="text-xl">✅</span>
    <p className="text-gray-700">{message}</p>
  </div>
);

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email
        }));
      } else {
        dispatch(logout());
      }
      setLoadingState(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const signup = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email
      }));
      toast.success(<SuccessToast message="Account created successfully! Welcome to Todo App!" />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const { title, message, icon } = getErrorMessage(error);
      dispatch(setError(message));
      toast.error(<ErrorToast title={title} message={message} icon={icon} />, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email
      }));
      toast.success(<SuccessToast message="Welcome back! You have successfully logged in." />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const { title, message, icon } = getErrorMessage(error);
      dispatch(setError(message));
      toast.error(<ErrorToast title={title} message={message} icon={icon} />, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success(<SuccessToast message="You have been successfully logged out. See you soon!" />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const { title, message, icon } = getErrorMessage(error);
      dispatch(setError(message));
      toast.error(<ErrorToast title={title} message={message} icon={icon} />, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return {
    signup,
    login,
    logout: logoutUser,
    loading
  };
}; 