const express = require("express");
const SupportRequest = require("../models/SupportRequest");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /api/support
 * @desc Create a new support request
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, intro, skills, availability } = req.body;

    if (!name || !email || !intro || !skills || !availability) {
      return res.status(400).json({ success: false, message: "Please fill all fields." });
    }

    const newRequest = new SupportRequest({
      name,
      email,
      intro,
      skills,
      availability,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Support request received! We will contact you soon.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Support request error:", error);
    res.status(500).json({ success: false, message: "Server error sending request." });
  }
});

/**
 * @route POST /api/support/become-supporter
 * @desc Register the current user as a supporter
 * @access Private
 */
router.post("/become-supporter", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.isSupporter = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "You are now registered as a supporter! Thank you for helping the community.",
      user: { id: user._id, username: user.username, isSupporter: user.isSupporter }
    });
  } catch (error) {
    console.error("Become supporter error:", error);
    res.status(500).json({ success: false, message: "Server error registering as supporter." });
  }
});

module.exports = router;
