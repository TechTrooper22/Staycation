import React, { useState } from "react";
import {
  X,
  Calendar,
  Users,
  CreditCard,
  User,
  Mail,
  Phone,
} from "lucide-react";

const BookingModal = ({ isOpen, onClose, hotel, user }) => {
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: {
      adults: 2,
      children: 0,
    },
    roomType: hotel?.roomTypes?.[0] || "",
    specialRequests: "",
    guestInfo: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Dates & Guests, 2: Guest Info, 3: Payment
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !hotel) return null;

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGuestInfoChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      guestInfo: {
        ...prev.guestInfo,
        [field]: value,
      },
    }));
  };

  const handleGuestChange = (type, operation) => {
    setBookingData((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]:
          operation === "increment"
            ? prev.guests[type] + 1
            : Math.max(0, prev.guests[type] - 1),
      },
    }));
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = hotel.price * nights;
    const taxes = basePrice * 0.18; // 18% GST
    return {
      basePrice,
      taxes,
      total: basePrice + taxes,
      nights,
    };
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = async () => {
    setIsProcessing(true);

    // Simulate booking process
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        `Booking confirmed for ${
          hotel.name
        }!\n\nBooking Details:\n- Check-in: ${
          bookingData.checkIn
        }\n- Check-out: ${bookingData.checkOut}\n- Guests: ${
          bookingData.guests.adults + bookingData.guests.children
        }\n- Total: ₹${calculateTotal().total.toLocaleString()}`
      );
      onClose();
    }, 2000);
  };

  const isStep1Valid = () => {
    return bookingData.checkIn && bookingData.checkOut && bookingData.roomType;
  };

  const isStep2Valid = () => {
    return (
      bookingData.guestInfo.name &&
      bookingData.guestInfo.email &&
      bookingData.guestInfo.phone
    );
  };

  const pricing = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Book Your Stay
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{hotel.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    step <= currentStep
                      ? "text-red-600"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step === 1 && "Dates & Room"}
                  {step === 2 && "Guest Info"}
                  {step === 3 && "Payment"}
                </span>
                {step < 3 && (
                  <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="md:col-span-2">
              {/* Step 1: Dates & Room */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Select Dates & Room
                  </h3>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-in Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) =>
                            handleInputChange("checkIn", e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-out Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) =>
                            handleInputChange("checkOut", e.target.value)
                          }
                          min={
                            bookingData.checkIn ||
                            new Date().toISOString().split("T")[0]
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left"
                        onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                      >
                        {bookingData.guests.adults +
                          bookingData.guests.children}{" "}
                        Guests
                      </button>

                      {showGuestDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 dark:text-gray-300">
                                Adults
                              </span>
                              <div className="flex items-center space-x-3">
                                <button
                                  type="button"
                                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() =>
                                    handleGuestChange("adults", "decrement")
                                  }
                                >
                                  -
                                </button>
                                <span className="w-8 text-center dark:text-white">
                                  {bookingData.guests.adults}
                                </span>
                                <button
                                  type="button"
                                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() =>
                                    handleGuestChange("adults", "increment")
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 dark:text-gray-300">
                                Children
                              </span>
                              <div className="flex items-center space-x-3">
                                <button
                                  type="button"
                                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() =>
                                    handleGuestChange("children", "decrement")
                                  }
                                >
                                  -
                                </button>
                                <span className="w-8 text-center dark:text-white">
                                  {bookingData.guests.children}
                                </span>
                                <button
                                  type="button"
                                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() =>
                                    handleGuestChange("children", "increment")
                                  }
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

                  {/* Room Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Type
                    </label>
                    <select
                      value={bookingData.roomType}
                      onChange={(e) =>
                        handleInputChange("roomType", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Room Type</option>
                      {hotel.roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Guest Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={bookingData.guestInfo.name}
                          onChange={(e) =>
                            handleGuestInfoChange("name", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={bookingData.guestInfo.email}
                          onChange={(e) =>
                            handleGuestInfoChange("email", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={bookingData.guestInfo.phone}
                        onChange={(e) =>
                          handleGuestInfoChange("phone", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        handleInputChange("specialRequests", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Any special requests or preferences..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Payment Information
                  </h3>

                  <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        Secure Payment
                      </span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                      Your payment information is encrypted and secure. This is
                      a demo booking system.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Summary */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Booking Summary
                </h3>

                {/* Hotel Info */}
                <div className="mb-4">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {hotel.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hotel.location}
                  </p>
                </div>

                {/* Booking Details */}
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Check-in:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {bookingData.checkIn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Check-out:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {bookingData.checkOut}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Nights:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {pricing.nights}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Guests:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {bookingData.guests.adults +
                          bookingData.guests.children}
                      </span>
                    </div>
                    {bookingData.roomType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Room:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {bookingData.roomType}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing */}
                {pricing.nights > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        ₹{hotel.price.toLocaleString()} × {pricing.nights}{" "}
                        nights
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ₹{pricing.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Taxes & fees
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ₹{pricing.taxes.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ₹{pricing.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevStep}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
              disabled={currentStep === 1}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  (currentStep === 1 && !isStep1Valid()) ||
                  (currentStep === 2 && !isStep2Valid())
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                disabled={
                  (currentStep === 1 && !isStep1Valid()) ||
                  (currentStep === 2 && !isStep2Valid())
                }
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={isProcessing}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? "Processing..."
                  : `Confirm Booking - ₹${pricing.total.toLocaleString()}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
