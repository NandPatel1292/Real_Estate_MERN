import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-slate-50'>
      {/* Sidebar */}
      <div className='md:w-96 bg-white p-7 border-b-2 md:border-r border-slate-200 shadow-sm z-10'>
        <div className="sticky top-24">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>Advanced Search</span>
          </h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-slate-700'>Search Term</label>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search by address, name, etc.'
                className='input-field'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-4">
              <label className='font-semibold text-slate-700'>Filters</label>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Type</p>
                <div className='flex gap-4 flex-wrap'>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      id='all'
                      className='w-4 h-4 accent-blue-600 rounded'
                      onChange={handleChange}
                      checked={sidebardata.type === 'all'}
                    />
                    <span>All</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      id='rent'
                      className='w-4 h-4 accent-blue-600 rounded'
                      onChange={handleChange}
                      checked={sidebardata.type === 'rent'}
                    />
                    <span>Rent</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      id='sale'
                      className='w-4 h-4 accent-blue-600 rounded'
                      onChange={handleChange}
                      checked={sidebardata.type === 'sale'}
                    />
                    <span>Sale</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      id='offer'
                      className='w-4 h-4 accent-blue-600 rounded'
                      onChange={handleChange}
                      checked={sidebardata.offer}
                    />
                    <span>Offer</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Amenities</p>
                <div className="flex gap-4 flex-wrap">
                  <div className='flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      id='parking'
                      className='w-4 h-4 accent-blue-600 rounded'
                      onChange={handleChange}
                      checked={sidebardata.parking}
                    />
                    <span>Parking</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      id='furnished'
                      className='w-4 h-4 accent-blue-600 rounded'
                      onChange={handleChange}
                      checked={sidebardata.furnished}
                    />
                    <span>Furnished</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-slate-700'>Sort By</label>
              <div className="relative">
                <select
                  onChange={handleChange}
                  defaultValue={'created_at_desc'}
                  id='sort_order'
                  className='input-field appearance-none'
                >
                  <option value='regularPrice_desc'>Price high to low</option>
                  <option value='regularPrice_asc'>Price low to high</option>
                  <option value='createdAt_desc'>Latest</option>
                  <option value='createdAt_asc'>Oldest</option>
                </select>
              </div>
            </div>

            <button className='btn-primary w-full shadow-lg shadow-blue-900/20'>
              Apply Filters
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className='flex-1 p-7'>
        <div className="max-w-7xl mx-auto">
          <h1 className='text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3'>
            Search Results
            <span className="text-sm font-normal text-slate-500 bg-slate-200 px-3 py-1 rounded-full">{listings.length} found</span>
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr'>
            {!loading && listings.length === 0 && (
              <div className="col-span-full text-center py-20 opacity-50">
                <p className='text-2xl font-bold text-slate-700'>No listing found!</p>
                <p>Try adjusting your filters</p>
              </div>
            )}
            {loading && (
              <p className='text-xl text-slate-700 text-center w-full col-span-full py-20'>
                Loading...
              </p>
            )}

            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>

          {showMore && (
            <div className="mt-12 text-center">
              <button
                onClick={onShowMoreClick}
                className='btn-secondary'
              >
                Show More Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
