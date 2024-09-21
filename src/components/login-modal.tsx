import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../lib/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState<string[]>(['user']); // Default user type
  const { signInWithGoogle, signInWithEmailAndPassword } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        email,
        password,
        username, // You need to provide this
        userType  // You need to provide this as a string array
      );
      onClose();
    } catch (error) {
      console.error('Error signing in with email and password:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(username, userType);
      onClose();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleEmailLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" className="w-full mb-2">Login with Email</Button>
        </form>
        <Button onClick={handleGoogleLogin} className="w-full">Sign in with Google</Button>
        <Button onClick={onClose} className="mt-4 w-full">Close</Button>
      </div>
    </div>
  );
};

export default LoginModal;