import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function DeviceScreen() {
  const { device, setDeviceStatus } = useApp();

  const handlePair = () => {
    setDeviceStatus({ status: 'searching' });
    // Simulate search (demo)
    setTimeout(() => {
      Alert.alert(
        'Demonstração',
        'A integração real com Bluetooth Low Energy (BLE) ainda não está implementada. Este é um fluxo simulado.',
        [
          {
            text: 'Simular conexão',
            onPress: () =>
              setDeviceStatus({
                connected: true,
                status: 'connected',
                battery: 87,
                deviceId: 'ALIA-BTN-001',
                lastSeen: new Date().toISOString(),
              }),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    }, 1500);
  };

  const handleDisconnect = () => {
    setDeviceStatus({
      connected: false,
      status: 'disconnected',
      battery: undefined,
      deviceId: undefined,
    });
  };

  const statusLabel = {
    connected: 'Conectado',
    disconnected: 'Desconectado',
    searching: 'Procurando dispositivo...',
    low_battery: 'Bateria baixa',
    unknown: 'Dispositivo não identificado',
  }[device.status];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View style={styles.header}>
        <Text style={styles.title}>Dispositivo Físico</Text>
        <Text style={styles.subtitle}>
          Botão de emergência discreto
        </Text>
      </View>

      {/* Device Status Card */}
      <View style={styles.statusCard}>
        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor: device.connected
                ? colors.success + '20'
                : colors.grayDark + '40',
            },
          ]}
        >
          <Ionicons
            name={device.connected ? 'bluetooth' : 'bluetooth-outline'}
            size={40}
            color={device.connected ? colors.success : colors.gray}
          />
        </View>
        <Text style={styles.statusTitle}>{statusLabel}</Text>
        {device.deviceId && (
          <Text style={styles.deviceId}>ID: {device.deviceId}</Text>
        )}
        {device.battery !== undefined && (
          <View style={styles.batteryRow}>
            <Ionicons
              name={device.battery > 20 ? 'battery-half' : 'battery-dead'}
              size={18}
              color={device.battery > 20 ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.batteryText,
                { color: device.battery > 20 ? colors.success : colors.danger },
              ]}
            >
              {device.battery}%
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!device.connected ? (
          <Pressable style={styles.primaryButton} onPress={handlePair}>
            <Ionicons name="search" size={20} color={colors.white} />
            <Text style={styles.primaryText}>Parear dispositivo</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.secondaryButton}
              onPress={() =>
                Alert.alert('Teste', 'Teste de funcionamento enviado (demo).')
              }
            >
              <Ionicons name="flash" size={20} color={colors.pink} />
              <Text style={styles.secondaryText}>Testar funcionamento</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={handleDisconnect}>
              <Text style={styles.dangerText}>Desconectar</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={colors.gray} />
        <Text style={styles.infoText}>
          O dispositivo é pequeno e discreto, instalado na roupa íntima. A
          comunicação usa Bluetooth Low Energy (BLE). Esta tela está preparada
          para integração real — atualmente em modo demonstração.
        </Text>
      </View>
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
  statusCard: {
    margin: spacing.xl,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  statusTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
  deviceId: {
    fontSize: typography.size.sm,
    color: colors.gray,
    marginTop: spacing.sm,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  batteryText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.pink,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryText: {
    color: colors.pink,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  dangerButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dangerText: {
    color: colors.danger,
    fontSize: typography.size.sm,
  },
  infoBox: {
    flexDirection: 'row',
    margin: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    color: colors.gray,
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
});
