import React, { useState } from "react"
import { Star, Wifi, Car, Dumbbell, Utensils, Waves, MapPin, Heart } from "lucide-react"

const HotelCard = ({ hotel, onViewDetails, onBookNow, user, favorites, onToggleFavorite, layout = "vertical" }) => {
  const [isImageLoading, setIsImageLoading] = useState(true)

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    gym: Dumbbell,
    restaurant: Utensils,
    pool: Waves,
    spa: Star,
    concierge: Star,
    conference: Star,
    adventure: Star,
  }

  const isFavorite = favorites?.includes(hotel.id)

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    if (user && onToggleFavorite) {
      onToggleFavorite(hotel.id)
    }
  }

  if (layout === "horizontal") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Hotel Image */}
          <div className="relative md:w-80 flex-shrink-0">
            {isImageLoading && (
              <div className="w-full h-64 md:h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            )}
            <img
              src={hotel.image || "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"}
              alt={hotel.name}
              className={`w-full h-64 md:h-full object-cover ${isImageLoading ? "hidden" : "block"}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />

            {/* Discount Badge */}
            {hotel.discount && (
              <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                {hotel.discount}% OFF
              </div>
            )}

            {/* Favorite Button */}
            {user && (
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            )}

            {/* Sold Out Overlay */}
            {hotel.soldOut && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">SOLD OUT</span>
              </div>
            )}
          </div>

          {/* Hotel Details */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(hotel.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{hotel.rating}-Star Hotel</span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{hotel.price.toLocaleString()}
                    </span>
                    {hotel.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{hotel.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">/night</span>
                </div>
              </div>

              {/* Room Type Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.roomTypes.slice(0, 3).map((type, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
                {hotel.roomTypes.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">+{hotel.roomTypes.length - 3} more</span>
                )}
              </div>

              {/* Amenities */}
              <div className="flex items-center space-x-3 mb-4">
                {hotel.amenities.slice(0, 6).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity]
                  return IconComponent ? (
                    <div key={index} className="flex items-center space-x-1">
                      <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{amenity}</span>
                    </div>
                  ) : null
                })}
                {hotel.amenities.length > 6 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">+{hotel.amenities.length - 6} more</span>
                )}
              </div>

              {/* Description */}
              {hotel.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{hotel.description}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewDetails(hotel.id)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onBookNow(hotel)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    disabled={hotel.soldOut}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original vertical layout for other uses
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
      {/* Hotel Image */}
      <div className="relative">
        {isImageLoading && (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading...</span>
          </div>
        )}
        <img
          src={hotel.image || "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"}
          alt={hotel.name}
          className={`w-full h-64 object-cover ${isImageLoading ? "hidden" : "block"}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {/* Discount Badge */}
        {hotel.discount && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            {hotel.discount}% OFF
          </div>
        )}

        {/* Favorite Button */}
        {user && (
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Sold Out Overlay */}
        {hotel.soldOut && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xl font-bold">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Hotel Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center space-x-1">
            {[...Array(hotel.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        {/* Room Type Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {hotel.roomTypes.slice(0, 2).map((type, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
            >
              {type}
            </span>
          ))}
          {hotel.roomTypes.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{hotel.roomTypes.length - 2} more</span>
          )}
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-2 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity, index) => {
            const IconComponent = amenityIcons[amenity]
            return IconComponent ? (
              <IconComponent key={index} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : null
          })}
          {hotel.amenities.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{hotel.price.toLocaleString()}</span>
              {hotel.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{hotel.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">/night</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(hotel.id)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              View Details
            </button>
            <button
              onClick={() => onBookNow(hotel)}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              disabled={hotel.soldOut}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelCard