/*************************************************
 * DISPLAY.JS — CURHAT 7C (FINAL CLEAN FIX)
 * READ ONLY • AMAN • SISWA FRIENDLY • PRODUKSI
 *************************************************/

(async () => {
  const list = document.getElementById("list");
  const empty = document.getElementById("empty");

  // pengaman DOM
  if (!list || !empty) {
    console.warn("Elemen #list atau #empty tidak ditemukan");
    return;
  }

  /* ================= CLIENT NORMALIZER ================= */
  // pagar terakhir (jika server kecolongan)
  function normalizeClient(str) {
    return String(str)
      .toLowerCase()
      .replace(/[0]/g, "o")
      .replace(/[1]/g, "i")
      .replace(/[3]/g, "e")
      .replace(/[4]/g, "a")
      .replace(/[5]/g, "s")
      .replace(/[7]/g, "t")
      .replace(/[^a-z]/g, "")
      .replace(/(.)\1{2,}/g, "$1$1");
  }

  /* ================= BLOCK LIST (RINGKAS) ================= */
  const BLOCKED = [
    "anjing","babi","bangsat","goblok","tolol",
    "kontol","memek","kafir","cina","monyet",
    "bodoh","jelek","hitam","rendi"
  ];

  try {
    // MODE FILTER DARI code.gs
    const res = await fetch(API_URL + "?mode=list");
    const json = await res.json();

    // validasi response
    if (!json.ok || !Array.isArray(json.data) || json.data.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    const seen = new Set();
    let rendered = 0;

    json.data.forEach(text => {
      if (typeof text !== "string") return;

      const clean = normalizeClient(text);

      // terlalu pendek / noise
      if (clean.length < 5) return;

      // spam huruf sama semua: aaaaaaa
      if (/^(.)\1{5,}$/.test(clean)) return;

      // kata terlarang (kalau server kecolongan)
      if (BLOCKED.some(w => clean.includes(w))) return;

      // duplikat tampilan (walau beda ejaan)
      if (seen.has(clean)) return;
      seen.add(clean);

      const card = document.createElement("div");
      card.className = "card";
      card.textContent = text; // TETAP ASLI (ANTI XSS)
      list.appendChild(card);
      rendered++;
    });

    // jika semua terfilter di client
    if (rendered === 0) {
      empty.style.display = "block";
    }

  } catch (err) {
    console.error(err);
    empty.textContent = "Gagal memuat refleksi teman";
    empty.style.display = "block";
  }
})();
