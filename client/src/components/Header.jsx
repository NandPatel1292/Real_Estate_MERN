import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4 sm:px-8 relative">
        <Link to="/" className="flex items-center gap-2 group">
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap tracking-wide">
            <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Urban</span>
            <span className="text-blue-600">Nest</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2.5 rounded-xl flex items-center shadow-inner mx-4 flex-1 max-w-[160px] sm:max-w-md transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full px-2 text-slate-700 placeholder:text-slate-400 font-medium text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-1 sm:p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <FaSearch className="text-slate-500 hover:text-blue-600 transition-colors" />
          </button>
        </form>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-6 items-center font-medium">
          <Link to="/">
            <li className="text-slate-600 hover:text-blue-600 transition-colors">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-600 hover:text-blue-600 transition-colors">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-9 w-9 object-cover border-2 border-slate-200 hover:border-blue-400 transition-all"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-600 hover:text-blue-600 transition-colors"> Sign in</li>
            )}
          </Link>
        </ul>

        {/* Mobile Menu & Profile */}
        <div className="sm:hidden flex items-center gap-4">
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border border-slate-200"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <span className="text-slate-700 hover:text-blue-600 font-medium text-sm">Sign in</span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-700 hover:text-blue-600 transition-colors p-2"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg flex flex-col py-4 px-6 sm:hidden gap-4 animate-in slide-in-from-top-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <div className="text-slate-700 hover:text-blue-600 font-medium py-2 border-b border-slate-100">Home</div>
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              <div className="text-slate-700 hover:text-blue-600 font-medium py-2 border-b border-slate-100">About</div>
            </Link>
            <Link to="/create-listing" onClick={() => setIsMenuOpen(false)}>
              <div className="text-slate-700 hover:text-blue-600 font-medium py-2">Create Listing</div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
