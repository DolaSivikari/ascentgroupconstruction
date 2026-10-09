import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { getHeroPhoto } from "@/data/hero-photography";

/** A failed saved image falls back to the page's bundled image, once. */
export function PageHeroImage({
  src,
  fallbackSrc,
  alt,
  position,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  position?: "center" | "top" | "bottom";
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const current = failed && fallbackSrc ? fallbackSrc : src;
  const photo = getHeroPhoto(current);
  const style = {
    "--hero-image-position": position || photo?.position || "center",
    "--hero-image-position-mobile":
      position || photo?.mobilePosition || photo?.position || "center",
  } as CSSProperties;

  return (
    <>
      <div
        className="absolute inset-0 z-0"
        data-hero-image-state={
          unavailable ? "unavailable" : loaded ? "loaded" : "loading"
        }
      >
        {!unavailable && (
          <img
            key={current}
            src={current}
            alt={photo?.alt || alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className={`h-full w-full object-cover [object-position:var(--hero-image-position-mobile)] md:[object-position:var(--hero-image-position)] transition-opacity duration-500 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`}
            style={style}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              if (!failed && fallbackSrc && fallbackSrc !== src)
                setFailed(true);
              else setUnavailable(true);
            }}
          />
        )}
      </div>
      {loaded && !unavailable && photo && (
        <div className="absolute bottom-3 right-4 z-20 max-w-[calc(100%-2rem)] text-xs text-white/90 sm:right-6">
          {photo.projectPath ? (
            <Link
              to={photo.projectPath}
              className="inline-block rounded bg-black/45 px-2 py-1 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              Project reference: {photo.projectTitle}
            </Link>
          ) : (
            <details className="group relative text-right">
              <summary className="cursor-pointer rounded bg-black/45 px-2 py-1 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                Photo credit
              </summary>
              <div className="absolute bottom-full right-0 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg bg-slate-950 p-3 text-left leading-relaxed shadow-lg">
                <p>{photo.alt}</p>
                <p className="mt-2">Photo: {photo.author}</p>
                <p className="mt-1">
                  {photo.licenseUrl ? (
                    <a
                      className="underline"
                      href={photo.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {photo.license}
                    </a>
                  ) : (
                    photo.license
                  )}{" "}
                  · Displayed with a responsive crop.
                </p>
                <a
                  className="mt-2 inline-block underline"
                  href={photo.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original photograph & attribution
                </a>
              </div>
            </details>
          )}
        </div>
      )}
    </>
  );
}
