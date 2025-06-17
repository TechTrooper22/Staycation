import React, { useState } from "react"
import { Menu, X, MapPin, User, LogOut } from "lucide-react"

const Navbar = ({ onLoginClick, onNavigation, currentPage, user, onLogout, onDashboard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const navItems = [
    { id: "home", label: "Home" },
    { id: "hotels", label: "Hotels" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]

  const handleNavClick = (pageId) => {
    onNavigation(pageId)
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Staycation</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors ${
                  currentPage === item.id
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-red-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Hi, {user.name}</span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false)
                          onDashboard()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false)
                          onLogout()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onLoginClick}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left transition-colors ${
                    currentPage === item.id
                      ? "text-red-600 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-red-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-gray-700 dark:text-gray-300">
                      <div className="font-semibold">Hi, {user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        onDashboard()
                      }}
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors block"
                    >
                      Dashboard
                    </button>
                    <button onClick={onLogout} className="text-left text-red-600 hover:text-red-700 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={onLoginClick}
                      className="text-left text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={onLoginClick}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-left"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar