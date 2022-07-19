import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import About from "./pages/About.js";
import Profile from "./pages/Profile.js";
import RequireAuth from "./components/RequireAuth.js";
import PageNotFound from "./pages/PageNotFound";

const RouteSwitch = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={
                    <RequireAuth>
                        <Profile />
                    </RequireAuth>
                    } />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouteSwitch;