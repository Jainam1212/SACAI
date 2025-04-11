import logo from '/logo.png';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const loginMutation = trpc.login.useMutation({
    onSuccess: (result) => {
      if (result.success) {        
        console.log('✅', result.message);
        document.cookie = `username=${result.userId}`
        navigate('/sacai')
      } else {
        console.log('❌ Login failed:', result.message);
        setServerError(result.message);
      }
    },
    onError: (err) => {
      console.error('❌ Mutation error:', err.message);
      setServerError('An unexpected error occurred');
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
    setValidationError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) {
      return;
    }
    setServerError('');
    console.log('Attempting login:', { email, password });
    await loginMutation.mutateAsync({ email, password });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-cyan-200 to-pink-100">
      <div className="bg-white rounded-2xl shadow-md flex items-center">
        <div className="flex flex-row items-center p-6 border-b">
          <img src={logo} alt="logo" className="w-16 mr-4" />
          <h2 className="text-xl font-semibold">SkillBridge and CareerPath AI</h2>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-black">Welcome Back</h2>
          <h3 className="text-gray-500 mb-6">Login here with your account credentials</h3>

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
                  validationError && password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500`}
                placeholder="••••••••"
                required
                minLength="8"
                autoComplete="current-password"
              />
              {validationError && password && (
                <p className="mt-1 text-sm text-red-600">{validationError}</p>
              )}
              {serverError && <p className="mt-1 text-sm text-red-600">{serverError}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Must contain at least one uppercase letter, one number, and one special character
              </p>
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
              disabled={validationError && password ? true : false}
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/sacai/signup" className="font-medium text-cyan-600 hover:text-cyan-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};