"use client";

import { useEffect, useRef, useState } from "react";
import { detectPlatform, type PlatformId } from "@/lib/platform";

/**
 * ホスト直下の favicon がロゴにならない PF。
 * よくある公開 URL のロゴ画像を先に使う。ファイルはリポジトリに置かない。
 */
const PREFERRED_LOGO: Partial<Record<PlatformId, string>> = {
  amazon:
    "https://m.media-amazon.com/images/G/01/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png",
  discord: "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/discord.svg",
  ea: "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/ea.svg",
  google_meet: "https://www.gstatic.com/meet/icons/favicon-2026-v2.png",
  dribbble: "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/dribbble.svg",
  artstation:
    "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/artstation.svg",
  epic: "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/epicgames.svg",
};

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
    case "abema":
      return (
        <span className="text-[8px] font-black leading-none tracking-tight">
          AB
        </span>
      );
    case "about_me":
      return (
        <span className="text-[8px] font-black leading-none tracking-tight">
          me
        </span>
      );
    case "amazon":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M15.93 17.29c-2.36 1.74-5.77 2.66-8.72 2.66-4.12 0-7.83-1.52-10.64-4.05-.22-.2-.02-.47.24-.32 2.91 1.7 6.5 2.71 10.22 2.71 2.5 0 5.25-.52 7.78-1.59.38-.16.7.25.12.58zm1.07-1.35c-.28-.35-1.82-.17-2.52-.08-.21.02-.24-.16-.05-.3 1.25-.88 3.31-.62 3.55-.33.24.3-.06 2.35-1.24 3.33-.18.15-.35.07-.27-.13.27-.66.86-2.15.53-2.49z"
          />
        </svg>
      );
    case "carrd":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M2 8.2h11.2c.7 0 1.3.6 1.3 1.3v6.6c0 .7-.6 1.3-1.3 1.3H2c-.7 0-1.3-.6-1.3-1.3V9.5c0-.7.6-1.3 1.3-1.3zm5.4-3.6H20c.7 0 1.3.6 1.3 1.3v6.6c0 .7-.6 1.3-1.3 1.3h-1.6V9.2c0-1.3-1-2.3-2.3-2.3H7.4V4.6z"
          />
        </svg>
      );
    case "ea":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M16.635 6.162l-5.928 9.377H4.24l1.508-2.3h4.024l1.474-2.335H2.264L.79 13.239h2.156L0 17.84h12.072l4.563-7.259 1.652 2.66h-1.401l-1.473 2.299h4.347l1.473 2.3H24zm-11.461.107L3.7 8.604l9.52-.035 1.474-2.3z"
          />
        </svg>
      );
    case "google_calendar":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M7 3.2h1.6V5H7V3.2zm8.4 0H17V5h-1.6V3.2zM6.2 6.2h11.6c.9 0 1.6.7 1.6 1.6v11c0 .9-.7 1.6-1.6 1.6H6.2c-.9 0-1.6-.7-1.6-1.6V7.8c0-.9.7-1.6 1.6-1.6zm.4 4.2v7.8h10.8V10.4H6.6z"
          />
        </svg>
      );
    case "google_meet":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M5.53 2.13 0 7.75h5.53zm.398 0v5.62h7.608v3.65l5.47-4.45c-.014-1.22.031-2.25-.025-3.46-.148-1.09-1.287-1.47-2.236-1.36zM23.1 4.32c-.802.295-1.358.995-2.047 1.49-2.506 2.05-4.982 4.12-7.468 6.19 3.025 2.59 6.04 5.18 9.065 7.76 1.218.671 1.428-.814 1.328-1.64v-13a.828.828 0 0 0-.877-.825zM.038 8.15v7.7h5.53v-7.7zm13.577 8.1H6.008v5.62c3.864-.006 7.737.011 11.58-.009 1.02-.07 1.618-1.12 1.468-2.07v-2.51l-5.47-4.68v3.65zm-13.577 0c.02 1.44-.041 2.88.033 4.31.162.948 1.158 1.43 2.047 1.31h3.464v-5.62z"
          />
        </svg>
      );
    case "google_sites":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M6 2.5h8.1L20 8.3V21.5H6V2.5zm7.2 1.4V8h4.2L13.2 3.9zM8.2 11h7.6v1.5H8.2V11zm0 3.2h7.6V16H8.2v-1.8z"
          />
        </svg>
      );
    case "lemon_squeezy":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="m7.4916 10.835 2.3748-6.5114a3.1497 3.1497 0 0 0-.065-2.3418C9.0315.183 6.9427-.398 5.2928.265 3.643.929 2.71 2.4348 3.512 4.3046l2.8197 6.5615c.219.509.97.489 1.16-.03m1.6798 1.0969 6.5334-2.7758c2.1699-.9219 2.7218-3.6907 1.022-5.2905l-.068-.063c-1.6669-1.5469-4.4217-1.002-5.3706 1.0359L8.3566 11.135c-.234.503.295 1.0199.8159.7979m.373.87 6.6454-2.5119c2.2078-.8349 4.6206.745 4.5886 3.0398l-.002.09c-.048 2.2358-2.3938 3.7376-4.5536 2.9467l-6.6724-2.4418a.595.595 0 0 1-.006-1.1229m-.386 1.9269 6.4375 2.9767a3.2997 3.2997 0 0 1 1.6658 1.6989c.769 1.7998-.283 3.6396-1.9328 4.3016-1.6499.662-3.4097.235-4.2097-1.6359l-2.8027-6.5694c-.217-.509.328-1.009.8419-.772"
          />
        </svg>
      );
    case "mixi":
      return (
        <span className="text-[13px] font-black leading-none">m</span>
      );
    case "naver":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"
          />
        </svg>
      );
    case "orcid":
      return (
        <span className="text-[9px] font-black leading-none tracking-tight">
          iD
        </span>
      );
    case "openstreetmap":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M10.2 3.2a6.4 6.4 0 1 0 3.9 11.4l3.9 3.9 1.7-1.7-3.9-3.9A6.4 6.4 0 0 0 10.2 3.2zm0 2.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4z"
          />
        </svg>
      );
    case "tistory":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M0 3a3 3 0 1 0 6 0 3 3 0 0 0-6 0m9 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0m0-9a3 3 0 1 0 6 0 3 3 0 0 0-6 0m0-9a3 3 0 1 0 6 0 3 3 0 0 0-6 0m9 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0"
          />
        </svg>
      );
    case "venmo":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M4.2 3.2h3.6l4.2 12.2L16.2 3.2H20L13.1 21H10L4.2 3.2z"
          />
        </svg>
      );
    case "devto":
      return (
        <span className="text-[7px] font-black leading-none tracking-tight">
          DEV
        </span>
      );
    case "tver":
      return (
        <span className="text-[7px] font-black leading-none tracking-tight">
          TVer
        </span>
      );
    case "snapchat":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 2.4c-2.8 0-4.8 2-4.8 5.1 0 .9.12 1.7.32 2.4.06.22.12.42.12.62 0 .32-.2.55-.48.78-.4.28-.62.6-.62 1 0 .42.34.72.86.72.3 0 .48-.08.68-.3.16.46.4.86.66 1.16.18.22.46.36.76.36s.58-.14.76-.4c.22.26.5.4.8.4s.58-.14.8-.4c.18.26.46.4.76.4s.58-.14.76-.36c.26-.3.5-.7.66-1.16.2.22.38.3.68.3.52 0 .86-.3.86-.72 0-.4-.22-.72-.62-1-.28-.23-.48-.46-.48-.78 0-.2.06-.4.12-.62.2-.7.32-1.5.32-2.4 0-3.1-2-5.1-4.8-5.1zM9.7 8.5a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7zm4.6 0a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7z"
          />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M2.2 10.4 21.4 3.1c.6-.2 1.2.4 1 1L18.6 19c-.2.7-1 .9-1.6.4l-4.6-3.4-2.6 2.6c-.5.5-1.4.2-1.5-.5l-.8-4.4-4.6-1.5c-.8-.3-.8-1.4 0-1.7z"
          />
        </svg>
      );
    case "researchgate":
      return (
        <span className="text-[12px] font-black leading-none">R</span>
      );
    case "hashnode":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z"
          />
        </svg>
      );
    case "steam":
      return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"
          />
        </svg>
      );
    default:
      return (
        <span className="text-[10px] font-bold leading-none">
          {id === "other" ? "?" : id.replace(/_/g, "").slice(0, 2).toUpperCase()}
        </span>
      );
  }
}

