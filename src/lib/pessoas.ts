export type Pessoa = {
    id: string;
    nome: string;
    whatsapp: string | null;
    responsavelId: string | null;
    token: string | null;
    confirmado: boolean | null;
};

export async function buscarConvitePorToken(token: string) {
    const res = await fetch(`/api/convite?token=${encodeURIComponent(token)}`);

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Falha ao buscar convite");

    return (await res.json()) as { titular: Pessoa; acompanhantes: Pessoa[] };
}

export async function confirmarPresencas(
    token: string,
    confirmacoes: { id: string; confirmado: boolean }[]
) {
    const res = await fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, confirmacoes }),
    });

    if (!res.ok) throw new Error("Falha ao confirmar presença");
}
