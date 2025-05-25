import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { flow } from "mobx"
import { supabase } from "@/services/auth/supabase"

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    userId: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
    address: types.maybeNull(types.string),
    profilePicture: types.maybeNull(types.string),
    notifications: types.array(types.frozen()), // Notifications structure
    theme: types.optional(types.enumeration(["light", "dark", "system"]), "system"),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    fetchUsers: flow(function* () {
      try {
        const { data, error } = yield supabase.auth.getUser()
        if (error) throw error

        if (data?.user) {
          const { user } = data
          store.setProp("userId", user.id)
          store.setProp("email", user.email)
          store.setProp("firstName", user.user_metadata?.full_name)
          store.setProp("lastName", user.user_metadata?.last_name || "")
          store.setProp("phone", user.user_metadata?.phone || "")
          store.setProp("profilePicture", user.user_metadata?.picture || "")
        }
      } catch (error) {
        console.error(`Error fetching user:`, error)
      }
    }),
  }))
  .views((self) => ({
    get fullName() {
      return self.name ? self.name : "Guest"
    },
    get userEmail() {
      return self.email ? self.email : "No email provided"
    },
    get userPhone() {
      return self.phone ? self.phone : "No phone number provided"
    },
    get userAddress() {
      return self.address ? self.address : "No address provided"
    },
    get userProfilePicture() {
      return self.profilePicture ? self.profilePicture : "No profile picture"
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setUserId(userId: string | null) {
      self.userId = userId
    },
    setName(name: string | null) {
      self.name = name
    },
    setEmail(email: string | null) {
      self.email = email
    },
    setPhone(phone: string | null) {
      self.phone = phone
    },
    setAddress(address: string | null) {
      self.address = address
    },
    setProfilePicture(profilePicture: string | null) {
      self.profilePicture = profilePicture
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
