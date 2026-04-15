import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { theme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  diagram?: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Holo! 🇿🇦 I'm **PromptPal**. Ready for some Maths or Science?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const textToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      const CHAT_API_URL = 'https://multi-agent-system-promptpal.onrender.com';
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      // Simple implementation: wait for full text instead of streaming
      // (Streaming in RN fetch is complex without extra libs)
      const data = await response.text();
      
      // Parse if it's SSE format or just extract content
      // The web app parses 'data: ' lines. 
      const lines = data.split("\n\n");
      let fullText = "";
      let diagram = "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const json = JSON.parse(line.replace("data: ", ""));
          if (json.type === "hint_delta") {
            fullText += json.delta;
          }
          if (json.type === "complete") {
            fullText = json.data?.content || fullText;
            diagram = json.data?.diagram;
          }
        } catch (e) {}
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullText || "I'm not sure how to answer that.", diagram }]);
      
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Eish, connection load-shedding! 🔌 Is the backend awake?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[s.msgWrap, item.role === 'user' ? s.msgUserWrap : s.msgBotWrap]}>
      <View style={[s.bubble, item.role === 'user' ? s.bubbleUser : s.bubbleBot]}>
        <Markdown style={item.role === 'user' ? mdUser : mdBot}>
          {item.content}
        </Markdown>
        {item.diagram && (
          <View style={[s.diagramWrap, { borderTopColor: item.role === 'user' ? 'rgba(255,255,255,0.2)' : theme.border }]}>
            <View style={s.diagramLabelRow}>
              <MaterialCommunityIcons name="map-search-outline" size={12} color={item.role === 'user' ? '#fff' : theme.primary} style={s.diagramLabelIcon} />
              <Text style={[s.diagramLabel, { color: item.role === 'user' ? '#fff' : theme.primary }]}>Interactive Map</Text>
            </View>
            <Text style={[s.diagramHint, { color: item.role === 'user' ? '#eee' : theme.textMuted }]}>Diagrams coming soon to mobile!</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderMessage}
        contentContainerStyle={s.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={s.inputArea}>
        {isLoading && (
          <View style={s.thinking}>
            <Text style={s.thinkingText}>Sharp-sharp, thinking...</Text>
          </View>
        )}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Type your question..."
            placeholderTextColor={theme.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={s.sendBtn} onPress={handleSend} disabled={isLoading}>
            {isLoading ? (
              <Text style={s.sendBtnText}>...</Text>
            ) : (
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.chatBg },
  list: { padding: 20, paddingBottom: 40 },
  msgWrap: { flexDirection: 'row', marginBottom: 20 },
  msgUserWrap: { justifyContent: 'flex-end' },
  msgBotWrap: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '85%', padding: 16, borderRadius: 24,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  bubbleUser: { backgroundColor: 'rgba(124,58,237,0.95)', borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: 'rgba(255,255,255,0.84)', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.borderSoft },
  diagramWrap: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, alignItems: 'center' },
  diagramLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  diagramLabelIcon: { marginRight: 6 },
  diagramLabel: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  diagramHint: { fontSize: 11, fontStyle: 'italic' },
  inputArea: {
    padding: 16, backgroundColor: 'rgba(255,255,255,0.82)',
    borderTopWidth: 1, borderTopColor: theme.borderSoft,
  },
  inputRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100,
    fontSize: 15, color: theme.text,
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  sendBtnText: { fontSize: 20 },
  thinking: { marginBottom: 10, marginLeft: 4 },
  thinkingText: { fontSize: 10, fontWeight: '900', color: theme.primary, textTransform: 'uppercase', letterSpacing: 1 },
});

const mdUser = {
  body: { color: '#fff', fontSize: 15 },
  strong: { fontWeight: 'bold' },
};

const mdBot = {
  body: { color: theme.text, fontSize: 15 },
  strong: { fontWeight: 'bold', color: theme.primary },
};
