import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100"
    >
      <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        <Icon size={32} className="text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
