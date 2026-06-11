import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const Icon = AppConfig.icon;

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="px-4 py-8 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <Icon className="size-8 text-primary" />
            <span className="font-semibold">{AppConfig.name}</span>
          </div>
          <nav aria-label="footer-navigation">
            <ul className="flex flex-wrap justify-center gap-4 text-sm">
              <li>
                <Link to="/" className="link link-hover">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/auth" search={{ returnTo: "/dashboard" }} className="link link-hover">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="link link-hover">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-base-content/60">
          Copyright © {currentYear} {AppConfig.name}
        </p>
      </div>
    </footer>
  );
}
