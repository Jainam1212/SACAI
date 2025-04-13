import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navLinks = ["Student Roadmap", "Job Preference"];

  const dropdownData = [
    { name: "JavaScript", link: "https://roadmap.sh/javascript" },
    { name: "Python", link: "https://roadmap.sh/python" },
    { name: "Java", link: "https://roadmap.sh/java" },
    { name: "C++", link: "https://roadmap.sh/cpp" },
    { name: "Go", link: "https://roadmap.sh/go" },
    { name: "Rust", link: "https://roadmap.sh/rust" },
    { name: "TypeScript", link: "https://roadmap.sh/typescript" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setActiveDropdown(false), 100); // delay fixes link click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav className="fixed w-full z-50 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">Try Our Services ➡️</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 relative items-center">
          {navLinks.map((link, index) =>
            link === "Student Roadmap" ? (
              <div key={index} className="relative" ref={dropdownRef}>
                <span
                  className="hover:text-cyan-400 cursor-pointer transition"
                  onClick={() => setActiveDropdown((prev) => !prev)}
                >
                  {link}
                </span>

                {activeDropdown && (
                  <div className="absolute left-0 p-6 mt-2 bg-black bg-opacity-90 rounded-lg shadow-lg flex flex-col space-y-2" style={{zIndex:100}}>
                    <div className="grid grid-cols-2 gap-3 w-64">
                      {dropdownData.map((item, i) => (
                        <a
                          key={i}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-cyan-400 transition text-sm"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                key={index}
                href={`#${link.toLowerCase()}`}
                className="hover:text-cyan-400 transition"
              >
                {link}
              </a>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-80 text-white px-6 py-4 space-y-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={`#${link.toLowerCase()}`}
              className="block text-lg hover:text-cyan-400 transition"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
