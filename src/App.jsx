import { useEffect, useMemo, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDYf3BlHCmlCpNNNVREQbYsdBvrobjXJTo",
  authDomain: "album-mundial-1cbed.firebaseapp.com",
  projectId: "album-mundial-1cbed",
  storageBucket: "album-mundial-1cbed.firebasestorage.app",
  messagingSenderId: "19718687012",
  appId: "1:19718687012:web:d004f4b9e91253a6128bb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function AlbumTracker() {
  const figuritasFaltantesIniciales = useMemo(
    () => [
      1, 8, 11, 17, 19, 21, 24, 25, 28, 32, 34, 37, 39, 41, 44, 45, 46, 47,
      49, 53, 54, 55, 59, 64, 66, 67, 68, 70, 77, 80, 81, 84, 86, 88, 89,
      92, 93, 94, 96, 98, 105, 106, 107, 108, 110, 112, 115, 120, 123, 124,
      128, 130, 131, 133, 136, 137, 138, 139, 143, 148, 154, 155, 157, 158,
      163, 165, 166, 168, 169, 171, 176, 177, 180, 185, 188, 189, 193, 194,
      199, 202, 205, 206, 216, 222, 224, 227, 228, 229, 230, 233, 236, 240,
      243, 244, 250, 255, 269, 270, 272, 274, 275, 277, 280, 283, 286, 289,
      292, 294, 296, 299, 300, 303, 304, 305, 307, 308, 309, 310, 314, 318,
      325, 329, 330, 334, 336, 337, 340, 342, 347, 348, 350, 353, 354, 357,
      360, 361, 363, 364, 366, 368, 374, 375, 376, 379, 380, 381, 382, 383,
      387, 389, 391, 396, 400, 405, 411, 416, 423, 427, 428, 429, 430, 431,
      434, 436, 438, 441, 450, 452, 453, 454, 458, 463, 464, 467, 468, 469,
      470, 471, 473, 476, 477, 478, 480, 482, 484, 487, 491, 493, 501, 504,
      508, 510, 512, 515, 519, 521, 522, 523, 526, 527, 528, 530, 533, 534,
      537, 538, 540, 541, 543, 544, 545, 546, 547, 551, 552, 553, 557, 559,
      562, 563, 565, 568, 569, 570, 572, 573, 576, 578, 579, 580, 581, 582,
      584,
    ],
    []
  );

  const escudosEncontradosIniciales = useMemo(
    () => [
      'T-1',
      'T-2',
      'T-5',
      'T-7',
      'T-8',
      'T-10',
      'T-11',
      'T-12',
      'T-13',
      'T-15',
      'T-17',
      'T-20',
      'T-24',
      'T-25',
      'T-27',
      'T-28',
      'T-29',
      'T-31',
      'T-35',
      'T-37',
      'T-38',
      'T-39',
      'T-40',
      'T-41',
      'T-43',
      'T-45',
      'T-46',
      'T-47',
    ],
    []
  );

  const especialesFaltantesIniciales = useMemo(
    () => [
      'E-2',
      'E-3',
      'E-5',
      'E-7',
      'E-9',
      'E-11',
      'E-17',
      'E-18',
      'E-19',
      'E-22',
      'E-23',
      'E-25',
      'E-27',
      'E-28',
      'E-29',
      'E-32',
      'E-35',
      'E-36',
      'E-43',
      'E-49',
      'E-51',
      'E-53',
      'E-58',
      'E-62',
      'E-65',
      'E-67',
    ],
    []
  );

  const [figuritasFaltantes, setFiguritasFaltantes] = useState(
    new Set(figuritasFaltantesIniciales)
  );
  const [escudosEncontrados, setEscudosEncontrados] = useState(
    new Set(escudosEncontradosIniciales)
  );
  const [especialesFaltantes, setEspecialesFaltantes] = useState(
    new Set(especialesFaltantesIniciales)
  );

  useEffect(() => {
    const referencia = doc(db, 'albumes', 'mundial3reyes');

    const unsubscribe = onSnapshot(referencia, (snapshot) => {
      const data = snapshot.data();

      if (!data) {
        return;
      }

      if (Array.isArray(data.figuritasFaltantes)) {
        setFiguritasFaltantes(new Set(data.figuritasFaltantes));
      }

      if (Array.isArray(data.escudosEncontrados)) {
        setEscudosEncontrados(new Set(data.escudosEncontrados));
      }

      if (Array.isArray(data.especialesFaltantes)) {
        setEspecialesFaltantes(new Set(data.especialesFaltantes));
      }
    });

    return () => unsubscribe();
  }, []);

  const guardarCambios = async (
    nuevasFiguritas,
    nuevosEscudos,
    nuevosEspeciales
  ) => {
    await setDoc(doc(db, 'albumes', 'mundial3reyes'), {
      figuritasFaltantes: Array.from(nuevasFiguritas),
      escudosEncontrados: Array.from(nuevosEscudos),
      especialesFaltantes: Array.from(nuevosEspeciales),
      updatedAt: Date.now(),
    });
  };

  const toggleFigurita = async (numero) => {
    const nuevoSet = new Set(figuritasFaltantes);

    if (nuevoSet.has(numero)) {
      nuevoSet.delete(numero);
    } else {
      nuevoSet.add(numero);
    }

    setFiguritasFaltantes(nuevoSet);

    await guardarCambios(
      nuevoSet,
      escudosEncontrados,
      especialesFaltantes
    );
  };

  const toggleEscudo = async (codigo) => {
    const nuevoSet = new Set(escudosEncontrados);

    if (nuevoSet.has(codigo)) {
      nuevoSet.delete(codigo);
    } else {
      nuevoSet.add(codigo);
    }

    setEscudosEncontrados(nuevoSet);

    await guardarCambios(
      figuritasFaltantes,
      nuevoSet,
      especialesFaltantes
    );
  };

  const toggleEspecial = async (codigo) => {
    const nuevoSet = new Set(especialesFaltantes);

    if (nuevoSet.has(codigo)) {
      nuevoSet.delete(codigo);
    } else {
      nuevoSet.add(codigo);
    }

    setEspecialesFaltantes(nuevoSet);

    await guardarCambios(figuritasFaltantes, escudosEncontrados, nuevoSet);
  };

  const totalFiguritas = 584;
  const encontradasFiguritas =
    totalFiguritas - figuritasFaltantes.size;
  const porcentajeFiguritas = Math.round(
    (encontradasFiguritas / totalFiguritas) * 100
  );

  const totalEscudos = 48;
  const encontradosEscudos = escudosEncontrados.size;
  const faltantesEscudos = totalEscudos - encontradosEscudos;
  const porcentajeEscudos = Math.round(
    (encontradosEscudos / totalEscudos) * 100
  );

  const totalEspeciales = 67;
  const encontradosEspeciales =
    totalEspeciales - especialesFaltantes.size;
  const porcentajeEspeciales = Math.round(
    (encontradosEspeciales / totalEspeciales) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-3 md:p-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-5 md:p-8 mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-center mb-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Álbum Mundial 3 Reyes
          </h1>

          <p className="text-center text-slate-600 mb-4 text-sm md:text-base">
            Seguimiento completo del álbum
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-xs md:text-sm text-slate-600">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-semibold">Figurita encontrada</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="font-semibold">Figurita faltante</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="font-semibold">Escudo T encontrado</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="font-semibold">Especial E encontrado</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-4 shadow-lg text-white text-center">
              <p className="text-3xl font-black">
                {encontradasFiguritas}
              </p>
              <p className="font-semibold">Figuritas</p>
              <p className="text-xs opacity-90">Encontradas</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-4 shadow-lg text-white text-center">
              <p className="text-3xl font-black">
                {figuritasFaltantes.size}
              </p>
              <p className="font-semibold">Figuritas</p>
              <p className="text-xs opacity-90">Faltantes</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl p-4 shadow-lg text-white text-center">
              <p className="text-3xl font-black">
                {porcentajeFiguritas}%
              </p>
              <p className="font-semibold">Álbum</p>
              <p className="text-xs opacity-90">Completado</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-sky-700 rounded-3xl p-4 shadow-lg text-white text-center">
              <p className="text-3xl font-black">
                {encontradosEscudos}/{totalEscudos}
              </p>
              <p className="font-semibold">Escudos T</p>
              <p className="text-xs opacity-90">
                {faltantesEscudos} faltantes · {porcentajeEscudos}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-fuchsia-700 rounded-3xl p-4 shadow-lg text-white text-center col-span-2 md:col-span-1">
              <p className="text-3xl font-black">
                {encontradosEspeciales}/{totalEspeciales}
              </p>
              <p className="font-semibold">Especiales E</p>
              <p className="text-xs opacity-90">
                {especialesFaltantes.size} faltantes · {porcentajeEspeciales}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/70 p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-black text-emerald-700">
                Figuritas
              </h2>

              <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-bold text-sm md:text-base">
                {encontradasFiguritas}/{totalFiguritas}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
              {Array.from(
                { length: totalFiguritas },
                (_, index) => index + 1
              ).map((numero) => {
                const falta = figuritasFaltantes.has(numero);

                return (
                  <button
                    key={numero}
                    onClick={() => toggleFigurita(numero)}
                    className={`relative overflow-hidden rounded-2xl py-2.5 text-center font-black border text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 backdrop-blur-md before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity shadow-lg hover:shadow-2xl ${
                      falta
                        ? 'bg-gradient-to-br from-red-100 via-rose-100 to-red-200 text-red-700 border-red-300'
                        : 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-700 text-white border-emerald-700 shadow-emerald-300/50'
                    }`}
                  >
                    {numero}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/70 p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black text-cyan-700">
                  Escudos T
                </h2>

                <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-2xl font-bold text-sm">
                  {encontradosEscudos}/{totalEscudos}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-4 gap-3">
                {Array.from({ length: totalEscudos }, (_, index) => `T-${index + 1}`).map(
                  (codigo) => {
                    const encontrado = escudosEncontrados.has(codigo);

                    return (
                      <button
                        key={codigo}
                        onClick={() => toggleEscudo(codigo)}
                        className={`relative overflow-hidden rounded-2xl py-2.5 text-center font-black border text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 backdrop-blur-md before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity shadow-lg hover:shadow-2xl ${
                          encontrado
                            ? 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 text-white border-cyan-700 shadow-cyan-300/50'
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 border-slate-300'
                        }`}
                      >
                        {codigo}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/70 p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black text-purple-700">
                  Especiales E
                </h2>

                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl font-bold text-sm">
                  {encontradosEspeciales}/{totalEspeciales}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-4 gap-3">
                {Array.from(
                  { length: totalEspeciales },
                  (_, index) => `E-${index + 1}`
                ).map((codigo) => {
                  const falta = especialesFaltantes.has(codigo);

                  return (
                    <button
                      key={codigo}
                      onClick={() => toggleEspecial(codigo)}
                      className={`relative overflow-hidden rounded-2xl py-2.5 text-center font-black border text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 backdrop-blur-md before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity shadow-lg hover:shadow-2xl ${
                        falta
                          ? 'bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-200 text-amber-800 border-yellow-300'
                          : 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-fuchsia-700 text-white border-fuchsia-700 shadow-fuchsia-300/50'
                      }`}
                    >
                      {codigo}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="font-semibold">Figurita encontrada</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="font-semibold">Figurita faltante</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="font-semibold">Escudo T encontrado</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="font-semibold">Especial E encontrado</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-md">
            <span className="font-semibold text-slate-500">
              Sincronización en tiempo real activada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
