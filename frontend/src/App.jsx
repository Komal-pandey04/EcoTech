// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Community from "./pages/Community"; // community page

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Authentication Routes */}

//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Community Page */}

//         <Route path="/community" element={<Community />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// // export default App
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Login from "./pages/Login";
// // import Signup from "./pages/Signup";

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<Login />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/signup" element={<Signup />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/Home";
import Community from "./pages/Community";
import DailyTracker from "./pages/DailyTracker";
import WeeklyTracker from "./pages/WeeklyTracker";

// ========== PRIVATE ROUTE PROTECTION ==========
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// ========== ROOT REDIRECT ==========
const RootRedirect = () => {
  return <Navigate to="/home" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT - REDIRECT BASED ON AUTH */}
        <Route path="/" element={<RootRedirect />} />

        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ========== PROTECTED ROUTES ========== */}

        {/* Home Page - Public */}
        <Route
          path="/home"
          element={<HomePage />}
        />

        {/* Daily Tracker - Protected */}
        <Route
          path="/daily"
          element={
            <PrivateRoute>
              <DailyTracker />
            </PrivateRoute>
          }
        />

        {/* Weekly Tracker - Protected */}
        <Route
          path="/weekly"
          element={
            <PrivateRoute>
              <WeeklyTracker />
            </PrivateRoute>
          }
        />

        {/* Community - Protected */}
        <Route
          path="/community"
          element={
            <PrivateRoute>
              <Community />
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;