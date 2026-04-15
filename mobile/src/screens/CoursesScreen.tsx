import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { api, type Course } from '../utils/api';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<AppStackParamList, 'Courses'>;

export default function CoursesScreen() {
  const navigation = useNavigation<Nav>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setError(null);
      const data = await api.getAssignedCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Could not load courses.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => navigation.navigate('CourseDetail', { id: item._id, title: item.title })}
      activeOpacity={0.88}
    >
      <View style={s.cardImageWrapper}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={s.cardImageFull} resizeMode="cover" />
        ) : (
          <View style={s.cardImageFallback}>
            <Text style={s.cardImageText}>{item.title[0]}</Text>
          </View>
        )}
      </View>
      <View style={s.cardBody}>
        <View style={s.tagRow}>
          <View style={s.tagPill}><Text style={s.tagText}>{item.tag}</Text></View>
        </View>
        <Text style={s.cardTitle}>{item.title}</Text>
        <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
      </View>
      <View style={s.cardFooter}>
        <Text style={s.metaText}>{item.assessments?.length || 0} questions</Text>
        <Text style={s.metaText}>Pass {item.passingThreshold}%</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={s.loadingText}>Loading your courses…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={item => item._id}
      contentContainerStyle={s.list}
      renderItem={renderCourse}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadCourses(); }} tintColor={theme.primary} />
      }
      ListEmptyComponent={
        <View style={s.emptyState}>
          <Text style={s.emptyTitle}>No courses assigned yet.</Text>
          <Text style={s.emptySubtitle}>Ask your admin to give you access or check back later.</Text>
          {error ? <Text style={s.errorText}>{error}</Text> : null}
        </View>
      }
    />
  );
}

const s = StyleSheet.create({
  list: { padding: 20, paddingBottom: 30, backgroundColor: theme.homeBg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.homeBg },
  loadingText: { marginTop: 14, color: theme.textMuted, fontSize: 15 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    overflow: 'hidden',
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
    marginBottom: 18,
  },
  cardImageWrapper: {
    width: '100%',
    height: 170,
    backgroundColor: theme.secondary,
    overflow: 'hidden',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  cardImageFull: {
    width: '100%',
    height: '100%',
  },
  cardImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageText: {
    fontSize: 56,
    fontWeight: '900',
    color: theme.primary,
    opacity: 0.35,
  },
  cardBody: { padding: 20 },
  tagRow: { flexDirection: 'row', marginBottom: 10 },
  tagPill: {
    backgroundColor: theme.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '900',
    color: theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cardTitle: { fontSize: 18, fontWeight: '900', color: theme.text, marginBottom: 8, lineHeight: 24 },
  cardDesc: { fontSize: 13, color: theme.textMuted, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: theme.borderSoft, paddingTop: 14 },
  metaText: { fontSize: 12, color: theme.textMuted, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: theme.text, marginBottom: 10, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: theme.textMuted, lineHeight: 20, textAlign: 'center' },
  errorText: { marginTop: 12, color: theme.danger, textAlign: 'center', fontWeight: '700' },
});
