import { useViewer } from "@/data-access-layer/auth/viewer";
import { Link } from "@tanstack/react-router";

export default function LandingDashboardLink() {
  const { viewer } = useViewer();

  if (viewer?.user) {
    return (
      <Link
        to="/dashboard"
        className="flex h-full items-center bg-primary px-6 font-mono text-xs tracking-widest text-primary-content uppercase transition-opacity hover:opacity-90"
      >
        Dashboard →
      </Link>
    );
  }

  return (
    <Link
      to="/auth"
      search={{ returnTo: "/dashboard" }}
      className="flex h-full items-center bg-primary px-6 font-mono text-xs tracking-widest text-primary-content uppercase transition-opacity hover:opacity-90"
    >
      Get Started →
    </Link>
  );
}
