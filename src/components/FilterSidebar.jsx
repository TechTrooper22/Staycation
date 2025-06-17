import React from "react"
import { Star, Wifi, Car, Dumbbell, Utensils, Waves, Heart } from "lucide-react"

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const starRatings = [1, 2, 3, 4, 5]
  const roomTypes = ["Single", "Double", "Deluxe", "Suite"]
  const amenities = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "pool", label: "Pool", icon: Waves },
    { id: "ac", label: "AC", icon: Star },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "parking", label: "Parking", icon: Car },
    { id: "restaurant", label: "Restaurant", icon: Utensils },
    { id: "petFriendly", label: "Pet-friendly", icon: Heart },
  ]

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters }

    if (filterType === "priceRange") {
      newFilters.priceRange = value
    } else {
      const currentValues = newFilters[filterType]
      if (currentValues.includes(value)) {
        newFilters[filterType] = currentValues.filter((item) => item !== value)
      } else {
        newFilters[filterType] = [...currentValues, value]
      }
    }

    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 10000],
      starRating: [],
      roomTypes: [],
      amenities: [],
    })
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden\" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-16 left-0 h-screen lg:h-auto w-80 lg:w-full
        bg-white dark:bg-gray-800 shadow-lg lg:shadow-none
        transform transition-transform duration-300 ease-in-out z-50 lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        overflow-y-auto
      `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>₹0</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Star Rating</h3>
            <div className="space-y-2">
              {starRatings.map((rating) => (
                <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.starRating.includes(rating)}
                    onChange={() => handleFilterChange("starRating", rating)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-700 dark:text-gray-300">
                      {rating} Star{rating > 1 ? "s" : ""}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Type</h3>
            <div className="space-y-2">
              {roomTypes.map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roomTypes.includes(type)}
                    onChange={() => handleFilterChange("roomTypes", type)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amenities</h3>
            <div className="space-y-2">
              {amenities.map((amenity) => {
                const IconComponent = amenity.icon
                return (
                  <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity.id)}
                      onChange={() => handleFilterChange("amenities", amenity.id)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{amenity.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearAllFilters}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  )
}

export default FilterSidebar