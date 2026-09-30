import type { IncomingMessage, ServerResponse } from "node:http";
import { db } from "./_db";

type Confirmacao = { id: string; confirmado: boolean };

async function lerCorpoJson(req: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf-8");
    return raw ? JSON.parse(raw) : {};
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "POST") {
        res.statusCode = 405;
        res.end();
        return;
    }

    const body = (await lerCorpoJson(req)) as {
        token?: string;
        confirmacoes?: Confirmacao[];
    };

    const { token, confirmacoes } = body;

    if (!token || !Array.isArray(confirmacoes) || confirmacoes.length === 0) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "dados inválidos" }));
        return;
    }

    const titularResult = await db.execute({
        sql: "SELECT id FROM pessoas WHERE token = ?",
        args: [token],
    });

    if (titularResult.rows.length === 0) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "convite não encontrado" }));
        return;
    }

    const titularId = titularResult.rows[0].id as string;

    const acompanhantesResult = await db.execute({
        sql: "SELECT id FROM pessoas WHERE responsavel_id = ?",
        args: [titularId],
    });

    const idsPermitidos = new Set<string>([
        titularId,
        ...acompanhantesResult.rows.map((row) => row.id as string),
    ]);

    const temIdForaDoConvite = confirmacoes.some((c) => !idsPermitidos.has(c.id));
    if (temIdForaDoConvite) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "id fora do convite" }));
        return;
    }

    for (const { id, confirmado } of confirmacoes) {
        await db.execute({
            sql: "UPDATE pessoas SET confirmado = ? WHERE id = ?",
            args: [confirmado ? 1 : 0, id],
        });
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
}
