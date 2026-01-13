document.getElementById("submitBtn").onclick = async () => {
  const msg = document.getElementById("msg");
  const curhat = document.getElementById("curhat").value.trim();
  const foto = document.getElementById("foto").files[0];

  if (!curhat) {
    msg.textContent = "❌ Curhat tidak boleh kosong";
    return;
  }

  msg.textContent = "⏳ Mengirim...";

  let photoBase64 = "";
  let photoName = "";

  if (foto) {
    photoName = foto.name;
    photoBase64 = await toBase64(foto);
  }

  const payload = new URLSearchParams();
  payload.append("curhat", curhat);
  payload.append("photoBase64", photoBase64);
  payload.append("photoName", photoName);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: payload
    });

    const json = await res.json();

    if (json.ok) {
      msg.textContent = "✅ Curhat & foto terkirim";
      document.getElementById("curhat").value = "";
      document.getElementById("foto").value = "";
    } else {
      msg.textContent = "❌ Gagal: " + json.error;
    }
  } catch (err) {
    msg.textContent = "❌ Error: " + err.message;
  }
};

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
