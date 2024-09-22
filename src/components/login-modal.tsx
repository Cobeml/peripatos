import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../lib/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmailAndPassword, signInWithGoogle } = useAuth();
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState<string[]>(['user']); // Default user type

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(emailOrUsername, password);
      onClose();
    } catch (error: any) {
      console.error('Error signing in with email and password:', error);
      setError(error.message || 'An error occurred during sign in.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(username, userType);
      onClose();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('An error occurred during Google sign in.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleEmailLogin}>
          <Input
            type="text"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="mb-2 text-black"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 text-black"
          />
          <Button type="submit" className="w-full mb-2">Login</Button>
        </form>
        <Button onClick={handleGoogleLogin} className="w-full">Sign in with Google</Button>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 text-black"
        />
        <Button onClick={handleGoogleLogin} className="w-full">Sign in with Google</Button>
        <Button onClick={onClose} className="mt-4 w-full">Close</Button>
      </div>
    </div>
  );
};

export default LoginModal;