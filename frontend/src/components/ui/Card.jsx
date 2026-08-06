function Card({ children, className = "", padded = true, hoverable = false, ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm transition ${
        hoverable
          ? "hover:shadow-md hover:border-blue-200/80 hover:-translate-y-0.5"
          : ""
      } ${padded ? "p-6" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
