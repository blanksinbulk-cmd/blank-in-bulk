"use client";

import { useRef, useState, useTransition } from "react";

export default function MediaUploader({ media, uploadAction, deleteAction, maxItems = 6 }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const atLimit = (media?.length || 0) >= maxItems;

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadAction(formData);
      if (result?.error) setError(result.error);
      e.target.value = "";
    });
  }

  function handleDelete(mediaId) {
    startTransition(async () => {
      await deleteAction(mediaId);
    });
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {(media || []).map((item) => (
          <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-[#F5F5F3] border border-line group">
            {item.media_type === "video" ? (
              <video src={item.url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={item.url} alt="" className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="absolute top-1 right-1 bg-black/70 hover:bg-[#B23B3B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              aria-label="Remove"
            >
              ×
            </button>
            {item.media_type === "video" && (
              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                Video
              </span>
            )}
          </div>
        ))}

        {!atLimit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="aspect-square rounded-lg border-2 border-dashed border-line hover:border-olive flex items-center justify-center text-muted text-xs disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "+ Add"}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />

      <p className="text-[11px] text-muted">
        {(media || []).length}/{maxItems} files &mdash; up to 5 images plus 1 video, 100MB max per file.
      </p>
      {error && <p className="text-xs text-[#B23B3B] mt-1">{error}</p>}
    </div>
  );
}
