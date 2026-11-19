import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { OccurrenceStatus, STATUS_LABELS } from '../types';

const statusConfig: Record<
  OccurrenceStatus,
  { color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  sending: { color: colors.warning, icon: 'cloud-upload-outline' },
  sent: { color: colors.info, icon: 'checkmark-circle-outline' },
  waiting: { color: colors.warning, icon: 'time-outline' },
  accepted: { color: colors.success, icon: 'person-circle-outline' },
  in_progress: { color: colors.pink, icon: 'walk-outline' },
  finished: { color: colors.success, icon: 'checkmark-done-outline' },
  cancelled: { color: colors.gray, icon: 'close-circle-outline' },
};

export default function EmergencyScreen({ navigation }: any) {
  const { currentOccurrence, updateOccurrenceStatus, cancelActive, setRole } = useApp();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  if (!currentOccurrence) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noData}>Nenhuma ocorrência ativa</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const config = statusConfig[currentOccurrence.status];
  const steps: OccurrenceStatus[] = ['sent', 'waiting', 'accepted', 'in_progress'];
  const stepIndex = steps.findIndex((s) => s === currentOccurrence.status);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Emergência</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.mainStatus}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={[styles.statusIcon, { backgroundColor: config.color + '30' }]}>
              <Ionicons name={config.icon} size={48} color={config.color} />
            </View>
          </Animated.View>
          <Text style={styles.statusLabel}>{STATUS_LABELS[currentOccurrence.status]}</Text>
          <Text style={styles.occurrenceId}>{currentOccurrence.id}</Text>
        </View>

        <View style={styles.steps}>
          {steps.map((step, index) => {
            const isActive =
              stepIndex >= index || currentOccurrence.status === 'finished';
            return (
              <View key={step} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    isActive && styles.stepDotActive,
                    currentOccurrence.status === step && styles.stepDotCurrent,
                  ]}
                />
                {index < steps.length - 1 && (
                  <View style={[styles.stepLine, isActive && styles.stepLineActive]} />
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color={colors.pink} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Localização</Text>
              <Text style={styles.infoValue}>
                {currentOccurrence.location?.address || 'Não compartilhada'}
              </Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color={colors.pink} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horário do alerta</Text>
              <Text style={styles.infoValue}>
                {new Date(currentOccurrence.createdAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
          {currentOccurrence.acceptedBy && (
            <View style={[styles.infoCard, styles.acceptedCard]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Atendido por</Text>
                <Text style={[styles.infoValue, { color: colors.success }]}>
                  {currentOccurrence.acceptedBy.name}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.timelineTitle}>Linha do tempo</Text>
        <View style={styles.timeline}>
          {(currentOccurrence.events ?? []).map((ev, i) => (
            <View key={`${ev.at}-${i}`} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.timelineText}>{ev.text}</Text>
                <Text style={styles.timelineTime}>
                  {new Date(ev.at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          {currentOccurrence.status === 'waiting' && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                setRole('desk');
                navigation.navigate('Desk');
              }}
            >
              <Ionicons name="briefcase" size={20} color={colors.white} />
              <Text style={styles.primaryButtonText}>Abrir central e aceitar</Text>
            </Pressable>
          )}
          {(currentOccurrence.status === 'accepted' ||
            currentOccurrence.status === 'in_progress') && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Location')}
            >
              <Ionicons name="map" size={20} color={colors.white} />
              <Text style={styles.primaryButtonText}>Acompanhar no mapa</Text>
            </Pressable>
          )}
          {currentOccurrence.status !== 'finished' &&
            currentOccurrence.status !== 'cancelled' && (
              <>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => {
                    updateOccurrenceStatus(currentOccurrence.id, 'finished');
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.secondaryButtonText}>
                    Encerrar (quando estiver segura)
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => {
                    cancelActive();
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Cancelar alerta</Text>
                </Pressable>
              </>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
  scroll: { paddingBottom: spacing.xxxl },
  mainStatus: { alignItems: 'center', paddingVertical: spacing.xl },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  statusLabel: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.white,
    textAlign: 'center',
  },
  occurrenceId: { fontSize: typography.size.sm, color: colors.gray, marginTop: spacing.sm },
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.grayDark },
  stepDotActive: { backgroundColor: colors.pink },
  stepDotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.pinkLight,
  },
  stepLine: { width: 36, height: 2, backgroundColor: colors.grayDark },
  stepLineActive: { backgroundColor: colors.pink },
  infoSection: { paddingHorizontal: spacing.xl, gap: spacing.md },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  acceptedCard: { borderWidth: 1, borderColor: colors.success + '40' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: typography.size.xs, color: colors.gray },
  infoValue: {
    fontSize: typography.size.md,
    color: colors.white,
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
  timelineTitle: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    color: colors.gray,
    fontSize: typography.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeline: { paddingHorizontal: spacing.xl, marginTop: spacing.md, gap: spacing.md },
  timelineItem: { flexDirection: 'row', gap: spacing.md },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.pink,
    marginTop: 4,
  },
  timelineText: { color: colors.white, fontSize: typography.size.sm },
  timelineTime: { color: colors.grayDark, fontSize: typography.size.xs, marginTop: 2 },
  actions: { marginTop: spacing.xl, paddingHorizontal: spacing.xl, gap: spacing.md },
  primaryButton: {
    backgroundColor: colors.pink,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  secondaryButton: { paddingVertical: spacing.md, alignItems: 'center' },
  secondaryButtonText: { color: colors.gray, fontSize: typography.size.sm },
  noData: { color: colors.gray, textAlign: 'center', marginTop: 100, fontSize: typography.size.lg },
  backButton: { marginTop: spacing.xl, alignSelf: 'center', padding: spacing.lg },
  backButtonText: { color: colors.pink, fontSize: typography.size.md },
});
