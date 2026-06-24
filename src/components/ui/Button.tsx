// ============================================================
// Button — 风格化按钮
// ============================================================
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { bg: ViewStyle; text: TextStyle }> = {
  primary: {
    bg: { backgroundColor: colors.primary },
    text: { color: colors.textInverse },
  },
  secondary: {
    bg: { backgroundColor: colors.secondary },
    text: { color: colors.textPrimary },
  },
  outline: {
    bg: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
    text: { color: colors.primary },
  },
  ghost: {
    bg: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
};

const sizeStyles: Record<ButtonSize, { padding: ViewStyle; font: TextStyle }> = {
  sm: { padding: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md }, font: { fontSize: 14 } },
  md: { padding: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg }, font: { fontSize: 16 } },
  lg: { padding: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl }, font: { fontSize: 18 } },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        v.bg,
        s.padding,
        { borderRadius: borderRadius.md, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse}
        />
      ) : (
        <Text style={[styles.text, v.text, s.font, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    ...typography.button,
  },
});
