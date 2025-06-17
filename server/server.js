import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewareclear
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://shrikhandetejas22:staycation22@staycation.y6yetzk.mongodb.net/staycation?retryWrites=true&w=majority&appName=Staycation";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { dbName: "staycation" }) // <- force the database name here
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Connection event listeners
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Graceful shutdown handlers
process.once("SIGUSR2", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose disconnected on app termination");
    process.kill(process.pid, "SIGUSR2");
  });
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    favorites: [
      {
        type: Number,
      },
    ],
    bookings: [
      {
        hotelId: Number,
        hotelName: String,
        checkIn: Date,
        checkOut: Date,
        guests: {
          adults: Number,
          children: Number,
        },
        totalPrice: Number,
        status: {
          type: String,
          enum: ["confirmed", "cancelled", "completed"],
          default: "confirmed",
        },
        bookingDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index to email field
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

// Hotel Schema (for storing additional hotel data)
const hotelSchema = new mongoose.Schema(
  {
    hotelId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: String,
    city: String,
    rating: Number,
    price: Number,
    image: String,
    roomTypes: [String],
    amenities: [String],
    description: String,
    reviews: [
      {
        user: String,
        rating: Number,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

// Routes

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get user profile
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        favorites: user.favorites,
        bookings: user.bookings,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add/Remove hotel from favorites
app.post(
  "/api/user/favorites/:hotelId",
  authenticateToken,
  async (req, res) => {
    try {
      const { hotelId } = req.params;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hotelIdNum = parseInt(hotelId);
      const isFavorite = user.favorites.includes(hotelIdNum);

      if (isFavorite) {
        // Remove from favorites
        user.favorites = user.favorites.filter((id) => id !== hotelIdNum);
      } else {
        // Add to favorites
        user.favorites.push(hotelIdNum);
      }

      await user.save();

      res.json({
        message: isFavorite ? "Removed from favorites" : "Added to favorites",
        favorites: user.favorites,
      });
    } catch (error) {
      console.error("Favorites error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create a booking
app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const { hotelId, hotelName, checkIn, checkOut, guests, totalPrice } =
      req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = {
      hotelId: parseInt(hotelId),
      hotelName,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalPrice,
      status: "confirmed",
    };

    user.bookings.push(booking);
    await user.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: user.bookings[user.bookings.length - 1],
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error during booking" });
  }
});

// Get user bookings
app.get("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("bookings");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ bookings: user.bookings });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add hotel review
app.post(
  "/api/hotels/:hotelId/reviews",
  authenticateToken,
  async (req, res) => {
    try {
      const { hotelId } = req.params;
      const { rating, comment } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let hotel = await Hotel.findOne({ hotelId: parseInt(hotelId) });

      if (!hotel) {
        // Create hotel document if it doesn't exist
        hotel = new Hotel({
          hotelId: parseInt(hotelId),
          name: `Hotel ${hotelId}`,
          reviews: [],
        });
      }

      const review = {
        user: user.name,
        rating: parseInt(rating),
        comment,
        date: new Date(),
      };

      hotel.reviews.push(review);
      await hotel.save();

      res.status(201).json({
        message: "Review added successfully",
        review,
      });
    } catch (error) {
      console.error("Review error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get hotel reviews
app.get("/api/hotels/:hotelId/reviews", async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findOne({ hotelId: parseInt(hotelId) });

    if (!hotel) {
      return res.json({ reviews: [] });
    }

    res.json({ reviews: hotel.reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
