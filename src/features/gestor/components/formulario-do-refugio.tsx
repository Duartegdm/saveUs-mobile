import { Building2, Clock, MapPin, Signpost, Users } from 'lucide-react-native';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';
import { FormInput } from '@/components/form/form-input';
import { FormSwitch } from '@/components/form/form-switch';
import { Alert, Card, Text } from '@/components/ui';
import type { RefugioRequest } from '@/types/refugio';
import { mascararCep, mascararHora } from '@/utils/mascaras';
import type { RefugioForm } from '../refugio-form';
import { SeletorDeTipo } from './seletor-de-tipo';

type FormularioDoRefugioProps = {
  form: UseFormReturn<RefugioForm, unknown, RefugioRequest>;
  cep: { buscando: boolean; aviso?: string };
};

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

export function FormularioDoRefugio({ form, cep }: FormularioDoRefugioProps) {
  const {
    control,
    setFocus,
    formState: { errors },
  } = form;

  return (
    <>
      {errors.root?.message && <Alert tone="error" message={errors.root.message} />}

      <Secao titulo="Identificação">
        <FormInput
          control={control}
          name="nome"
          label="Nome do refúgio"
          icon={Building2}
          required
          placeholder="Ex.: Biblioteca Municipal da Penha"
          maxLength={150}
          autoCapitalize="words"
        />
        <SeletorDeTipo control={control} />
      </Secao>

      <Secao titulo="Endereço">
        <FormInput
          control={control}
          name="cep"
          label="CEP"
          icon={MapPin}
          required
          placeholder="00000-000"
          keyboardType="number-pad"
          maxLength={9}
          formatar={mascararCep}
          hint={cep.buscando ? 'Buscando o endereço...' : 'O endereço é preenchido a partir do CEP.'}
        />
        {cep.aviso && <Alert tone="warning" message={cep.aviso} />}
        <FormInput
          control={control}
          name="endereco"
          label="Endereço"
          icon={Signpost}
          required
          placeholder="Rua e número"
          maxLength={200}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('bairro')}
        />
        <FormInput
          control={control}
          name="bairro"
          label="Bairro"
          icon={MapPin}
          required
          maxLength={100}
          autoCapitalize="words"
        />
      </Secao>

      <Secao titulo="Funcionamento">
        <FormInput
          control={control}
          name="capacidade"
          label="Capacidade por dia"
          icon={Users}
          required
          placeholder="Ex.: 40"
          keyboardType="number-pad"
          maxLength={5}
          hint="Quantas pessoas o local recebe por dia."
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormInput
              control={control}
              name="abre"
              label="Abre às"
              icon={Clock}
              required
              placeholder="08:00"
              keyboardType="number-pad"
              maxLength={5}
              formatar={mascararHora}
            />
          </View>
          <View className="flex-1">
            <FormInput
              control={control}
              name="fecha"
              label="Fecha às"
              icon={Clock}
              required
              placeholder="18:00"
              keyboardType="number-pad"
              maxLength={5}
              formatar={mascararHora}
            />
          </View>
        </View>
      </Secao>

      <Secao titulo="Situação">
        <FormSwitch
          control={control}
          name="acessivel"
          label="Adaptado para cadeira de rodas"
          descricao="Rampa, banheiro adaptado e circulação sem degraus."
        />
        <FormSwitch
          control={control}
          name="ativo"
          label="Aceitando reservas"
          descricao="Desligue para pausar novas reservas sem excluir o refúgio."
        />
      </Secao>
    </>
  );
}
