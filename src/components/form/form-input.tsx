import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Input, type InputProps } from '@/components/ui';

export type FormInputProps<T extends FieldValues, TSaida extends FieldValues = T> = Omit<
  InputProps,
  'value' | 'onChangeText' | 'onBlur' | 'error' | 'ref'
> & {
  control: Control<T, unknown, TSaida>;
  name: Path<T>;
  formatar?: (texto: string) => string;
};

export function FormInput<T extends FieldValues, TSaida extends FieldValues = T>({
  control,
  name,
  formatar,
  ...props
}: FormInputProps<T, TSaida>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          ref={field.ref}
          value={typeof field.value === 'string' ? field.value : ''}
          onChangeText={(texto) => field.onChange(formatar ? formatar(texto) : texto)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
          {...props}
        />
      )}
    />
  );
}
