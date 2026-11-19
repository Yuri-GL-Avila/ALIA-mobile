import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Occurrence, OccurrenceStatus } from '../types';

const statusLabels: Record<OccurrenceStatus, string> = {
  sending: 'Enviando',
  sent: 'Enviado',
  waiting: 'Aguardando',
  accepted: 'Aceito',
  in_progress: 'Em andamento',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

const statusColors: Record<OccurrenceStatus, string> = {
  sending: colors.warning,
  sent: colors.info,
  waiting: colors.warning,
  accepted: colors.success,
  in_progress: colors.pink,
  finished: colors.success,
  cancelled: colors.gray,
};

export default function HistoryScreen() {
  const { occurrences } = useApp();

  const renderItem = ({ item }: { item: Occurrence }) => (
    <Pressable style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.code}>#{item.id.slice(-8).toUpperCase()}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: statusColors[item.status] + '25' },
          ]}
        >
          <Text style={[styles.badgeText, { color: statusColors[item.status] }]}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={16} color={colors.gray} />
        <Text style={styles.rowText}>
          {new Date(item.createdAt).toLocaleString('pt-BR')}
        </Text>
      </View>

      {item.location?.address && (
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={colors.gray} />
          <Text style={styles.rowText}>{item.location.address}</Text>
        </View>
      )}

      {item.acceptedBy && (
        <View style={styles.row}>
          <Ionicons name="person-outline" size={16} color={colors.gray} />
          <Text style={styles.rowText}>{item.acceptedBy.name}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Alertas e ocorrências anteriores</Text>
      </View>

      <FlatList
        data={occurrences}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={48} color={colors.grayDark} />
            <Text style={styles.emptyText}>Nenhuma ocorrência ainda</Text>
            <Text style={styles.emptySub}>
              Seus alertas aparecerão aqui
            </Text>
          </View>
        }
      />
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
  list: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  code: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 6,
  },
  rowText: {
    color: colors.gray,
    fontSize: typography.size.sm,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: colors.gray,
    fontSize: typography.size.lg,
    marginTop: spacing.lg,
  },
  emptySub: {
    color: colors.grayDark,
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
  },
});
