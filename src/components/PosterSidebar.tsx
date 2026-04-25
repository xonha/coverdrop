interface SidebarSection {
  label: string;
  value: number | string;
  onChange: (v: number | string) => void;
  min?: number;
  max?: number;
}

interface PosterSidebarProps {
  sections: SidebarSection[];
}

export function PosterSidebar({ sections }: PosterSidebarProps) {
  return (
    <div className="absolute right-0 top-0 h-full w-48 bg-gray-950/90 flex flex-col p-4 gap-4 overflow-y-auto">
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">{section.label}</span>
          {typeof section.value === "string" ? (
            <input
              type="color"
              value={section.value}
              onChange={(e) => section.onChange(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          ) : (
            <>
              <input
                type="range"
                min={section.min}
                max={section.max}
                value={section.value}
                onChange={(e) => section.onChange(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400 text-center">
                {section.value}%
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

