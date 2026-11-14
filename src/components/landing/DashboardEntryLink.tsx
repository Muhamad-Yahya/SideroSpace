"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentProps, MouseEventHandler, ReactNode } from "react";

type DashboardEntryLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
};

function DashboardEntryLinkContent({
  opening,
  pathname,
  sourcePath,
  onNavigationSettled,
  children,
}: {
  opening: boolean;
  pathname: string;
  sourcePath: { current: string };
  onNavigationSettled: () => void;
  children: ReactNode;
}) {
  const { pending } = useLinkStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
    } else if (wasPending.current) {
      wasPending.current = false;
      if (pathname === sourcePath.current) onNavigationSettled();
    }
  }, [onNavigationSettled, pathname, pending, sourcePath]);

  if (!opening) return children;

  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>Opening Project...</span>
    </span>
  );
}

export default function DashboardEntryLink({
  children,
  className,
  onClick,
  ...props
}: DashboardEntryLinkProps) {
  const [opening, setOpening] = useState(false);
  const pathname = usePathname();
  const sourcePath = useRef(pathname);
  const onNavigationSettled = useCallback(() => setOpening(false), []);
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (opening) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <Link
      {...props}
      href="/dashboard"
      className={`${className ?? ""}${opening ? " pointer-events-none cursor-wait" : ""}`}
      aria-disabled={opening}
      onClick={handleClick}
      onNavigate={() => {
        sourcePath.current = pathname;
        setOpening(true);
      }}
    >
      <DashboardEntryLinkContent
        opening={opening}
        pathname={pathname}
        sourcePath={sourcePath}
        onNavigationSettled={onNavigationSettled}
      >
        {children}
      </DashboardEntryLinkContent>
    </Link>
  );
}
