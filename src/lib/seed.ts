import { createId } from "@/lib/id";
import type { AppData, ProfilePage } from "@/lib/types";

function nowIso() {
  return new Date().toISOString();
}

export function createSeedPages(): ProfilePage[] {
  const musicId = createId("page");
  const circleId = createId("page");
  const ts = nowIso();

  return [
    {
      id: musicId,
      title: "音楽イベント用",
      slug: "music",
      displayName: "ゆうと",
      bio: "ギターとLo-fiが好きです。よければ音源もどうぞ。",
      isDefault: true,
      createdAt: ts,
      updatedAt: ts,
      links: [
        {
          id: createId("link"),
          title: "SoundCloud",
          url: "https://soundcloud.com",
          comment: "最近のデモ音源",
          type: "interest",
          order: 0,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
        },
        {
          id: createId("link"),
          title: "YouTube",
          url: "https://youtube.com",
          comment: "ライブ映像まとめ",
          type: "interest",
          order: 1,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80",
        },
        {
          id: createId("link"),
          title: "X",
          url: "https://x.com",
          comment: "日常・告知",
          type: "contact",
          order: 2,
        },
        {
          id: createId("link"),
          title: "Instagram",
          url: "https://instagram.com",
          comment: "写真多め",
          type: "contact",
          order: 3,
        },
      ],
    },
    {
      id: circleId,
      title: "サークル用",
      slug: "circle",
      displayName: "ゆうと",
      bio: "大学の音楽サークルです。新歓で会った方向け。",
      isDefault: false,
      createdAt: ts,
      updatedAt: ts,
      links: [
        {
          id: createId("link"),
          title: "サークル紹介",
          url: "https://example.com/circle",
          comment: "活動内容とスケジュール",
          type: "org",
          order: 0,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        },
        {
          id: createId("link"),
          title: "好きなアーティスト（note）",
          url: "https://note.com",
          comment: "最近の推し解説",
          type: "interest",
          order: 1,
        },
        {
          id: createId("link"),
          title: "LINE",
          url: "https://line.me",
          comment: "連絡はこちらが早いです",
          type: "contact",
          order: 2,
        },
      ],
    },
  ];
}

export function createSeedData(): AppData {
  const pages = createSeedPages();
  return {
    pages,
    activePageId: pages[0]?.id ?? null,
    savedPeople: [],
  };
}
