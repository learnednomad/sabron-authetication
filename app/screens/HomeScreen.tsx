import { FC, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AutoImage, Icon, Screen, Text } from "@/components"
import { useStores } from "@/models"
import { AppStackScreenProps } from "@/navigators"
import { colors } from "@/theme"

// Constants
const NOTIFICATION_LIMIT = 99
const REFRESH_INTERVAL = 6000 // 1 minute
const FETCH_TIMEOUT = 30000 // 30 seconds
const CACHE_DURATION = 300 // 5 minutes

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}
const getGreeting = () => {
  const currentHour = new Date().getHours()
  return currentHour < 12
    ? "travel:morning"
    : currentHour < 18
      ? "travel:afternoon"
      : "travel:evening"
}
export const HomeScreen: FC<HomeScreenProps> = observer(() => {
  const navigation = useNavigation()
  const { userStore } = useStores()
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const notifics = 13
  const [greeting, setGreeting] = useState(getGreeting())
  const unreadNotifications = userStore.notifications.filter((notification) => !notification.isRead)

  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await userStore.fetchUsers()
      setIsLoading(false)
    })()
  }, [userStore])

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <Screen
      backgroundColor={colors.palette.neutral900}
      contentContainerStyle={{ margin: 5 }}
      safeAreaEdges={["top"]}
      preset="auto"
      statusBarStyle="light"
    >
      <View style={$container}>
        <View style={$profileContainer}>
          <TouchableOpacity
            style={$profileImage}
            onPress={() => navigation.navigate("Profile" as never)}
          >
            <AutoImage
              source={require("../../assets/images/splash-screen/oxana-v-qoAIlAmLJBU-unsplash.jpg")}
              style={$image}
            />
          </TouchableOpacity>
          <View style={$stats}>
            <Text preset="header" tx={greeting} style={$welcomeText} />
            <Text preset="header" text={userStore.firstName} style={$name} />
          </View>
          <TouchableOpacity
            style={$notificationIcon}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Icon icon="bell" size={25} style={$bellIcon} />
            {notifics > 0 && (
              <View style={$notificationBadge}>
                <Text style={$notificationBadgeText}>{notifics > 99 ? "99+" : notifics}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Trip Container */}
        {/*<View style={$tripContainer}>*/}
        {/*  {userStore.trips.length > 0 ? (*/}
        {/*    <>*/}
        {/*      /!* Background Image *!/*/}
        {/*      <AutoImage*/}
        {/*        source={require("../../assets/images/splash-screen/oxana-v-qoAIlAmLJBU-unsplash.jpg")}*/}
        {/*        style={$tripBackgroundImage}*/}
        {/*      />*/}

        {/*      /!* Semi-transparent Overlay *!/*/}
        {/*      <View style={$overlay} />*/}

        {/*      /!* Text Overlay *!/*/}
        {/*      <TouchableOpacity*/}
        {/*        style={$tripOverlayContent}*/}
        {/*        onPress={() => navigation.navigate("TripDetails", { tripId: tripDetails[0].id })}*/}
        {/*      >*/}
        {/*        <Text style={$tripText}>Next Trip: {tripDetails[0].destination}</Text>*/}
        {/*        <Text style={$tripDate}>*/}
        {/*          {tripDetails[0].startDate} - {tripDetails[0].endDate}*/}
        {/*        </Text>*/}
        {/*      </TouchableOpacity>*/}
        {/*    </>*/}
        {/*  ) : (*/}
        {/*    <TouchableOpacity*/}
        {/*      style={$addTripButton}*/}
        {/*      onPress={() => navigation.navigate("CreateItinerary")}*/}
        {/*    >*/}
        {/*      <Text style={$addTripText}>Plan Your Next Trip</Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  )}*/}
        {/*</View>*/}

        <View style={$fullSquare}>
          <TouchableOpacity>
            <AutoImage
              source={require("../../assets/images/splash-screen/oxana-v-qoAIlAmLJBU-unsplash.jpg")}
              style={$image}
            />
          </TouchableOpacity>
        </View>

        <View style={$row}>
          <TouchableOpacity style={$square}>
            <AutoImage
              source={require("../../assets/images/splash-screen/maria-orlova-b37mDyPzdJM-unsplash.jpg")}
              style={$image}
            />
          </TouchableOpacity>
          <TouchableOpacity style={$square} onPress={() => navigation.navigate("CreateItinerary")}>
            <AutoImage
              source={require("../../assets/images/splash-screen/ian-dooley-hpTH5b6mo2s-unsplash.jpg")}
              style={$image}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

// Styles
const $bellIcon: ViewStyle = {
  maxHeight: 100,
  borderRadius: 8,
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 24,
}

const $fullSquare: ViewStyle = {
  width: "100%",
  height: 250,
  backgroundColor: colors.primary,
  borderRadius: 12,
  padding: 10,
}

const $image: ViewStyle = {
  width: "100%",
  height: "100%",
  borderRadius: 8,
}

const $notificationIcon: ViewStyle = {
  alignContent: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  width: "15%",
  maxHeight: 100,
  padding: 20,
  alignItems: "center",
  marginRight: 10,
}

const $name: TextStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: colors.palette.neutral200,
  marginTop: 10,
}

const $profileContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingVertical: 12,
  backgroundColor: colors.palette.neutral900,
}

const $profileImage: ViewStyle = {
  width: "25%",
  maxHeight: 100,
  backgroundColor: colors.primary,
  borderRadius: 8,
  padding: 10,
}

const $row: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-evenly",
  width: "100%",
  marginBottom: 24,
  marginTop: 15,
}

const $square: ViewStyle = {
  width: "45%",
  height: 150,
  backgroundColor: "gray",
  borderRadius: 8,
}

const $stats: ViewStyle = {
  flex: 1,
  height: "85%",
}

const $welcomeText: TextStyle = {
  color: colors.palette.neutral200,
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 15,
  marginTop: 5,
}

const $notificationBadge: ViewStyle = {
  position: "absolute",
  top: -5,
  right: -7,
  backgroundColor: "red",
  borderRadius: 12,
  width: 25,
  height: 15,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
}

const $notificationBadgeText: TextStyle = {
  color: "white",
  fontSize: 10,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: -4,
}

const $tripContainer: ViewStyle = {
  width: "95%",
  height: 100, // Fixed height for the container
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  overflow: "hidden", // Clip the image to the container
  position: "relative", // Required for absolute positioning of child elements
  marginVertical: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
}

const $tripBackgroundImage: ViewStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "cover", // Ensures the image covers the entire container
}

const $overlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject, // Covers the entire container
  backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
}

const $tripOverlayContent: ViewStyle = {
  position: "absolute",
  bottom: 20, // Position the text near the bottom
  left: 20,
  right: 20,
}

const $tripText: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.palette.neutral200, // White text for contrast
  textAlign: "center",
  marginBottom: 4,
}

const $tripDate: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral200, // White text for contrast
  textAlign: "center",
}

const $addTripButton: ViewStyle = {
  backgroundColor: colors.primary,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
}

const $addTripText: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
}
