import { db } from "./db";

export type Pessoa = {
    id: string;
    nome: string;
    whatsapp: string | null;
    responsavelId: string | null;
    token: string | null;
    confirmado: boolean | null;
};

function rowToPessoa(row: Record<string, unknown>): Pessoa {
    return {
        id: row.id as string,
        nome: row.nome as string,
        whatsapp: (row.whatsapp as string | null) ?? null,
        responsavelId: (row.responsavel_id as string | null) ?? null,
        token: (row.token as string | null) ?? null,
        confirmado:
            row.confirmado === null || row.confirmado === undefined
                ? null
                : Boolean(row.confirmado),
    };
}

export async function buscarConvitePorToken(token: string) {
    const result = await db.execute({
        sql: "SELECT * FROM pessoas WHERE token = ?",
        args: [token],
    });

    if (result.rows.length === 0) return null;

    const titular = rowToPessoa(result.rows[0]);

    const acompanhantesResult = await db.execute({
        sql: "SELECT * FROM pessoas WHERE responsavel_id = ? ORDER BY nome",
        args: [titular.id],
    });

    const acompanhantes = acompanhantesResult.rows.map(rowToPessoa);

    return { titular, acompanhantes };
}

export async function confirmarPresencas(
    confirmacoes: { id: string; confirmado: boolean }[]
) {
    for (const { id, confirmado } of confirmacoes) {
        await db.execute({
            sql: "UPDATE pessoas SET confirmado = ? WHERE id = ?",
            args: [confirmado ? 1 : 0, id],
        });
    }
}
