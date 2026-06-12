import { useViewer } from "@/data-access-layer/auth/viewer";
import { Link } from "@tanstack/react-router";

export default function LandingDashboardLink() {
  const { viewer } = useViewer();

  if (viewer?.user) {
    return (
      <Link
        to="/dashboard"
        className="m-2 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Dashboard →
      </Link>
    );
  }

  return (
    <Link
      to="/auth"
      search={{ returnTo: "/dashboard" }}
      className="m-2 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      Get Started →
    </Link>
  );
}
