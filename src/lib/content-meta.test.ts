import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  dailymotionVideoUrl,
  devtoApiUrl,
  devtoMetaFromApi,
  mediumFeedRequest,
  mixcloudApiUrl,
  mixcloudMetaFromApi,
  naverMobilePostUrl,
  pickMediumItem,
  tverEpisodeId,
  tverMetaFromApi,
  vimeoVideoUrl,
} from "./content-meta";

describe("content meta url routing", () => {
  it("rewrites Naver desktop posts to the mobile article", () => {
    assert.equal(
      naverMobilePostUrl("https://blog.naver.com/naverofficial/224429356463"),
      "https://m.blog.naver.com/naverofficial/224429356463",
    );
    assert.equal(
      naverMobilePostUrl(
        "https://blog.naver.com/PostView.naver?blogId=naverofficial&logNo=224429356463",
      ),
      "https://m.blog.naver.com/naverofficial/224429356463",
    );
    assert.equal(
      naverMobilePostUrl("https://blog.naver.com/naverofficial"),
      null,
    );
  });

  it("keeps Mixcloud profiles off the cloudcast API", () => {
    assert.equal(mixcloudApiUrl("https://www.mixcloud.com/BBCRadio1/"), null);
    assert.equal(
      mixcloudApiUrl("https://www.mixcloud.com/spartacus/party-time/"),
      "https://api.mixcloud.com/spartacus/party-time/",
    );
    assert.equal(
      mixcloudApiUrl("https://www.mixcloud.com/spartacus/followers/"),
      null,
    );
  });

  it("builds video and article endpoints only for content urls", () => {
    assert.equal(
      vimeoVideoUrl("https://player.vimeo.com/video/22439234"),
      "https://vimeo.com/22439234",
    );
    assert.equal(vimeoVideoUrl("https://vimeo.com/terjes"), null);
    assert.equal(
      dailymotionVideoUrl("https://dai.ly/x7tgad0"),
      "https://www.dailymotion.com/video/x7tgad0",
    );
    assert.equal(
      devtoApiUrl(
        "https://dev.to/ai-defi-news/where-monero-privacy-stops-after-a-swap-gga",
      ),
      "https://dev.to/api/articles/ai-defi-news/where-monero-privacy-stops-after-a-swap-gga",
    );
    assert.equal(devtoApiUrl("https://dev.to/t/javascript"), null);
    assert.equal(tverEpisodeId("https://tver.jp/episodes/eprq7xrt39"), "eprq7xrt39");
    assert.deepEqual(
      mediumFeedRequest(
        "https://ev.medium.com/making-social-social-again-0126fa5c6ce8",
      ),
      {
        feed: "https://ev.medium.com/feed",
        token: "0126fa5c6ce8",
      },
    );
  });
});

describe("content meta parsers", () => {
  it("reads Mixcloud show name and art", () => {
    assert.deepEqual(
      mixcloudMetaFromApi({
        name: "Party Time",
        pictures: { large: "https://cdn.example/large.jpg", thumbnail: "https://cdn.example/s.jpg" },
      }),
      { title: "Party Time", thumbnailUrl: "https://cdn.example/large.jpg" },
    );
  });

  it("reads Dev.to title and social image", () => {
    assert.deepEqual(
      devtoMetaFromApi({
        title: "Where Monero privacy stops after a swap",
        cover_image: null,
        social_image: "https://media2.dev.to/dynamic/image.png",
      }),
      {
        title: "Where Monero privacy stops after a swap",
        thumbnailUrl: "https://media2.dev.to/dynamic/image.png",
      },
    );
  });

  it("picks the Medium RSS item that matches the article id", () => {
    const xml = `<?xml version="1.0"?><rss><channel><item>
      <title><![CDATA[Making “Social” Social Again]]></title>
      <link>https://ev.medium.com/making-social-social-again-0126fa5c6ce8</link>
      <content:encoded><![CDATA[<img src="https://cdn-images-1.medium.com/max/1024/pic.jpeg" />]]></content:encoded>
    </item></channel></rss>`;
    assert.deepEqual(pickMediumItem(xml, "0126fa5c6ce8"), {
      title: "Making “Social” Social Again",
      thumbnailUrl: "https://cdn-images-1.medium.com/max/1024/pic.jpeg",
    });
    assert.equal(pickMediumItem(xml, "deadbeef0000"), null);
  });

  it("joins TVer series and episode titles and expands the thumbnail", () => {
    assert.deepEqual(
      tverMetaFromApi({
        result: {
          episode: {
            content: {
              title: "第1話 昭和12年うぶな夫婦の恋物語",
              seriesTitle: "波うららかに、めおと日和",
              thumbnailPath: "/images/content/thumbnail/episode/xlarge/eprq7xrt39.jpg?v=1",
            },
          },
        },
      }),
      {
        title: "波うららかに、めおと日和 第1話 昭和12年うぶな夫婦の恋物語",
        thumbnailUrl:
          "https://statics.tver.jp/images/content/thumbnail/episode/xlarge/eprq7xrt39.jpg?v=1",
      },
    );
  });
});
