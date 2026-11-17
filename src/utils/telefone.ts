const MAXIMO_DE_DIGITOS = 11;

export function mascararTelefone(texto: string): string {
  const digitos = texto.replace(/\D/g, '').slice(0, MAXIMO_DE_DIGITOS);
  const ddd = digitos.slice(0, 2);

  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${ddd}`;
  if (digitos.length <= 6) return `(${ddd}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) return `(${ddd}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return `(${ddd}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}
