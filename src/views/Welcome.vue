<template>
  <div class="welcome">
    <div v-if="currentUser">
      <h1 class="">Welcome, {{ currentUser.displayName || currentUser.email }}</h1>
      <div class="user">
        <div class="user-avatar"><img :src="currentUser.photoURL" width="120" height="120"></div>
        <div class="user-info">
          <div>UID: {{ currentUser.uid }}</div>
          <div>E-mail: {{ currentUser.email }}</div>
          <div>
            Verified :
            <span v-if="currentUser.emailVerified" class="status verified">{{ currentUser.emailVerified }}</span>
            <span v-if="!currentUser.emailVerified" class="status unverified">{{ currentUser.emailVerified }}</span>
            <v-btn v-if="!currentUser.emailVerified" outline small color="primary" @click="sendVerificationMail">Send Verify mail</v-btn>
          </div>
          <div>Provider: {{ currentUser.providerId }}</div>
          <div>Name: {{ currentUser.displayName }}</div>
          <div>Phone: {{ currentUser.phoneNumber }}</div>
          <div>Photo URL: {{ currentUser.photoURL }}</div>
        </div>
      </div>
      <v-layout row justify-center>
        <v-btn flat large color="info" @click="updateProfileDialog = true">Update Profile</v-btn>
        <v-btn flat large color="info" @click="updatePasswordDialog = true">Update Password</v-btn>
        <v-btn flat large color="info" @click="updateEmailDialog = true">Update Email</v-btn>
        <v-btn flat large color="error" @click="deleteAccountDialog = true">Delete Account</v-btn>
      </v-layout>
      <v-layout row justify-center>
        <v-btn flat large color="primary" @click="signOut">Sing Out</v-btn>
      </v-layout>
      <v-dialog v-model="updateProfileDialog" max-width="700">
        <v-card>
          <v-card-title class="headline">Update profile</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="newDisplayName" label="Display Name" />
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="newPhotoURL" label="Photo URL" hint="An URl of avatar" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="info" flat @click.native="updateProfileDialog = false">Cancel</v-btn>
            <v-btn color="info" @click.native="updateProfile">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="updatePasswordDialog" max-width="700">
        <v-card>
          <v-card-title class="headline">Update Password</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field ref="newPassword" v-model="newPassword" :rules="passwordRules"
                                :type="newPasswordFieldType" :append-icon="newPasswordFieldAppendIcon" label="Password" @click:append="changePasswordFieldType" />
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field ref="newConfirmPassword" v-model="newConfirmPassword" :rules="confirmPasswordRules"
                                :type="newPasswordFieldType" :append-icon="newPasswordFieldAppendIcon" label="Confirm password" @click:append="changePasswordFieldType" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="info" flat @click.native="updatePasswordDialog = false">Cancel</v-btn>
            <v-btn color="info" @click.native="updatePassword">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="updateEmailDialog" max-width="700">
        <v-card>
          <v-card-title class="headline">Change Email</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field ref="newEmail" v-model="newEmail" :rules="emailRules" label="Email" required/>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="info" flat @click.native="updateEmailDialog = false">Cancel</v-btn>
            <v-btn color="info" @click.native="updateEmail">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteAccountDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Are you sure you want to do this?</v-card-title>
          <v-card-text>Once you delete your account, we will immediately delete all of yourinfomations, there is no going back. Please be certain.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error lighten-3" flat @click.native="deleteAccountDialog = false">Cancel</v-btn>
            <v-btn color="error dark-3" @click.native="deleteAccount">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-snackbar v-model="snackbar" :color="snackbarCollor" :bottom="true" :left="true" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Welcome',
  components: {},
  directives: {},
  props: {},
  data () {
    return {
      updateProfileDialog: false,
      updatePasswordDialog: false,
      updateEmailDialog: false,
      deleteAccountDialog: false,
      newDisplayName: '',
      newPhotoURL: '',
      newPassword: '',
      newPasswordFieldType: 'password',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be more than 6 characters'
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirm your password',
        v => (v && v.length >= 6) || 'Confirm password must be more than 6 characters',
        v => (v && v === this.newPassword) || 'Confirm password did not match.'
      ],
      newConfirmPassword: '',
      newEmail: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\../.test(v) || 'E-mail must be valid'
      ],
      //
      snackbar: false,
      snackbarCollor: '',
      snackbarText: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    newPasswordFieldAppendIcon () {
      return (this.newPasswordFieldType === 'password') ? 'visibility' : 'visibility_off'
    }
  },
  watch: {
    updateProfileDialog (newValue) {
      if (newValue) {
        this.newDisplayName = this.currentUser.displayName
        this.newPhotoURL = this.currentUser.photoURL
      }
    },
    updatePasswordDialog (newValue) {
      if (newValue) {
        this.newPassword = this.newConfirmPassword = ''
      }
    }
  },
  created () {},
  mounted () {},
  updated () {},
  methods: {
    changePasswordFieldType () {
      this.newPasswordFieldType = (this.newPasswordFieldType === 'password') ? 'text' : 'password'
    },
    displaySnakbar (color = '', text = '') {
      this.snackbar = true
      this.snackbarCollor = color
      this.snackbarText = text
    },
    deleteAccount () {
      this.deleteAccountDialog = false
      const user = firebase.auth().currentUser
      user.delete().then(() => {
        // User deleted.
        console.log('User deleted')
        this.$router.push({ name: 'signin' })
      }).catch((error) => {
        // An error happened.
        console.error('User delete error...', error)
        if (error.code === 'auth/requires-recent-login') {
          this.displaySnakbar('error', 'Need login again.')
          // const credential = null
          //
          // TODO: Prompt the user to re-provide their sign-in credentials
          //
          // user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
          //   // User re-authenticated.
          // }).catch((error) => {
          //   // An error happened.
          //   console.error('reauthenticateAndRetrieveDataWithCredential error...', error)
          // })
        }
      })
    },
    updateProfile () {
      console.log('Update profile', this.newDisplayName, this.newPhotoURL)
      const user = firebase.auth().currentUser
      user.updateProfile({
        displayName: this.newDisplayName,
        photoURL: this.newPhotoURL
      }).then((data) => {
        // Update successful.
        const newCurrentUser = firebase.auth().currentUser
        const newUserObj = {
          uid: newCurrentUser.uid,
          displayName: newCurrentUser.displayName,
          photoURL: newCurrentUser.photoURL,
          email: newCurrentUser.email,
          emailVerified: newCurrentUser.emailVerified,
          isAnonymous: newCurrentUser.isAnonymous,
          providerId: newCurrentUser.providerId,
          providerData: newCurrentUser.providerData,
          refreshToken: newCurrentUser.refreshToken
        }
        this.$store.commit('setCurrentUser', newUserObj)
        this.updateProfileDialog = false
        this.displaySnakbar('', 'Profile updated')
      }).catch((error) => {
        // An error happened.
        console.log(error)
        this.displaySnakbar('error', 'Error...')
      })
    },
    updatePassword () {
      if (this.$refs.newPassword.validate() && this.$refs.newConfirmPassword.validate()) {
        this.updatePasswordDialog = false
        console.log('Update password', this.newPassword)

        const user = firebase.auth().currentUser
        user.updatePassword(this.newPassword).then(() => {
          // Update successful.
          this.displaySnakbar('', 'Password updated')
        }).catch((error) => {
          // An error happened.
          console.log(error)
          this.displaySnakbar('error', 'Error...')
          if (error.code === 'auth/requires-recent-login') {
            //
            // TODO: Prompt the user to re-provide their sign-in credentials
            //
            // user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
            //   // User re-authenticated.
            // }).catch((error) => {
            //   // An error happened.
            //   console.error('reauthenticateAndRetrieveDataWithCredential error...', error)
            // })

            // WORK AROUND
            //
            this.displaySnakbar('error', 'Need to login again...')
            this.signOut()
          }
        })
      }
    },
    updateEmail () {
      if (this.$refs.newEmail.validate()) {
        this.updateEmailDialog = false
        // console.log('Update email', this.newEmail)
        const user = firebase.auth().currentUser
        user.updateEmail(this.newEmail).then((res) => {
          // Update successful.
          this.$store.commit('setCurrentUser', user)
          this.displaySnakbar('', 'Email updated')
        }).catch((error) => {
          // An error happened.
          console.log(error)
          this.displaySnakbar('error', 'Error...')
          if (error.code === 'auth/requires-recent-login') {
            this.displaySnakbar('error', 'Need to login again...')
            this.signOut()
          }
        })
      }
    },
    sendVerificationMail () {
      console.log('Send user a verification mail.')
      var user = firebase.auth().currentUser

      user.sendEmailVerification().then(() => {
        // Email sent.
        this.displaySnakbar('', 'Email sent')
      }).catch((error) => {
        // An error happened.
        console.log(error)
        this.displaySnakbar('error', 'Error happened')
      })
    },
    signOut () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          console.log('Sign out success.')
          // ...
          this.$router.push({ name: 'signin' })
        })
        .catch(error => {
          // An error happened.
          console.error(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  margin: 24px auto;
  max-width: 700px;
  text-align: left;
  position: relative;
  &-avatar {
    position: relative;
    overflow: hidden;
    float: left;
    margin-right: 36px;
  }
  &-info {
    position: relative;
    overflow: hidden;
    .status {
      font-weight: 700;
      &.verified {
        color: #43A047; // green darken-1
      }
      &.unverified {
        color: #E53935; // red darken-1
      }
    }
  }
  &:after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
