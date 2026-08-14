import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && user?.role !== "admin" && <ChatWidget />}
    </>
  );
}

export default App;
