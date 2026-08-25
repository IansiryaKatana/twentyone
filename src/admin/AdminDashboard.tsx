import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getSupabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/database.types";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import {
  adminCard,
  adminMuted,
  adminSectionTitle,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTableWrap,
} from "@/admin/adminClassNames";

type SubmissionRow = Tables<"form_submissions">;

type Counts = {
  projects: number;
  journal: number;
  submissions: number;
  media: number;
};

export function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    projects: 0,
    journal: 0,
    submissions: 0,
    media: 0,
  });
  const [recent, setRecent] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    const [projects, journal, submissions, media, recentRes] = await Promise.all([
      sb.from("projects").select("*", { count: "exact", head: true }),
      sb.from("journal_posts").select("*", { count: "exact", head: true }),
      sb.from("form_submissions").select("*", { count: "exact", head: true }),
      sb.from("cms_media").select("*", { count: "exact", head: true }),
      sb
        .from("form_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    setCounts({
      projects: projects.count ?? 0,
      journal: journal.count ?? 0,
      submissions: submissions.count ?? 0,
      media: media.count ?? 0,
    });
    setRecent(recentRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const statCards = [
    { label: "Projects", value: counts.projects, to: "/admin/projects" as const },
    { label: "Journal posts", value: counts.journal, to: "/admin/journal" as const },
    { label: "Submissions", value: counts.submissions, to: "/admin/submissions" as const },
    { label: "Media assets", value: counts.media, to: "/admin/media" as const },
  ];

  return (
    <div>
      <AdminPageHeading
        title="Dashboard"
        description="Overview of content and recent inbound messages."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} to={card.to} className={`${adminCard} transition hover:shadow-md`}>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--admin-muted)]">
              {card.label}
            </p>
            <p className="font-display mt-2 text-3xl font-medium text-[var(--admin-ink)]">
              {loading ? "-" : card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className={adminSectionTitle}>
          Recent submissions
        </h2>
        <p className={`${adminMuted} mt-1`}>Latest contact and inquiry form entries.</p>

        <div className={`${adminTableWrap} mt-4`}>
          <table className={adminTable}>
            <thead>
              <tr>
                <th className={adminTableHeadCell}>Form</th>
                <th className={adminTableHeadCell}>Status</th>
                <th className={adminTableHeadCell}>Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr>
                  <td colSpan={3} className={`${adminTableCell} py-8 text-center text-[var(--admin-muted)]`}>
                    Loading…
                  </td>
                </tr>
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={3} className={`${adminTableCell} py-8 text-center text-[var(--admin-muted)]`}>
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                recent.map((row) => (
                  <tr key={row.id}>
                    <td className={adminTableCell}>{row.form_name}</td>
                    <td className={adminTableCell}>{row.status}</td>
                    <td className={adminTableCell}>
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
