import React, { useState, useMemo } from "react"
import { Filter } from "lucide-react"
import HotelCard from "./HotelCard"
import { maharashtraHotels } from "../data/hotels"

const HotelListings = ({
  onFilterToggle,
  searchQuery,
  filters,
  onViewDetails,
  onBookNow,
  user,
  favorites,
  onToggleFavorite,
  currentPage = 1,
  onPageChange,
}) => {
  const [sortBy, setSortBy] = useState("price-low")
  const itemsPerPage = 10

  // Filter hotels based on search query and filters
  const filteredHotels = useMemo(() => {
    let filtered = [...maharashtraHotels]

    // Filter by location search
    if (searchQuery?.location && searchQuery.location.trim() !== "") {
      const searchTerm = searchQuery.location.toLowerCase().trim()
      filtered = filtered.filter(
        (hotel) =>
          hotel.location.toLowerCase().includes(searchTerm) ||
          hotel.name.toLowerCase().includes(searchTerm) ||
          hotel.city.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by price range
    if (filters?.priceRange && Array.isArray(filters.priceRange)) {
      filtered = filtered.filter(
        (hotel) => hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1]
      )
    }

    // Filter by star rating
    if (filters?.starRating && Array.isArray(filters.starRating) && filters.starRating.length > 0) {
      filtered = filtered.filter((hotel) => filters.starRating.includes(hotel.rating))
    }

    // Filter by room types
    if (filters?.roomTypes && Array.isArray(filters.roomTypes) && filters.roomTypes.length > 0) {
      filtered = filtered.filter((hotel) => 
        hotel.roomTypes && hotel.roomTypes.some((type) => filters.roomTypes.includes(type))
      )
    }

    // Filter by amenities
    if (filters?.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
      filtered = filtered.filter((hotel) => 
        hotel.amenities && filters.amenities.every((amenity) => hotel.amenities.includes(amenity))
      )
    }

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating-high":
          return b.rating - a.rating
        case "rating-low":
          return a.rating - b.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, filters, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentHotels = filteredHotels.slice(startIndex, endIndex)

  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating-high", label: "Rating: High to Low" },
    { value: "rating-low", label: "Rating: Low to High" },
    { value: "name", label: "Name: A to Z" },
  ]

  // Check if any filters are active
  const hasActiveFilters = () => {
    if (!filters) return false
    
    return (
      (filters.starRating && filters.starRating.length > 0) ||
      (filters.roomTypes && filters.roomTypes.length > 0) ||
      (filters.amenities && filters.amenities.length > 0) ||
      (filters.priceRange && filters.priceRange[1] < 10000)
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Hotels</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredHotels.length} properties found
            {searchQuery?.location && searchQuery.location.trim() !== "" && ` in "${searchQuery.location}"`}
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={onFilterToggle}
            className="lg:hidden bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.priceRange && filters.priceRange[1] < 10000 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Price: ₹0 - ₹{filters.priceRange[1].toLocaleString()}
              </span>
            )}
            {filters.starRating && filters.starRating.map((rating) => (
              <span key={rating} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {rating} Star{rating > 1 ? "s" : ""}
              </span>
            ))}
            {filters.roomTypes && filters.roomTypes.map((type) => (
              <span key={type} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {type}
              </span>
            ))}
            {filters.amenities && filters.amenities.map((amenity) => (
              <span key={amenity} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hotel List - One card per row */}
      {currentHotels.length > 0 ? (
        <div className="space-y-6">
          {currentHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
              user={user}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              layout="horizontal"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hotels found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search criteria to find more options.
          </p>
        </div>
      )}
    </div>
  )
}

export default HotelListings