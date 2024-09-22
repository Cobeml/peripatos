import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../lib/hooks/useAuth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [userType, setUserType] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUpWithEmailAndPassword, signInWithGoogle } = useAuth();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!userType) {
      setError('Please select at least one user type.');
      return;
    }
    try {
      console.log('Starting sign-up process...');
      await signUpWithEmailAndPassword(email, password, username, [userType]);
      console.log('Sign-up successful');
      if (receiveUpdates) {
        await subscribeToNewsletter(email, username);
      }
      onClose();
    } catch (error: any) {
      console.error('Error during sign-up:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError(`An error occurred during sign up: ${error.message}`);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!userType) {
      setError('Please select at least one user type.');
      return;
    }
    try {
      await signInWithGoogle(username, [userType]);
      if (receiveUpdates) {
        await subscribeToNewsletter(email, username);
      }
      onClose();
    } catch (error) {
      setError('An error occurred during Google sign up. Please try again.');
      console.error('Error signing up with Google:', error);
    }
  };

  const handleUserTypeChange = (type: string) => {
    setSelectedTypes(prev => {
      const newTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      // Determine user type based on selected checkboxes
      let newUserType = '';
      if (newTypes.includes('learn')) {
        newUserType = 'Student';
      } else if (newTypes.includes('teach')) {
        newUserType = 'Teacher';
      } else if (newTypes.includes('lease') && newTypes.length === 1) {
        newUserType = 'Classroom Owner';
      }
      
      setUserType(newUserType);
      return newTypes;
    });
  };

  const subscribeToNewsletter = async (email: string, name: string) => {
    try {
      const response = await fetch('https://peripatos-listmonk.up.railway.app/subscription/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          name,
          l: 'e7d10ec7-c55e-4599-8054-b704a81f4a18',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-black">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleEmailSignUp}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <p className="mb-2">How do you intend to use the platform?</p>
          {['learn', 'teach', 'lease'].map((type) => (
            <label key={type} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleUserTypeChange(type)}
                className="mr-2"
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
          {userType && (
            <p className="mt-2 text-sm text-gray-600">
              You will be registered as: <strong>{userType}</strong>
            </p>
          )}
          <div className="mt-6 mb-4 p-3 bg-gray-100 rounded-md border border-gray-300">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={receiveUpdates}
                onChange={(e) => setReceiveUpdates(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">
                I want to receive updates on Peripatos
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full mt-4 mb-2">Sign Up</Button>
        </form>
        <Button onClick={handleGoogleSignUp} className="w-full">Sign up with Google</Button>
        <Button onClick={onClose} className="mt-4 w-full">Close</Button>
      </div>
    </div>
  );
};

export default SignUpModal;