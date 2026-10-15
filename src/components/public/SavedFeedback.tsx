"use client";

import { Users } from "lucide-react";
import { StatusToast } from "@/components/ui/StatusToast";
import { useI18n } from "@/lib/i18n/locale";

/** 公開ページ自動保存の短いフィードバック */
export function SavedFeedback({ visible }: { visible: boolean }) {
  const { t } = useI18n();
  if (!visible) return null;
  return (
    <StatusToast icon={<Users className="h-3.5 w-3.5" aria-hidden />}>
      {t("people.saved")}
    </StatusToast>
  );
}
