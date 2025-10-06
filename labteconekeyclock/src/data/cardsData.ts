import { StaticImageData } from 'next/image';
import BgEletric from '../../public/loginBackgroundEletric.svg';

export interface CardData {
  id: number;
  title: string;
  description: string;
  content?: string;
  link: string;
  foto: string | StaticImageData;
}

export const defaultCards: CardData[] = [
    {
        id: 1,
        title: "Eletric Games - Aprenda Elétrica",
        description: "Site interativo voltado ao aprendizado de elétrica, com jogos educativos, desafios práticos e quizzes.",
        link: "https://electricgames.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 2,
        title: "EduMind - Gestão Educacional",
        description: "Plataforma completa para gestão de instituições de ensino, controle acadêmico e administrativa.",
        link: "https://edumind.com.br/",
        foto: BgEletric
    },
    {
        id: 3,
        title: "LabtecOne - Portal Principal",
        description: "Portal principal da LabtecOne com acesso a todos os serviços e aplicações da plataforma.",
        link: "https://labtecone.com.br/",
        foto: BgEletric
    },
    {
        id: 4,
        title: "Sistema de Laboratórios",
        description: "Gerenciamento completo de laboratórios, equipamentos e agendamento de aulas práticas.",
        link: "https://labs.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 5,
        title: "Portal do Aluno",
        description: "Acesso a notas, horários, material didático e comunicação com professores.",
        link: "https://portal.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 6,
        title: "Biblioteca Digital",
        description: "Acervo digital com livros, artigos e materiais de pesquisa para estudantes e professores.",
        link: "https://biblioteca.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 7,
        title: "Sistema de Projetos",
        description: "Plataforma para gerenciamento de projetos acadêmicos, TCCs e pesquisas.",
        link: "https://projetos.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 8,
        title: "Ambiente Virtual",
        description: "Plataforma de ensino à distância com aulas online, fóruns e atividades interativas.",
        link: "https://ead.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 9,
        title: "Sistema Financeiro",
        description: "Controle de mensalidades, boletos e situação financeira dos estudantes.",
        link: "https://financeiro.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 10,
        title: "Portal de Estágios",
        description: "Conecta estudantes com empresas parceiras para oportunidades de estágio.",
        link: "https://estagios.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 11,
        title: "Sistema de Extensão",
        description: "Gerenciamento de projetos de extensão universitária e ações comunitárias.",
        link: "https://extensao.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 12,
        title: "Plataforma de Pesquisa",
        description: "Portal para submissão e acompanhamento de projetos de iniciação científica.",
        link: "https://pesquisa.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 13,
        title: "Sistema de Eventos",
        description: "Inscrições e gerenciamento de congressos, seminários e eventos acadêmicos.",
        link: "https://eventos.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 14,
        title: "Portal de Empresas",
        description: "Interface para empresas parceiras acessarem currículos e publicarem vagas.",
        link: "https://empresas.satc.edu.br/",
        foto: BgEletric
    },
    {
        id: 15,
        title: "Sistema de Monitoria",
        description: "Plataforma para candidatura e gerenciamento do programa de monitoria acadêmica.",
        link: "https://monitoria.satc.edu.br/",
        foto: BgEletric
    }
];