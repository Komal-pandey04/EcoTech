const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// ========== POST: Submit Contact Form ==========
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate message length
    if (message.length < 10 || message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message must be between 10 and 1000 characters",
      });
    }

    // Create contact document
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      status: "new",
    });

    // Save to database
    await contact.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting contact form. Please try again.",
      error: error.message,
    });
  }
});

// ========== GET: Retrieve All Contacts (Optional - for admin) ==========
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Fetch Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
});

// ========== GET: Retrieve Single Contact (Optional - for tracking) ==========
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Fetch Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contact",
      error: error.message,
    });
  }
});

module.exports = router;
