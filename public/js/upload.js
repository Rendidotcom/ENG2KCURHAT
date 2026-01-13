document.getElementById("uploadBtn").onclick = async () => {
  const msg = document.getElementById("msg");
  const foto = document.getElementById("foto").files[0];

  if (!foto) {
    msg.textContent = "❌ Pilih file dulu";
    return;
  }

  msg.textContent = "⏳ Uploading...";

  const base64 = await toBase64(foto);

  const payload = new URLSearchParams();
  payload.append("curhat", "[UPLOAD_ONLY]");
  payload.append("photoBase64", base64);
  payload.append("photoName", foto.name);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: payload
    });

    const json = await res.json();

    if (json.ok) {
      msg.textContent = "✅ Upload foto berhasil";
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
