const somenteDigitos = (texto: string, maximo: number) => texto.replace(/\D/g, '').slice(0, maximo);

export function mascararTelefone(texto: string): string {
  const digitos = somenteDigitos(texto, 11);
  const ddd = digitos.slice(0, 2);

  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${ddd}`;
  if (digitos.length <= 6) return `(${ddd}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) return `(${ddd}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return `(${ddd}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function mascararCep(texto: string): string {
  const digitos = somenteDigitos(texto, 8);
  return digitos.length <= 5 ? digitos : `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function mascararHora(texto: string): string {
  const digitos = somenteDigitos(texto, 4);
  return digitos.length <= 2 ? digitos : `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
}

export function cepCompleto(cep: string): boolean {
  return somenteDigitos(cep, 9).length === 8;
}
