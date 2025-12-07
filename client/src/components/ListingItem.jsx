import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-full border border-slate-100 flex flex-col'>
      <Link to={`/listing/${listing._id}`} className='flex flex-col h-full'>
        <div className='relative overflow-hidden aspect-[4/3]'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-500'
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase">
            {listing.type}
          </div>
        </div>

        <div className='p-4 flex flex-col gap-2 w-full'>
          <h3 className='truncate text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors'>
            {listing.name}
          </h3>
          <div className='flex items-center gap-1.5'>
            <MdLocationOn className='h-4 w-4 text-emerald-600' />
            <p className='text-sm text-slate-500 truncate w-full'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-slate-500 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className='text-xl font-bold text-blue-600'>
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && <span className="text-xs text-slate-400 font-normal ml-1">/ month</span>}
            </p>

            <div className='flex gap-3 text-slate-600 text-xs font-semibold'>
              <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {listing.bedrooms} Bed
              </span>
              <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {listing.bathrooms} Bath
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
