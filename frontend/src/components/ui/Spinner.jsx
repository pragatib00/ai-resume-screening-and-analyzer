import { Loader2 } from "lucide-react";

function Spinner({ size = 20, className = "" }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-blue-600 ${className}`}
    />
  );
}

export default Spinner;
