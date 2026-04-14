import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name) { Alert.alert('Error', 'Please enter your name'); setLoading(false); return; }
        await register(name, email, password);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={s.logoWrap}>
          <Text style={s.logoText}>Prompt<Text style={s.logoBrand}>Pal</Text></Text>
          <Text style={s.logoSub}>AI Prompting for Everyone</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          {/* Tab Switcher */}
          <View style={s.tabs}>
            {(['login', 'register'] as const).map(m => (
              <TouchableOpacity key={m} style={[s.tab, mode === m && s.tabActive]} onPress={() => setMode(m)}>
                <Text style={[s.tabText, mode === m && s.tabTextActive]}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fields */}
          {mode === 'register' && (
            <View style={s.field}>
              <Text style={s.label}>Full Name</Text>
              <TextInput
                style={s.input} value={name} onChangeText={setName}
                placeholder="Your name" placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
              />
            </View>
          )}
          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input} value={email} onChangeText={setEmail}
              placeholder="you@example.com" placeholderTextColor={theme.textMuted}
              keyboardType="email-address" autoCapitalize="none"
            />
          </View>
          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <TextInput
              style={s.input} value={password} onChangeText={setPassword}
              placeholder="••••••••" placeholderTextColor={theme.textMuted}
              secureTextEntry
            />
          </View>

          {/* Submit */}
          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
            }
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 36 },
  logoText: { fontSize: 36, fontWeight: '900', color: theme.text, letterSpacing: -1 },
  logoBrand: { color: theme.primary },
  logoSub: { fontSize: 13, color: theme.textMuted, marginTop: 4, fontWeight: '600' },
  card: {
    backgroundColor: theme.card, borderRadius: 28, padding: 28,
    borderWidth: 1, borderColor: theme.border,
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  tabs: { flexDirection: 'row', backgroundColor: theme.secondary, borderRadius: 16, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: theme.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: theme.textMuted },
  tabTextActive: { color: '#fff' },
  field: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '800', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1.5, borderColor: theme.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: theme.text, fontWeight: '600',
    backgroundColor: theme.secondary,
  },
  btn: {
    backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});
