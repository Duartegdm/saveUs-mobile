import { Droplets, type LucideIcon, Salad, Shirt, Sun, Users, Wind } from 'lucide-react-native';

export type Cuidado = {
  titulo: string;
  descricao: string;
  Icone: LucideIcon;
};

export const CUIDADOS: Cuidado[] = [
  {
    titulo: 'Beba água sempre',
    descricao:
      'Beba água ao longo do dia, mesmo sem sede. Leve uma garrafa quando sair. Se o seu médico limitou a quantidade de líquidos, siga a orientação dele.',
    Icone: Droplets,
  },
  {
    titulo: 'Evite o sol forte',
    descricao: 'Entre 10h e 16h, prefira ficar em lugares frescos e com sombra. Deixe passeios e compras para o começo da manhã.',
    Icone: Sun,
  },
  {
    titulo: 'Use roupas leves',
    descricao: 'Prefira roupas claras e soltas, de algodão. Ao sair, use chapéu e protetor solar.',
    Icone: Shirt,
  },
  {
    titulo: 'Fique em lugar fresco',
    descricao:
      'Mantenha a casa ventilada e as cortinas fechadas nas horas mais quentes. Se a casa estiver muito quente, vá para um refúgio.',
    Icone: Wind,
  },
  {
    titulo: 'Coma leve',
    descricao: 'Prefira frutas, verduras e refeições pequenas. Evite bebidas alcoólicas e comidas muito pesadas.',
    Icone: Salad,
  },
  {
    titulo: 'Combine com alguém',
    descricao: 'Peça para um familiar ou vizinho falar com você nos dias mais quentes. Se puder, faça o mesmo por outra pessoa.',
    Icone: Users,
  },
];

export const SINAIS_DE_ALERTA = [
  'Tontura, fraqueza ou confusão',
  'Dor de cabeça forte',
  'Pele muito quente, vermelha ou seca',
  'Enjoo ou vômito',
  'Câimbras',
  'Coração acelerado ou falta de ar',
];

export const O_QUE_FAZER = [
  'Vá para um lugar fresco e com sombra',
  'Molhe o rosto, a nuca e os braços com água fresca',
  'Beba água aos poucos, se estiver consciente',
  'Afrouxe as roupas e descanse',
];

export const TELEFONE_SAMU = '192';
