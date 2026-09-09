// SOAL 1
// Buat fungsi tunggu(ms: number): Promise<void>
// Buat fungsi hitungMundur(dari: number): Promise<void>
// yang menampilkan angka mundur dengan jeda 1 detik, lalu "Selesai!"
function tunggu(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hitungMundur(dari: number): Promise<void> {
    if (dari <= 0) {
        console.log("Value 'dari' harus lebih dari 0")
    }
    console.log(`Hitung Mundur dari ${dari}`);
    for (let from = dari; from >= 0; from--) {
        await tunggu(1000);
        console.log(from);
    }
    console.log("Hitung done");
}

// SOAL 2
// Buat fungsi simulasiAmbilPeserta(id: number): Promise<Peserta>
// - Jeda 500ms sebelum mengembalikan data
// - Jika id tidak ada di data dummy, reject dengan Error
interface Peserta {
    id?: number
    nama: string;
}

const pesertas: Peserta[] = [
    { id: 1, nama: "Peserta 1" },
    { id: 2, nama: "Peserta 2" },
    { id: 3, nama: "Peserta 3" }
];

function simulasiAmbilPeserta(id: number): Promise<Peserta> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const pesertaDitemukan = pesertas.find(p => p.id === id);
            if (pesertaDitemukan) {
                resolve(pesertaDitemukan);
            } else {
                reject(new Error(`ID ${id} tidak valid`));
            }
        }, 500);
    });
}

async function pakai(): Promise<void> {
    const data = await amanKan(simulasiAmbilPeserta(1));
    if (data.error) {
        console.error("error", data.error);
    } else {
        console.log(data);
    }

    const dataE = await amanKan(simulasiAmbilPeserta(0));
    if (dataE.error) {
        console.error("error", dataE.error);
    } else {
        console.log(dataE);
    }
}

// SOAL 3 — Sequential vs Parallel
// Buat fungsi ambilSemuaSequential(ids: number[]): Promise<Peserta[]>
// Buat fungsi ambilSemuaParallel(ids: number[]): Promise<Peserta[]>
// Ukur waktu eksekusi keduanya dengan console.time / console.timeEnd
// Tulis di komentar berapa selisih waktunya

async function ambilSemuaSequential(ids: number[]): Promise<Peserta[]> {
    let dataKumpulan: Peserta[] = [];
    for (const id of ids) {
        const peserta = await amanKan<Peserta>(simulasiAmbilPeserta(id));
        if (peserta.error) {
            console.log(peserta.error);
        } else {
            if (peserta.data !== null) {
                dataKumpulan.push(peserta.data);
            }
        }
    }
    return dataKumpulan;
}

async function ambilSemuaParallel(ids: number[]): Promise<Peserta[]> {
    const daftarPromise = ids.map(id => simulasiAmbilPeserta(id));
    const dataKumpulan = await amanKan(Promise.all(daftarPromise));
    if (dataKumpulan.error) {
        console.error("Error", dataKumpulan.error);
    } else {
        console.log("Berhasil", dataKumpulan.data);
    }
    return dataKumpulan.data || [];
}

async function runSoal3() {
    //paralel 503.164ms
    console.time("parallel")
    const parallel = await ambilSemuaParallel([1, 2]);
    console.timeEnd("parallel");
    console.log('Data lewat parallel:', parallel, '\n');

    //sequent 1.013s
    console.time("sequential")
    const sequential = await ambilSemuaSequential([1, 2]);
    console.timeEnd("sequential");
    console.log('Data lewat sequential:', sequential, '\n');
}


// SOAL 4 — Promise.allSettled
// Buat fungsi ambilDenganToleransi(ids: number[]): Promise<void>
// yang mengambil data beberapa peserta, dan tetap menampilkan
// hasil yang sukses meski ada beberapa id yang gagal
async function ambilDenganToleransi(ids: number[]): Promise<void> {
    const daftarPromise = ids.map(id => simulasiAmbilPeserta(id));
    const dataKumpulan = await Promise.allSettled(daftarPromise);
    dataKumpulan.forEach((daftar) => {
        if (daftar.status === "fulfilled") {
            console.log('Berhasil ambil data dengan id:', daftar.value)
        } else {
            console.log('Gagal ambil data dengan id. karena:', daftar.reason)
        }
    });
}

// SOAL 5 — Helper Hasil<T>
// Implementasikan type Hasil<T> dan fungsi amanKan<T>()
// Gunakan untuk membungkus semua pemanggilan simulasiAmbilPeserta
type HasilSukses<T> = { error: null; data: T };
type HasilGagal = { error: string; data: null };
type Hasil<T> = HasilSukses<T> | HasilGagal;

async function amanKan<T>(promise: Promise<T>): Promise<Hasil<T>> {
    try {
        const data = await promise;
        return { error: null, data: data };
    } catch (err) {
        const pesanError = err instanceof Error ? err.message : String(err);
        return { error: pesanError, data: null };
    }
}

async function main() {
    console.log("Soal 1:\n")
    await hitungMundur(5);
    await tunggu(2000);
    console.log("\nSoal 2:\n")
    await pakai();
    console.log("\nSoal 3:\n")
    await runSoal3();
    console.log("\nSoal 4:\n")
    await ambilDenganToleransi([0, 1, 2, 3, 4]);
}
main();