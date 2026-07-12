import { useState } from "react";
import { FaCopy, FaGift, FaShoePrints, FaTimes, FaTshirt } from "react-icons/fa";

const PIX_CHAVE = "aniversario.josepedro@pix.com";

export default function Presentes({ onFechar }: { onFechar: () => void }) {
    const [copiado, setCopiado] = useState(false);

    const copiarPix = async () => {
        try {
            await navigator.clipboard.writeText(PIX_CHAVE);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch {
            // ignora falha de clipboard
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

                <h1 className="mb-2 text-2xl font-extrabold">Sugestões de presente</h1>
                <p className="mb-6 opacity-80">
                    Sua presença já é o maior presente, mas se quiser mimar o José Pedro:
                </p>

                <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                        <FaShoePrints className="mt-1 shrink-0 text-yellow-400" />
                        <div>
                            <p className="font-semibold">Calçado</p>
                            <p className="opacity-80">Tamanho 16</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                        <FaTshirt className="mt-1 shrink-0 text-yellow-400" />
                        <div>
                            <p className="font-semibold">Roupa</p>
                            <p className="opacity-80">Tamanho 2 anos</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 rounded-xl bg-white/10 p-4">
                        <div className="flex items-center gap-3 self-start">
                            <FaGift className="shrink-0 text-yellow-400" />
                            <div>
                                <p className="font-semibold">Pix</p>
                                <p className="opacity-80">No valor que seu coração mandar</p>
                            </div>
                        </div>

                        <div className="mt-2 rounded-lg bg-white p-3">
                            <QrCodeMock />
                        </div>

                        <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-black/40 px-3 py-2">
                            <code className="truncate text-sm">{PIX_CHAVE}</code>
                            <button
                                onClick={copiarPix}
                                className="flex shrink-0 items-center gap-1 rounded-md bg-yellow-400 px-2 py-1 text-xs font-bold text-black"
                            >
                                <FaCopy /> {copiado ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QrCodeMock() {
    const tamanho = 9;
    const seed = 42;
    let estado = seed;
    const pseudoRandom = () => {
        estado = (estado * 1103515245 + 12345) % 2147483648;
        return estado / 2147483648;
    };

    const celulas = Array.from({ length: tamanho * tamanho }, () => pseudoRandom() > 0.5);

    return (
        <svg
            viewBox={`0 0 ${tamanho} ${tamanho}`}
            width={140}
            height={140}
            role="img"
            aria-label="QR code (ilustrativo) para pagamento via Pix"
        >
            <rect width={tamanho} height={tamanho} fill="#fff" />
            {celulas.map((preenchido, i) => {
                if (!preenchido) return null;
                const x = i % tamanho;
                const y = Math.floor(i / tamanho);
                return <rect key={i} x={x} y={y} width={1} height={1} fill="#000" />;
            })}
            {[
                [0, 0],
                [tamanho - 3, 0],
                [0, tamanho - 3],
            ].map(([bx, by]) => (
                <g key={`${bx}-${by}`}>
                    <rect x={bx} y={by} width={3} height={3} fill="#000" />
                    <rect x={bx + 0.6} y={by + 0.6} width={1.8} height={1.8} fill="#fff" />
                </g>
            ))}
        </svg>
    );
}
