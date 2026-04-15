import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking, Modal, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const infoBlocks = [
  {
    title: 'What is Prompt Engineering?',
    description: 'Write clear instructions so AI helps you learn faster.',
    iconName: 'sparkles',
  },
  {
    title: 'Getting Started',
    description: 'Explore lessons, study prompts, and build confidence every day.',
    iconName: 'book-open-page-variant',
  },
  {
    title: 'Smart Learning',
    description: 'Turn each topic into easy, practical steps with the AI Lab.',
    iconName: 'lightbulb-on-outline',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [videoOpen, setVideoOpen] = useState(false);

  const videoId = 'dtSpw9xVo2k';
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`;
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const openVideo = async () => {
    await Linking.openURL(youtubeUrl);
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <View style={s.bgAccent1} />
      <View style={s.bgAccent2} />
      <View style={s.heroCard}>
        <Text style={s.heroBadge}>Welcome back, {user?.name?.split(' ')[0]}</Text>
        <Text style={s.heroTitle}>The home for your smart learning.</Text>
        <Text style={s.heroSubtitle}>
          Start with video guidance, explore the AI Lab, then jump straight into your courses.
        </Text>

        <View style={s.buttonGroup}>
          <TouchableOpacity style={s.primaryButton} onPress={() => navigation.navigate('Courses')}>
            <Text style={s.primaryButtonText}>Explore Courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.videoCard}>
        <TouchableOpacity style={s.videoPreview} activeOpacity={0.92} onPress={() => setVideoOpen(true)}>
          <Image source={{ uri: thumbnail }} style={s.videoImage} />
          <View style={s.videoOverlay} />
          <View style={s.videoPlay}>
            <MaterialCommunityIcons name="play" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={s.videoDetails}>
          <Text style={s.videoTitle}>In-app walkthrough</Text>
          <Text style={s.videoText}>Play the walkthrough directly in the app with one tap.</Text>
          <TouchableOpacity style={s.videoLink} onPress={openVideo}>
            <Text style={s.videoLinkText}>Open in YouTube</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.popupGroup}>
        {infoBlocks.map((block, index) => (
          <View key={block.title} style={[s.popupCard, index === 1 && s.popupMid, index === 2 && s.popupLast]}>
            <View style={s.popupIcon}>
              <MaterialCommunityIcons name={block.iconName} size={20} color={theme.primary} />
            </View>
            <Text style={s.popupTitle}>{block.title}</Text>
            <Text style={s.popupText}>{block.description}</Text>
          </View>
        ))}
      </View>

      <View style={s.footerNote}>
        <Text style={s.footerText}>
          Tap the video card to play the walkthrough inside the app, or open it in YouTube if you prefer.
        </Text>
      </View>

      <Modal visible={videoOpen} animationType="slide" transparent>
        <View style={s.modalBackdrop}>
          <View style={s.modalContent}>
            <TouchableOpacity style={s.modalClose} onPress={() => setVideoOpen(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <WebView
              source={{ uri: embedUrl }}
              style={s.webview}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              startInLoadingState
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.homeBg },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, position: 'relative' },
  bgAccent1: {
    position: 'absolute', top: -40, left: -40, width: 180, height: 180,
    borderRadius: 100, backgroundColor: 'rgba(124,58,237,0.16)',
  },
  bgAccent2: {
    position: 'absolute', top: 180, right: -50, width: 180, height: 180,
    borderRadius: 100, backgroundColor: 'rgba(168,85,247,0.12)',
  },
  heroCard: {
    backgroundColor: theme.card,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  heroBadge: {
    color: theme.primary,
    fontWeight: '900',
    letterSpacing: 1.4,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.text,
    lineHeight: 36,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textMuted,
    marginBottom: 22,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
  videoCard: {
    marginTop: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderSoft,
    backgroundColor: theme.card,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  videoPreview: {
    position: 'relative',
    width: '100%',
    height: 190,
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  videoPlay: {
    position: 'absolute',
    top: '42%',
    left: '42%',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(17,24,39,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  videoDetails: {
    padding: 18,
    backgroundColor: theme.card,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.text,
    marginBottom: 8,
  },
  videoText: {
    fontSize: 13,
    color: theme.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  videoLink: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  videoLinkText: {
    color: theme.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    gap: 10,
  },
  secondaryButtonText: {
    color: theme.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  popupGroup: {
    marginTop: 24,
    gap: 14,
  },
  popupCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  popupMid: {
    transform: [{ translateY: -8 }],
  },
  popupLast: {
    transform: [{ translateY: -4 }],
  },
  popupIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  popupTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.text,
    marginBottom: 8,
  },
  popupText: {
    fontSize: 13,
    color: theme.textMuted,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    marginTop: 56,
  },
  footerNote: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  footerText: {
    color: theme.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
