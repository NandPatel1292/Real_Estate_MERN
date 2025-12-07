import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  resetError,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='min-h-screen py-10 px-4 bg-slate-50'>
      <div className='max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100'>
        <div className="bg-slate-800 p-6 text-center">
          <h1 className='text-3xl font-bold text-white mb-2'>My Profile</h1>
          <p className="text-slate-300 text-sm">Manage your account and listings</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-2">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type='file'
                ref={fileRef}
                hidden
                accept='image/*'
              />
              <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt='profile'
                  className='rounded-full h-32 w-32 object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity'
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Change</span>
                </div>
              </div>

              <p className='text-sm font-medium h-5'>
                {fileUploadError ? (
                  <span className='text-red-600'>
                    Error: Image must be less than 2 MB
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className='text-slate-600'>{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className='text-green-600'>Image successfully uploaded!</span>
                ) : (
                  ''
                )}
              </p>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                <input
                  type='text'
                  placeholder='username'
                  defaultValue={currentUser.username}
                  id='username'
                  className='w-full border border-slate-200 bg-slate-50 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all'
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                <input
                  type='email'
                  placeholder='email'
                  id='email'
                  defaultValue={currentUser.email}
                  className='w-full border border-slate-200 bg-slate-50 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all'
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <input
                  type='password'
                  placeholder='Leave blank to keep current password'
                  onChange={handleChange}
                  id='password'
                  className='w-full border border-slate-200 bg-slate-50 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all placeholder:text-slate-400 placeholder:font-normal'
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                disabled={loading}
                className='bg-slate-800 text-white rounded-xl p-4 uppercase font-bold hover:bg-slate-900 hover:shadow-lg disabled:opacity-70 transition-all'
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              <Link
                className='bg-green-600 text-white p-4 rounded-xl uppercase font-bold text-center hover:bg-green-700 hover:shadow-lg transition-all'
                to={'/create-listing'}
              >
                Create Listing
              </Link>
            </div>
          </form>

          <div className='flex justify-between mt-8 pt-6 border-t border-slate-100 text-sm font-medium'>
            <span
              onClick={handleDeleteUser}
              className='text-red-600 hover:text-red-800 cursor-pointer transition-colors'
            >
              Delete Account
            </span>
            <span onClick={handleSignOut} className='text-slate-500 hover:text-slate-800 cursor-pointer transition-colors'>
              Sign Out
            </span>
          </div>

          <p className='text-red-600 mt-4 text-center font-medium'>{error ? error : ''}</p>
          <p className='text-green-600 mt-4 text-center font-medium'>
            {updateSuccess ? 'User is updated successfully!' : ''}
          </p>
        </div>
      </div>

      {/* Listings Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <button onClick={handleShowListings} className='text-slate-700 font-bold w-full border border-slate-300 rounded-xl p-3 hover:bg-slate-50 transition-colors mb-6'>
          Show Your Listings
        </button>
        <p className='text-red-700 mt-5'>
          {showListingsError ? 'Error showing listings' : ''}
        </p>

        {userListings && userListings.length > 0 && (
          <div className='space-y-6 animate-in fade-in duration-500'>
            <h2 className='text-center text-2xl font-bold text-slate-800'>
              Your Active Listings
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow'
                >
                  <Link to={`/listing/${listing._id}`} className="shrink-0">
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-20 w-24 object-cover rounded-lg'
                    />
                  </Link>
                  <Link
                    className='text-slate-800 font-bold hover:underline truncate flex-1 text-lg'
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className='flex flex-col gap-2 shrink-0'>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='text-red-600 hover:text-red-800 uppercase font-medium text-sm border border-red-100 rounded px-2 py-1 hover:bg-red-50'
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-600 hover:text-green-800 uppercase font-medium text-sm border border-green-100 rounded px-2 py-1 w-full hover:bg-green-50'>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
