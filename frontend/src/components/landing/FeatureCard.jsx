import { motion } from "framer-motion";

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-slate-500 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default FeatureCard;