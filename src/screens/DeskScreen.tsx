import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Occurrence, STATUS_LABELS } from '../types';

export default function DeskScreen({ navigation }: any) {
  const { occurrences, units, acceptAlert, updateOccurrenceStatus, setRole, user } =
    useApp();
  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id ?? '');

  const open = occurrences.filter((o) =>
    ['waiting', 'sent', 'sending', 'accepted', 'in_progress'].includes(o.status),
  );

  const handleAccept = (occ: Occurrence) => {
    const ok = acceptAlert(occ.id, selectedUnitId);
    if (!ok) {
      Alert.alert(
        'Não disponível',
        'Essa ocorrência já foi assumida por outro profissional ou foi encerrada.',
      );
    }
  };

  const renderItem = ({ item }: { item: Occurrence }) => {
    const canAccept = ['waiting', 'sent', 'sending'].includes(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.code}>{item.id}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{STATUS_LABELS[item.status]}</Text>
          </View>
        </View>
        <Text style={styles.meta}>
          {new Date(item.createdAt).toLocaleString('pt-BR')}
        </Text>
        <Text style={styles.meta}>
          {item.placeLabel ? `${item.placeLabel} · ` : ''}
          {item.location?.address ?? 'Local oculto'}
        </Text>
        {item.reason ? <Text style={styles.reason}>{item.reason}</Text> : null}
        {item.acceptedBy ? (
          <Text style={styles.accepted}>Assumida por {item.acceptedBy.name}</Text>
        ) : null}

        {canAccept ? (
          <Pressable style={styles.acceptBtn} onPress={() => handleAccept(item)}>
            <Ionicons name="hand-left" size={18} color={colors.white} />
            <Text style={styles.acceptText}>Aceitar primeiro</Text>
          </Pressable>
        ) : item.status === 'accepted' || item.status === 'in_progress' ? (
          <View style={styles.rowActions}>
            {item.status === 'accepted' && (
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => updateOccurrenceStatus(item.id, 'in_progress')}
              >
                <Text style={styles.secondaryText}>Em deslocamento</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => updateOccurrenceStatus(item.id, 'finished')}
            >
              <Text style={styles.secondaryText}>Finalizar</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.header}>
        <Pressable onPress={() => setRole('woman')} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Central ALIA</Text>
          <Text style={styles.subtitle}>
            Aceite como profissional · estilo Uber (primeiro leva)
          </Text>
        </View>
      </View>

      <Text style={styles.section}>Atuando como</Text>
      <View style={styles.units}>
        {units.map((u) => {
          const on = selectedUnitId === u.id;
          return (
            <Pressable
              key={u.id}
              onPress={() => setSelectedUnitId(u.id)}
              style={[styles.unitChip, on && styles.unitChipOn]}
            >
              <Text style={[styles.unitText, on && styles.unitTextOn]}>{u.name}</Text>
              <Text style={styles.unitKind}>
                {u.kind} · {u.area}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={open}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.grayDark} />
            <Text style={styles.emptyText}>Nenhuma ocorrência na fila</Text>
            <Text style={styles.emptySub}>
              Dispare um SOS no app da mulher neste mesmo aparelho para testar.
            </Text>
          </View>
        }
      />

      <Pressable style={styles.exit} onPress={() => setRole('woman')}>
        <Text style={styles.exitText}>Voltar ao app da mulher ({user?.name?.split(' ')[0]})</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  subtitle: { fontSize: typography.size.xs, color: colors.gray, marginTop: 2 },
  section: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.xl,
    fontSize: typography.size.xs,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  units: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, gap: spacing.sm },
  unitChip: {
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitChipOn: { borderColor: colors.pink },
  unitText: { color: colors.white, fontWeight: typography.weight.semibold },
  unitTextOn: { color: colors.pinkLight },
  unitKind: { color: colors.gray, fontSize: typography.size.xs, marginTop: 2 },
  list: { padding: spacing.xl, paddingBottom: 40 },
  card: {
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  code: { color: colors.white, fontWeight: typography.weight.semibold },
  badge: {
    backgroundColor: colors.pink20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: { color: colors.pinkLight, fontSize: typography.size.xs },
  meta: { color: colors.gray, fontSize: typography.size.sm, marginTop: 6 },
  reason: { color: colors.white, marginTop: spacing.sm, fontSize: typography.size.sm },
  accepted: { color: colors.success, marginTop: spacing.sm, fontSize: typography.size.sm },
  acceptBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.pink,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  acceptText: { color: colors.white, fontWeight: typography.weight.semibold },
  rowActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.blackTertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryText: { color: colors.white, fontSize: typography.size.sm },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.gray, marginTop: spacing.lg, fontSize: typography.size.lg },
  emptySub: {
    color: colors.grayDark,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  exit: { padding: spacing.lg, alignItems: 'center' },
  exitText: { color: colors.pink, fontSize: typography.size.sm },
});
