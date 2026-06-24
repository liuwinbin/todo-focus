// ============================================================
// CheckInButton — 打卡按钮（带动画反馈）
// ============================================================
import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface CheckInButtonProps {
  checked: boolean;
  count: number;
  target: number;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function CheckInButton({
  checked,
  count,
  target,
  onPress,
  size = 'md',
}: CheckInButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const sizeConfig = {
    sm: { width: 48, height: 48, fontSize: 12 },
    md: { width: 64, height: 64, fontSize: 14 },
    lg: { width: 80, height: 80, fontSize: 16 },
  };

  const s = sizeConfig[size];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={checked}
        activeOpacity={0.7}
        style={[
          styles.btn,
          { width: s.width, height: s.height },
          checked ? styles.btnChecked : styles.btnUnchecked,
        ]}
      >
        {checked ? (
          <>
            <Ionicons name="checkmark-circle" size={28} color={colors.textInverse} />
            <Text style={[styles.count, { fontSize: s.fontSize }]}>
              {count}/{target}
            </Text>
          </>
        ) : (
          <Ionicons name="add-outline" size={28} color={colors.primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnUnchecked: {
    backgroundColor: colors.primaryBg,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  btnChecked: {
    backgroundColor: colors.success,
  },
  count: {
    ...typography.badge,
    color: colors.textInverse,
    fontWeight: '700',
    marginTop: 2,
  },
});
