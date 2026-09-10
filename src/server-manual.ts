import http from "http";

const PORT: number = 3000;

type Peserta = {
    id: number;
    nama: string;
    sekolah: string;
}

const peserta: Peserta[] = [
    { id: 1, nama: "Budi", sekolah: "SMKN5" },
    { id: 2, nama: "Ajeng", sekolah: "SMKN6" },
    { id: 3, nama: "Zidan", sekolah: "SMKN5" },
    { id: 4, nama: "Saida", sekolah: "SMKN6" },
    { id: 5, nama: "Linda", sekolah: "SMKN5" },
];

// Buat HTTP server tanpa framework dengan route berikut:

// SOAL 1
// GET  /              → { pesan: "API Peserta Magang Batch 4" }
// GET  /health        → { status: "ok", uptime: <detik> }

// SOAL 2
// GET  /peserta       → daftar semua peserta (array)
// GET  /peserta/:id   → satu peserta berdasarkan id
//                       404 jika tidak ditemukan

// SOAL 3
// GET  /peserta?sekolah=SMK5  → filter berdasarkan query string

// SOAL 4
// POST /peserta       → tambah peserta baru dari body JSON
//                       201 jika sukses
//                       400 jika body tidak valid (nama kosong)

// SOAL 5
// DELETE /peserta/:id → hapus peserta
//                       204 jika sukses
//                       404 jika tidak ditemukan

// Semua route yang tidak dikenal → 404 dengan pesan yang jelas
// Data disimpan di array dalam memori (belum pakai database)
const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;
    const searchParams = url.searchParams;

    // Routing manual — inilah yang Express permudah
    if (method === "GET" && path === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ pesan: "API Peserta Magang Batch 4" }));
        return;
    }

    if (method === "GET" && path === "/health") {
        const health = [
            {
                status: "ok",
                uptime: `${Math.floor(process.uptime())} Detik`
            },
        ];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(health));
        return;
    }

    //soal2 yang 1 dan soal 3 saya gabung untuk simplified code
    if (method === "GET" && path === "/peserta") {
        if (searchParams.has("sekolah")) {
            const query = searchParams.get("sekolah");
            const data = peserta.filter(peserta => peserta.sekolah === query);
            if (data.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ "data": [], "message": `Data Peserta dengan sekolah ${query}, tidak ditemukan`}));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ "data": data, "message": `Data Peserta dengan sekolah ${query}, ditemukan` }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({"data": peserta, "message": "Data Peserta ditemukan"}));
        return;
    }

    if (method === "GET" && path.startsWith("/peserta/")) {
        const id = Number(path.split("/")[2]);
        const data = peserta.find(item => item.id === id );
        if (data === undefined ) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ "data": [], "message": `Data Peserta dengan id ${id}, tidak ditemukan`}));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ "data": data, "message": `Data Peserta dengan id ${id}, ditemukan` }));
        return;
    }

    if (method === "POST" && path === "/peserta") {
        let body = "";

        // Body datang dalam potongan (chunk), harus dikumpulkan dulu
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                console.log("Data diterima:", data);
                if (data['id'] === undefined && data['nama'] === undefined && data['sekolah'] === undefined) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "JSON tidak valid, Harus berisi id, nama, dan sekolah" }));
                }
                peserta.push(data)
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ sukses: true, data }));
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "JSON tidak valid" }));
            }
        });
        return;
    }

    if (method === "DELETE" && path.startsWith("/peserta/")) {
        const id = Number(path.split("/")[2]);
        const data = peserta.findIndex(item => item.id === id);
        if (data <= -1 ) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ "data": [], "message": `Data Peserta dengan id ${id}, tidak ditemukan`}));
            return;
        }
        peserta.splice(data, 1);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ "data": [], "message": `Data Peserta dengan id ${id}, berhasil dihapus` }));
        return;
    }

    // 404 — tidak ada route yang cocok
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route tidak ditemukan" }));
});

server.listen(PORT, () => console.log(`Server di port ${PORT}`));