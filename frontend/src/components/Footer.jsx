import { Leaf, Mail, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={24} className="text-green-400" />
              <h3 className="text-xl font-bold">EcoTrack</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Monitor your environmental impact, reduce carbon footprint, and build a sustainable future together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/daily" className="hover:text-green-400 transition">
                  Daily Tracker
                </Link>
              </li>
              <li>
                <Link to="/weekly" className="hover:text-green-400 transition">
                  Weekly Tracker
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-green-400 transition">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#faq" className="hover:text-green-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-green-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:hello@ecotrack.com"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Email: hello@ecotrack.com
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 EcoTrack. All rights reserved. | Built with 💚 for a sustainable future.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
