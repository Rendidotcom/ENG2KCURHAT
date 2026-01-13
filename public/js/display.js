/*************************************************
 * DISPLAY.JS — CURHAT 7C (FILTER MODE)
 * READ ONLY • AMAN • SISWA FRIENDLY
 *************************************************/

(async () => {
  const list = document.getElementById("list");
  const empty = document.getElementById("empty");

  // pengaman DOM
  if (!list || !empty) {
    console.warn("Elemen #list atau #empty tidak ditemukan");
    return;
  }

  try {
    // MODE FILTER DARI code.gs
    const res = await fetch(API_URL + "?mode=list");
    const json = await res.json();

    // validasi data
    if (!json.ok || !Array.isArray(json.data) || json.data.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    json.data.forEach(text => {
      const card = document.createElement("div");
      card.className = "card";
      card.textContent = text;
      list.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    empty.textContent = "Gagal memuat refleksi teman";
    empty.style.display = "block";
  }
})();
