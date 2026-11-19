process.env.EXPO_PUBLIC_API_URL = 'http://api.teste';
process.env.EXPO_PUBLIC_JAVA_API_URL = 'http://java.teste';

jest.mock('expo-secure-store', () => {
  const memoria = new Map<string, string>();
  return {
    __memoria: memoria,
    setItemAsync: jest.fn(async (chave: string, valor: string) => {
      memoria.set(chave, valor);
    }),
    getItemAsync: jest.fn(async (chave: string) => memoria.get(chave) ?? null),
    deleteItemAsync: jest.fn(async (chave: string) => {
      memoria.delete(chave);
    }),
  };
});

jest.mock('expo-haptics', () => ({
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
  notificationAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: () => jest.requireActual<{ randomUUID: () => string }>('crypto').randomUUID(),
}));

jest.mock('react-native-safe-area-context', () => jest.requireActual('react-native-safe-area-context/jest/mock').default);
