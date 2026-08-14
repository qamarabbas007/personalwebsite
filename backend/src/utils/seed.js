// Creates the initial admin account + demo content. Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");
const Service = require("../models/Service");
const Experience = require("../models/Experience");
const Testimonial = require("../models/Testimonial");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const { hashPassword } = require("./hashPassword");
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = require("../config/env");
const demoData = require("./demoData");

const run = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("An admin account already exists:", existingAdmin.email);
  } else {
    const hashed = await hashPassword(ADMIN_PASSWORD || "ChangeMe123!");
    const admin = await User.create({
      name: ADMIN_NAME || "Qamar Abbas",
      email: ADMIN_EMAIL || "admin@qamarabbas.dev",
      password: hashed,
      role: "admin",
    });
    console.log("Admin account created:", admin.email);
  }

  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      fullName: "Qamar Abbas",
      title: "MERN Stack Developer",
      tagline: "Building fast, scalable web apps with the MERN stack",
      bio: "A passionate MERN Stack Developer focused on building performant, user-friendly web applications from concept to deployment.",
      email: ADMIN_EMAIL || "admin@qamarabbas.dev",
      location: "Karachi, Pakistan",
      stats: { projectsCompleted: 12, happyClients: 9, yearsExperience: 2, technologiesUsed: 15 },
      socialLinks: { github: "https://github.com", linkedin: "https://linkedin.com", twitter: "https://twitter.com" },
    });
    console.log("Default profile document created");
  }

  // --- Demo content (only seeded once each, skipped if the collection already has data) ---
  const seedIfEmpty = async (Model, data, label) => {
    const count = await Model.countDocuments();
    if (count === 0) {
      await Model.insertMany(data);
      console.log(`Seeded ${data.length} ${label}`);
    } else {
      console.log(`Skipped ${label} — collection already has ${count} document(s)`);
    }
  };

  await seedIfEmpty(Skill, demoData.skills, "skills");
  await seedIfEmpty(Service, demoData.services, "services");
  await seedIfEmpty(Experience, demoData.experience, "experience entries");
  await seedIfEmpty(Testimonial, demoData.testimonials, "testimonials");
  await seedIfEmpty(Project, demoData.projects, "projects");
  await seedIfEmpty(Blog, demoData.blogs, "blog posts");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
