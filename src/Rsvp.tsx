import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import {
    buscarConvitePorToken,
    confirmarPresencas,
    type Pessoa,
} from "./lib/pessoas";

export default function Rsvp({
    token,
    onFechar,
}: {
    token: string;
    onFechar: () => void;
}) {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-black/90 p-6 text-center text-white shadow-2xl">
                <button
                    onClick={onFechar}
                    aria-label="Fechar"
                    className="absolute right-4 top-4 text-white/70 hover:text-white"
                >
                    <FaTimes size={20} />
                </button>

                {carregando && <p className="py-10">Carregando convite...</p>}

                {!carregando && (erro || !titular) && (
                    <p className="py-10">
                        Não encontramos seu convite. Verifique o link recebido.
                    </p>
                )}

                {!carregando && !erro && titular && enviado && (
                    <div className="flex flex-col items-center gap-4 py-10">
                        <FaCheckCircle className="text-5xl text-green-500" />
                        <p className="text-2xl font-bold">Presença confirmada!</p>
                        <p className="opacity-80">
                            Nos vemos no aniversário do José Pedro 🎉
                        </p>
                    </div>
                )}

                {!carregando && !erro && titular && !enviado && (
                    <>
                        <h1 className="mb-2 text-2xl font-extrabold">
                            Confirmar Presença
                        </h1>
                        <p className="mb-6 opacity-80">
                            Olá, {titular.nome}! Marque quem vai comparecer:
                        </p>

                        <div className="mb-6 flex flex-col gap-3">
                            {[titular, ...acompanhantes].map((pessoa) => (
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
                            className="w-full rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-bold text-black shadow-xl transition hover:scale-105 disabled:opacity-60"
                        >
                            {enviando ? "Enviando..." : "Confirmar"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
