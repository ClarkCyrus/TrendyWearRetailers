type BreadcrumbItem = {
  label: string;
  href?: string; // no href = current page
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-[20px] mb-2 flex flex-wrap gap-1">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const hasHref = item.href && item.href.trim() !== "";

        return (
          <span key={index} className="flex items-center">
            {hasHref && !isLast ? (
              <a
                href={item.href}
                className="text-[#626262] hover:underline"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-black">{item.label}</span>
            )}

            {!isLast && <span className="mx-1 text-[#626262]">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
