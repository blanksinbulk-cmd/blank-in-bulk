"use client";

import { useRef, useState } from "react";

export default function ProductGallery({ media }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-2xl bg-[#F5F5F3] flex items-center justify-center text-muted text-sm">
        No photos yet
      </div>
    );
  }

  const current = media[active];

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50 && active > 0) setActive(active - 1);
    if (delta < -50 && active < media.length - 1) setActive(active + 1);
    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5F5F3]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current.media_type === "video" ? (
          <video src={current.url} controls className="w-full h-full object-cover" />
        ) : (
          <img src={current.url} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {media.length > 1 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={item.id || i}
              onClick={() => setActive(i)}
              className={
                "w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 " +
                (i === active ? "border-olive" : "border-transparent opacity-60 hover:opacity-100")
              }
            >
              {item.media_type === "video" ? (
                <div className="w-full h-full bg-[#F5F5F3] flex items-center justify-center text-[10px] text-muted">
                  Video
                </div>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
