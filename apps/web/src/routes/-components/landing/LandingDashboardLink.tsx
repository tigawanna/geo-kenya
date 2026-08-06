import { useViewer } from "@/data-access-layer/auth/viewer";
import {
  getLandingAccessMode,
  publicReleasesQueryOptions,
} from "@/data-access-layer/dashboard/releases";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

const linkClass =
  "m-2 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";

export default function LandingDashboardLink() {
  const { viewer } = useViewer();
  const { data } = useQuery(publicReleasesQueryOptions);

  if (viewer?.user) {
    return (
      <Link to="/dashboard" className={linkClass}>
        Dashboard →
      </Link>
    );
  }

  if (!data) {
    return (
      <a href="#waitlist" className={linkClass}>
        Join waitlist →
      </a>
    );
  }

  const mode = getLandingAccessMode(data);

  if (mode === "open_testing" || mode === "open_and_production") {
    return (
      <a href={data.openTesting!.url} target="_blank" rel="noreferrer" className={linkClass}>
        Try the app →
      </a>
    );
  }

  if (mode === "production") {
    return (
      <a href={data.production!.url} target="_blank" rel="noreferrer" className={linkClass}>
        Get the app →
      </a>
    );
  }

  return (
    <a href="#waitlist" className={linkClass}>
      Join waitlist →
    </a>
  );
}
