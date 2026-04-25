interface SidebarSection {
  label: string;
  value: number | string;
  onChange: (v: number | string) => void;
  min?: number;
  max?: number;
  type?: "range" | "number";
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
          ) : section.type === "number" ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => section.onChange(Math.max(section.min ?? 0, (section.value as number) - 1))}
                className="w-6 h-6 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                -
              </button>
              <span className="flex-1 text-xs text-gray-400 text-center">{section.value}px</span>
              <button
                onClick={() => section.onChange(Math.min(section.max ?? 100, (section.value as number) + 1))}
                className="w-6 h-6 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                +
              </button>
            </div>
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

