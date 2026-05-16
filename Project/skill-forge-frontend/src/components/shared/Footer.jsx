import { Link } from 'react-router-dom';
import { BookOpen, Mail, Heart, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Specializations', path: '/specializations' },
      { name: 'Course Catalog', path: '/courses' },
      { name: 'Data Library', path: '/datasets' },
      { name: 'Professional Certification', path: '/' },
    ],
    company: [
      { name: 'About Academy', path: '/' },
      { name: 'Instructor Portal', path: '/login' },
      { name: 'Enterprise Solutions', path: '/' },
      { name: 'Success Stories', path: '/' },
    ],
    support: [
      { name: 'Technical Support', path: '/' },
      { name: 'Terms of Study', path: '/' },
      { name: 'Privacy Policy', path: '/' },
      { name: 'Academic Integrity', path: '/' },
    ],
  };

  return (
    <footer className="bg-white dark:bg-[#0a0c12] border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                SkillForge
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-sm leading-relaxed">
              Advancing the world through expert-led Data Science education and interactive AI-driven learning paths.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">
                {title}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            © {currentYear} SkillForge Academy. Global Educational Standards Applied.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Certification
             </div>
             <div className="w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
             <div className="text-[10px] font-black text-gray-500 uppercase">
                v2.0 Data Science Edition
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ShieldCheck = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)

export default Footer;
