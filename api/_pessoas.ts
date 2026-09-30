import type { Pessoa } from "../src/lib/pessoas";

export function rowToPessoa(row: Record<string, unknown>): Pessoa {
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
