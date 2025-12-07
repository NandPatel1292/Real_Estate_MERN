import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
      <div className='max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300'>
        <div className="text-center mb-8">
          <h1 className='text-3xl font-extrabold text-slate-800 mb-2'>Welcome Back</h1>
          <p className="text-slate-500">Sign in to continue to UrbanNest</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
            <input
              type='email'
              placeholder='name@company.com'
              className='w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all'
              id='email'
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <input
              type='password'
              placeholder='••••••••'
              className='w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all'
              id='password'
              onChange={handleChange}
            />
          </div>

          <button
            disabled={loading}
            className='bg-slate-800 text-white p-3.5 rounded-xl uppercase font-bold hover:bg-slate-900 hover:shadow-lg disabled:opacity-70 transition-all mt-2'
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="relative flex items-center gap-2 my-2">
            <div className="h-px bg-slate-200 w-full"></div>
            <span className="text-slate-400 text-sm font-medium">OR</span>
            <div className="h-px bg-slate-200 w-full"></div>
          </div>

          <OAuth />
        </form>

        <div className='flex gap-2 mt-6 justify-center text-sm font-medium'>
          <p className="text-slate-500">Don't have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-600 hover:text-blue-700 hover:underline'>Sign up</span>
          </Link>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
