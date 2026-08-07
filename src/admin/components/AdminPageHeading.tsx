import type { ReactNode } from "react";
import { adminMuted, adminPageTitle } from "@/admin/adminClassNames";

type AdminPageHeadingProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeading({ title, description, actions }: AdminPageHeadingProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className={adminPageTitle}>{title}</h1>
        {description ? <p className={`${adminMuted} mt-1`}>{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
