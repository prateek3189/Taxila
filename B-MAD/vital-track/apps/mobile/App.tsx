import './global.css';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Linking, Pressable, ScrollView, Text, View, SafeAreaView } from 'react-native';
import { APP_VERSION } from '@vital-track/shared-types';

const apiBase =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export default function App() {
  const openDocs = () => {
    Linking.openURL(`${apiBase}/api/docs`).catch(() => undefined);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 shadow-sm">
              <Text className="text-base font-bold text-white">VT</Text>
            </View>
            <View>
              <Text className="text-lg font-semibold text-slate-900">vital-track</Text>
              <Text className="text-xs text-slate-500">Parent & caregiver app</Text>
            </View>
          </View>
          <Text className="font-mono text-[10px] text-slate-400">v{APP_VERSION}</Text>
        </View>

        <View className="overflow-hidden rounded-3xl bg-teal-600 p-6 shadow-lg shadow-teal-900/25">
          <Text className="text-xs font-semibold uppercase tracking-wide text-teal-100">
            Epic 1 · Foundation
          </Text>
          <Text className="mt-2 text-2xl font-bold leading-tight text-white">
            Vaccination clarity in your pocket.
          </Text>
          <Text className="mt-3 text-sm leading-relaxed text-teal-50">
            Shared types, validated config, and a consistent API — ready for ChildID, plans, and
            approvals in upcoming epics.
          </Text>
        </View>

        <View className="mt-6 gap-3">
          {[
            { title: 'ChildID & QR', body: 'Six-character codes with scoped clinician access.' },
            { title: 'One schedule', body: 'Plans and records aligned across family and clinic.' },
            { title: 'Audit-ready', body: 'Immutable history with clear approval flows.' },
          ].map((item) => (
            <View
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50"
            >
              <Text className="text-base font-semibold text-slate-900">{item.title}</Text>
              <Text className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</Text>
            </View>
          ))}
        </View>

        <View className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
            API base
          </Text>
          <Text className="mt-1 font-mono text-xs text-slate-700">{apiBase}</Text>
          <Text className="mt-2 text-xs text-slate-500">
            Use your machine LAN IP in EXPO_PUBLIC_API_URL when testing on a physical device.
          </Text>
        </View>

        <Pressable
          onPress={openDocs}
          className="mt-6 items-center rounded-xl bg-teal-600 px-4 py-3.5 active:bg-teal-700"
          accessibilityRole="button"
          accessibilityLabel="Open API documentation"
        >
          <Text className="text-sm font-semibold text-white">View API docs (Swagger)</Text>
        </Pressable>

        <Text className="mt-8 text-center text-[11px] text-slate-400">
          {Constants.expoConfig?.name ?? 'vital-track'} · Expo SDK{' '}
          {Constants.expoConfig?.sdkVersion ?? '—'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
