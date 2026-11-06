import React, { useState } from 'react';
import { 
  Dumbbell, 
  Activity, 
  User, 
  Plus, 
  Play, 
  CheckCircle2, 
  ShieldAlert, 
  Target, 
  Search, 
  Trash2,
  Edit3,
  Video,
  Info,
  Layers
} from 'lucide-react';

const initialExerciseDB = [
  {
    id: 'ex-1',
    name: 'Supino Reto com Barra',
    category: 'Hipertrofia',
    targetMuscle: 'Peitoral Maior, Tríceps, Deltoide Anterior',
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    execution: 'Deite-se no banco, aduza e deprima as escápulas. Mantenha os pés firmes no chão. Desça a barra de forma controlada até a linha do esterno e empurre com explosão controlada.',
    safety: 'Evite hiperestender os punhos. Mantenha o cotovelo levemente alinhado a ~45°-60° do tronco para proteger a articulação glenoumeral.',
    level: 'Intermediário',
    rehabFocus: false
  },
  {
    id: 'ex-2',
    name: 'Agachamento Livre com Barra',
    category: 'Hipertrofia',
    targetMuscle: 'Quadríceps, Glúteo Máximo, Eretores da Espinha',
    videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
    execution: 'Pés na largura dos ombros, escápulas travadas. Inicie o movimento projetando o quadril para trás e flexionando joelhos simultaneamente até passar da linha paralela.',
    safety: 'Não desfaça o travamento abdominal (bracing). Evite o valgo dinâmico dos joelhos durante a subida.',
    level: 'Avançado',
    rehabFocus: false
  },
  {
    id: 'ex-3',
    name: 'Rotação Externa de Ombro com TheraBand',
    category: 'Reabilitação',
    targetMuscle: 'Manguito Rotador (Infraspinhal, Redondo Menor)',
    videoUrl: 'https://www.youtube.com/embed/P6MMD5Lfn3U',
    execution: 'Mantenha o cotovelo fletido a 90° e colado junto ao tronco. Realize a rotação externa lenta e retorne no mesmo ritmo.',
    safety: 'Não utilize impulso do tronco nem afaste o cotovelo do corpo. Carga leve priorizando o tempo sob tensão.',
    level: 'Iniciante / Reab',
    rehabFocus: true
  },
  {
    id: 'ex-4',
    name: 'Mobilidade Thorácica no Rolo (Foam Roller)',
    category: 'Mobilidade',
    targetMuscle: 'Coluna Torácica, Postura',
    videoUrl: 'https://www.youtube.com/embed/2Yl_uB6o0jM',
    execution: 'Posicione o rolo sob a região média das costas, entrelace as mãos atrás da cabeça para suportar o pescoço. Estenda a coluna suavemente sobre o rolo respirando fundo.',
    safety: 'Não apoie o rolo na coluna lombar nem na cervical.',
    level: 'Todos os níveis',
    rehabFocus: true
  }
];

const initialWorkouts = [
  {
    id: 'w-1',
    studentId: 'st-101',
    studentName: 'Lucas Andrade',
    title: 'Treino A - Peitoral, Ombro & Reab Manguito',
    goal: 'Hipertrofia & Prevenção de Lesão',
    dateCreated: '2026-11-01',
    exercises: [
      {
        exerciseId: 'ex-3',
        name: 'Rotação Externa de Ombro com TheraBand',
        sets: 3,
        reps: '15',
        rest: '45s',
        weight: 'Elástico Verde',
        rpe: '6-7',
        notes: 'Aquecimento articular e ativação pré-treino.'
      },
      {
        exerciseId: 'ex-1',
        name: 'Supino Reto com Barra',
        sets: 4,
        reps: '8-10',
        rest: '90s',
        weight: '70kg',
        rpe: '8-9',
        notes: 'Pausa de 1 segundo no peito antes da subida.'
      }
    ]
  }
];

