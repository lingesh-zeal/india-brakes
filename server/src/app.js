import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/event.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import registrationRoutes from "./routes/registration.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import sponsorInquiryRoutes from "./routes/sponsor.routes.js";
import enquiryTypeRoutes from "./routes/enquiryType.routes.js";
import welcomeRoutes from "./routes/welcome.routes.js"
import heroBannerRoutes from "./routes/heroBanner.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy:{
    policy: "cross-origin"
  }
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

const uploadsPath = path.join(process.cwd(), "uploads");
// Static uploads
app.use(
  "/uploads",
  express.static(uploadsPath)
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);


// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true,
    status: "OK",
    message: "Server running properly",
    timestamp: new Date().toISOString(),
   });
});

app.use("/api/registrations", registrationRoutes);

app.use("/api/admin/dashboard", dashboardRoutes);
app.use(
    "/api/admin",
    registrationRoutes
);

app.use("/api/sponsors", sponsorInquiryRoutes);
app.use("/api/enquiry-types", enquiryTypeRoutes);
app.use("/api/welcome-cms", welcomeRoutes);

app.use("/api/hero-banner", heroBannerRoutes);
// Global Error handler (must be last)
app.use(errorHandler);

export default app;