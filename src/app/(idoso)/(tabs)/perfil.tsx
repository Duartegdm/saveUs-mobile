import { IdCard, LogOut, Mail, MapPin, Phone, PhoneCall, Save, UserRound } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { EstadoDaLista } from '@/components/estado-da-lista';
import { FormInput } from '@/components/form/form-input';
import { Alert, Button, Card, Input, Screen, Text } from '@/components/ui';
import { useAuth } from '@/features/auth/use-auth';
import { CabecalhoDoPerfil } from '@/features/perfil/components/cabecalho-do-perfil';
import { useFormularioDoPerfil } from '@/features/perfil/hooks/use-formulario-do-perfil';
import { mascararTelefone } from '@/utils/mascaras';

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Card className="gap-5">
      <Text variant="headline" accessibilityRole="header">
        {titulo}
      </Text>
      {children}
    </Card>
  );
}

export default function PerfilScreen() {
  const { sair } = useAuth();
  const { perfil, form, enviar, salvando, salvo } = useFormularioDoPerfil();
  const {
    control,
    setFocus,
    formState: { errors, isDirty },
  } = form;

  if (perfil.isPending) {
    return (
      <Screen>
        <EstadoDaLista tipo="carregando" mensagem="Carregando seu perfil..." />
      </Screen>
    );
  }

  if (perfil.isError) {
    return (
      <Screen>
        <EstadoDaLista tipo="erro" mensagem={perfil.error.message} onTentarDeNovo={() => void perfil.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen
      rodape={
        <Button
          label="Salvar alterações"
          icon={Save}
          size="lg"
          loading={salvando}
          disabled={!isDirty}
          onPress={enviar}
        />
      }>
      <Text variant="display" tone="primary">
        Perfil
      </Text>

      <CabecalhoDoPerfil usuario={perfil.data} />

      {salvo && <Alert tone="success" message="Seus dados foram salvos." />}
      {errors.root?.message && <Alert tone="error" message={errors.root.message} />}

      <Secao titulo="Dados pessoais">
        <FormInput
          control={control}
          name="nome"
          label="Nome completo"
          icon={IdCard}
          required
          maxLength={150}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('bairro')}
        />
        <Input
          label="E-mail"
          icon={Mail}
          value={perfil.data.email}
          editable={false}
          hint="O e-mail não pode ser alterado pelo app."
        />
        <FormInput
          control={control}
          name="bairro"
          label="Bairro onde mora"
          icon={MapPin}
          placeholder="Ex.: Penha"
          maxLength={100}
          autoCapitalize="words"
          hint="Usado para mostrar os refúgios perto de você na tela Início."
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('telefone')}
        />
      </Secao>

      <Secao titulo="Contato de emergência">
        <FormInput
          control={control}
          name="telefone"
          label="Seu celular"
          icon={Phone}
          placeholder="(11) 90000-0000"
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={15}
          formatar={mascararTelefone}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('contatoEmergenciaNome')}
        />
        <FormInput
          control={control}
          name="contatoEmergenciaNome"
          label="Nome do contato"
          icon={UserRound}
          placeholder="Ex.: João Souza (filho)"
          maxLength={150}
          autoCapitalize="words"
          hint="Alguém de confiança, como um familiar ou vizinho."
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('contatoEmergenciaTelefone')}
        />
        <FormInput
          control={control}
          name="contatoEmergenciaTelefone"
          label="Telefone do contato"
          icon={PhoneCall}
          placeholder="(11) 90000-0000"
          keyboardType="phone-pad"
          maxLength={15}
          formatar={mascararTelefone}
          returnKeyType="done"
          onSubmitEditing={enviar}
        />
      </Secao>

      <View className="pb-space-sm pt-space-sm">
        <Button label="Sair da conta" icon={LogOut} variant="tonal" onPress={() => void sair()} />
      </View>
    </Screen>
  );
}
