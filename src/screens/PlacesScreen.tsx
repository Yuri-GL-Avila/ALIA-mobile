import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafePlace } from '../types';

export default function PlacesScreen({ navigation }: any) {
  const { places, activePlaceId, setActivePlaceId, addPlace, removePlace } = useApp();
  const [modal, setModal] = useState(false);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');

  const save = () => {
    if (!label.trim() || !address.trim()) {
      Alert.alert('Atenção', 'Nome e endereço são obrigatórios.');
      return;
    }
    addPlace(label, address);
    setLabel('');
    setAddress('');
    setModal(false);
  };

  const renderItem = ({ item }: { item: SafePlace }) => {
    const active = item.id === activePlaceId;
    return (
      <Pressable
        style={[styles.card, active && styles.cardActive]}
        onPress={() => setActivePlaceId(item.id)}
      >
        <View style={styles.icon}>
          <Ionicons
            name={active ? 'location' : 'location-outline'}
            size={22}
            color={active ? colors.pink : colors.gray}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.label}</Text>
          <Text style={styles.addr}>{item.address}</Text>
          {active && <Text style={styles.activeTag}>Usado no próximo alerta</Text>}
        </View>
        <Pressable
          onPress={() =>
            Alert.alert('Remover lugar', `Remover ${item.label}?`, [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Remover', style: 'destructive', onPress: () => removePlace(item.id) },
            ])
          }
          hitSlop={10}
        >
          <Ionicons name="trash-outline" size={20} color={colors.gray} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <View>
          <Text style={styles.title}>Lugares seguros</Text>
          <Text style={styles.subtitle}>Casa, trabalho e rotas que você confia</Text>
        </View>
      </View>

      <FlatList
        data={places}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum lugar cadastrado.</Text>
        }
      />

      <Pressable style={styles.fab} onPress={() => setModal(true)}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Novo lugar</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome (ex: Casa)"
              placeholderTextColor={colors.gray}
              value={label}
              onChangeText={setLabel}
            />
            <TextInput
              style={styles.input}
              placeholder="Endereço ou referência"
              placeholderTextColor={colors.gray}
              value={address}
              onChangeText={setAddress}
            />
            <View style={styles.actions}>
              <Pressable style={styles.cancel} onPress={() => setModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.save} onPress={save}>
                <Text style={styles.saveText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  subtitle: { fontSize: typography.size.sm, color: colors.gray, marginTop: 2 },
  list: { padding: spacing.xl, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardActive: { borderColor: colors.pink },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.pink20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: colors.white, fontWeight: typography.weight.semibold },
  addr: { color: colors.gray, fontSize: typography.size.sm, marginTop: 2 },
  activeTag: { color: colors.pinkLight, fontSize: typography.size.xs, marginTop: 4 },
  empty: { color: colors.gray, textAlign: 'center', marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.blackSecondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  modalTitle: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.blackTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    color: colors.white,
    marginBottom: spacing.md,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  cancel: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.blackTertiary,
    borderRadius: borderRadius.md,
  },
  cancelText: { color: colors.gray },
  save: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.pink,
    borderRadius: borderRadius.md,
  },
  saveText: { color: colors.white, fontWeight: typography.weight.semibold },
});
