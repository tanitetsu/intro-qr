"use client";

import { useEffect, useMemo, useState } from "react";

function detectInAppBrowser(ua: string) {
  return /FBAN|FBAV|Instagram|Line\/|Twitter|GSA\/|Gmail|MicroMessenger|TikTok/i.test(
    ua,
  );
}

export function InAppBrowserBanner() {
  const [visible, setVisible] = useState(false);
  const href = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisible(detectInAppBrowser(navigator.userAgent));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <p className="font-medium">アプリ内ブラウザで開いています</p>
      <p className="mt-0.5">
        うまく動かない場合は、右下メニューから「Safariで開く」を選んでください。
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-block font-semibold text-violet-700 underline"
      >
        外部ブラウザで開き直す
      </a>
    </div>
  );
}
