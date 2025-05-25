import { ComponentType, FC, useMemo, useRef, useState } from "react"
import { useNavigation } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { Alert, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useAuth } from "@/services/auth/useAuth"
import { colors, spacing } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { signUp } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [validationErrors, setValidationErrors] = useState<Map<string, string>>(new Map())
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false)
  const passwordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const navigation = useNavigation<AppStackScreenProps<"SignUp">["navigation"]>()

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
          />
        )
      },
    [isPasswordHidden],
  )

  const validateForm = () => {
    const errors: Map<string, string> = new Map()
    if (!firstName.trim()) errors.set("FirstName", "First name is required.")
    if (!lastName.trim()) errors.set("LastName", "Last name is required.")
    if (!phoneNumber.trim()) errors.set("PhoneNumber", "Phone number is required.")
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.set("Email", "Enter a valid email.")
    if (!password || password.length < 8) {
      errors.set("Password", "Password must be at least 8 characters long.")
    }
    if (password !== confirmPassword) {
      errors.set("ConfirmPassword", "Passwords do not match.")
    }
    return errors
  }

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, "")
    if (digits.length >= 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
    return digits
  }

  const onSignUp = async () => {
    setIsSigningUp(true)
    setError(undefined)
    const errors = validateForm()
    setValidationErrors(errors)
    if (errors.size > 0) {
      setIsSigningUp(false)
      return
    }

    try {
      const { error } = await signUp({ firstName, lastName, email, password, phone: phoneNumber })
      if (error) {
        setError(error.message)
      } else {
        setIsSignUpSuccessful(true)
        Alert.alert("Sign Up Successful", "Please check your email to confirm your account.", [
          { text: "OK", onPress: () => navigation.navigate("SignIn") },
        ])
      }
    } catch (err) {
      setError(err.message || "An error occurred during sign up.")
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <Screen safeAreaEdges={["top", "bottom"]} style={$root} preset="scroll">
      <TouchableOpacity style={$backButton} onPress={() => navigation.push("SignIn")}>
        <Icon icon="caretLeft" size={24} color={colors.text} />
      </TouchableOpacity>
      {/*<Screen contentContainerStyle={$root} preset="auto" safeAreaEdges={["top"]}>*/}
      <View style={$container}>
        <View style={$topContainer} />
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          {error && <Text style={$errorText}>{error}</Text>}
          <View>
            <TextField
              containerStyle={$textField}
              label="First Name"
              autoCapitalize="words"
              autoComplete="given-name"
              autoCorrect={false}
              value={firstName}
              onChangeText={setFirstName}
              readOnly={isSigningUp}
              helper={validationErrors.get("FirstName")}
              status={validationErrors.get("FirstName") ? "error" : undefined}
            />
            <TextField
              containerStyle={$textField}
              label="Last Name"
              autoCapitalize="words"
              autoComplete="family-name"
              autoCorrect={false}
              value={lastName}
              onChangeText={setLastName}
              readOnly={isSigningUp}
              helper={validationErrors.get("LastName")}
              status={validationErrors.get("LastName") ? "error" : undefined}
            />
            <TextField
              containerStyle={$textField}
              label="Phone Number"
              autoCapitalize="none"
              autoComplete="tel"
              autoCorrect={false}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              readOnly={isSigningUp}
              helper={validationErrors.get("PhoneNumber")}
              status={validationErrors.get("PhoneNumber") ? "error" : undefined}
            />
            <TextField
              containerStyle={$textField}
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={() => passwordInput.current?.focus()}
              readOnly={isSigningUp}
              helper={validationErrors.get("Email")}
              inputMode="email"
              returnKeyType="next"
              status={validationErrors.get("Email") ? "error" : undefined}
            />
            <TextField
              autoCapitalize="none"
              autoComplete="off"
              textContentType="none"
              keyboardType="default"
              autoCorrect={false}
              containerStyle={$textField}
              defaultValue={password}
              helper={validationErrors.get("Password")}
              label="Password"
              onChangeText={setPassword}
              onSubmitEditing={onSignUp}
              readOnly={isSigningUp}
              ref={passwordInput}
              returnKeyType="done"
              RightAccessory={PasswordRightAccessory}
              // secureTextEntry={isPasswordHidden}
              status={validationErrors.get("Password") ? "error" : undefined}
            />
            <TextField
              containerStyle={$textField}
              textContentType="none"
              keyboardType="default"
              label="Confirm Password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              readOnly={isSigningUp}
              helper={validationErrors.get("ConfirmPassword")}
              ref={confirmPasswordInput}
              returnKeyType="done"
              // secureTextEntry={isPasswordHidden}
              RightAccessory={PasswordRightAccessory}
              status={validationErrors.get("ConfirmPassword") ? "error" : undefined}
            />
            <View>
              <Button preset="reversed" onPress={onSignUp} disabled={isSigningUp}>
                {isSigningUp ? "Signing Up..." : "Sign Up"}
              </Button>
            </View>
          </View>
          <View style={$cap} />
        </View>
      </View>
      {/*</Screen>*/}
    </Screen>
  )
})

// Styles remain unchanged
const $root: ViewStyle = {
  minHeight: "100%",
}

const $container: ViewStyle = {
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  height: 50,
  justifyContent: "center",
  alignItems: "center",
}

const $bottomContainer: ViewStyle = {
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $cap: ViewStyle = {
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

const $errorText: TextStyle = {
  color: colors.error,
}

const $backButton: ViewStyle = {
  position: "absolute",
  top: spacing.lg,
  left: spacing.lg,
  zIndex: 1,
}
