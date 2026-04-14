import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

// Screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

// ─── Type definitions ──────────────────────────────────────────────────────
export type AppStackParamList = {
  Home: undefined;
  CourseDetail: { id: string; title: string };
};

export type TabParamList = {
  HomeTab: undefined;
  Chat: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// ─── Tab Navigator ─────────────────────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: theme.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'AI Lab',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🚀</Text>,
          headerShown: true,
          headerTitle: 'AI Chat Lab',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '900', color: theme.text, fontSize: 18 },
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text>,
          headerShown: true,
          headerTitle: 'Leaderboard',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '900', color: theme.text, fontSize: 18 },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
          headerShown: true,
          headerTitle: 'My Profile',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '900', color: theme.text, fontSize: 18 },
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Home + Course Detail Stack ────────────────────────────────────────────
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'PromptPal',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '900', color: theme.text, fontSize: 20 },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({
          title: (route.params as any).title || 'Course',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '800', color: theme.text, fontSize: 16 },
          headerBackTitle: 'Back',
          headerTintColor: theme.primary,
        })}
      />
    </Stack.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <RootAuthStack />}
    </NavigationContainer>
  );
}

function RootAuthStack() {
  const AuthStack = createNativeStackNavigator();
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Auth" component={AuthScreen} />
    </AuthStack.Navigator>
  );
}
