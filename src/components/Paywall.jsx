import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n';

const FEATURES = ['paywallFeature1', 'paywallFeature2', 'paywallFeature3', 'paywallFeature4'];

export default function Paywall({ onClose, onSuccess, priceString, isLoading, purchase, restore }) {
  const colors = useTheme();
  const t = useTranslation();
  const [buying, setBuying] = useState(false);
  const [restoring, setRestoring] = useState(false);

  async function handlePurchase() {
    setBuying(true);
    const ok = await purchase();
    setBuying(false);
    if (ok) onSuccess();
  }

  async function handleRestore() {
    setRestoring(true);
    const ok = await restore();
    setRestoring(false);
    if (ok) onSuccess();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
        <Text style={[styles.closeText, { color: colors.textMuted }]}>✕</Text>
      </Pressable>

      <Text style={styles.icon}>𝄞</Text>
      <Text style={[styles.title, { color: colors.text }]}>{t.paywallTitle}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.paywallSubtitle}</Text>

      <View style={[styles.featuresBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {FEATURES.map(key => (
          <View key={key} style={styles.featureRow}>
            <Text style={[styles.check, { color: colors.correct }]}>✓</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>{t[key]}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.buyButton, { backgroundColor: colors.buttonBg }, buying && styles.disabled]}
        onPress={handlePurchase}
        disabled={buying || isLoading}
      >
        {buying || isLoading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buyText, { color: colors.buttonText }]}>
            {priceString ? t.paywallBuy(priceString) : t.paywallBuyFallback}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={handleRestore} disabled={restoring} style={styles.restoreBtn}>
        {restoring
          ? <ActivityIndicator color={colors.textMuted} />
          : <Text style={[styles.restoreText, { color: colors.textMuted }]}>{t.paywallRestore}</Text>
        }
      </Pressable>

      <Text style={[styles.legal, { color: colors.textMuted }]}>{t.paywallLegal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
  },
  closeText: {
    fontSize: 20,
  },
  icon: {
    fontSize: 80,
    lineHeight: 90,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featuresBox: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  check: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
  },
  buyButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  buyText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.6,
  },
  restoreBtn: {
    paddingVertical: 6,
    marginBottom: 20,
  },
  restoreText: {
    fontSize: 14,
  },
  legal: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