const LIGHT_BG = new Set<PlatformId>([
  "bmc",
  "kick",
  "lemon8",
  "lemon_squeezy",
  "mixi",
  "snapchat",
]);

/**
 * リンク先ホストの apple-touch-icon / favicon。
 * サブドメインで取れないときは親ホストも試す。
 */
function brandIconUrls(pageUrl: string): string[] {
  let parsed: URL;
  try {
    parsed = new URL(pageUrl.trim());
  } catch {
    return [];
  }
  const protocol = parsed.protocol === "http:" ? "http:" : "https:";
  const host = parsed.hostname.replace(/\.$/, "").toLowerCase();
  if (!host) return [];
  const hosts = [host];
  const labels = host.split(".").filter(Boolean);
  if (labels.length > 2) {
    const parent = labels.slice(-2).join(".");
    if (!/^(co|com|ne|or|ac|go|gov|org|net|edu)\.[a-z]{2}$/.test(parent)) {
      hosts.push(parent);
    }
  }
  // ストア用ホストはロゴを置いていないので、ブランド本体も見る。
  if (host === "myshopify.com" || host.endsWith(".myshopify.com")) {
    hosts.push("shopify.com");
  }
  const paths = [
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
    "/favicon.ico",
  ];
  return hosts.flatMap((name) => paths.map((path) => `${protocol}//${name}${path}`));
}

