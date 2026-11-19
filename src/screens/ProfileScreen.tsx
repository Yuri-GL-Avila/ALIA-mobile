import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateUser, settings, updateSettings, setRole } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState(user?.city ?? 'Hortolândia, SP');

  const saveProfile = () => {
    updateUser({
      name: name.trim() || user?.name,
      phone: phone.trim() || user?.phone,
      city: city.trim() || user?.city,
    });
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'AB'}
            </Text>
          </View>
          {!editing ? (
            <>
              <Text style={styles.name}>{user?.name || 'Usuária'}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.phone}>{user?.phone}</Text>
              <View style={styles.cityRow}>
                <Ionicons name="location-outline" size={14} color={colors.pinkLight} />
                <Text style={styles.city}>{user?.city || 'Hortolândia, SP'}</Text>
              </View>
              <Pressable style={styles.editBtn} onPress={() => setEditing(true)}>
                <Text style={styles.editBtnText}>Editar perfil</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.editForm}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput
                style={styles.field}
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.grayDark}
              />
              <Text style={styles.fieldLabel}>Telefone</Text>
              <TextInput
                style={styles.field}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={colors.grayDark}
              />
              <Text style={styles.fieldLabel}>Cidade</Text>
              <TextInput
                style={styles.field}
                value={city}
                onChangeText={setCity}
                placeholderTextColor={colors.grayDark}
              />
              <View style={styles.editActions}>
                <Pressable style={styles.cancelEdit} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelEditText}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.saveEdit} onPress={saveProfile}>
                  <Text style={styles.saveEditText}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.section}>Dados da conta</Text>
        <View style={styles.menu}>
          <InfoRow icon="person-outline" label="Nome completo" value={user?.name || '—'} />
          <InfoRow icon="mail-outline" label="E-mail" value={user?.email || '—'} />
          <InfoRow icon="call-outline" label="Telefone" value={user?.phone || '—'} />
          <InfoRow
            icon="location-outline"
            label="Cidade"
            value={user?.city || 'Hortolândia, SP'}
          />
        </View>

        <Text style={styles.section}>Privacidade e segurança</Text>
        <View style={styles.menu}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Compartilhar localização no alerta</Text>
              <Text style={styles.menuDetail}>Só quem aceitar a ocorrência vê o ponto</Text>
            </View>
            <Switch
              value={settings.shareLocation}
              onValueChange={(v) => updateSettings({ shareLocation: v })}
              trackColor={{ false: colors.grayDark, true: colors.pink }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Avisar contatos de confiança</Text>
              <Text style={styles.menuDetail}>Quem está marcado na rede recebe o SOS</Text>
            </View>
            <Switch
              value={settings.notifyContacts}
              onValueChange={(v) => updateSettings({ notifyContacts: v })}
              trackColor={{ false: colors.grayDark, true: colors.pink }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Modo discreto</Text>
              <Text style={styles.menuDetail}>Reduz destaque visual (demo)</Text>
            </View>
            <Switch
              value={settings.discreetMode}
              onValueChange={(v) => updateSettings({ discreetMode: v })}
              trackColor={{ false: colors.grayDark, true: colors.pink }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Text style={styles.section}>Atalhos</Text>
        <View style={styles.menu}>
          <MenuRow
            label="Lugares seguros"
            icon="home-outline"
            onPress={() => navigation.navigate('Places')}
          />
          <MenuRow
            label="Dispositivo físico"
            icon="hardware-chip-outline"
            onPress={() => navigation.navigate('Device')}
          />
          <MenuRow
            label="Histórico de ocorrências"
            icon="time-outline"
            onPress={() => navigation.navigate('History')}
          />
          <MenuRow
            label="Central de atendimento"
            icon="briefcase-outline"
            detail="Simula hotel, ronda ou delegacia aceitando"
            onPress={() => {
              setRole('desk');
              navigation.navigate('Desk');
            }}
          />
        </View>

        <Pressable
          style={styles.logout}
          onPress={() =>
            Alert.alert('Sair', 'Deseja sair da sua conta?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive', onPress: () => logout() },
            ])
          }
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
        <Text style={styles.version}>ALIA v1.2 · login + perfil</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.gray} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuRow({
  label,
  detail,
  icon,
  onPress,
}: {
  label: string;
  detail?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.gray} />
      <View style={{ flex: 1 }}>
        <Text style={styles.menuText}>{label}</Text>
        {detail ? <Text style={styles.menuDetail}>{detail}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.grayDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  content: { paddingBottom: 40 },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.pink20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarText: { fontSize: 32, fontWeight: typography.weight.bold, color: colors.pink },
  name: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.white },
  email: { fontSize: typography.size.sm, color: colors.gray, marginTop: 4 },
  phone: { fontSize: typography.size.sm, color: colors.gray, marginTop: 2 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  city: { color: colors.pinkLight, fontSize: typography.size.sm },
  editBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.blackSecondary,
  },
  editBtnText: { color: colors.white, fontSize: typography.size.sm },
  editForm: { width: '100%', marginTop: spacing.md },
  fieldLabel: {
    color: colors.gray,
    fontSize: typography.size.xs,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  field: {
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.white,
    marginBottom: spacing.md,
  },
  editActions: { flexDirection: 'row', gap: spacing.sm },
  cancelEdit: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.blackTertiary,
    borderRadius: borderRadius.md,
  },
  cancelEditText: { color: colors.gray },
  saveEdit: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.pink,
    borderRadius: borderRadius.md,
  },
  saveEditText: { color: colors.white, fontWeight: typography.weight.semibold },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    color: colors.gray,
    fontSize: typography.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menu: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackTertiary,
  },
  infoLabel: { color: colors.gray, fontSize: typography.size.xs },
  infoValue: { color: colors.white, fontSize: typography.size.md, marginTop: 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackTertiary,
    gap: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackTertiary,
    gap: spacing.md,
  },
  menuText: { color: colors.white, fontSize: typography.size.md },
  menuDetail: { color: colors.gray, fontSize: typography.size.xs, marginTop: 2 },
  logout: { alignItems: 'center', padding: spacing.lg },
  logoutText: { color: colors.danger },
  version: {
    textAlign: 'center',
    color: colors.grayDark,
    fontSize: typography.size.xs,
    marginTop: spacing.md,
  },
});
