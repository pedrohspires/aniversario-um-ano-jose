import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaGift, FaMapMarkerAlt, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Presentes from "./Presentes";
import { buscarConvitePorToken } from "./lib/pessoas";

type Acesso = "carregando" | "liberado" | "encerrado" | "erro";

export default function App() {
  const tokenDaUrl = new URLSearchParams(window.location.search).get("token");

  const [acesso, setAcesso] = useState<Acesso>(
    tokenDaUrl ? "carregando" : "encerrado"
  );
  const [presentesAberto, setPresentesAberto] = useState(false);
  const [somAtivo, setSomAtivo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!tokenDaUrl) return;

    (async () => {
      try {
        const convite = await buscarConvitePorToken(tokenDaUrl);
        const algumConfirmado =
          convite &&
          [convite.titular, ...convite.acompanhantes].some(
            (p) => p.confirmado === true
          );
        setAcesso(algumConfirmado ? "liberado" : "encerrado");
      } catch {
        setAcesso("erro");
      }
    })();
  }, [tokenDaUrl]);

  const abrirLocal = () => {
    window.open(
      "https://maps.app.goo.gl/HDVFE1CTMshLkwgc6",
      "_blank"
    );
  };

  const alternarSom = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = somAtivo;
    setSomAtivo(!somAtivo);
  };

  if (acesso !== "liberado") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-900 px-6 text-center text-white">
        {acesso === "carregando" && <p>Carregando...</p>}
        {acesso === "erro" && (
          <p className="max-w-md text-lg">
            Não foi possível carregar o convite. Tente novamente em instantes.
          </p>
        )}
        {acesso === "encerrado" && (
          <div>
            <h1 className="mb-3 text-3xl font-extrabold">
              A confirmação de presença foi encerrada
            </h1>
            <p className="max-w-md opacity-80">
              As informações do aniversário estão disponíveis apenas para quem
              confirmou presença.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <button
        onClick={alternarSom}
        className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-lg transition hover:scale-110"
        aria-label={somAtivo ? "Desativar som" : "Ativar som"}
      >
        {somAtivo ? <FaVolumeUp /> : <FaVolumeMute />}
      </button>

      {/* Conteúdo */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-4 text-5xl font-extrabold drop-shadow-lg"
        >
          José Pedro faz 1 aninho 🐮
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 max-w-md text-lg"
        >
          Venha comemorar conosco um dia cheio de diversão na
          Fazendinha do José!
        </motion.p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={abrirLocal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-bold text-black shadow-xl transition hover:scale-105 sm:w-64"
          >
            <FaMapMarkerAlt />
            Ver Local
          </button>

          <button
            onClick={() => setPresentesAberto(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 sm:w-64"
          >
            <FaGift />
            Sugestão de Presentes
          </button>
        </div>

        <div className="mt-10 text-sm opacity-90">
          <p>📅 7 de Novembro • 17:30</p>
          <p>📍 Av.principal do conviver com  Rua Francisco Enéas rocha, Nº 47</p>
          <p>🏊 Banho de piscina entre 09 e 15 horas. Traga sua roupa de banho</p>
          <p>⚠️ Obs: não haverá almoço no horário aberto para banho</p>
        </div>
      </div>

      {presentesAberto && (
        <Presentes onFechar={() => setPresentesAberto(false)} />
      )}
    </div>
  );
}
