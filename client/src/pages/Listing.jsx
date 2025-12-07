import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-slate-50 min-h-screen">
      {loading && <p className='text-center py-10 text-2xl text-slate-600 animate-pulse'>Loading listing details...</p>}
      {error && (
        <p className='text-center py-10 text-2xl text-red-600'>Something went wrong!</p>
      )}

      {listing && !loading && !error && (
        <div className="animate-in fade-in duration-500">

          {/* Gallery Section */}
          <div className="w-full h-[50vh] md:h-[60vh] relative bg-slate-200">
            <Swiper
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              effect="fade"
              className="h-full w-full"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className="h-full w-full bg-slate-200 flex items-center justify-center overflow-hidden relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-md opacity-50 scale-110"
                      style={{ backgroundImage: `url(${url})` }}
                    ></div>
                    <img
                      src={url}
                      alt={listing.name}
                      className="relative h-full w-full object-cover z-10 shadow-sm"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Share Button (Overlapping Image) */}
            < div className='absolute top-6 right-6 z-10 border border-white/20 rounded-full w-12 h-12 flex justify-center items-center bg-white/90 backdrop-blur-sm shadow-md cursor-pointer hover:bg-white transition-colors'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              title="Copy Link">
              <FaShare className='text-slate-700' />
            </div>
            {copied && (
              <p className='absolute top-20 right-6 z-20 rounded-md bg-slate-800 text-white p-2 text-sm shadow-xl'>
                Link copied!
              </p>
            )}
          </div>

          {/* Main Content Container */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">

                {/* Header */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wide text-white ${listing.type === 'rent' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                      {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    {listing.offer && (
                      <span className='px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wide bg-rose-500 text-white'>
                        Offer
                      </span>
                    )}
                  </div>
                  <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight'>
                    {listing.name}
                  </h1>
                  <p className='flex items-center gap-2 text-lg text-slate-600 font-medium'>
                    <FaMapMarkerAlt className='text-emerald-600 flex-shrink-0' />
                    {listing.address}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-200">
                  <div className='flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 text-center'>
                    <FaBed className='text-3xl text-slate-400' />
                    <span className="font-semibold text-slate-700 text-sm">
                      {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                    </span>
                  </div>
                  <div className='flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 text-center'>
                    <FaBath className='text-3xl text-slate-400' />
                    <span className="font-semibold text-slate-700 text-sm">
                      {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                    </span>
                  </div>
                  <div className='flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 text-center'>
                    <FaParking className='text-3xl text-slate-400' />
                    <span className="font-semibold text-slate-700 text-sm">
                      {listing.parking ? 'Parking' : 'No Parking'}
                    </span>
                  </div>
                  <div className='flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 gap-2 text-center'>
                    <FaChair className='text-3xl text-slate-400' />
                    <span className="font-semibold text-slate-700 text-sm">
                      {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">Description</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
                  <div className="p-6 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm text-slate-500 font-medium mb-1">Price</p>
                    <p className='text-3xl font-bold text-slate-900'>
                      $
                      {listing.offer
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-US')}
                      {listing.type === 'rent' && <span className="text-lg text-slate-500 font-normal"> / month</span>}
                    </p>
                    {listing.offer && (
                      <p className="text-sm text-rose-600 font-semibold mt-1">
                        You save ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')}
                      </p>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    {currentUser && listing.userRef !== currentUser._id && (
                      <>
                        {!contact ? (
                          <button
                            onClick={() => setContact(true)}
                            className='w-full btn-primary py-3 text-lg shadow-lg shadow-blue-200'
                          >
                            Contact Landlord
                          </button>
                        ) : (
                          <div className="animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-slate-800">Send Message</h3>
                              <button onClick={() => setContact(false)} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
                            </div>
                            <Contact listing={listing} />
                          </div>
                        )}
                      </>
                    )}

                    {!currentUser && (
                      <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-blue-800 font-medium mb-2">Interested in this property?</p>
                        <button
                          onClick={() => setContact(true)}
                          className='w-full bg-white text-blue-600 border border-blue-200 font-bold py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all'
                        >
                          Contact Landlord
                        </button>
                      </div>
                    )}

                    {currentUser && listing.userRef === currentUser._id && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                        <p className="text-yellow-800 font-medium">This is your listing</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </main >
  );
}
