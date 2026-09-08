import fss from 'fs/promises'
import fs from 'fs'
import path from "path";
import os from "os";

// SOAL 1 — Path
// Buat fungsi analisisPath(filePath: string): void
// yang menampilkan: nama file, ekstensi, folder induk, dan path absolut
function analisisPath(filePath: string) {
    console.log(`Nama file: ${path.basename(filePath, path.extname(filePath))}`);
    console.log(`Folder induk: ${path.dirname(filePath)}`);
    console.log(`Path absolut: ${path.resolve(filePath)}`);
    console.log(`Ext: ${path.extname(filePath)}`);
}


// SOAL 2 — Tulis & baca file
// Buat fungsi async simpanLog(pesan: string): Promise<void>
// yang menambahkan baris ke file logs/app.log dengan format:
// [2026-09-07 10:30:15] pesan
// Buat folder logs otomatis jika belum ada
async function simpanLog(pesan: string) {
    const logFile = path.join(__dirname, "..", "logs", "app.log");
    const logDir = path.dirname(logFile);
    const now = new Date().toLocaleString('id-ID').replace(/\/|\./g, (match) => {
        return match === '/' ? '-' : ':';
    });
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
        console.log(`Folder logs berhasil dibuat! ${logDir}`);
    }
    fs.appendFileSync(logFile, `[${now.replaceAll('/', '-')}] ${pesan}\n`, "utf-8");
    console.log(`logs berhasil dibuat! ${logDir}`);
}


// SOAL 3 — Baca folder
// Buat fungsi async daftarFile(folder: string): Promise<void>
// yang menampilkan semua file dalam folder beserta ukurannya dalam KB
// Format output:
//   tasks.json      2.45 KB
//   config.json     0.89 KB
async function daftarFile(folder: string) {
    try {
        const isiFolder = await fss.readdir(folder);
        for (const namaFile of isiFolder) {
            const filePath = path.join(folder, namaFile);
            const stat = await fss.stat(filePath);
            if (stat.isFile()) {
                const sizeKB = (stat.size / 1024).toFixed(2);
                console.log(`${namaFile.padEnd(20)} ${sizeKB} KB`);
            }
        }
    } catch (error) {
        console.error(`Gagal membaca folder ${folder}:`, error);
    }
}

// SOAL 4 — JSON typed
// Buat interface Task (id, judul, selesai)
// Buat fungsi generic bacaJSON<T>(path: string): Promise<T>
// Buat fungsi generic tulisJSON<T>(path: string, data: T): Promise<void>
// Test dengan menulis 3 task ke file, lalu membacanya kembali
interface Task {
    id: number;
    judul: string;
    selesai: boolean;
}

async function tulisJSON<T>(filePath: string, data: T): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    await fss.writeFile(filePath, jsonString, "utf-8");
}

async function bacaJSON<T>(filePath: string): Promise<T> {
    const data = await fss.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
}

async function jalankanTest() {
    await daftarFile(__dirname);
    console.log("\n");

    console.log("SOAL 4");
    const daftarTask: Task[] = [
        { id: 1, judul: "Belajar Node.js FS", selesai: true },
        { id: 2, judul: "Mengerjakan Soal Latihan", selesai: false },
        { id: 3, judul: "Push ke GitHub", selesai: false }
    ];

    const jsonPath = path.join(__dirname, "..", "tasks.json");

    await tulisJSON(jsonPath, daftarTask);
    console.log("Berhasil menulis 3 task ke tasks.json");

    const taskDibaca = await bacaJSON<Task[]>(jsonPath);
    console.log("Hasil baca tasks.json:", taskDibaca);
    console.log("\n");
}

// SOAL 5 — Info sistem
// Buat fungsi laporanSistem(): string yang mengembalikan ringkasan
// informasi sistem dalam format tabel teks yang rapi
function laporanSistem(): string {
    const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const ramFree = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

    return `
+-------------------+-----------------------------------+
| Sistem Operasi    | ${os.type()} ${os.release()}
| Arsitektur        | ${os.arch()}
| Model CPU         | ${os.cpus()[0].model}
| Total RAM         | ${ramTotal} GB
| Sisa RAM          | ${ramFree} GB
+-------------------+-----------------------------------+`;
}

async function main() {
    console.log("HASIL SOAL 1");
    analisisPath("src/index.ts");
    console.log("\n");

    console.log("HASIL SOAL 2");
    await simpanLog("Halo");
    console.log("\n");

    console.log("HASIL SOAL 3");
    await daftarFile(__dirname);
    console.log("\n");

    console.log("HASIL SOAL 4");
    const daftarTask: Task[] = [
        { id: 1, judul: "Belajar Node.js FS", selesai: true },
        { id: 2, judul: "Mengerjakan Soal Latihan", selesai: false },
        { id: 3, judul: "Push ke GitHub", selesai: false }
    ];
    const jsonPath = path.join(__dirname, "..", "tasks.json");

    await tulisJSON(jsonPath, daftarTask);
    console.log("Berhasil menulis 3 task ke tasks.json");

    const taskDibaca = await bacaJSON<Task[]>(jsonPath);
    console.log("Hasil baca tasks.json:", taskDibaca);
    console.log("\n");

    console.log("HASIL SOAL 5");
    console.log(laporanSistem());
}
main();