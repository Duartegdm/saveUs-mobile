import { Text, View } from 'react-native';

type ScreenPlaceholderProps = {
  title: string;
  description?: string;
};

export function ScreenPlaceholder({ title, description }: ScreenPlaceholderProps) {
  return (
    <View className="flex-1 items-center justify-center gap-space-sm bg-surface px-gutter-mobile">
      <Text className="font-jakarta-bold text-headline-lg text-primary">{title}</Text>
      {description ? (
        <Text className="text-center font-jakarta text-body-md text-on-surface-variant">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
