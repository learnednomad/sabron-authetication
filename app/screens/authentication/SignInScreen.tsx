import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Screen, Text, TextField } from "@/components"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { colors, spacing } from "@/theme"
import { useAuth } from "@/services/auth/useAuth"
import { useNavigation } from "@react-navigation/native"
import { supabase } from "@/services/auth/supabase"
import { storage } from "@/utils/storage"
const logo = require("../../../assets/images/smbc_logo.png")

interface SignInScreenProps extends AppStackScreenProps<"SignIn"> {}

export const SignInScreen: FC<SignInScreenProps> = observer(function SignInScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const isLoading = isSigningIn || isSigningUp
  const [error, setError] = useState<string | undefined>(undefined)
  const navigation = useNavigation()

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required.")
      return false
    }
    if (!password.trim()) {
      setError("Password is required.")
      return false
    }
    return true
  }

  const onSignIn = async () => {
    try {
      await storage.set("hasSeenOnboarding", true)
      setIsSigningIn(true)
      setError(undefined)

      if (!validateInputs()) return

      const { error: authError } = await signIn({ email, password })
      if (authError) {
        setError(authError.message || "An error occurred during sign-in.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSigningIn(false)
    }
  }

  const onSignUp = async () => {
    try {
      setIsSigningUp(true)
      setError(undefined)
      navigation.navigate("SignUp" as never)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSigningUp(false)
    }
  }

  const onForgotPassword = () => {
    try {
      setIsSigningUp(true)
      setError(undefined)
      navigation.navigate("ForgotPassword" as never)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <Screen contentContainerStyle={$root} preset="auto" safeAreaEdges={["top"]}>
      <View style={$container}>
        <View style={$topContainer}>
          <Image style={$logo} source={logo} resizeMode="contain" />
        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <View>
            <TextField
              containerStyle={$textField}
              label="Email"
              autoCapitalize="none"
              defaultValue={email}
              onChangeText={setEmail}
              readOnly={isLoading}
            />
            <TextField
              containerStyle={$textField}
              label="Password"
              autoCapitalize="none"
              defaultValue={password}
              secureTextEntry
              onChangeText={setPassword}
              readOnly={isLoading}
            />
            {error && <Text style={$errorMessage}>{error}</Text>}
          </View>
          <View>
            <Button onPress={onSignIn} disabled={isLoading}>
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
            <Pressable style={$forgotPassword} onPress={onForgotPassword} disabled={isLoading}>
              <Text preset="bold">Forgot Password?</Text>
            </Pressable>
            <Text style={$buttonDivider}>- or -</Text>
            <Button preset="reversed" onPress={onSignUp} disabled={isLoading}>
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </Button>
          </View>
          <View style={$cap} />
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  minHeight: "100%",
  backgroundColor: colors.palette.neutral100,
}

const $container: ViewStyle = {
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  height: 200,
  justifyContent: "center",
  alignItems: "center",
}

const $bottomContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $cap: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  height: spacing.xl,
  position: "absolute",
  top: -spacing.xl,
  left: 0,
  right: 0,
}

const $textField: ViewStyle = {
  marginBottom: spacing.md,
}

const $forgotPassword: ViewStyle = {
  marginVertical: spacing.md,
}

const $buttonDivider: TextStyle = {
  textAlign: "center",
  marginVertical: spacing.md,
}

const $logo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

const $googleButton: ViewStyle = {
  marginTop: spacing.md,
  width: 340,
  height: 44,
  alignItems: "center",
  borderRadius: 15,
}
const $errorMessage: TextStyle = {
  color: colors.error,
  textAlign: "center",
  marginTop: spacing.sm,
}
