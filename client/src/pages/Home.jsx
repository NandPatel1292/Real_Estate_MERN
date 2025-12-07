import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation, Autoplay, EffectFade, Pagination]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 mb-20">
        <div className="mx-auto max-w-5xl py-12 sm:py-24 lg:py-32 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl mb-6">
            Find your next <span className="text-blue-600">perfect</span> place <br /> with ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            UrbanNest is the best place to find your next perfect place to live.
            We have a wide range of properties for you to choose from.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/search"
              className="btn-primary"
            >
              Start Exploring
            </Link>
            <Link to="/about" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Swiper Hero */}
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl mb-24 mx-4">
        <Swiper
          modules={[Navigation, Autoplay, Pagination, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-[550px]"
        >
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id} className="relative group">
                {/* Background Image */}
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4 text-white z-10">
                  <Link to={`/listing/${listing._id}`} className="hover:opacity-90 transition-opacity">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight shadow-sm drop-shadow-md">
                      {listing.name}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <span className="bg-blue-600 px-4 py-1 rounded-full shadow-lg border border-blue-500/50">
                      ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                      {listing.type === 'rent' ? ' / mo' : ''}
                    </span>
                    <span className="flex items-center gap-1 drop-shadow-md backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full">
                      {listing.bedrooms} Beds • {listing.bathrooms} Baths
                    </span>
                  </div>
                  <Link
                    to={`/listing/${listing._id}`}
                    className="mt-2 self-start px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
                  >
                    View Details
                  </Link>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listing Results */}
      <div className="max-w-7xl mx-auto p-4 flex flex-col gap-16 pb-20">

        {/* Offers */}
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Recent Offers</h2>
                <p className="text-slate-500 mt-2">Grab these deals before they are gone</p>
              </div>
              <Link
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                to={"/search?offer=true"}
              >
                View all offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rentListings && rentListings.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">For Rent</h2>
                <p className="text-slate-500 mt-2">Find your temporary paradise</p>
              </div>
              <Link
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                to={"/search?type=rent"}
              >
                View all rentals
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Sale */}
        {saleListings && saleListings.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">For Sale</h2>
                <p className="text-slate-500 mt-2">Find a place to call your own</p>
              </div>
              <Link
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                to={"/search?type=sale"}
              >
                View all properties
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
