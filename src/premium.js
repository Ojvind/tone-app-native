import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get these from your RevenueCat dashboard → Project → API keys
const API_KEY = Platform.OS === 'ios'
  ? 'test_aPGPDxvLrRRMPWOdcmyaYorfFoH'
  : 'goog_PASTE_YOUR_REVENUECAT_ANDROID_KEY_HERE';

// Must match the entitlement identifier in RevenueCat dashboard
export const ENTITLEMENT_ID = 'premium';

// RevenueCat requires a native build — skip in Expo Go
const IS_EXPO_GO = Constants.appOwnership === 'expo';

export function initPurchases() {
  if (IS_EXPO_GO) return;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: API_KEY });
}

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(!IS_EXPO_GO);
  const [offering, setOffering] = useState(null);

  useEffect(() => {
    if (IS_EXPO_GO) return;

    let cancelled = false;

    async function init() {
      try {
        const [info, offerings] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);
        if (cancelled) return;
        setIsPremium(!!info.entitlements.active[ENTITLEMENT_ID]);
        if (offerings.current) setOffering(offerings.current);
      } catch {
        // RevenueCat not configured yet or network error — fail silently
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  async function purchase() {
    if (IS_EXPO_GO) return false;
    const pkg = offering?.lifetime ?? offering?.availablePackages?.[0];
    if (!pkg) return false;
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const premium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
      setIsPremium(premium);
      return premium;
    } catch (e) {
      if (!e.userCancelled) console.error('Purchase error:', e);
      return false;
    }
  }

  async function restore() {
    if (IS_EXPO_GO) return false;
    try {
      const info = await Purchases.restorePurchases();
      const premium = !!info.entitlements.active[ENTITLEMENT_ID];
      setIsPremium(premium);
      return premium;
    } catch (e) {
      console.error('Restore error:', e);
      return false;
    }
  }

  const priceString = offering?.lifetime?.product?.priceString
    ?? offering?.availablePackages?.[0]?.product?.priceString
    ?? null;

  return { isPremium, isLoading, priceString, purchase, restore };
}
