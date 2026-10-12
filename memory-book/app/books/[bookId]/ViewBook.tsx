
"use client";

import { useState } from "react";

type Memory = {
  id: number;
  image_id: number | null;
  title: string;
  description: string | null;
  file_name: string | null;
  imageSrc: string | null;
};

export default function ViewBook({
  memories,
}: {
  memories: Memory[];
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
      >
        {show ? "Hide" : "View"}
      </button>

      {show && (
        <div className="space-y-8 px-12 py-12 text-[11px] leading-[1.6] text-zinc-700">
          {memories.map((item) => (
            <article
              key={`${item.id}-${item.image_id ?? "no-image"}`}
              className="relative rounded-lg border border-zinc-200 bg-white p-8"
            >
              <h2 className="m-5 text-center font-serif text-4xl text-[#433f3e]">
                {item.title}
              </h2>

              {item.description && (
                <p className="mt-5 text-center text-xs leading-[1.7]">
                  {item.description}
                </p>
              )}

              {item.imageSrc && (
                <img
                  src={item.imageSrc}
                  alt={item.file_name || item.title}
                  className="mx-auto mt-5 h-[400px] w-full max-w-[400px] object-contain"
                />
              )}

              <div className="pointer-events-none absolute inset-3 rounded-lg border border-zinc-200" />
              <div className="mt-6 text-center text-xs text-[#8b7355]">
                ♥
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
