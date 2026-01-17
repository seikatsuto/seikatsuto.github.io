(function () {

  function toHiragana(katakana) {
    return katakana.replace(/[\u30a1-\u30f6]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
  }

  function addRubyToElement(el, tokenizer) {
    const text = el.innerText;
    const tokens = tokenizer.tokenize(text);

    el.innerHTML = tokens.map(t => {
      if (t.surface_form.match(/[一-龯]/) && t.reading) {
        return `<ruby>${t.surface_form}<rt>${toHiragana(t.reading)}</rt></ruby>`;
      }
      return t.surface_form;
    }).join("");
  }

  kuromoji.builder({ dicPath: "dict/" }).build(function (err, tokenizer) {

    // 🔹 ページ内の「全部のテキスト」を対象にする
    document.querySelectorAll("body *").forEach(el => {
      if (el.children.length === 0 && el.innerText.trim()) {
        addRubyToElement(el, tokenizer);
      }
    });

    // 🔹 クリックした単語だけ表示
    document.body.addEventListener("click", e => {
      const ruby = e.target.closest("ruby");
      if (ruby) ruby.classList.toggle("show");
    });
  });

})();
