const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "Qamar Abbas" },
    title: { type: String, default: "MERN Stack Developer" },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    education: [
      {
        degree: String,
        institute: String,
        startYear: String,
        endYear: String,
        description: String,
      },
    ],
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
    stats: {
      projectsCompleted: { type: Number, default: 0 },
      happyClients: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 },
      technologiesUsed: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
