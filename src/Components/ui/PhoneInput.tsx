import { Input } from "./Input";


const PhoneInput = ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label?: string }) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (!newValue.startsWith('+998')) {
      newValue = '+998';
    }
    const cleaned = newValue.replace(/[^\d+]/g, '');
    if (cleaned.length > 12) {
      onChange(cleaned.slice(0, 12));
    } else {
      onChange(cleaned);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-cyan-400/15 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      <Input
        label={label || "Phone"}
        value={value}
        onChange={handlePhoneChange}
        placeholder="+998 XX XXX XX XX"
        className="backdrop-blur-sm font-mono"
      />
    </div>
  );
};

export default PhoneInput