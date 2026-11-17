import { Screen, Text } from '@/components/ui';

type ScreenPlaceholderProps = {
  title: string;
  description?: string;
};

export function ScreenPlaceholder({ title, description }: ScreenPlaceholderProps) {
  return (
    <Screen scroll={false} className="items-center justify-center">
      <Text variant="title" tone="primary">
        {title}
      </Text>
      {description && (
        <Text tone="muted" className="text-center">
          {description}
        </Text>
      )}
    </Screen>
  );
}
