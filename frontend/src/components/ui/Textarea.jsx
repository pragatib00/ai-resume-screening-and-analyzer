function Textarea({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        className={`
          w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900
          placeholder:text-slate-400 outline-none transition resize-y
          focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
          ${error ? "border-red-300" : "border-slate-200"}
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default Textarea;
