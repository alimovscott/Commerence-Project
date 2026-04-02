import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useGlobals } from "../../hooks/useGlobals";

const socialLinks = [
  { href: "#", label: "Facebook", icon: "/icons/icon1.png" },
  { href: "#", label: "Twitter", icon: "/icons/icon2.png" },
  { href: "#", label: "Instagram", icon: "/icons/icon3.png" },
  { href: "#", label: "YouTube", icon: "/icons/icon4.png" },
];

export default function Footer() {
  const { authMember } = useGlobals();

  const navLinks: Array<{ to: string; label: string }> = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    ...(authMember
      ? [
          { to: "/orders", label: "Orders" },
          { to: "/member-page", label: "My Page" },
        ]
      : []),
    { to: "/help", label: "Help" },
  ];

  return (
    <footer className="border-t border-zinc-200/80 bg-white-900 text-zinc-300">
      <div className="mx-auto max-w-[1300px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
           <Link
                         to="/"
                         className="flex items-center gap-2 text-xl font-bold tracking-tighter text-black no-underline"
                       >
                         <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-white">
                           L
                         </span>
                         LUXE
                         <span className="text-emerald-600">COMMERCE</span>
                       </Link>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum maiores, libero, sint mollitia, in laboriosam reiciendis eos ea molestiae distinctio exercitationem non velit dicta placeat officia iusto! Rerum, quae nulla?
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border  text-zinc-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  <img src={icon} alt="" className="h-5 w-5 opacity-90" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Quick links
            </h3>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Footer">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to + label}
                  to={to}
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Find us
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/90"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-zinc-400">Downtown, Dubai</span>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/90"
                  strokeWidth={2}
                  aria-hidden
                />
                <a
                  href="8210-4364-1330"
                  className="text-zinc-300 transition-colors hover:text-emerald-400"
                >
                  +8210-4364-1330
                </a>
              </li>
              <li className="flex gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/90"
                  strokeWidth={2}
                  aria-hidden
                />
                <a
                  href="mailto:devexuz@gmail.com"
                  className="text-zinc-300 transition-colors hover:text-emerald-400"
                >
                  abduqodiralimov23@icloud.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/90"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-zinc-400">Visit 24 hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-zinc-800 pt-8 text-center text-xs text-zinc-500 sm:text-sm">
          © {new Date().getFullYear()} Scott Global. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
