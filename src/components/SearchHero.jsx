import React, { useState } from "react"
import { MapPin, Calendar, Users, Search } from "lucide-react"

const SearchHero = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 2, children: 0 },
  })
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)

  const handleGuestChange = (type, operation) => {
    setSearchData((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: operation === "increment" ? prev.guests[type] + 1 : Math.max(0, prev.guests[type] - 1),
      },
    }))
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData)
    }
  }

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-16">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl text-white opacity-90">Discover amazing hotels at unbeatable prices</p>
        </div>

        {/* Search Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Where</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, hotel, or area"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={searchData.location}
                  onChange={(e) => setSearchData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData((prev) => ({ ...prev, checkIn: e.target.value }))}
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData((prev) => ({ ...prev, checkOut: e.target.value }))}
                />
              </div>
            </div>

            {/* Guests */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left"
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  {searchData.guests.adults + searchData.guests.children} Guests
                </button>

                {showGuestDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Adults</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleGuestChange("adults", "decrement")}
                          >
                            -
                          </button>
                          <span className="w-8 text-center dark:text-white">{searchData.guests.adults}</span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleGuestChange("adults", "increment")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Children</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleGuestChange("children", "decrement")}
                          >
                            -
                          </button>
                          <span className="w-8 text-center dark:text-white">{searchData.guests.children}</span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleGuestChange("children", "increment")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
            >
              <Search className="w-5 h-5" />
              <span>Search Hotels</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchHero