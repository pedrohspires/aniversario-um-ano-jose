import type { IncomingMessage, ServerResponse } from "node:http";
import { db } from "./_db.js";
import { rowToPessoa } from "./_pessoas.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "token obrigatório" }));
        return;
    }

    const result = await db.execute({
        sql: "SELECT * FROM pessoas WHERE token = ?",
        args: [token],
    });

    if (result.rows.length === 0) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "convite não encontrado" }));
        return;
    }

    const titular = rowToPessoa(result.rows[0] as unknown as Record<string, unknown>);

    const acompanhantesResult = await db.execute({
        sql: "SELECT * FROM pessoas WHERE responsavel_id = ? ORDER BY nome",
        args: [titular.id],
    });

    const acompanhantes = acompanhantesResult.rows.map((row) =>
        rowToPessoa(row as unknown as Record<string, unknown>)
    );

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ titular, acompanhantes }));
}
