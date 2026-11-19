import { Alert, Linking } from 'react-native';

export function ligarPara(numero: string) {
  const digitos = numero.replace(/\D/g, '');
  Linking.openURL(`tel:${digitos}`).catch(() =>
    Alert.alert('Não foi possível ligar', `Disque ${numero} no seu telefone.`),
  );
}
