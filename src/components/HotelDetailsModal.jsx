import React, { useState } from "react";
import {
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Waves,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HotelDetailsModal = ({
  isOpen,
  onClose,
  hotel,
  user,
  favorites,
  onToggleFavorite,
  onBookNow,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !hotel) return null;

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
  };

  const isFavorite = favorites?.includes(hotel.id);

  const handleToggleFavorite = () => {
    if (user && onToggleFavorite) {
      onToggleFavorite(hotel.id);
    }
  };

  const nextImage = () => {
    if (hotel.images && hotel.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel.images && hotel.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + hotel.images.length) % hotel.images.length
      );
    }
  };

  const currentImages = hotel.images || [hotel.image];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {hotel.name}
            </h2>
            <div className="flex items-center space-x-1">
              {[...Array(hotel.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {hotel.rating}-Star Hotel
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Gallery */}
          <div className="relative mb-6">
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img
                src={currentImages[currentImageIndex] || hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {currentImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Favorite Button */}
              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                    isFavorite
                      ? "bg-red-500 text-white"
                      : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              )}

              {/* Discount Badge */}
              {hotel.discount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {hotel.discount}% OFF
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Hotel Info */}
            <div className="space-y-6">
              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Location
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{hotel.address || hotel.location}</span>
                </div>
              </div>

              {/* Description */}
              {hotel.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    About
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>
              )}

              {/* Room Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Room Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.roomTypes.map((type, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity];
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        {IconComponent && (
                          <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {hotel.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {hotel.phone}
                      </span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {hotel.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check-in/Check-out */}
              {(hotel.checkIn || hotel.checkOut) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Check-in & Check-out
                  </h3>
                  <div className="space-y-2">
                    {hotel.checkIn && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Check-in: {hotel.checkIn}
                        </span>
                      </div>
                    )}
                    {hotel.checkOut && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Check-out: {hotel.checkOut}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Pricing & Booking */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{hotel.price.toLocaleString()}
                    </span>
                    {hotel.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{hotel.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    /night
                  </span>
                  {hotel.discount && (
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                        Save {hotel.discount}%
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onBookNow(hotel)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  disabled={hotel.soldOut}
                >
                  {hotel.soldOut ? "Sold Out" : "Book Now"}
                </button>
              </div>

              {/* Policies */}
              {hotel.policies && hotel.policies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Hotel Policies
                  </h3>
                  <ul className="space-y-2">
                    {hotel.policies.map((policy, index) => (
                      <li
                        key={index}
                        className="text-gray-600 dark:text-gray-400 text-sm flex items-start"
                      >
                        <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {policy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews */}
              {hotel.reviews && hotel.reviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Recent Reviews
                  </h3>
                  <div className="space-y-4">
                    {hotel.reviews.slice(0, 2).map((review, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-red-600 pl-4"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {review.user}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {review.comment}
                        </p>
                        <span className="text-xs text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsModal;
