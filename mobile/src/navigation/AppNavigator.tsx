import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

// Screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';


// ─── Type definitions ──────────────────────────────────────────────────────
export type AppStackParamList = {
  Home: undefined;
  Courses: undefined;
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
        tabBarActiveBackgroundColor: 'rgba(124,58,237,0.12)',
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopColor: 'rgba(124,58,237,0.14)',
          paddingBottom: 8,
          paddingTop: 8,
          height: 68,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'home-circle' : 'home-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'AI Lab',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'robot' : 'robot-outline'}
              size={24}
              color={color}
            />
          ),
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
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'trophy' : 'trophy-outline'}
              size={24}
              color={color}
            />
          ),
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
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={24}
              color={color}
            />
          ),
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
        name="Courses"
        component={CoursesScreen}
        options={{
          title: 'Courses',
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
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

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
