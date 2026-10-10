import { cx } from "../lib/cx";

/** Logotipo de texto "›gen" + producto (work, saas, stock…). */
export function BrandLogo({ product, className }: { product?: string; className?: string }) {
  return (
    <span className={cx("brand-logo", className)}>
      <span className="brand-gen">›gen</span>
      {product && <span className="brand-product">{product}</span>}
    </span>
  );
}
