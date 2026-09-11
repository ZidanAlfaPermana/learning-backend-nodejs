import { IncomingMessage, ServerResponse } from 'http';
import * as handlers from './handlers';

export async function requestListener(req: IncomingMessage, res: ServerResponse){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }
    const host = req.headers.host || 'localhost';
    const parsedUrl = new URL(req.url || '', `http://${host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname === '/health' && method === 'GET') {
        return handlers.getHealth(req, res);
    }

    const jurnalIdMatch = pathname.match(/^\/jurnal\/(\d+)$/);

    if (jurnalIdMatch) {
        const id = parseInt(jurnalIdMatch[1], 10);
        if (method === 'GET') return handlers.getJurnalById(req, res, id);
        if (method === 'PUT') return handlers.updateJurnal(req, res, id);
        if (method === 'DELETE') return handlers.deleteJurnal(req, res, id);
    }

    if (pathname === '/jurnal') {
        if (method === 'GET') return handlers.getJurnals(req, res, parsedUrl);
        if (method === 'POST') return handlers.createJurnal(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint tidak ditemukan' }));
}