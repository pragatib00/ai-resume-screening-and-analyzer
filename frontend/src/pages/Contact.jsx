import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/landing/Footer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useToast } from "../context/ToastContext";
import { validateName, validateEmail, validateRequired } from "../utils/validators";
import { sendContactMessage } from "../services/contactService";

const CONTACT_EMAIL = "resumeiq.help@gmail.com";
const CONTACT_PHONE = "9749713834";

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: `+977 ${CONTACT_PHONE}`,
    href: `tel:+977${CONTACT_PHONE}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kathmandu, Nepal",
    href: null,
  },
];

function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const validate = () => {
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      message: validateRequired(formData.message, "Message"),
    };

    if (!errors.message && formData.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters.";
    }

    const cleaned = Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
    setFieldErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(false);

    if (!validate()) return;

    setLoading(true);
    try {
      await sendContactMessage(formData);
      setSent(true);
      toast.success("Message sent , we'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-blue-100 text-xs font-semibold px-3.5 py-1.5">
            Contact Us
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight">
            We'd love to hear from you
          </h1>
          <p className="mt-5 text-lg text-blue-100 max-w-2xl mx-auto">
            Questions, feedback, or partnership ideas, reach out and our team
            will get back to you shortly.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
              <Card key={label} className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="font-medium text-slate-900 hover:text-blue-600 transition break-words"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-900">{value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-3">
            <Card className="p-8">
              <h2 className="text-xl font-bold text-slate-900">Send us a message</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Fill out the form and we'll respond within 1-2 business days.
              </p>

              {sent && (
                <Alert variant="success" className="mt-6">
                  Thanks for reaching out! Your message has been received.
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  placeholder="Jane Doe"
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  placeholder="you@example.com"
                />

                <Textarea
                  label="Message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  error={fieldErrors.message}
                  placeholder="How can we help?"
                />

                <Button type="submit" loading={loading} icon={Send} className="w-full mt-2">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;