/** 取得できた公式アイコン。直リンクも HTML 上の icon も失敗したら今の字形に戻す。 */
function FetchedBrandIcon({
  url,
  preferred,
  contain = false,
  onExhausted,
}: {
  url: string;
  preferred?: string;
  contain?: boolean;
  onExhausted: () => void;
}) {
  const sources = preferred
    ? [preferred, ...brandIconUrls(url)]
    : brandIconUrls(url);
  const fit = contain ? "object-contain" : "object-cover";
  const [index, setIndex] = useState(0);
  const [forUrl, setForUrl] = useState(url);
  const [discovered, setDiscovered] = useState<string | null>(null);
  const onExhaustedRef = useRef(onExhausted);
  onExhaustedRef.current = onExhausted;
  if (forUrl !== url) {
    setForUrl(url);
    setIndex(0);
    setDiscovered(null);
  }
  const directDone = sources.length === 0 || index >= sources.length;
  useEffect(() => {
    if (!directDone || discovered) return;
    const ctrl = new AbortController();
    let cancelled = false;
    const timer = setTimeout(() => ctrl.abort(), 5000);
    fetch(`/api/brand-icon?url=${encodeURIComponent(url)}`, {
      signal: ctrl.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { src?: string };
        return data.src?.trim() || null;
      })
      .then((src) => {
        if (cancelled) return;
        if (src) setDiscovered(src);
        else onExhaustedRef.current();
      })
      .catch(() => {
        if (!cancelled) onExhaustedRef.current();
      })
      .finally(() => clearTimeout(timer));
    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [directDone, discovered, url]);
  if (discovered) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={discovered}
        alt=""
        referrerPolicy="no-referrer"
        className={`h-full w-full ${fit}`}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth < 8 || img.naturalHeight < 8) onExhaustedRef.current();
        }}
        onError={() => onExhaustedRef.current()}
      />
    );
  }
  if (directDone) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[index]}
      alt=""
      referrerPolicy="no-referrer"
      className={`h-full w-full ${fit}`}
      onLoad={(event) => {
        const img = event.currentTarget;
        if (img.naturalWidth < 8 || img.naturalHeight < 8) {
          setIndex((current) => current + 1);
        }
      }}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}

function siteFaviconSrc(url: string): string | null {
  try {
    const host = new URL(url.trim()).hostname.replace(/^www\./, "");
    if (!host) return null;
    return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`;
  } catch {
    return null;
  }
}

/** 未登録ホストはサイトの favicon。取れなければ従来の「?」 */
function UnknownPlatformMark({ url }: { url: string }) {
  const src = siteFaviconSrc(url);
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="text-[10px] font-bold leading-none">?</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-5 w-5 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export function PlatformIcon({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const platform = detectPlatform(url);
  const lightBg = LIGHT_BG.has(platform.id);
  const fetchFromHost = platform.id !== "other";
  const preferred = PREFERRED_LOGO[platform.id];
  const [fetchFailed, setFetchFailed] = useState(false);
  const [failedFor, setFailedFor] = useState(url);
  if (failedFor !== url) {
    setFailedFor(url);
    setFetchFailed(false);
  }
  const showFetched = fetchFromHost && !fetchFailed;
  return (
    <span
      title={platform.label}
      aria-label={platform.label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{
        backgroundColor: showFetched ? "#fff" : platform.color,
        color: lightBg ? "#111" : "#fff",
      }}
    >
      {platform.id === "other" ? (
        <UnknownPlatformMark url={url} />
      ) : showFetched ? (
        <FetchedBrandIcon
          url={url}
          preferred={preferred}
          contain={platform.id === "amazon"}
          onExhausted={() => setFetchFailed(true)}
        />
      ) : (
        <Glyph id={platform.id} />
      )}
    </span>
  );
}

export function platformLabelFromUrl(url: string): string {
  return detectPlatform(url).label;
}
