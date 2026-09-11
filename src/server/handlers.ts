import { IncomingMessage, ServerResponse } from 'http';
import { CreateJurnalDTO, UpdateJurnalDTO } from '../types/jurnal.types';
import * as JurnalService from '../services/jurnal.service';

const parseBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
};

function sendJson(res: ServerResponse, statusCode: number, data: any) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export async function getHealth(req: IncomingMessage, res: ServerResponse) {
    sendJson(res, 200, {
        status: 'ok',
        uptime: Math.floor(process.uptime())
    });
}

export async function getJurnals(req: IncomingMessage, res: ServerResponse, parsedUrl: URL) {
    try {
        const pesertaIdParams = parsedUrl.searchParams.get('peserta');
        let jurnals = await JurnalService.getAll();
        if (pesertaIdParams) {
            const pesertaId = parseInt(pesertaIdParams, 10);
            jurnals = jurnals.filter(j => j.pesertaId === pesertaId);
        }
        sendJson(res, 200, { data: jurnals });
    } catch (error) {
        sendJson(res, 500, { error: 'Internal Server Error' });
    }
}

export async function getJurnalById(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const jurnal = await JurnalService.getById(id);
        if (!jurnal) {
            return sendJson(res, 404, { error: 'Jurnal tidak ditemukan' });
        }
        sendJson(res, 200, { data: jurnal });
    } catch (error) {
        sendJson(res, 500, { error: 'Internal Server Error' });
    }
}

export async function createJurnal(req: IncomingMessage, res: ServerResponse) {
    try {
        const body: CreateJurnalDTO = await parseBody(req);
        if (!body.kegiatan || body.kegiatan.length < 10) {
            return sendJson(res, 400, { error: 'Kegiatan harus diisi dan minimal 10 karakter' });
        }

        const newJurnal = await JurnalService.create(body);
        sendJson(res, 201, { message: 'Jurnal berhasil ditambahkan', data: newJurnal });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return sendJson(res, 400, { error: 'Format JSON tidak valid' });
        }
        sendJson(res, 500, { error: 'Internal Server Error' });
    }
}

export async function updateJurnal(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const body: UpdateJurnalDTO = await parseBody(req);
        if (body.kegiatan && body.kegiatan.length < 10) {
            return sendJson(res, 400, { error: 'Kegiatan minimal 10 karakter' });
        }

        const updatedJurnal = await JurnalService.update(id, body);
        if (!updatedJurnal) {
            return sendJson(res, 404, { error: 'Jurnal tidak ditemukan' });
        }

        sendJson(res, 200, { message: 'Jurnal berhasil diupdate', data: updatedJurnal });
    } catch (error) {
        sendJson(res, 500, { error: 'Internal Server Error' });
    }
}

export async function deleteJurnal(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const isDeleted = await JurnalService.remove(id);
        if (!isDeleted) {
            return sendJson(res, 404, { error: 'Jurnal tidak ditemukan' });
        }

        // 204 No Content tidak mengirimkan body response
        res.writeHead(204);
        res.end();
    } catch (error) {
        sendJson(res, 500, { error: 'Internal Server Error' });
    }
}