import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
    buscarConvitePorToken,
    confirmarPresencas,
    type Pessoa,
} from "./lib/pessoas";

export default function Rsvp({ token }: { token: string }) {
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [titular, setTitular] = useState<Pessoa | null>(null);
    const [acompanhantes, setAcompanhantes] = useState<Pessoa[]>([]);
    const [selecionados, setSelecionados] = useState<Record<string, boolean>>({});
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const convite = await buscarConvitePorToken(token);

                if (!convite) {
                    setErro(true);
                    return;
                }

                setTitular(convite.titular);
                setAcompanhantes(convite.acompanhantes);

                const inicial: Record<string, boolean> = {
                    [convite.titular.id]: convite.titular.confirmado ?? true,
                };
                convite.acompanhantes.forEach((a) => {
                    inicial[a.id] = a.confirmado ?? true;
                });
                setSelecionados(inicial);
            } catch {
                setErro(true);
            } finally {
                setCarregando(false);
            }
        })();
    }, [token]);

    const alternar = (id: string) => {
        setSelecionados((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const enviar = async () => {
        if (!titular) return;
        setEnviando(true);

        const confirmacoes = [titular, ...acompanhantes].map((p) => ({
            id: p.id,
            confirmado: !!selecionados[p.id],
        }));

        try {
            await confirmarPresencas(confirmacoes);
            setEnviado(true);
        } catch {
            setErro(true);
        } finally {
            setEnviando(false);
        }
    };

    if (carregando) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                Carregando convite...
            </div>
        );
    }

    if (erro || !titular) {
        return (
            <div className="flex h-screen items-center justify-center bg-black px-6 text-center text-white">
                Não encontramos seu convite. Verifique o link recebido.
            </div>
        );
    }

    if (enviado) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
                <FaCheckCircle className="text-5xl text-green-500" />
                <p className="text-2xl font-bold">Presença confirmada!</p>
                <p className="opacity-80">Nos vemos no aniversário do José Pedro 🎉</p>
            </div>
        );
    }

    const todos = [titular, ...acompanhantes];

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 py-12 text-center text-white">
            <h1 className="text-3xl font-extrabold">Confirmar Presença</h1>
            <p className="opacity-80">
                Olá, {titular.nome}! Marque quem vai comparecer:
            </p>

            <div className="flex w-full max-w-sm flex-col gap-3">
                {todos.map((pessoa) => (
                    <label
                        key={pessoa.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3"
                    >
                        <span>{pessoa.nome}</span>
                        <input
                            type="checkbox"
                            className="h-5 w-5"
                            checked={!!selecionados[pessoa.id]}
                            onChange={() => alternar(pessoa.id)}
                        />
                    </label>
                ))}
            </div>

            <button
                onClick={enviar}
                disabled={enviando}
                className="rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-bold text-black shadow-xl transition hover:scale-105 disabled:opacity-60"
            >
                {enviando ? "Enviando..." : "Confirmar"}
            </button>
        </div>
    );
}
