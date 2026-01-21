let items = [];
let index = 0;
let player = null;

function onYouTubeIframeAPIReady() {
  items = Array.from(document.querySelectorAll("#videoList li"));
  checkNext();
}

function checkNext() {
  if (index >= items.length) return;

  const li = items[index];
  const a = li.querySelector("a.hit");
  const v = new URLSearchParams(a.getAttribute("href").split("?")[1]).get("v");

  player = new YT.Player("checker", {
    videoId: v,
    events: {
      onReady: () => {
        // 再生できる → 次へ
        cleanup();
        index++;
        checkNext();
      },
      onError: () => {
        // ❌ 再生不可 → liを削除
        li.remove();
        cleanup();
        index++;
        checkNext();
      }
    }
  });
}

function cleanup() {
  if (player) {
    player.destroy();
    player = null;
  }
}
