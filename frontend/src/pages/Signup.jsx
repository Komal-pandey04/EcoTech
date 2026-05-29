import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  // const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      // Auto-login after signup
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Signup successful! Redirecting to home...");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error.message);
      alert(error?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center m-0 p-0">

      <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">

        {/* LEFT PANEL */}
        <div className="md:w-[58%] bg-gradient-to-br from-green-50 to-white text-gray-900 flex flex-col items-center justify-center relative p-10 md:p-12">

          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3 mb-12"
            >
              <Leaf size={48} className="text-green-600" />
              <span className="text-4xl font-bold text-green-600">EcoTech</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 md:space-y-5 max-w-md text-center"
          >
            <h1 className="text-5xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Join Us
            </h1>

            <h2 className="text-xl font-semibold text-green-600">
              Build Your Green Future
            </h2>

            <p className="text-base text-gray-600 leading-relaxed">
              Start your sustainability journey today. Track your impact and connect with a community dedicated to positive change.
            </p>
          </motion.div>
        </div>


        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-[52%] flex items-center justify-center p-8 bg-white shadow-xl relative z-10"
        >

          <div className="w-full max-w-md space-y-6">

            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create account
              </h2>
              <p className="text-gray-600 text-sm">
                Join thousands tracking sustainability
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50 hover:bg-white transition"
                />
              </div>

              

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50 hover:bg-white transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50 hover:bg-white transition"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105 shadow-md"
              >
                Create Account
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-green-600 hover:text-green-700 font-semibold transition"
              >
                Log In
              </button>
            </p>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     if (!name.trim() || !email.trim() || !employeeId.trim() || !password.trim()) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/signup", {
//         name,
//         email,
//         employee_id: employeeId,
//         password,
//       });

//       alert("Signup successful. Please login to continue.");
//       navigate("/login");
//     } catch (error) { 
//         // : any
//       console.error("Signup error:", error?.response?.data || error.message);
//       alert(error?.response?.data?.error || "Signup failed");
//     }
//   };

//   return (
//       <div className="min-h-screen flex">
//         {/* Left Branding Panel */}
//         <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-700 to-emerald-800 text-white items-center justify-center px-12">
//           <div className="space-y-6">
//             <h1 className="text-5xl font-extrabold tracking-tight leading-tight">Join EcoTech</h1>
//             <p className="text-lg max-w-md">
//               EcoTech combines AI and environmental data to help people understand their carbon footprint, reduce waste, and build sustainable daily habits.
//             </p>
//           </div>
//         </div>
    
//         {/* Right Signup Form */}
//         <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
//           <motion.div
//             key="signup"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -30 }}
//             transition={{ duration: 1 }}
//             className="max-w-md w-full"
//           >
//             <div className="space-y-8">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800 text-center">Create your account</h2>
//                 <p className="text-sm text-gray-500 text-center mt-2">
//                   Get started with the platform
//                 </p>
//               </div>
    
//               <div className="space-y-5">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 />
//                 {/* <input
//                   type="text"
//                   placeholder="Employee ID"
//                   value={employeeId}
//                   onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 /> */}
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 />
//                 <button
//                   onClick={handleSignup}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl shadow-md transition"
//                 >
//                   Sign Up
//                 </button>
//               </div>
    
//               <div className="text-center text-sm text-gray-500">
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="text-green-600 hover:underline font-medium"
//                 >
//                   Log In
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
    
 
// }