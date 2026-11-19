import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

const services = [
  {
    id: '180',
    title: 'Central 180',
    description: 'Disque Denúncia — ligação gratuita',
    icon: 'call' as const,
    action: 'tel:180',
  },
  {
    id: '190',
    title: 'Polícia Militar 190',
    description: 'Emergência imediata',
    icon: 'shield' as const,
    action: 'tel:190',
  },
  {
    id: 'places',
    title: 'Lugares seguros',
    description: 'Casa, trabalho e rotas de confiança',
    icon: 'home' as const,
    nav: 'Places',
  },
  {
    id: 'device',
    title: 'Dispositivo físico',
    description: 'Botão discreto e pareamento BLE',
    icon: 'hardware-chip' as const,
    nav: 'Device',
  },
  {
    id: 'desk',
    title: 'Central de atendimento',
    description: 'Aceitar ocorrências (hotel / ronda / delegacia)',
    icon: 'briefcase' as const,
    nav: 'Desk',
  },
  {
    id: 'tips',
    title: 'Orientações rápidas',
    description: 'Check-in, rede e o que fazer no alerta',
    icon: 'book' as const,
  },
];

export default function SecurityScreen({ navigation }: any) {
  const { setRole, startCheckIn } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.header}>
        <Text style={styles.title}>Segurança e suporte</Text>
        <Text style={styles.subtitle}>Canais oficiais, dispositivo e central</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <Pressable style={styles.checkBanner} onPress={() => startCheckIn(15)}>
          <Ionicons name="timer-outline" size={22} color={colors.pink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.checkTitle}>Iniciar check-in de 15 min</Text>
            <Text style={styles.checkSub}>Se não confirmar, o SOS dispara</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray} />
        </Pressable>

        {services.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => {
              if (item.action) Linking.openURL(item.action).catch(() => {});
              if (item.nav === 'Desk') {
                setRole('desk');
                navigation.navigate('Desk');
              } else if (item.nav) {
                navigation.navigate(item.nav);
              }
            }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={24} color={colors.pink} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
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
  subtitle: { fontSize: typography.size.sm, color: colors.gray, marginTop: 4 },
  list: { padding: spacing.xl, paddingBottom: 40 },
  checkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.pink20,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  checkTitle: { color: colors.white, fontWeight: typography.weight.semibold },
  checkSub: { color: colors.gray, fontSize: typography.size.xs, marginTop: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.pink20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1, marginLeft: spacing.md },
  cardTitle: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  cardDescription: { color: colors.gray, fontSize: typography.size.sm, marginTop: 2 },
});
