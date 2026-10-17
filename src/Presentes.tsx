import { useState } from "react";
import { FaCopy, FaGift, FaPuzzlePiece, FaShoePrints, FaTimes, FaTshirt } from "react-icons/fa";

const PIX_CHAVE = "7a559576-e68f-4aa5-9280-13f8fb611cc3";

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
            <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-black/90 p-6 text-center text-white shadow-2xl md:max-w-4xl">
                <button
                    onClick={onFechar}
                    aria-label="Fechar"
                    className="absolute right-4 top-4 text-white/70 hover:text-white"
                >
                    <FaTimes size={20} />
                </button>

                <h1 className="mb-2 text-2xl font-extrabold">Sugestões de presente</h1>
                <p className="mb-6 opacity-80">
                    Segue abaixo sugestões de presentes para o José Pedro.
                </p>

                <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                            <FaShoePrints className="mt-1 shrink-0 text-yellow-400" />
                            <div>
                                <p className="font-semibold">Calçado</p>
                                <p className="opacity-80">A partir do número 20</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                            <FaTshirt className="mt-1 shrink-0 text-yellow-400" />
                            <div>
                                <p className="font-semibold">Roupa</p>
                                <p className="opacity-80">Tamanho 3 a 4 anos</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                            <FaPuzzlePiece className="mt-1 shrink-0 text-yellow-400" />
                            <div>
                                <p className="font-semibold">Brinquedos</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 rounded-xl bg-white/10 p-4 md:col-span-2">
                        <div className="flex items-center gap-3 self-start">
                            <FaGift className="shrink-0 text-yellow-400" />
                            <div>
                                <p className="font-semibold">Pix</p>
                                <p className="opacity-80">No valor que seu coração mandar</p>
                            </div>
                        </div>

                        <div className="mt-2 rounded-lg bg-white p-3">
                            <img
                                src="/qrcode-pix.png"
                                alt="QR code para pagamento via Pix"
                                width={200}
                                height={200}
                            />
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