export default function App() {
  const [role, setRole] = useState('trainer');
  const [activeTab, setActiveTab] = useState('workouts');
  const [exerciseDb, setExerciseDb] = useState(initialExerciseDB);
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState(initialWorkouts[0]);
  const [exerciseModal, setExerciseModal] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newWorkoutGoal, setNewWorkoutGoal] = useState('Hipertrofia');
  const [builderExercises, setBuilderExercises] = useState([]);
  const [loggedSets, setLoggedSets] = useState({});

  const handleToggleSetLog = (workoutId, exIndex, setIndex) => {
    const key = `${workoutId}-${exIndex}-${setIndex}`;
    setLoggedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddExerciseToBuilder = (ex) => {
    const newItem = {
      exerciseId: ex.id,
      name: ex.name,
      sets: 3,
      reps: '10-12',
      rest: '60s',
      weight: '10kg',
      rpe: '8',
      notes: ''
    };
    setBuilderExercises([...builderExercises, newItem]);
  };

  const handleSaveWorkout = () => {
    if (!newWorkoutTitle || builderExercises.length === 0) {
      alert('Por favor, preencha o título do treino e adicione ao menos 1 exercício.');
      return;
    }

    const newWk = {
      id: `w-${Date.now()}`,
      studentId: 'st-custom',
      studentName: newStudentName || 'Aluno Demonstrativo',
      title: newWorkoutTitle,
      goal: newWorkoutGoal,
      dateCreated: new Date().toISOString().split('T')[0],
      exercises: builderExercises
    };

    setWorkouts([newWk, ...workouts]);
    setSelectedWorkout(newWk);
    setNewWorkoutTitle('');
    setNewStudentName('');
    setBuilderExercises([]);
    setActiveTab('workouts');
  };

  const filteredExercises = exerciseDb.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.targetMuscle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-red-600 to-amber-500 p-2.5 rounded-xl shadow-lg shadow-red-950/50">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-red-500 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              FitRehab <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50 font-mono">PRO</span>
            </h1>
            <p className="text-xs text-slate-400">Prescrição Biomecânica & Reabilitação</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { setRole('trainer'); setActiveTab('workouts'); }}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'trainer'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Portal do Treinador / Físio</span>
          </button>
          <button
            onClick={() => { setRole('student'); setActiveTab('student-view'); }}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'student'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Visão do Aluno</span>
          </button>
        </div>
      </header>

      {role === 'trainer' && (
        <nav className="bg-slate-900 border-b border-slate-800/80 px-4 lg:px-8 py-2 flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'workouts'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Treinos Prescritos</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'builder'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Montar Novo Treino</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'library'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Acervo de Exercícios</span>
          </button>
        </nav>
      )}

      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {role === 'trainer' && activeTab === 'workouts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" /> Prescrições Ativas
              </h2>
              <div className="space-y-3">
                {workouts.map((wk) => (
                  <div
                    key={wk.id}
                    onClick={() => setSelectedWorkout(wk)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedWorkout?.id === wk.id
                        ? 'bg-slate-900 border-amber-500/60 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-100 text-base">{wk.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                        {wk.goal}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Aluno: <strong className="text-slate-300">{wk.studentName}</strong></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedWorkout && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="border-b border-slate-800 pb-5">
                    <h2 className="text-2xl font-black text-slate-100">{selectedWorkout.title}</h2>
                    <p className="text-sm text-slate-400">Prescrito para: <span className="text-amber-400">{selectedWorkout.studentName}</span></p>
                  </div>

                  <div className="space-y-4">
                    {selectedWorkout.exercises.map((exItem, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h4 className="font-bold text-slate-100 text-base mb-2">{idx + 1}. {exItem.name}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div><span className="text-slate-500 block">Séries</span><strong>{exItem.sets}</strong></div>
                          <div><span className="text-slate-500 block">Reps</span><strong>{exItem.reps}</strong></div>
                          <div><span className="text-slate-500 block">Carga</span><strong className="text-amber-400">{exItem.weight}</strong></div>
                          <div><span className="text-slate-500 block">Descanso</span><strong>{exItem.rest}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {role === 'trainer' && activeTab === 'library' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Buscar exercício..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((ex) => (
                <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-amber-950 text-amber-400 border border-amber-800/50">{ex.category}</span>
                  <h3 className="text-lg font-bold text-slate-100">{ex.name}</h3>
                  <p className="text-xs text-slate-400"><strong className="text-slate-300">Alvo:</strong> {ex.targetMuscle}</p>
                  <button
                    onClick={() => setExerciseModal(ex)}
                    className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold pt-2"
                  >
                    <Video className="w-4 h-4" /> <span>Ver Vídeo & Detalhes</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(role === 'student' || activeTab === 'student-view') && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <span className="text-xs font-bold text-amber-400 uppercase block mb-1">Área do Aluno</span>
              <h2 className="text-2xl font-black text-slate-100">{selectedWorkout?.title}</h2>
            </div>

            {selectedWorkout && (
              <div className="space-y-4">
                {selectedWorkout.exercises.map((exItem, exIndex) => (
                  <div key={exIndex} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-lg font-bold text-slate-100">{exIndex + 1}. {exItem.name}</h4>
                    <div className="flex gap-2">
                      {Array.from({ length: parseInt(exItem.sets) || 1 }).map((_, setIdx) => {
                        const isLogged = loggedSets[`${selectedWorkout.id}-${exIndex}-${setIdx}`];
                        return (
                          <button
                            key={setIdx}
                            onClick={() => handleToggleSetLog(selectedWorkout.id, exIndex, setIdx)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 ${
                              isLogged ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Série {setIdx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {exerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-100">{exerciseModal.name}</h3>
              <button onClick={() => setExerciseModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              <iframe src={exerciseModal.videoUrl} title={exerciseModal.name} className="w-full h-full border-0" allowFullScreen></iframe>
            </div>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">{exerciseModal.execution}</p>
          </div>
        </div>
      )}
    </div>
  );
}
