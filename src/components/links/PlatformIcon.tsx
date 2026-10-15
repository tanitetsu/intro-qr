import { detectPlatform, type PlatformId } from "@/lib/platform";

function Glyph({ id }: { id: PlatformId }) {
  // 簡易ブランド字形（外部画像に依存しない）
  switch (id) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z"
          />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.75.75 0 0 1-1 .25c-2.9-1.8-6.6-2.2-10.9-1.2a.75.75 0 1 1-.3-1.5c4.7-1 8.8-.6 12 .1a.75.75 0 0 1 .2 2.35zm1.5-3.3a.9.9 0 0 1-1.2.3c-3.3-2-8.3-2.6-12.2-1.4a.9.9 0 1 1-.5-1.7c4.4-1.3 10-.6 13.7 1.6a.9.9 0 0 1 .2 1.2zm.1-3.5a1 1 0 0 1-1.4.4c-3.8-2.2-10-2.5-13.6-1.3a1 1 0 0 1-.6-1.9c4.1-1.3 10.9-1 15.2 1.5a1 1 0 0 1 .4 1.3z"
          />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 .5A11.5 11.5 0 0 0 8.3 22.9c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 12 .5z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.2 8.2h4.8V24H.2V8.2zM8.3 8.2h4.6v2.2h.1c.6-1.2 2.2-2.5 4.5-2.5 4.8 0 5.7 3.2 5.7 7.3V24h-4.8v-7.4c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24H8.3V8.2z"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M18.9 2H22l-6.8 7.8L23.2 22h-6.5l-5.1-6.6L5.7 22H2.5l7.3-8.3L.8 2h6.7l4.6 6L18.9 2zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .4.4.7.9 1 1.5.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5-.4.4-.9.7-1.5 1-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1-.4-.4-.7-.9-1-1.5-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5.4-.4.9-.7 1.5-1 .4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 0 5.7.1 4.8.3 4 .6 3.1 1 2.3 1.4 1.6 2.2.8 2.9.4 3.7 0 4.6-.3 5.4-.5 6.3-.6 7.6-.7 8.9-.7 9.3-.7 12s0 3.1.1 4.4c.1 1.3.3 2.2.6 3 .4.9.8 1.7 1.6 2.4.7.8 1.5 1.2 2.4 1.6.8.3 1.7.5 3 .6 1.3.1 1.7.1 4.4.1s3.1 0 4.4-.1c1.3-.1 2.2-.3 3-.6.9-.4 1.7-.8 2.4-1.6.8-.7 1.2-1.5 1.6-2.4.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-4.4s0-3.1-.1-4.4c-.1-1.3-.3-2.2-.6-3-.4-.9-.8-1.7-1.6-2.4C21.1.8 20.3.4 19.4 0 18.6-.3 17.7-.5 16.4-.6 15.1-.7 14.7-.7 12-.7zm0 5.4a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.2a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M19.6 7.3a6.3 6.3 0 0 1-3.7-1.2v7.1a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.9a3 3 0 1 0 2.1 2.9V1.5h2.9a6.3 6.3 0 0 0 3.7 3.6v2.2z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3.1l.9-3H13v-2c0-.6.4-1 1-1z"
          />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2C6.5 2 2 5.8 2 10.5c0 4.2 3.7 7.7 8.7 8.4.3 0 .8.2.9.5.1.2.1.6 0 .9l-.2 1.1c-.1.4-.3 1.5 1.3.8 1.6-.7 8.5-5 8.5-11.7C21.2 5.8 16.7 2 12 2z"
          />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M16.3 10.3c-.1-.1-.3-.1-.4-.1a5.5 5.5 0 0 0-1.1-.2c.1-.4.1-.8.1-1.1 0-2.2-1.3-3.5-3.5-3.5-1.9 0-3.1 1.1-3.4 2.9l1.6.3c.2-1 .8-1.5 1.8-1.5 1.1 0 1.7.6 1.7 1.8 0 .4 0 .7-.1 1.1-1.6-.1-3.3.1-4.6.7-1.6.7-2.7 2-2.7 4 0 2.5 1.9 4.2 4.6 4.2 1.7 0 3-.6 3.9-1.7.5.8 1.1 1.2 2.1 1.3l.3-1.6c-.5 0-.8-.2-1.1-.6.8-1 1.2-2.3 1.2-4 0-.8-.1-1.5-.4-2zm-5.5 5.8c-1.5 0-2.5-.9-2.5-2.2 0-1.7 1.5-2.6 4.1-2.8.2.7.3 1.5.3 2.2 0 2-1 2.8-1.9 2.8z"
          />
        </svg>
      );
    case "twitch":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M4 2 2 6v14h5v2h3l3-2h4l5-5V2H4zm15 11-3 3h-4l-3 2v-2H6V4h13v9zm-3-6h-2v5h2V7zm-5 0H9v5h2V7z"
          />
        </svg>
      );
    case "soundcloud":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M1.5 13.2c0 1.2.8 2.1 1.9 2.1h.4V11c-.9.4-1.5 1.2-1.5 2.2zm2.8 2.1h.8V9.2c-.5.5-.8 1.2-.8 2v4.1zm1.7 0h.8V8.3c-.3.3-.6.8-.7 1.3-.1.3-.1.6-.1.9v4.8zm1.7 0h.8V7.9c0-.3 0-.6.1-.9.2-.7.7-1.3 1.3-1.6V15.3zm9.8-.1h-8.1V6.4c1-.8 2.3-1.2 3.7-1.2 3.2 0 5.8 2.4 6.1 5.5 1.5.2 2.6 1.4 2.6 2.9 0 1.6-1.3 2.9-2.9 2.9-.5 0-1.1-.1-1.4-.3z"
          />
        </svg>
      );
    case "apple_music":
    case "apple_podcasts":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M18.7 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM15.5 5.5c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.2z"
          />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M19.3 5.2A17 17 0 0 0 15 4l-.3.6a15.7 15.7 0 0 1 3.5 1.4 16 16 0 0 0-13.4 0A15 15 0 0 1 8.3 4L8 4a17 17 0 0 0-4.3 1.2C1.2 9.3.4 13.2.7 17a16.8 16.8 0 0 0 5.1 2.6l1-1.3a10.8 10.8 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 10.3 0l.4.3c-.5.3-1.1.6-1.7.8l1 1.3A16.8 16.8 0 0 0 23.3 17c.4-4.5-.6-8.4-4-11.8zM8.3 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2-.8 2-1.8 2zm7.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2-.8 2-1.8 2z"
          />
        </svg>
      );
    case "note":
      return (
        <span className="text-[9px] font-bold leading-none tracking-tight">
          note
        </span>
      );
    default:
      return (
        <span className="text-[10px] font-bold leading-none">
          {id === "other" ? "?" : id.replace(/_/g, "").slice(0, 2).toUpperCase()}
        </span>
      );
  }
}

export function PlatformIcon({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const platform = detectPlatform(url);
  const lightBg =
    platform.id === "bmc" ||
    platform.id === "kick" ||
    platform.id === "lemon8";
  return (
    <span
      title={platform.label}
      aria-label={platform.label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        backgroundColor: platform.color,
        color: lightBg ? "#111" : "#fff",
      }}
    >
      <Glyph id={platform.id} />
    </span>
  );
}

export function platformLabelFromUrl(url: string): string {
  return detectPlatform(url).label;
}
