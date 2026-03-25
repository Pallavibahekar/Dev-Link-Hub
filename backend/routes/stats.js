const express = require("express");
const User = require("../models/User");
const Link = require("../models/Link");
const SupportRequest = require("../models/SupportRequest");

const router = express.Router();

/**
 * @route GET /api/stats
 * @desc Get real-time stats for the landing page
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    // 1. Get total users
    const userCount = await User.countDocuments();
    
    // 2. Get total links
    const linkCount = await Link.countDocuments();
    
    // 3. Get links created in the last 24 hours (Daily Discovered)
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyCount = await Link.countDocuments({ createdAt: { $gte: last24h } });

    // 4. Support Stats
    const seekingSupport = await SupportRequest.distinct("email");
    const offeringSupport = await User.countDocuments({ isSupporter: true });
    const resolvedSessions = await SupportRequest.countDocuments({ status: "resolved" });

    res.status(200).json({
      success: true,
      stats: {
        users: userCount,
        links: linkCount,
        daily: dailyCount,
        support: {
          seeking: seekingSupport.length,
          offering: offeringSupport,
          resolved: resolvedSessions
        }
      }
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ success: false, message: "Server error fetching stats." });
  }
});

module.exports = router;
