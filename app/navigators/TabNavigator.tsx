import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "@/components"
import { translate } from "@/i18n"
import { HomeScreen, SettingsScreen, ProfileScreen } from "@/screens"
import type { ThemedStyle } from "@/theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { useAppTheme } from "@/utils/useAppTheme"

export type TabParamList = {
  Home: undefined
  Profile: undefined
  Settings: undefined
  History: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */

export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? colors.tint : "#000"} size={24} />
          ),
        }}
      />
      {/*<Tab.Screen*/}
      {/*  name="Calendar"*/}
      {/*  component={CalendarScreen}*/}
      {/*  options={{*/}
      {/*    tabBarLabel: "Appointments",*/}
      {/*    tabBarIcon: ({ focused }) => (*/}
      {/*      <Icon icon="appointment" color={focused ? colors.tint : "#000"} size={24} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <Tab.Screen
        name="History"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon icon="profile" color={focused ? colors.tint : "#000"} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Preferences",
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused ? colors.tint : "#000"} size={24} />
          ),
        }}
      />
      {/*<Tab.Screen*/}
      {/*  name="SignOut"*/}
      {/*  component={WelcomeScreen}*/}
      {/*  options={{*/}
      {/*    tabBarLabel: "Out",*/}
      {/*    tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,*/}
      {/*  }}*/}
      {/*/>*/}
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#FFF", // White background
  borderTopColor: "#000", // Black border
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: "#000", // Black text
})
