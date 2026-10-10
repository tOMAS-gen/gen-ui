"use client";

import { useGenUI } from "./Provider";

export type BreadcrumbItem = { label: string; href?: string };

/** Migas de pan; el último ítem es la página actual. */
export function Breadcrumbs({ items, ariaLabel = "Ubicación" }: { items: BreadcrumbItem[]; ariaLabel?: string }) {
  const { Link } = useGenUI();
  return (
    <nav className="breadcrumbs" aria-label={ariaLabel}>
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`}>
              {i > 0 && (
                <span aria-hidden="true" className="breadcrumbs-sep">
                  /
                </span>
              )}
              {!isLast && item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
