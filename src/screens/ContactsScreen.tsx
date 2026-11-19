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
import { Contact } from '../types';

export default function ContactsScreen() {
  const { contacts, addContact, updateContact, removeContact } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isEmergency, setIsEmergency] = useState(true);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('');
    setIsEmergency(true);
    setModalVisible(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship || '');
    setIsEmergency(contact.isEmergencyContact);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Atenção', 'Nome e telefone são obrigatórios.');
      return;
    }

    if (editingContact) {
      updateContact(editingContact.id, {
        name: name.trim(),
        phone: phone.trim(),
        relationship: relationship.trim(),
        isEmergencyContact: isEmergency,
      });
    } else {
      addContact({
        id: `c-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        relationship: relationship.trim(),
        isEmergencyContact: isEmergency,
      });
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Remover contato',
      'Tem certeza que deseja remover este contato da sua rede de proteção?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removeContact(id),
        },
      ]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <Pressable style={styles.contactCard} onPress={() => openEditModal(item)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.relationship ? (
          <Text style={styles.contactRelation}>{item.relationship}</Text>
        ) : null}
      </View>
      <View style={styles.contactActions}>
        {item.isEmergencyContact && (
          <View style={styles.emergencyBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.pink} />
          </View>
        )}
        <Pressable onPress={() => handleDelete(item.id)} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color={colors.gray} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View style={styles.header}>
        <Text style={styles.title}>Minha Rede de Proteção</Text>
        <Text style={styles.subtitle}>
          Contatos que receberão alertas em emergências
        </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.grayDark} />
            <Text style={styles.emptyText}>Nenhum contato cadastrado</Text>
            <Text style={styles.emptySub}>
              Adicione pessoas de confiança à sua rede
            </Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>

      {/* Modal Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingContact ? 'Editar contato' : 'Novo contato'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.gray}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor={colors.gray}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Relação (ex: Mãe, Amiga)"
              placeholderTextColor={colors.gray}
              value={relationship}
              onChangeText={setRelationship}
            />

            <Pressable
              style={styles.checkRow}
              onPress={() => setIsEmergency(!isEmergency)}
            >
              <Ionicons
                name={isEmergency ? 'checkbox' : 'square-outline'}
                size={24}
                color={isEmergency ? colors.pink : colors.gray}
              />
              <Text style={styles.checkLabel}>Receber alertas de emergência</Text>
            </Pressable>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
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
    paddingBottom: 100,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pink20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.pink,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.md,
  },
  contactInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  contactName: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  contactPhone: {
    color: colors.gray,
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  contactRelation: {
    color: colors.pinkLight,
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emergencyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.pink20,
    alignItems: 'center',
    justifyContent: 'center',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.pink,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.blackSecondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.white,
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.blackTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    color: colors.white,
    fontSize: typography.size.md,
    marginBottom: spacing.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  checkLabel: {
    color: colors.white,
    fontSize: typography.size.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.blackTertiary,
  },
  cancelText: {
    color: colors.gray,
    fontWeight: typography.weight.medium,
  },
  saveButton: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.pink,
  },
  saveText: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
  },
});
