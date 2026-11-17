import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ApiError } from '@/services/api';
import { applyApiErrors } from '@/utils/apply-api-errors';

const ESPERA_PADRAO_SEGUNDOS = 60;

type Opcoes<T extends FieldValues> = {
  iniciarBloqueio: (segundos: number) => void;
  fieldByStatus?: Partial<Record<number, Path<T>>>;
};

export function aplicarErroDeAuth<T extends FieldValues>(
  error: unknown,
  form: Pick<UseFormReturn<T>, 'setError' | 'getValues'>,
  { iniciarBloqueio, fieldByStatus }: Opcoes<T>,
) {
  if (error instanceof ApiError && error.status === 429) {
    iniciarBloqueio(error.retryAfter ?? ESPERA_PADRAO_SEGUNDOS);
    return;
  }

  applyApiErrors(error, form, { fieldByStatus });
}
