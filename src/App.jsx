import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SearchHero from './components/SearchHero'
import HotelListings from './components/HotelListings'
import FilterSidebar from './components/FilterSidebar'
import LoginModal from './components/LoginModal'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [searchQuery, setSearchQuery] = useState({ location: '' })
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    starRating: [],
    roomTypes: [],
    amenities: [],
  })
  const [currentPageNum, setCurrentPageNum] = useState(1)

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('user')
    const savedFavorites = localStorage.getItem('favorites')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsLoginModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    setFavorites([])
    localStorage.removeItem('user')
    localStorage.removeItem('favorites')
  }

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId)
    setCurrentPageNum(1)
  }

  const handleSearch = (searchData) => {
    setSearchQuery(searchData)
    setCurrentPage('hotels')
    setCurrentPageNum(1)
  }

  const handleToggleFavorite = (hotelId) => {
    if (!user) return

    let newFavorites
    if (favorites.includes(hotelId)) {
      newFavorites = favorites.filter(id => id !== hotelId)
    } else {
      newFavorites = [...favorites, hotelId]
    }
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const handleViewDetails = (hotelId) => {
    // In a real app, this would navigate to hotel details page
    console.log('View details for hotel:', hotelId)
  }

  const handleBookNow = (hotel) => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    
    // In a real app, this would navigate to booking page
    console.log('Book hotel:', hotel)
    alert(`Booking initiated for ${hotel.name}`)
  }

  const handleDashboard = () => {
    setCurrentPage('dashboard')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="min-h-screen">
            <SearchHero onSearch={handleSearch} />
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Featured Hotels
              </h2>
              <div className="lg:flex lg:space-x-8">
                <div className="lg:w-1/4">
                  <FilterSidebar
                    isOpen={isFilterSidebarOpen}
                    onClose={() => setIsFilterSidebarOpen(false)}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
                <div className="lg:w-3/4">
                  <HotelListings
                    onFilterToggle={() => setIsFilterSidebarOpen(true)}
                    searchQuery={searchQuery}
                    filters={filters}
                    onViewDetails={handleViewDetails}
                    onBookNow={handleBookNow}
                    user={user}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    currentPage={currentPageNum}
                    onPageChange={setCurrentPageNum}
                  />
                  <Pagination
                    currentPage={currentPageNum}
                    totalPages={3}
                    onPageChange={setCurrentPageNum}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'hotels':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4">
            <div className="container mx-auto px-4">
              <div className="lg:flex lg:space-x-8">
                <div className="lg:w-1/4">
                  <FilterSidebar
                    isOpen={isFilterSidebarOpen}
                    onClose={() => setIsFilterSidebarOpen(false)}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
                <div className="lg:w-3/4">
                  <HotelListings
                    onFilterToggle={() => setIsFilterSidebarOpen(true)}
                    searchQuery={searchQuery}
                    filters={filters}
                    onViewDetails={handleViewDetails}
                    onBookNow={handleBookNow}
                    user={user}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    currentPage={currentPageNum}
                    onPageChange={setCurrentPageNum}
                  />
                  <Pagination
                    currentPage={currentPageNum}
                    totalPages={3}
                    onPageChange={setCurrentPageNum}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'about':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  About Staycation
                </h1>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    Staycation is your trusted partner for finding the perfect accommodation across Maharashtra. 
                    We specialize in connecting travelers with exceptional hotels, from luxury resorts to 
                    budget-friendly stays.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    Our platform offers a curated selection of hotels in major cities like Mumbai, Pune, 
                    Nagpur, and scenic destinations like Lonavala and Mahabaleshwar.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 dark:text-red-400 text-2xl font-bold">1000+</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Hotels</h3>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">50K+</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Happy Customers</h3>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 dark:text-green-400 text-2xl font-bold">25+</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Cities</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'contact':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  Contact Us
                </h1>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Dashboard
              </h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    My Bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">0 upcoming bookings</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Favorites
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{favorites.length} saved hotels</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Profile
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Manage your account</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar
          onLoginClick={() => setIsLoginModalOpen(true)}
          onNavigation={handleNavigation}
          currentPage={currentPage}
          user={user}
          onLogout={handleLogout}
          onDashboard={handleDashboard}
        />
        
        {renderCurrentPage()}
        
        <Footer />
        
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    </ThemeProvider>
  )
}

export default App