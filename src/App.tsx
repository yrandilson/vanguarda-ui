/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Image as ImageIcon, 
  Library, 
  Settings, 
  Search, 
  Plus,
  ArrowUpRight,
  MoreVertical,
  Clock,
  GripVertical
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <li 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-sm transition-all duration-200 ${
      active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </li>
);

interface Project {
  id: string;
  title: string;
  meta: string;
  status: 'Finalizado' | 'Em Revisão' | 'Rascunho';
  user: string;
  avatarColor?: string;
  imageUrl: string;
  imageAlt: string;
}

interface CardProps extends Project {}

const ProjectCard = ({ title, meta, status, user, avatarColor = 'bg-slate-300', imageUrl, imageAlt }: CardProps) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-card h-full">
    <div className="h-40 bg-slate-200 relative overflow-hidden group">
      <img 
        src={imageUrl} 
        alt={imageAlt}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <GripVertical className="text-white opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity" size={24} />
      </div>
      <span className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 uppercase">
        {status}
      </span>
    </div>
    <div className="p-5">
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
        <Clock size={12} /> {meta}
      </p>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full overflow-hidden ${avatarColor}`}>
           <img 
            src={`https://picsum.photos/seed/${user.replace(' ', '')}/64/64`} 
            alt={`Foto de perfil de ${user}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-xs text-slate-700">{user}</span>
        <button className="ml-auto text-slate-400 hover:text-slate-600">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  </div>
);

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col">
    <span className="text-lg font-bold text-slate-700">{value}</span>
    <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
  </div>
);

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: "Campanha Verão 2024",
    meta: "Criado há 2 dias • 14 arquivos",
    status: "Finalizado",
    user: "Beatriz Silva",
    avatarColor: "bg-blue-400",
    imageUrl: "https://picsum.photos/seed/summer2024/400/300",
    imageAlt: "Uma composição visual vibrante e ensolarada representando a campanha de marketing de verão 2024, com cores quentes e elementos gráficos tropicais."
  },
  {
    id: '2',
    title: "Identidade Visual - Apollo",
    meta: "Criado há 5 dias • 8 arquivos",
    status: "Em Revisão",
    user: "Marco Antônio",
    avatarColor: "bg-slate-400",
    imageUrl: "https://picsum.photos/seed/apollo-brand/400/300",
    imageAlt: "Peças de branding da identidade visual Apollo, demonstrando um design minimalista e corporativo em tons de azul profundo e cinza espacial."
  },
  {
    id: '3',
    title: "Assets Mobile App",
    meta: "Criado hoje • 32 arquivos",
    status: "Rascunho",
    user: "Helena Costa",
    avatarColor: "bg-slate-700",
    imageUrl: "https://picsum.photos/seed/mobile-assets/400/300",
    imageAlt: "Uma coleção de componentes de interface de usuário para um aplicativo móvel de alta performance, exibindo botões e layouts em um tema escuro e moderno."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = statusFilter === 'All' 
    ? projects 
    : projects.filter(p => p.status === statusFilter);

  const filterOptions = ['All', 'Finalizado', 'Em Revisão', 'Rascunho'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-2xl font-bold text-slate-700">Coleções Recentes</h2>
              <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                Ver tudo <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-6">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setStatusFilter(option)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    statusFilter === option 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <Reorder.Group 
              axis="y" 
              values={projects} 
              onReorder={setProjects}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {filteredProjects.map((project) => (
                <Reorder.Item 
                  key={project.id} 
                  value={project}
                  className="list-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProjectCard {...project} />
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <footer className="mt-auto bg-white p-6 rounded-2xl flex flex-wrap gap-x-12 gap-y-6 border border-slate-100 shadow-card">
              <StatItem value="1.2k" label="Uploads Totais" />
              <StatItem value="84%" label="Espaço Utilizado" />
              <StatItem value="24" label="Projetos Ativos" />
              <StatItem value="02" label="Pendências" />
            </footer>
          </>
        );
      case 'Projetos':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <FolderKanban size={64} className="text-slate-200" />
            <h2 className="text-xl font-bold text-slate-700">Seus Projetos</h2>
            <p className="text-slate-400 max-w-xs">Gerencie todos os seus fluxos de trabalho e acompanhe o progresso em tempo real.</p>
            <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold">Ver Arquivos</button>
          </div>
        );
      case 'Galeria':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group relative">
                <img src={`https://picsum.photos/seed/gallery-${i}/300/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-white text-slate-800 p-2 rounded-full shadow-lg"><Plus size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Recursos':
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-card">
            <h2 className="text-xl font-bold text-slate-700 mb-6">Recursos Disponíveis</h2>
            <div className="space-y-4">
              {['Documentação da API', 'Guias de Estilo', 'Assets Globais', 'Modelos de Apresentação'].map(item => (
                <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Library size={20} className="text-primary" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Configurações':
        return (
          <div className="max-w-2xl mx-auto w-full space-y-8">
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Perfil</h3>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://picsum.photos/seed/beatriz-silva/128/128" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Beatriz Silva</h4>
                  <p className="text-sm text-slate-400">beatriz.silva@vanguarda.design</p>
                </div>
                <button className="ml-auto text-xs font-bold text-primary px-4 py-2 border border-blue-100 rounded-lg">Editar</button>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Preferências</h3>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card divide-y divide-slate-50">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-slate-700">Notificações por Email</span>
                  <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-slate-700">Modo Escuro (Beta)</span>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-800 h-full p-6 flex flex-col text-white">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-6 h-6 bg-primary rounded-md shrink-0 flex items-center justify-center overflow-hidden">
             <img 
              src="https://picsum.photos/seed/vanguarda-logo/64/64" 
              alt="Logotipo da Vanguarda UI: uma forma geométrica minimalista em azul que simboliza inovação e design corporativo."
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Vanguarda UI</span>
        </div>
        
        <nav>
          <ul className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeTab === 'Dashboard'} 
              onClick={() => setActiveTab('Dashboard')}
            />
            <NavItem 
              icon={<FolderKanban size={18} />} 
              label="Projetos" 
              active={activeTab === 'Projetos'}
              onClick={() => setActiveTab('Projetos')}
            />
            <NavItem 
              icon={<ImageIcon size={18} />} 
              label="Galeria" 
              active={activeTab === 'Galeria'}
              onClick={() => setActiveTab('Galeria')}
            />
            <NavItem 
              icon={<Library size={18} />} 
              label="Recursos" 
              active={activeTab === 'Recursos'}
              onClick={() => setActiveTab('Recursos')}
            />
            <NavItem 
              icon={<Settings size={18} />} 
              label="Configurações" 
              active={activeTab === 'Configurações'}
              onClick={() => setActiveTab('Configurações')}
            />
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-500">
              <img 
                src="https://picsum.photos/seed/beatriz-silva/64/64" 
                alt="Retrato profissional de Beatriz Silva, diretora de criação da Vanguarda UI."
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Beatriz Silva</span>
              <span className="text-[10px] text-slate-400">Plano Premium</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar arquivos..." 
              className="bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
              <Plus size={18} />
              Novo Item
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
              <img 
                src="https://picsum.photos/seed/user-current/80/80" 
                alt="Miniatura da foto do usuário logado." 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
