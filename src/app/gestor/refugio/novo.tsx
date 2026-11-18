import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Button, Screen } from '@/components/ui';
import { FormularioDoRefugio } from '@/features/gestor/components/formulario-do-refugio';
import { useFormularioDoRefugio } from '@/features/gestor/hooks/use-formulario-do-refugio';

export default function NovoRefugioScreen() {
  const { form, cep, enviar, salvando } = useFormularioDoRefugio({ onSalvo: () => router.back() });

  return (
    <Screen
      edges={['bottom']}
      rodape={<Button label="Cadastrar refúgio" icon={Plus} size="lg" loading={salvando} onPress={enviar} />}>
      <FormularioDoRefugio form={form} cep={cep} />
    </Screen>
  );
}
