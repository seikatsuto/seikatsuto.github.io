let items = [];
let index = 0;
let player = null;
let timer = null;

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
    playerVars: {
      autoplay: 1,
      controls: 0
    },
    events: {
      onReady: e => {
        e.target.playVideo();

        // 3秒以内に再生できなければアウト
        timer = setTimeout(() => {
          removeItem(li);
        }, 3000);
      },
      onStateChange: e => {
        if (e.data === YT.PlayerState.PLAYING) {
          // ✅ 本当に再生できた
          clear();
          index++;
          checkNext();
        }
      },
      onError: () => {
        // ❌ 非公開・削除・制限
        removeItem(li);
      }
    }
  });
}

function removeItem(li) {
  clear();
  li.remove();
  index++;
  checkNext();
}

function clear() {
  clearTimeout(timer);
  timer = null;
  if (player) {
    player.destroy();
    player = null;
  }
}

