import { Check } from 'lucide-react-native';
import { type Control, useFormState, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { Text, type TextTone } from '@/components/ui';
import { colors } from '@/theme/colors';
import { type CadastroForm, REGRAS_SENHA } from '@/types/auth';
import { cn } from '@/utils/cn';

const DICA_INICIAL = 'Use 8 caracteres ou mais, com letra maiúscula, minúscula e número.';

function listar(itens: string[]) {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

function corDosSegmentos(atendidas: number) {
  if (atendidas === REGRAS_SENHA.length) return 'bg-secondary';
  if (atendidas >= 2) return 'bg-on-tertiary-container';
  return 'bg-error';
}

export function RegrasSenha({ control }: { control: Control<CadastroForm> }) {
  const senha = useWatch({ control, name: 'senha' });
  const { errors } = useFormState({ control, name: 'senha' });

  const pendentes = REGRAS_SENHA.filter((regra) => !regra.atende(senha)).map((regra) => regra.rotulo);
  const atendidas = REGRAS_SENHA.length - pendentes.length;
  const forte = pendentes.length === 0;

  const mensagem = forte ? 'Senha forte' : senha.length === 0 ? DICA_INICIAL : `Falta: ${listar(pendentes)}`;

  let tom: TextTone = 'muted';
  if (forte) tom = 'secondary';
  else if (errors.senha) tom = 'error';

  return (
    <View
      accessible
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Força da senha: ${atendidas} de ${REGRAS_SENHA.length}. ${mensagem}`}
      className="gap-2">
      <View className="flex-row gap-1.5">
        {REGRAS_SENHA.map((regra, indice) => (
          <View
            key={regra.rotulo}
            className={cn(
              'h-1 flex-1 rounded-full',
              indice < atendidas ? corDosSegmentos(atendidas) : 'bg-surface-container-high',
            )}
          />
        ))}
      </View>

      <View className="flex-row items-center gap-1.5">
        {forte && <Check color={colors.secondary} size={16} strokeWidth={2.5} />}
        <Text variant="bodySm" tone={tom} className="flex-1">
          {mensagem}
        </Text>
      </View>
    </View>
  );
}
