import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function LocationScreen() {
  const { currentOccurrence, isEmergencyMode } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View style={styles.header}>
        <Text style={styles.title}>Localização</Text>
        <Text style={styles.subtitle}>
          {isEmergencyMode
            ? 'Compartilhando localização em tempo real'
            : 'Sua localização atual'}
        </Text>
      </View>

      {/* Map Placeholder (dark mode) */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color={colors.grayDark} />
          <Text style={styles.mapText}>Mapa em modo escuro</Text>
          <Text style={styles.mapSub}>
            (Integração com react-native-maps será adicionada)
          </Text>

          {currentOccurrence?.location && (
            <View style={styles.marker}>
              <Ionicons name="location" size={32} color={colors.pink} />
              <Text style={styles.markerText}>Você está aqui</Text>
            </View>
          )}
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.infoCard}>
        <Ionicons name="navigate" size={22} color={colors.pink} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Coordenadas</Text>
          <Text style={styles.infoValue}>
            {currentOccurrence?.location
              ? `${currentOccurrence.location.latitude.toFixed(5)}, ${currentOccurrence.location.longitude.toFixed(5)}`
              : 'Aguardando permissão de localização'}
          </Text>
        </View>
      </View>

      {isEmergencyMode && currentOccurrence?.acceptedBy && (
        <View style={[styles.infoCard, { borderColor: colors.success + '40', borderWidth: 1 }]}>
          <Ionicons name="shield-checkmark" size={22} color={colors.success} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Profissional a caminho</Text>
            <Text style={[styles.infoValue, { color: colors.success }]}>
              {currentOccurrence.acceptedBy.name}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.gray,
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    margin: spacing.xl,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.blackSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    color: colors.gray,
    marginTop: spacing.md,
    fontSize: typography.size.md,
  },
  mapSub: {
    color: colors.grayDark,
    fontSize: typography.size.xs,
    marginTop: 4,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerText: {
    color: colors.pink,
    fontSize: typography.size.sm,
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSecondary,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.size.xs,
    color: colors.gray,
  },
  infoValue: {
    fontSize: typography.size.md,
    color: colors.white,
    fontWeight: typography.weight.medium,
    marginTop: 2,
  },
});
