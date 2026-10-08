"use client";

import { useEffect, useRef } from "react";

type Item = {
  id: string;
  label: string;
};

export function PageCarousel({
  items,
  activeId,
  onChange,
  renderItem,
}: {
  items: Item[];
  activeId: string | null;
  onChange: (id: string) => void;
  renderItem: (id: string, index: number) => React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * activeIndex, behavior: "smooth" });
  }, [activeIndex, items.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = el.clientWidth || 1;
        const index = Math.round(el.scrollLeft / width);
        const item = items[index];
        if (item && item.id !== activeId) onChange(item.id);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [activeId, items, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-1.5 px-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            onClick={() => onChange(item.id)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-violet-600" : "w-1.5 bg-zinc-300"
            }`}
          />
        ))}
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="w-full shrink-0 snap-center px-4"
            data-page-id={item.id}
          >
            {renderItem(item.id, index)}
          </div>
        ))}
      </div>
      <p className="px-4 text-center text-xs text-zinc-500">
        左右にスワイプでページ切替
      </p>
    </div>
  );
}
