import fs from 'fs/promises';
import path from 'path';
import { Jurnal, CreateJurnalDTO, UpdateJurnalDTO } from '../types/jurnal.types';

const DATA_PATH = path.join(__dirname, '..', 'data', 'jurnal.json');
async function readData(): Promise<Jurnal[]> {
    try {
        const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
        if (!fileContent.trim()) {
            await writeData([]);
            return [];
        }
        return JSON.parse(fileContent) as Jurnal[];
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await writeData([]);
            return [];
        }
        throw error;
    }
}

const writeData = async (data: Jurnal[]): Promise<void> => {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAll(): Promise<Jurnal[]> {
    return await readData();
}

export async function getById(id: number): Promise<Jurnal | undefined> {
    const jurnals = await readData();
    return jurnals.find((j) => j.id === id);
}

export async function create(data: CreateJurnalDTO): Promise<Jurnal> {
    const jurnals = await readData();

    const maxId = jurnals.length > 0 ? Math.max(...jurnals.map((j) => j.id)) : 0;

    const newJurnal: Jurnal = {
        id: maxId + 1,
        ...data
    };

    jurnals.push(newJurnal);
    await writeData(jurnals);

    return newJurnal;
}

export async function update(id: number, data: UpdateJurnalDTO): Promise<Jurnal | null> {
    const jurnals = await readData();
    const index = jurnals.findIndex((j) => j.id === id);

    if (index === -1) {
        return null;
    }

    const updatedJurnal: Jurnal = {
        ...jurnals[index],
        ...data,
        id
    };

    jurnals[index] = updatedJurnal;
    await writeData(jurnals);

    return updatedJurnal;
}

export async function remove(id: number): Promise<boolean> {
    const jurnals = await readData();
    const index = jurnals.findIndex((j) => j.id === id);

    if (index === -1) {
        return false;
    }

    jurnals.splice(index, 1);
    await writeData(jurnals);

    return true;
}