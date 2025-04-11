import logo from '/logo.png';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant'); // Add role state
  const [error, setError] = useState('');
  
  const registerMutation = trpc.register.useMutation({
    onSuccess: (data) => {
      console.log('✅ Success:', data);
    },
    onError: (err) => {
      console.error('❌ Error:', err.message);
      setError(err.message);
    },
  });

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      return 'Password must contain at least one uppercase letter, one number, and one special character';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      return;
    }
    console.log('Attempting signup:', { email, password, role });
    await registerMutation.mutateAsync({ email, password, role });
    navigate('/sacai/login')
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-cyan-200 to-pink-100">
      <div className="bg-white rounded-2xl shadow-md flex">
        <div className="flex flex-row items-center p-6 border-b">
          <img src={logo} alt="logo" className="w-16 mr-4" />
          <h2 className="text-xl font-semibold">SkillBridge and CareerPath AI</h2>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-black">We Welcome You</h2>
          <h3 className="text-gray-500 mb-6">Signup here with your account credentials</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="your@email.com"
                required
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                title="Please enter a valid email address"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full p-2 border ${
                  error && password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
                placeholder="••••••••"
                required
                minLength="8"
                autoComplete="current-password"
              />
              {error && password && <p className="mt-1 text-sm text-red-600">{error}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Must contain at least one uppercase letter, one number, and one special character
              </p>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                <div className="space-y-2">
                    <div className="flex items-center">
                    <input
                        id="role-participant"
                        name="role"
                        type="radio"
                        value="participant"
                        checked={role === 'participant'}
                        onChange={() => setRole('participant')}
                        className="h-4 w-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
                    />
                    <label htmlFor="role-participant" className="ml-2 text-sm text-gray-700">
                        Participant
                    </label>
                    </div>
                    
                    <div className="flex items-center">
                    <input
                        id="role-moderator"
                        name="role"
                        type="radio"
                        value="moderator"
                        checked={role === 'moderator'}
                        onChange={() => setRole('moderator')}
                        className="h-4 w-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
                    />
                    <label htmlFor="role-moderator" className="ml-2 text-sm text-gray-700">
                        Moderator
                    </label>
                    </div>
                    
                    <div className="flex items-center">
                    <input
                        id="role-evaluator"
                        name="role"
                        type="radio"
                        value="evaluator"
                        checked={role === 'evaluator'}
                        onChange={() => setRole('evaluator')}
                        className="h-4 w-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
                    />
                    <label htmlFor="role-evaluator" className="ml-2 text-sm text-gray-700">
                        Evaluator
                    </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
              disabled={error && password ? true : false}
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/sacai/login" className="font-medium text-cyan-600 hover:text-cyan-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};