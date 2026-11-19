import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('usuarioalia1@alia.com');
  const [password, setPassword] = useState('1234user1234');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setError('');
    setLoading(true);

    // Pequena pausa para feedback visual
    await new Promise<void>((resolve) => setTimeout(resolve, 400));

    try {
      const result = await login(email, password);

      if (!result.ok) {
        setError(result.message || 'Não foi possível entrar.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* <StatusBar barStyle="light-content" backgroundColor={colors.black} /> */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <View style={styles.mark}>
              <Ionicons name="shield" size={32} color={colors.pink} />
            </View>
            <Text style={styles.logo}>ALIA</Text>
            <Text style={styles.tagline}>Alerta discreto · rede de apoio</Text>
          </View>

          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>
            Acesse sua conta para configurar a rede de proteção e o dispositivo.
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={colors.gray} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.grayDark}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.gray} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••"
              placeholderTextColor={colors.grayDark}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.gray}
              />
            </Pressable>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Conta de demonstração</Text>
            <Text style={styles.demoLine}>Nome: Ana Beatriz</Text>
            <Text style={styles.demoLine}>E-mail: usuarioalia1@alia.com</Text>
            <Text style={styles.demoLine}>Senha: 1234user1234</Text>
            <Text style={styles.demoLine}>Cidade: Hortolândia, SP</Text>
          </View>

          {/* <Text style={styles.footer}>
            Login local neste protótipo. Não há servidor real de autenticação.
          </Text> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  scroll: { padding: spacing.xl, paddingBottom: spacing.huge },
  brand: { alignItems: 'center', marginTop: spacing.xxl, marginBottom: spacing.xxl },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.pink20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    fontSize: 28,
    fontWeight: typography.weight.bold,
    color: colors.pink,
    letterSpacing: 4,
  },
  tagline: { color: colors.gray, fontSize: typography.size.sm, marginTop: 6 },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  subtitle: {
    color: colors.gray,
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  label: {
    color: colors.gray,
    fontSize: typography.size.xs,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    minHeight: 52,
  },
  input: { flex: 1, color: colors.white, fontSize: typography.size.md, paddingVertical: 12 },
  error: { color: colors.danger, marginBottom: spacing.md, fontSize: typography.size.sm },
  button: {
    backgroundColor: colors.pink,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.md,
  },
  demoBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.blackSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  demoTitle: {
    color: colors.pinkLight,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.sm,
  },
  demoLine: { color: colors.gray, fontSize: typography.size.sm, marginTop: 2 },
  footer: {
    textAlign: 'center',
    color: colors.grayDark,
    fontSize: typography.size.xs,
    marginTop: spacing.xl,
    lineHeight: 16,
  },
});
