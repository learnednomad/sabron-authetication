import { FC } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface NotificationScreenProps extends AppStackScreenProps<"Notification"> {}


export const NotificationScreen: FC<NotificationScreenProps> = observer(function NotificationScreen() {
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="notification" />
    </Screen>
  )

})

const $root: ViewStyle = {
  flex: 1,
}
