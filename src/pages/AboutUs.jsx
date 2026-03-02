import { QrCode, Calendar, ClipboardCheck, Phone, Mail } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import melvin from "../images/melvin.jpg";
import princess from "../images/princess.jpg";
import FacebookLogo from "../images/FacebookLogo.jpg";

const AboutUs = () => {
  const features = [
    {
      icon: QrCode,
      title: "Fast Scanning",
      desc: "Instant room identification and attendance logging.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      desc: "Real-time updates on room availability and classes.",
    },
    {
      icon: ClipboardCheck,
      title: "Accurate Data",
      desc: "Reliable attendance reports for teachers and admins.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a2e]">
      <LandingNavbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Decorative Shapes */}
       
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            About Scan And Know
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            We are dedicated to simplifying administrative tasks in schools and
            universities. Our platform bridges the gap between physical spaces
            and digital management through intuitive QR technology.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <feature.icon size={22} />
                </div>

                <h3 className="text-lg font-bold mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* TEAM SECTION */}
          <div className="flex flex-wrap justify-center gap-8">
            
            {/* Developer Card */}
            <div className="bg-white w-72 p-6 rounded-3xl text-center shadow-md hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all">
              <img
                src={princess}
                alt="Princess Anne"
                className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500"
              />
              <div className="font-bold text-lg">
                Princess Anne H. Cañazares
              </div>
              <div className="text-sm text-gray-500 mb-3">
                Developer / Programmer
              </div>

              <div className="text-left text-sm space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <img
                    src={FacebookLogo}
                    alt="fb"
                    className="w-4 h-4"
                  />
                  <a
                    href="https://www.facebook.com/share/1EJk1Bvaia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-yellow-500"
                  >
                    Scan and Know
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-700" />
                  <span>scanandknow@gmail.com</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-700" />
                  <span>09276968065</span>
                </div>
              </div>
            </div>

            {/* Designer Card */}
            <div className="bg-white w-72 p-6 rounded-3xl text-center shadow-md hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all">
              <img
                src={melvin}
                alt="Melvin"
                className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500"
              />
              <div className="font-bold text-lg">
                Melvin M. Villaseran
              </div>
              <div className="text-sm text-gray-500 mb-3">
                Designer
              </div>

              <div className="text-left text-sm space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <img
                    src={FacebookLogo}
                    alt="fb"
                    className="w-4 h-4"
                  />
                  <a
                    href="https://www.facebook.com/share/1LnjjfR5fp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-yellow-500"
                  >
                    Scan and Know
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-700" />
                  <span>scanandknow@gmail.com</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-700" />
                  <span>0912 345 6789</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 Scan and Know. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutUs;