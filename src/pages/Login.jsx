import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
        /* Outer wrapper: Full screen flex */
        <div className="flex min-h-screen w-full bg-gray-50">
            
            {/* LEFT SIDE: Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-blue-700 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <h1 className="text-5xl font-black mb-6 tracking-tight">Welcome Back</h1>
                    <p className="text-xl text-blue-100 leading-relaxed">
                        Log in to manage your events and stay connected with your participants.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-gray-500">Enter your credentials to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border-l-4 border-red-500 rounded text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none shadow-sm"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-[0.98] mt-2"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-brand-text">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;