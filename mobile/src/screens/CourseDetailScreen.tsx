import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Image
} from 'react-native';
import { api, type Course, type AssessmentResult } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '../navigation/AppNavigator';
import * as Clipboard from 'expo-clipboard';

type RouteT = RouteProp<AppStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen() {
  const { params } = useRoute<RouteT>();
  const { refreshUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    api.getCourseById(params.id)
      .then(data => { setCourse(data); })
      .catch(() => Alert.alert('Error', 'Could not load course.'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleCopy = async (text: string, key: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSelectAnswer = (qIndex: number, opt: string) => {
    if (result?.locked || result?.passed) return;
    const n = [...answers]; n[qIndex] = opt; setAnswers(n);
  };

  const handleSubmit = async () => {
    if (!course) return;
    const items = course.assessments?.length ? course.assessments : (course.assessment ? [course.assessment] : []);
    if (answers.filter(Boolean).length !== items.length) {
      Alert.alert('Incomplete', 'Please answer all questions.'); return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(params.id, answers);
      setResult(res);
      if (res.passed) await refreshUser();
    } catch (err: any) {
      setResult({ passed: false, score: 0, message: err.message, stars: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <View style={s.centered}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={s.loadingText}>Loading course…</Text>
    </View>
  );

  if (!course) return (
    <View style={s.centered}><Text style={s.errorText}>Course not found.</Text></View>
  );

  const assessments = course.assessments?.length ? course.assessments : (course.assessment ? [course.assessment] : []);

  return (
    <ScrollView style={s.root} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Hero Image */}
      {course.image
        ? <Image source={{ uri: course.image }} style={s.hero} />
        : <View style={[s.hero, { backgroundColor: theme.secondary, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 60, color: theme.primary, opacity: 0.3 }}>{course.title[0]}</Text>
          </View>
      }

      <View style={s.body}>
        {/* Header */}
        <View style={s.tagRow}>
          <View style={s.tagPill}><Text style={s.tagText}>{course.tag}</Text></View>
        </View>
        <Text style={s.title}>{course.title}</Text>
        <Text style={s.desc}>{course.description}</Text>

        {/* Prompt Templates */}
        {course.templates?.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeading}>
              <MaterialCommunityIcons name="flask-outline" size={18} color={theme.primary} style={s.sectionIcon} />
              <Text style={s.sectionTitle}>Prompting Lab</Text>
            </View>
            {course.templates.map((t, idx) => {
              const key = t._id || String(idx);
              return (
                <View key={key} style={s.templateCard}>
                  <View style={s.templateHeader}>
                    <Text style={s.templateIcon}>{t.icon}</Text>
                    <Text style={s.templateTitle}>{t.title}</Text>
                    <TouchableOpacity
                      style={[s.copyBtn, copied === key && s.copyBtnActive]}
                      onPress={() => handleCopy(t.prompt, key)}
                    >
                      <Text style={[s.copyBtnText, copied === key && s.copyBtnTextActive]}>
                        {copied === key ? '✓ Copied' : 'Copy'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={s.promptBox}>
                    <Text style={s.promptText}>{t.prompt}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Assessment */}
        {assessments.length > 0 && (
          <View style={s.section}>
            <View style={s.quizHeader}>
              <View style={s.sectionHeading}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={18} color={theme.primary} style={s.sectionIcon} />
                <Text style={s.sectionTitle}>Knowledge Check</Text>
              </View>
              {result?.attempts !== undefined && (
                <Text style={s.attemptsText}>Attempts: {result.attempts}/3</Text>
              )}
            </View>

            {assessments.map((assmt, qIndex) => {
              const correction = result?.corrections?.find(c => c.questionIndex === qIndex);
              return (
                <View key={qIndex} style={s.question}>
                  <Text style={s.questionText}>
                    <Text style={s.questionNum}>{qIndex + 1}. </Text>{assmt.question}
                  </Text>
                  {assmt.options.map((opt, i) => {
                    const isSelected = answers[qIndex] === opt;
                    const isWrong = correction?.yourAnswer === opt;
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          s.option,
                          isSelected && s.optionSelected,
                          isWrong && s.optionWrong,
                        ]}
                        onPress={() => handleSelectAnswer(qIndex, opt)}
                        disabled={!!result?.passed || !!result?.locked}
                      >
                        <Text style={[s.optionText, isWrong && { color: theme.danger, textDecorationLine: 'line-through' }]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}

            {/* Result Banner */}
            {result && (
              <View style={[
                s.resultBanner,
                result.passed ? s.resultPass : result.locked ? s.resultLocked : s.resultFail
              ]}>
                <View style={s.resultTitleRow}>
                  <MaterialCommunityIcons
                    name={result.passed ? 'check-circle-outline' : result.locked ? 'lock-outline' : 'close-circle-outline'}
                    size={20}
                    color={result.passed ? theme.success : theme.danger}
                    style={s.resultIcon}
                  />
                  <Text style={s.resultTitle}>{result.passed ? 'Passed!' : result.locked ? 'Locked Out' : 'Not quite'}</Text>
                </View>
                <Text style={s.resultMsg}>{result.message} {result.score ? `(${Math.round(result.score)}%)` : ''}</Text>
                {result.passed && (
                  <View style={s.resultStarsRow}>
                    <MaterialCommunityIcons name="star" size={14} color={theme.accent} style={s.resultIcon} />
                    <Text style={s.resultStars}>Stars earned: {result.stars}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Actions */}
            {(!result || (!result.passed && !result.locked)) && (
              <TouchableOpacity
                style={[s.submitBtn, (submitting || answers.filter(Boolean).length < assessments.length) && s.submitBtnDim]}
                onPress={handleSubmit}
                disabled={submitting || answers.filter(Boolean).length < assessments.length}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.submitBtnText}>{result ? 'Try Again' : 'Submit Answers'}</Text>
                }
              </TouchableOpacity>
            )}
            {result && !result.passed && !result.locked && (
              <TouchableOpacity style={s.clearBtn} onPress={() => { setResult(null); setAnswers([]); }}>
                <Text style={s.clearBtnText}>Clear & Start Over</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },
  loadingText: { marginTop: 12, color: theme.textMuted, fontWeight: '600' },
  errorText: { color: theme.danger, fontWeight: '700' },
  hero: { width: '100%', height: 220 },
  body: { padding: 20 },
  tagRow: { flexDirection: 'row', marginBottom: 10 },
  tagPill: { backgroundColor: theme.secondary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: theme.border },
  tagText: { fontSize: 10, fontWeight: '800', color: theme.primary, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: '900', color: theme.text, marginBottom: 8, letterSpacing: -0.5 },
  desc: { fontSize: 14, color: theme.textMuted, lineHeight: 22, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionIcon: { marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: theme.text, letterSpacing: -0.3 },
  templateCard: { backgroundColor: theme.card, borderRadius: 18, borderWidth: 1, borderColor: theme.border, overflow: 'hidden', marginBottom: 12 },
  templateHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 8, borderBottomWidth: 1, borderBottomColor: theme.border },
  templateIcon: { fontSize: 20 },
  templateTitle: { flex: 1, fontSize: 13, fontWeight: '800', color: theme.text },
  copyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.secondary },
  copyBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  copyBtnText: { fontSize: 11, fontWeight: '800', color: theme.primary },
  copyBtnTextActive: { color: '#fff' },
  promptBox: { padding: 14, backgroundColor: theme.secondary },
  promptText: { fontSize: 13, color: theme.textMuted, lineHeight: 20, fontStyle: 'italic' },
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  attemptsText: { fontSize: 12, fontWeight: '700', color: theme.primary, backgroundColor: theme.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  question: { backgroundColor: theme.card, borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.border },
  questionText: { fontSize: 15, color: theme.text, lineHeight: 22, marginBottom: 14 },
  questionNum: { fontWeight: '900', color: theme.primary },
  option: { borderWidth: 1.5, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 8 },
  optionSelected: { borderColor: theme.primary, backgroundColor: theme.secondary },
  optionWrong: { borderColor: theme.danger, backgroundColor: '#fff5f5' },
  optionText: { fontSize: 14, color: theme.text, fontWeight: '500' },
  resultBanner: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  resultPass: { backgroundColor: '#f0fdf4', borderColor: theme.success },
  resultFail: { backgroundColor: '#fff5f5', borderColor: theme.danger },
  resultLocked: { backgroundColor: '#f8f8f8', borderColor: '#ccc' },
  resultTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  resultIcon: { marginRight: 10 },
  resultTitle: { fontSize: 18, fontWeight: '900', color: theme.text },
  resultMsg: { fontSize: 13, color: theme.textMuted, lineHeight: 20 },
  resultStarsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  resultStars: { fontSize: 13, fontWeight: '800', color: theme.accent },
  submitBtn: { backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: theme.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  submitBtnDim: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  clearBtn: { alignItems: 'center', marginTop: 12 },
  clearBtnText: { fontSize: 13, color: theme.primary, fontWeight: '700', textDecorationLine: 'underline' },
});
