// SOAL 1
// Buat fungsi infoSistem(): void yang menampilkan:
// - Versi Node.js (process.version)
// - Platform OS (process.platform)
// - Direktori kerja saat ini (process.cwd())
// - Waktu uptime proses (process.uptime())
function infoSistem() {
    console.log(`Versi Node.js saat ini: ${process.version}`)
    console.log(`Platform OS saat ini: ${process.platform}`)
    console.log(`Direktori kerja saat ini: ${process.cwd()}`)
    console.log(`Waktu uptime proses: ${process.uptime()}`)
}

infoSistem();

// SOAL 2
// Buat program yang menerima argumen dari command line:
// npm run dev -- halo dunia
// Program menampilkan: "Argumen diterima: halo, dunia"
// Gunakan process.argv.slice(2)
function commandHalo() {
    const args = process.argv.slice(2);
    if (args.length > 0) {
        console.log(`Argumen diterima: ${args.join(", ")}`);
    }
}

commandHalo();

// SOAL 3 — Event loop
// Tulis kode yang menampilkan output persis urutan ini:
// "Pertama"
// "Kedua"
// "Ketiga (setelah 500ms)"
// "Keempat (setelah 1 detik)"
// Gunakan setTimeout dengan urutan penulisan yang TIDAK berurutan
// (buktikan bahwa urutan eksekusi ≠ urutan penulisan)
function Eloop() {
    setTimeout(() => {
        console.log("Ketiga");
    }, 500);
    console.log("Pertama");
    console.log("Kedua")
    setTimeout(() => {
        console.log("Keempat");
    }, 1000);
}
Eloop();