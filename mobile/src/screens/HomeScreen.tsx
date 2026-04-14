import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api, type Course } from '../utils/api';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await api.getAssignedCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('CourseDetail', { id: item._id, title: item.title })}
      activeOpacity={0.8}
    >
      {item.image
        ? <Image source={{ uri: item.image }} style={s.cardImg} />
        : <View style={[s.cardImg, s.cardImgPlaceholder]}>
            <Text style={s.cardImgPlaceholderText}>{item.title[0]}</Text>
          </View>
      }
      <View style={s.cardBody}>
        <View style={s.tagRow}>
          <View style={s.tagPill}><Text style={s.tagText}>{item.tag}</Text></View>
        </View>
        <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
        <View style={s.cardFooter}>
          <Text style={s.cardFooterText}>{item.assessments?.length || 0} Questions</Text>
          <Text style={s.cardFooterText}>Pass: {item.passingThreshold}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const SkeletonCard = () => (
    <View style={[s.card, { overflow: 'hidden' }]}>
      <View style={[s.cardImg, { backgroundColor: theme.secondary }]} />
      <View style={s.cardBody}>
        <View style={{ width: 60, height: 18, backgroundColor: theme.secondary, borderRadius: 20, marginBottom: 10 }} />
        <View style={{ width: '80%', height: 20, backgroundColor: theme.secondary, borderRadius: 8, marginBottom: 8 }} />
        <View style={{ width: '100%', height: 14, backgroundColor: theme.secondary, borderRadius: 6 }} />
      </View>
    </View>
  );

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={s.subGreeting}>Continue your AI journey</Text>
        </View>
        <View style={s.statsRow}>
          <View style={s.statBadge}>
            <Text style={s.statEmoji}>⭐</Text>
            <Text style={s.statVal}>{user?.stars || 0}</Text>
          </View>
          <View style={[s.statBadge, { backgroundColor: '#d1fae5' }]}>
            <Text style={s.statEmoji}>✅</Text>
            <Text style={[s.statVal, { color: theme.success }]}>{user?.assessmentsPassed || 0}</Text>
          </View>
        </View>
      </View>

      {/* Course List */}
      <Text style={s.sectionTitle}>Your Courses</Text>
      {loading ? (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </ScrollView>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={i => i._id}
          renderItem={renderCourse}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCourses(); }} tintColor={theme.primary} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>No courses assigned yet.</Text>
              <Text style={s.emptySubText}>Ask your admin to assign you a course.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  greeting: { fontSize: 22, fontWeight: '900', color: theme.text, letterSpacing: -0.5 },
  subGreeting: { fontSize: 13, color: theme.textMuted, marginTop: 2, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#ede9fe', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
  },
  statEmoji: { fontSize: 14 },
  statVal: { fontSize: 13, fontWeight: '800', color: theme.primary },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: theme.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 20, marginTop: 20, marginBottom: 4,
  },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: theme.card, borderRadius: 20,
    borderWidth: 1, borderColor: theme.border, overflow: 'hidden',
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
  },
  cardImg: { width: '100%', height: 160 },
  cardImgPlaceholder: {
    backgroundColor: theme.secondary, alignItems: 'center', justifyContent: 'center',
  },
  cardImgPlaceholderText: { fontSize: 48, fontWeight: '900', color: theme.primary, opacity: 0.3 },
  cardBody: { padding: 16 },
  tagRow: { flexDirection: 'row', marginBottom: 8 },
  tagPill: {
    backgroundColor: theme.secondary, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: theme.border,
  },
  tagText: { fontSize: 10, fontWeight: '800', color: theme.primary, textTransform: 'uppercase', letterSpacing: 1 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: theme.text, marginBottom: 6, letterSpacing: -0.3 },
  cardDesc: { fontSize: 13, color: theme.textMuted, lineHeight: 19, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardFooterText: { fontSize: 11, fontWeight: '700', color: theme.textMuted },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 17, fontWeight: '800', color: theme.text, marginBottom: 8 },
  emptySubText: { fontSize: 13, color: theme.textMuted },
});
