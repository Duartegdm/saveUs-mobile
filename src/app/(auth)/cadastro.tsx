import { IdCard, Lock, LockKeyhole, Mail, ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';
import { FormInput } from '@/components/form/form-input';
import { Button, Text } from '@/components/ui';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { AvisoDeEnvio } from '@/features/auth/components/aviso-de-envio';
import { LinkAlternativo } from '@/features/auth/components/link-alternativo';
import { RegrasSenha } from '@/features/auth/components/regras-senha';
import { useCadastroForm } from '@/features/auth/hooks/use-cadastro-form';
import { colors } from '@/theme/colors';

export default function CadastroScreen() {
  const { form, enviar, segundosBloqueado } = useCadastroForm();
  const {
    control,
    setFocus,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthLayout
      titulo="Crie sua conta"
      subtitulo="Leva menos de 2 minutos."
      rodape={<LinkAlternativo pergunta="Já tem uma conta?" acao="Entrar" href="/login" dismissTo />}>
      <FormInput
        control={control}
        name="nome"
        label="Nome completo"
        icon={IdCard}
        required
        placeholder="Maria Souza"
        maxLength={150}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('email')}
      />
      <FormInput
        control={control}
        name="email"
        label="E-mail"
        icon={Mail}
        required
        placeholder="maria@email.com"
        maxLength={200}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('senha')}
      />
      <View className="gap-3">
        <FormInput
          control={control}
          name="senha"
          label="Senha"
          icon={Lock}
          required
          password
          hideErrorMessage
          placeholder="Crie uma senha"
          maxLength={100}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('confirmarSenha')}
        />
        <RegrasSenha control={control} />
      </View>
      <FormInput
        control={control}
        name="confirmarSenha"
        label="Confirmar senha"
        icon={LockKeyhole}
        required
        password
        placeholder="Repita a senha"
        maxLength={100}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={enviar}
      />

      <AvisoDeEnvio segundosBloqueado={segundosBloqueado} erro={errors.root?.message} />

      <View className="gap-3">
        <Button
          label="Criar conta"
          size="lg"
          loading={isSubmitting}
          disabled={segundosBloqueado > 0}
          onPress={enviar}
          className="mt-1"
        />
        <View className="flex-row items-center justify-center gap-1.5 px-2">
          <ShieldCheck color={colors.secondary} size={16} />
          <Text variant="bodySm" tone="muted" className="text-center">
            Seus dados são protegidos pela LGPD.
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
}
