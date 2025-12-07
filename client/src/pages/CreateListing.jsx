import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 sm:p-10 min-h-screen bg-slate-50'>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-800 p-8 text-white text-center sm:text-left">
          <h1 className='text-3xl font-extrabold'>Create a Listing</h1>
          <p className="text-slate-400 mt-2">Fill in the details to post your property</p>
        </div>

        <form onSubmit={handleSubmit} className='p-8 flex flex-col md:flex-row gap-10'>
          {/* Left Column: Details */}
          <div className='flex flex-col gap-6 flex-1'>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-700 border-b border-slate-200 pb-2">Property Details</h2>
              <input
                type='text'
                placeholder='Property Name'
                className='border border-slate-200 bg-slate-50 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-medium'
                id='name'
                maxLength='62'
                minLength='10'
                required
                onChange={handleChange}
                value={formData.name}
              />
              <textarea
                type='text'
                placeholder='Description'
                className='border border-slate-200 bg-slate-50 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all min-h-[120px]'
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
              />
              <input
                type='text'
                placeholder='Address'
                className='border border-slate-200 bg-slate-50 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all'
                id='address'
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-700 border-b border-slate-200 pb-2">Key Features</h2>
              <div className='flex gap-6 flex-wrap'>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-5 h-5 accent-slate-800'
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                  />
                  <span className="font-medium text-slate-700">Sell</span>
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-5 h-5 accent-slate-800'
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                  />
                  <span className="font-medium text-slate-700">Rent</span>
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-5 h-5 accent-slate-800'
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span className="font-medium text-slate-700">Parking spot</span>
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-5 h-5 accent-slate-800'
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span className="font-medium text-slate-700">Furnished</span>
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-5 h-5 accent-slate-800'
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <span className="font-medium text-slate-700">Offer</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-700 border-b border-slate-200 pb-2">Specs & Pricing</h2>
              <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200'>
                  <input
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    className='p-2 border border-gray-300 rounded-lg w-16 text-center'
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                  <p className="font-semibold text-slate-600">Beds</p>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200'>
                  <input
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    className='p-2 border border-gray-300 rounded-lg w-16 text-center'
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                  <p className="font-semibold text-slate-600">Baths</p>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200'>
                  <input
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='10000000'
                    required
                    className='p-2 border border-gray-300 rounded-lg w-28 text-center'
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <div className='flex flex-col'>
                    <p className="font-semibold text-slate-600">Regular Price</p>
                    {formData.type === 'rent' && (
                      <span className='text-xs text-slate-400'>($ / month)</span>
                    )}
                  </div>
                </div>
                {formData.offer && (
                  <div className='flex items-center gap-2 bg-rose-50 p-3 rounded-lg border border-rose-100'>
                    <input
                      type='number'
                      id='discountPrice'
                      min='0'
                      max='10000000'
                      required
                      className='p-2 border border-rose-200 rounded-lg w-28 text-center bg-white'
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <div className='flex flex-col'>
                      <p className="font-semibold text-rose-600">Discounted Price</p>
                      {formData.type === 'rent' && (
                        <span className='text-xs text-rose-400'>($ / month)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className='flex flex-col gap-6 flex-1'>
            <h2 className="text-xl font-bold text-slate-700 border-b border-slate-200 pb-2">Property Images</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col gap-4">
              <p className='font-semibold text-slate-600 mb-2'>
                Upload Images
                <span className='font-normal text-slate-400 ml-2 text-sm block sm:inline'>
                  (Max 6 images, less than 2MB each)
                </span>
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className='p-3 border border-slate-300 rounded w-full bg-white text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                />
                <button
                  type='button'
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 transition-all font-bold hover:bg-green-50'
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
            <p className='text-red-600 text-sm font-medium'>
              {imageUploadError && imageUploadError}
            </p>

            {/* Image Previews */}
            <div className="grid grid-cols-2 gap-4">
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-square'
                  >
                    <img
                      src={url}
                      alt='listing image'
                      className='w-full h-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                      className='absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity'
                      title="Delete Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>

            <div className="mt-auto">
              <button
                disabled={loading || uploading}
                className='w-full p-4 bg-slate-800 text-white rounded-xl uppercase font-bold text-lg hover:bg-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70'
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
              {error && <p className='text-red-600 text-sm mt-4 text-center'>{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
