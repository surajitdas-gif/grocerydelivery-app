/**
 * getFreshLocation
 * ─────────────────
 * Always returns a real hardware GPS fix.
 * Never returns a stale cached position from a previous session.
 *
 * Drop this file anywhere in your project, e.g. utils/freshLocation.ts
 * then import: import { getFreshLocation } from "@/utils/freshLocation";
 */

import * as Location from 'expo-location';

export async function getFreshLocation(
  timeoutMs = 15000,
): Promise<{ latitude: number; longitude: number } | null> {

  try {

    // 1. Ask for permission
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('📍 Location permission denied');
      return null;
    }

    // 2. Race a FRESH fix against a timeout
    //    BestForNavigation forces the OS to query the GPS chip directly.
    const freshPromise =
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        mayShowUserSettingsDialog: true,
      });

    const timeoutPromise =
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), timeoutMs)
      );

    const result =
      await Promise.race([freshPromise, timeoutPromise]);

    if (result) {
      console.log(
        '✅ FRESH GPS:',
        result.coords.latitude,
        result.coords.longitude,
        '| accuracy:', result.coords.accuracy, 'm',
      );
      return {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };
    }

    // 3. GPS chip timed out — use last-known ONLY if very recent (≤ 2 min)
    console.log('⚠️ GPS timed out — trying last known position...');

    const last = await Location.getLastKnownPositionAsync({
      maxAge: 2 * 60 * 1000,  // must be within 2 minutes
      requiredAccuracy: 200,   // must be within 200 metres
    });

    if (last) {
      const ageSeconds =
        Math.round((Date.now() - last.timestamp) / 1000);
      console.log(
        '📍 Last known (', ageSeconds, 's ago):',
        last.coords.latitude,
        last.coords.longitude,
      );
      return {
        latitude: last.coords.latitude,
        longitude: last.coords.longitude,
      };
    }

    console.log('❌ No fresh GPS fix available');
    return null;

  } catch (err) {
    console.log('getFreshLocation error:', err);
    return null;
  }
}