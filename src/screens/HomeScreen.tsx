import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');
const SOS_SIZE = width * 0.42;

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function HomeScreen({ navigation }: any) {
  const {
    user,
    device,
    triggerSOS,
    isEmergencyMode,
    currentOccurrence,
    checkInUntil,
    startCheckIn,
    confirmSafe,
    places,
    activePlaceId,
    settings,
  } = useApp();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [isHolding, setIsHolding] = useState(false);
  const [now, setNow] = useState(Date.now());
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePlace = places.find((p) => p.id === activePlaceId);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (!checkInUntil) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [checkInUntil]);

  const handlePressIn = () => {
    setIsHolding(true);
    Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
    holdTimeout.current = setTimeout(() => {
      triggerSOS();
      navigation.navigate('Emergency');
    }, 1200);
  };

  const handlePressOut = () => {
    setIsHolding(false);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>ALIA</Text>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuária'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={colors.white} />
            </Pressable>
            <View
              style={[
                styles.deviceIndicator,
                { backgroundColor: device.connected ? colors.success : colors.grayDark },
              ]}
            >
              <Ionicons
                name={device.connected ? 'bluetooth' : 'bluetooth-outline'}
                size={14}
                color={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Check-in */}
        <View style={styles.checkCard}>
          <View style={styles.checkHeader}>
            <Ionicons name="timer-outline" size={20} color={colors.pink} />
            <Text style={styles.checkTitle}>Check-in de segurança</Text>
          </View>
          {checkInUntil ? (
            <>
              <Text style={styles.checkTimer}>
                Confirme em {formatRemaining(checkInUntil - now)}
              </Text>
              <Text style={styles.checkHint}>
                Se o tempo acabar sem resposta, o SOS dispara sozinho.
              </Text>
              <Pressable style={styles.safeBtn} onPress={confirmSafe}>
                <Text style={styles.safeBtnText}>Estou bem</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.checkHint}>
                Ative quando sair sozinha. Você precisa tocar em “Estou bem” antes do prazo.
              </Text>
              <View style={styles.checkRow}>
                {[5, 15, 30].map((m) => (
                  <Pressable key={m} style={styles.checkChip} onPress={() => startCheckIn(m)}>
                    <Text style={styles.checkChipText}>{m} min</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>

        {/* SOS */}
        <View style={styles.sosArea}>
          <Animated.View
            style={[styles.sosOuterRing, { transform: [{ scale: pulseAnim }] }]}
          />
          <Animated.View style={[styles.sosButton, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.sosPressable}
            >
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>
                {isHolding ? 'Segure…' : 'Segure para acionar'}
              </Text>
            </Pressable>
          </Animated.View>
          <Text style={styles.instruction}>
            Local do alerta: {settings.shareLocation ? activePlace?.label ?? '—' : 'oculto'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusCard}>
            <Ionicons
              name={device.connected ? 'hardware-chip' : 'hardware-chip-outline'}
              size={20}
              color={device.connected ? colors.pink : colors.gray}
            />
            <Text style={styles.statusLabel}>Dispositivo</Text>
            <Text
              style={[
                styles.statusValue,
                { color: device.connected ? colors.success : colors.gray },
              ]}
            >
              {device.connected ? 'Conectado' : 'Off'}
            </Text>
          </View>
          <View style={styles.statusCard}>
            <Ionicons name="location-outline" size={20} color={colors.pink} />
            <Text style={styles.statusLabel}>Lugar ativo</Text>
            <Text style={[styles.statusValue, { color: colors.white }]} numberOfLines={1}>
              {activePlace?.label ?? '—'}
            </Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Places')}>
            <Ionicons name="home-outline" size={22} color={colors.pink} />
            <Text style={styles.actionText}>Lugares</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Contacts')}>
            <Ionicons name="people-outline" size={22} color={colors.pink} />
            <Text style={styles.actionText}>Rede</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('History')}>
            <Ionicons name="time-outline" size={22} color={colors.pink} />
            <Text style={styles.actionText}>Histórico</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Desk')}>
            <Ionicons name="briefcase-outline" size={22} color={colors.pink} />
            <Text style={styles.actionText}>Central</Text>
          </Pressable>
        </View>

        {isEmergencyMode && currentOccurrence && (
          <Pressable
            style={styles.emergencyBanner}
            onPress={() => navigation.navigate('Emergency')}
          >
            <View style={styles.emergencyPulse} />
            <Text style={styles.emergencyText}>
              Emergência ativa · {currentOccurrence.status}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.white} />
          </Pressable>
        )}

        <Text style={styles.demoNote}>
          Demonstração neste aparelho. Bluetooth, GPS e a fila real ainda não estão ligados a um
          servidor.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  scroll: { paddingBottom: spacing.xxxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  logo: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.pink,
    letterSpacing: 2,
  },
  greeting: { fontSize: typography.size.sm, color: colors.gray, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconButton: { padding: spacing.sm },
  deviceIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  checkHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkTitle: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.md,
  },
  checkTimer: {
    color: colors.pinkLight,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginTop: spacing.sm,
  },
  checkHint: { color: colors.gray, fontSize: typography.size.sm, marginTop: 6, lineHeight: 18 },
  checkRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  checkChip: {
    flex: 1,
    backgroundColor: colors.blackTertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  checkChipText: { color: colors.white, fontWeight: typography.weight.medium },
  safeBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.pink,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  safeBtnText: { color: colors.white, fontWeight: typography.weight.semibold },
  sosArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  sosOuterRing: {
    position: 'absolute',
    width: SOS_SIZE + 36,
    height: SOS_SIZE + 36,
    borderRadius: (SOS_SIZE + 36) / 2,
    borderWidth: 2,
    borderColor: colors.pink40,
  },
  sosButton: {
    width: SOS_SIZE,
    height: SOS_SIZE,
    borderRadius: SOS_SIZE / 2,
    backgroundColor: colors.pink,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  sosPressable: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sosText: {
    fontSize: 36,
    fontWeight: typography.weight.bold,
    color: colors.white,
    letterSpacing: 3,
  },
  sosSubtext: { fontSize: typography.size.xs, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  instruction: {
    marginTop: spacing.lg,
    fontSize: typography.size.sm,
    color: colors.gray,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statusCard: {
    flex: 1,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: { fontSize: typography.size.xs, color: colors.gray, marginTop: 4 },
  statusValue: { fontSize: typography.size.sm, fontWeight: typography.weight.medium },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  actionText: { fontSize: 10, color: colors.white, textAlign: 'center' },
  emergencyBanner: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.pink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  emergencyPulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  emergencyText: {
    flex: 1,
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  demoNote: {
    textAlign: 'center',
    color: colors.grayDark,
    fontSize: typography.size.xs,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
    lineHeight: 16,
  },
});
