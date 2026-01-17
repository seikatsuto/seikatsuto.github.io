(function () {

  /* ===== 設定 ===== */
  const LONG_PRESS_TIME = 500; // ms（長押し判定）
  const EXCLUDE_TAGS = ["A", "BUTTON"];

  /* ===== ひらがな変換 ===== */
  function toHiragana(katakana) {
    return katakana.replace(/[\u30a1-\u30f6]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
  }

  /* ===== 要素1つにルビ付与 ===== */
  function addRuby(el, tokenizer) {
    const text = el.innerText;
    const tokens = tokenizer.tokenize(text);

    el.innerHTML = tokens.map(t => {
      if (/[一-龯]/.test(t.surface_form) && t.reading) {
        return `<ruby>${t.surface_form}<rt>${toHiragana(t.reading)}</rt></ruby>`;
      }
      return t.surface_form;
    }).join("");
  }

  /* ===== kuromoji 初期化 ===== */
  kuromoji.builder({ dicPath: "dict/" }).build(function (err, tokenizer) {
    if (err) {
      alert("kuromoji 辞書 読み込み失敗");
      return;
    }

    /* ===== 本文を自動ルビ化（ボタン・リンク除外） ===== */
    document.querySelectorAll("body *").forEach(el => {
      if (
        el.children.length === 0 &&
        el.innerText.trim() &&
        !EXCLUDE_TAGS.includes(el.tagName) &&
        !el.closest("a, button") &&
        !["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(el.tagName)
      ) {
        addRuby(el, tokenizer);
      }
    });

    /* ===== 長押しでルビ表示 ===== */
    let pressTimer = null;
    let pressedRuby = null;

    document.body.addEventListener("touchstart", onPressStart, { passive: true });
    document.body.addEventListener("mousedown", onPressStart);

    document.body.addEventListener("touchend", onPressEnd);
    document.body.addEventListener("mouseup", onPressEnd);
    document.body.addEventListener("touchmove", cancelPress);
    document.body.addEventListener("mousemove", cancelPress);

    function onPressStart(e) {
      const ruby = e.target.closest("ruby");
      if (!ruby) return;

      // ボタン・リンク内は除外
      if (ruby.closest("a, button")) return;

      pressedRuby = ruby;
      pressTimer = setTimeout(() => {
        ruby.classList.toggle("show");
      }, LONG_PRESS_TIME);
    }

    function onPressEnd() {
      cancelPress();
    }

    function cancelPress() {
      clearTimeout(pressTimer);
      pressTimer = null;
      pressedRuby = null;
    }

  });

})();
