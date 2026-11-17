import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ApiError } from '@/services/api';

type FormErrorTarget<T extends FieldValues> = Pick<UseFormReturn<T>, 'setError' | 'getValues'>;

type ApplyApiErrorsOptions<T extends FieldValues> = {
  fieldByStatus?: Partial<Record<number, Path<T>>>;
};

const MENSAGEM_GENERICA = 'Algo deu errado. Tente de novo.';

export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  form: FormErrorTarget<T>,
  { fieldByStatus }: ApplyApiErrorsOptions<T> = {},
) {
  if (!(error instanceof ApiError)) {
    form.setError('root', { type: 'server', message: MENSAGEM_GENERICA });
    return;
  }

  const camposDoForm = Object.keys(form.getValues());
  const ehCampoDoForm = (campo: string): campo is Path<T> => camposDoForm.includes(campo);

  let camposMarcados = 0;
  let mensagemSemCampo: string | null = null;

  for (const [campo, message] of Object.entries(error.fieldErrors)) {
    if (ehCampoDoForm(campo)) {
      form.setError(campo, { type: 'server', message }, { shouldFocus: camposMarcados === 0 });
      camposMarcados++;
    } else {
      mensagemSemCampo ??= message;
    }
  }

  if (camposMarcados > 0 && mensagemSemCampo === null) return;

  const campoDoStatus = fieldByStatus?.[error.status];
  if (campoDoStatus && camposMarcados === 0) {
    form.setError(campoDoStatus, { type: 'server', message: error.message }, { shouldFocus: true });
    return;
  }

  form.setError('root', { type: 'server', message: mensagemSemCampo ?? error.message });
}
