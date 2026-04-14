import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Image, ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { theme } from '../theme';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.updateProfile({ name, email });
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          setLoggingOut(true);
          await logout();
        }
      }
    ]);
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Avatar */}
      <View style={s.avatarSection}>
        <View style={s.avatarWrap}>
          {user?.profileImage
            ? <Image source={{ uri: user.profileImage }} style={s.avatarImg} />
            : <Text style={s.avatarInitial}>{user?.name?.[0] || 'U'}</Text>
          }
        </View>
        <Text style={s.displayName}>{user?.name}</Text>
        <Text style={s.displayEmail}>{user?.email}</Text>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statEmoji}>⭐</Text>
            <Text style={s.statVal}>{user?.stars || 0}</Text>
            <Text style={s.statLabel}>Stars</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statCard}>
            <Text style={s.statEmoji}>✅</Text>
            <Text style={[s.statVal, { color: theme.success }]}>{user?.assessmentsPassed || 0}</Text>
            <Text style={s.statLabel}>Passed</Text>
          </View>
        </View>
      </View>

      {/* Edit Form */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Edit Profile</Text>

        {message && (
          <View style={[s.message, message.type === 'success' ? s.messageSuccess : s.messageError]}>
            <Text style={[s.messageText, { color: message.type === 'success' ? theme.success : theme.danger }]}>
              {message.text}
            </Text>
          </View>
        )}

        <View style={s.field}>
          <Text style={s.label}>Full Name</Text>
          <TextInput
            style={s.input} value={name} onChangeText={setName}
            placeholder="Your name" placeholderTextColor={theme.textMuted}
            autoCapitalize="words"
          />
        </View>
        <View style={s.field}>
          <Text style={s.label}>Email Address</Text>
          <TextInput
            style={s.input} value={email} onChangeText={setEmail}
            placeholder="your@email.com" placeholderTextColor={theme.textMuted}
            keyboardType="email-address" autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[s.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.saveBtnText}>Save Changes</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={s.logoutBtn}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={s.logoutText}>{loggingOut ? 'Signing out…' : '🚪 Sign Out'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  avatarSection: {
    alignItems: 'center', paddingTop: 36, paddingBottom: 28,
    backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  avatarWrap: {
    width: 88, height: 88, borderRadius: 44, overflow: 'hidden',
    backgroundColor: theme.secondary, borderWidth: 3, borderColor: theme.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 36, fontWeight: '900', color: theme.primary },
  displayName: { fontSize: 22, fontWeight: '900', color: theme.text, letterSpacing: -0.5 },
  displayEmail: { fontSize: 13, color: theme.textMuted, marginTop: 4, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row', backgroundColor: theme.secondary, borderRadius: 20,
    paddingVertical: 14, paddingHorizontal: 32,
    borderWidth: 1, borderColor: theme.border,
  },
  statCard: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, backgroundColor: theme.border, marginHorizontal: 16 },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statVal: { fontSize: 22, fontWeight: '900', color: theme.primary },
  statLabel: { fontSize: 11, color: theme.textMuted, marginTop: 2, fontWeight: '600' },
  card: { margin: 16, backgroundColor: theme.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: theme.border },
  cardTitle: { fontSize: 16, fontWeight: '900', color: theme.text, marginBottom: 20, letterSpacing: -0.3 },
  message: { borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1 },
  messageSuccess: { backgroundColor: '#f0fdf4', borderColor: theme.success },
  messageError: { backgroundColor: '#fff5f5', borderColor: theme.danger },
  messageText: { fontSize: 13, fontWeight: '700' },
  field: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '800', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1.5, borderColor: theme.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: theme.text, fontWeight: '600',
    backgroundColor: theme.secondary,
  },
  saveBtn: {
    backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 4,
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  logoutBtn: {
    margin: 16, padding: 16, backgroundColor: '#fff5f5',
    borderRadius: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#fecaca',
  },
  logoutText: { color: theme.danger, fontSize: 15, fontWeight: '800' },
});
