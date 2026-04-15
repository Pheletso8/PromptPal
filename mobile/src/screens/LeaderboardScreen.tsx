import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, RefreshControl, Image
} from 'react-native';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await api.getLeaderboard();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const topRankIcons = [
    { name: 'medal', color: '#facc15' },
    { name: 'trophy', color: '#9ca3af' },
    { name: 'podium', color: '#fb923c' },
  ];

  const renderRow = ({ item, index }: { item: any; index: number }) => {
    const isMe = item._id === user?._id;
    return (
      <View style={[s.row, isMe && s.rowMe]}>
        <View style={s.rankIconWrap}>
          {index < 3 ? (
            <MaterialCommunityIcons
              name={topRankIcons[index].name}
              size={22}
              color={topRankIcons[index].color}
            />
          ) : (
            <Text style={s.rank}>#{index + 1}</Text>
          )}
        </View>
        <View style={s.avatar}>
          {item.profileImage
            ? <Image source={{ uri: item.profileImage }} style={s.avatarImg} />
            : <Text style={s.avatarInitial}>{item.name?.[0] || '?'}</Text>
          }
        </View>
        <View style={s.nameCol}>
          <Text style={s.name} numberOfLines={1}>{item.name}{isMe ? ' (You)' : ''}</Text>
          <Text style={s.passedText}>{item.assessmentsPassed || 0} passed</Text>
        </View>
        <View style={s.starsBadge}>
          <MaterialCommunityIcons name="star" size={14} color="#b45309" style={s.starsIcon} />
          <Text style={s.starsText}>{item.stars || 0}</Text>
        </View>
      </View>
    );
  };

  const SkeletonRow = () => (
    <View style={[s.row, { gap: 12 }]}>
      <View style={{ width: 28, height: 28, backgroundColor: theme.secondary, borderRadius: 14 }} />
      <View style={{ width: 44, height: 44, backgroundColor: theme.secondary, borderRadius: 22 }} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ width: '60%', height: 14, backgroundColor: theme.secondary, borderRadius: 6 }} />
        <View style={{ width: '40%', height: 11, backgroundColor: theme.secondary, borderRadius: 6 }} />
      </View>
    </View>
  );

  return (
    <View style={s.root}>
      <View style={s.bgAccent} />
      <View style={s.header}>
        <View style={s.headerTitleRow}>
          <MaterialCommunityIcons name="trophy-outline" size={22} color={theme.primary} style={s.headerTitleIcon} />
          <Text style={s.headerTitle}>Leaderboard</Text>
        </View>
        <Text style={s.headerSub}>Top students on PromptPal</Text>
      </View>

      {loading ? (
        <View style={{ padding: 16, gap: 8 }}>
          {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={i => i._id}
          renderItem={renderRow}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={theme.primary} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>No entries yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.leaderboardBg, position: 'relative' },
  bgAccent: {
    position: 'absolute', top: -80, right: -60,
    width: 220, height: 220, borderRadius: 120,
    backgroundColor: 'rgba(245,158,11,0.16)',
  },
  header: {
    margin: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: theme.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  rowMe: { borderColor: theme.primary, backgroundColor: 'rgba(124,58,237,0.12)' },
  rank: { fontSize: 18, width: 32, textAlign: 'center' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.secondary, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', borderWidth: 1.5, borderColor: theme.border,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { fontSize: 18, fontWeight: '900', color: theme.primary },
  nameCol: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800', color: theme.text },
  passedText: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  starsBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#fde68a',
  },
  starsIcon: { marginRight: 6 },
  rankIconWrap: { width: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerTitleIcon: { marginRight: 8 },
  starsText: { fontSize: 13, fontWeight: '800', color: '#b45309' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '700', color: theme.textMuted },
});
