import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Skills from "../pages/Skills/Skills";
import Projects from "../pages/Projects/Projects";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import Services from "../pages/Services/Services";
import Experience from "../pages/Experience/Experience";
import Testimonials from "../pages/Testimonials/Testimonials";
import Blog from "../pages/Blog/Blog";
import BlogDetails from "../pages/Blog/BlogDetails";
import Contact from "../pages/Contact/Contact";
import Chat from "../pages/Chat/Chat";

import Login from "../pages/Auth/Login/Login";
import AdminLogin from "../pages/Auth/AdminLogin/AdminLogin";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

import AdminLayout from "../pages/Admin/shared/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import ProjectList from "../pages/Admin/Projects/ProjectList";
import AddProject from "../pages/Admin/Projects/AddProject";
import EditProject from "../pages/Admin/Projects/EditProject";
import AdminSkills from "../pages/Admin/Skills/Skills";
import AdminServices from "../pages/Admin/Services/Services";
import AdminExperience from "../pages/Admin/Experience/Experience";
import AdminTestimonials from "../pages/Admin/Testimonials/Testimonials";
import BlogList from "../pages/Admin/Blog/BlogList";
import BlogForm from "../pages/Admin/Blog/BlogForm";
import MessageList from "../pages/Admin/Messages/MessageList";
import MessageDetails from "../pages/Admin/Messages/MessageDetails";
import AdminChat from "../pages/Admin/Chat/AdminChat";
import AdminClients from "../pages/Admin/Clients/Clients";
import AdminProfile from "../pages/Admin/Profile/Profile";
import Resume from "../pages/Admin/Resume/Resume";
import SocialLinks from "../pages/Admin/SocialLinks/SocialLinks";
import Settings from "../pages/Admin/Settings/Settings";

const NotFound = () => (
  <main className="page-wrapper container text-center">
    <h1>404</h1>
    <p className="text-muted">Page not found.</p>
  </main>
);

const AppRoutes = () => (
  <Routes>
    {/* Public site */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/skills" element={<Skills />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectDetails />} />
    <Route path="/services" element={<Services />} />
    <Route path="/experience" element={<Experience />} />
    <Route path="/testimonials" element={<Testimonials />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:id" element={<BlogDetails />} />
    <Route path="/contact" element={<Contact />} />

    {/* Auth */}
    <Route path="/login" element={<Login />} />
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Client-only */}
    <Route element={<ProtectedRoute />}>
      <Route path="/chat" element={<Chat />} />
    </Route>

    {/* Admin-only */}
    <Route element={<ProtectedRoute requireAdmin />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<AddProject />} />
        <Route path="projects/:id/edit" element={<EditProject />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/new" element={<BlogForm />} />
        <Route path="blog/:id/edit" element={<BlogForm />} />
        <Route path="messages" element={<MessageList />} />
        <Route path="messages/:id" element={<MessageDetails />} />
        <Route path="chat" element={<AdminChat />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="resume" element={<Resume />} />
        <Route path="social-links" element={<SocialLinks />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
