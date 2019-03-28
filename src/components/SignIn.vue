<template>
  <div class="sign-in">
    <div class="sign-in-wrapper">
      <h1>Sign In</h1>
      <v-alert :value="errorMessage" color="error" icon="warning" transition="scale-transition" outline>
        {{ errorMessage }}
      </v-alert>
      <v-snackbar v-model="snackbar" :bottom="true" :left="true" :timeout="5000">
        {{ snackbarText }}
      </v-snackbar>
      <v-dialog v-model="resetPasswordDialog" max-width="700">
        <v-card>
          <v-card-title class="headline">Reset password</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="email" :rules="emailRules" :error-messages="resetEmailErrorMessages" label="E-mail" prepend-icon="mail" required/>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="info" flat @click.native="resetPasswordDialog = false">Cancel</v-btn>
            <v-btn color="info" @click.native="sendPasswordResetEmail">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="sign-in-item">
        <div class="form-wrapper">
          <v-form ref="form" v-model="valid" class="form" >
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              prepend-icon="mail"
              color="#4CAF50"
              required
            ><!--  --></v-text-field>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              prepend-icon="lock"
              color="#4CAF50"
              required
            ><!--  --></v-text-field>
            <v-btn :disabled="!valid" color="success" @click="submit">Sign In</v-btn>
            <v-btn @click="clear">clear</v-btn>
            <div>
              <v-btn flat small color="success" @click="resetPasswordDialog = true">Forget password?</v-btn>
              <v-btn flat small color="success" @click="createAnAccount">Create an account</v-btn>
            </div>
          </v-form>
        </div>
      </div>
      <div class="sign-in-item">
        <h3 class="subtitle">Sign In with</h3>
        <div class="provider-btn-list">
          <a class="provider-btn" @click="signInWithGoogle">
            <img src="@/assets/firebase/auth_service_google.svg" alt="sign in with google">
            <span>Google</span>
          </a>
          <a class="provider-btn" @click="signInWithFB">
            <img src="@/assets/firebase/auth_service_facebook.svg" alt="sign in with Facebook">
            <span>Facebook</span>
          </a>
          <a class="provider-btn" @click="signInWithTwitter">
            <img src="@/assets/firebase/auth_service_twitter.svg" alt="sign in with Twitter">
            <span>Twitter</span>
          </a>
          <a class="provider-btn" @click="signInWithGithub">
            <img src="@/assets/firebase/auth_service_github.svg" alt="sign in with Github">
            <span>Github</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Signin',
  components: {},
  data () {
    return {
      valid: false,
      email: 'desiredy+1@gmail.com',
      password: '123456',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be more than 6 characters'
      ],
      errorMessage: '',
      resetPasswordDialog: false,
      resetEmailErrorMessages: [],
      snackbar: false,
      snackbarText: ''
    }
  },
  computed: {},
  created () {},
  mounted () {},
  updated () {},
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        this.errorMessage = ''
        this.signInWithEmailAndPassword()
      }
    },
    clear () {
      this.errorMessage = ''
      this.$refs.form.reset()
    },
    sendPasswordResetEmail () {
      const auth = firebase.auth()
      this.resetEmailErrorMessages = []
      auth.sendPasswordResetEmail(this.email).then(() => {
        // Email sent.
        this.resetPasswordDialog = false
        this.snackbar = true
        this.snackbarText = 'Sent.'
      }).catch((error) => {
        // An error happened.
        console.log(error)
        this.resetEmailErrorMessages.push(error.message)
        this.snackbar = true
        this.snackbarText = 'Error happened.'
      })
    },
    createAnAccount () {
      this.$router.push('/signup')
    },
    signInWithEmailAndPassword () {
      console.log('Sign in with Email.')
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // ...
          console.error(errorCode, errorMessage)
          // auth/user-not-found
          // auth/invalid-email
          this.errorMessage = errorMessage
        })
    },
    signInWithGoogle () {
      console.log('Sign in with Google.')
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().useDeviceLanguage()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const token = result.credential.accessToken
          // The signed-in user info.
          const user = result.user
          // ...
          console.log('Sigin w/ Google succes.', user.providerData, token)
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          // const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          // const credential = error.credential
          // ...
          console.error(errorCode, errorMessage)
          // auth/user-cancelled
          // auth/popup-closed-by-user
          // auth/cancelled-popup-request
          if (errorCode === 'auth/account-exists-with-different-credential') {
            this.errorMessage = errorMessage
          }
        })
    },
    signInWithFB () {
      console.log('Sign in with FB.')
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().useDeviceLanguage()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const token = result.credential.accessToken
          // The signed-in user info.
          const user = result.user
          // ...
          console.log('Sigin w/ Facebook succes.', user.providerData, token)
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          // const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          // const credential = error.credential
          // ...
          console.error(errorCode, errorMessage)
          if (errorCode === 'auth/account-exists-with-different-credential') {
            this.errorMessage = errorMessage
          }
        })
    },
    signInWithTwitter () {
      console.log('Sign in with Twitter.')
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().useDeviceLanguage()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const token = result.credential.accessToken
          // The signed-in user info.
          const user = result.user
          // ...
          console.log('Sigin w/ Twitter succes.', user.providerData, token)
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          // const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          // const credential = error.credential
          // ...
          console.error(errorCode, errorMessage)
          if (errorCode === 'auth/account-exists-with-different-credential') {
            this.errorMessage = errorMessage
          }
        })
    },
    signInWithGithub () {
      console.log('Sign in with Github.')
      const provider = new firebase.auth.GithubAuthProvider()
      firebase.auth().useDeviceLanguage()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const token = result.credential.accessToken
          // The signed-in user info.
          const user = result.user
          // ...
          console.log('Sigin w/ Github succes.', user.providerData, token)
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          // const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          // const credential = error.credential
          // ...
          console.error(errorCode, errorMessage)
          if (errorCode === 'auth/account-exists-with-different-credential') {
            this.errorMessage = errorMessage
          }
        })
    }
  }
}
</script>
<style lang="scss">
.sign-in {
  .subtitle {
    margin: 16px 0;
  }
  &-wrapper{
    margin: 0 auto;
    max-width: 700px;
    &::after{
      content: "";
      display: block;
      clear: both;
    }
  }
  &-item {
    float: left;
    width: 50%;
    padding: 0 24px;
    margin-bottom: 36px;
    &:last-child  {
      border-left: #ececec solid 1px;
    }
  }
}
.provider-btn {
  &-list {}
  display: flex;
  padding: 8px;
  margin: 16px 0;
  border: solid 1px #e3e3e3;
  border-radius: 4px;
  background-color: #ffffff;
  color: #000000;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  > img {
    width: 20px;
    height: 20px;
    margin-right: 16px;
  }
  > span {}
}
@media only screen and (max-width: 767.98px) {
.sign-in {
  &-item {
    display: block;
    width: 100%;
    padding: 0 24px;
    float: unset;
    &:last-child  {
      border-left: none;
    }
  }
}
.provider-btn {
  display: inline-block;
  padding: 0;
  margin: 0 16px;
  border: none;
  &:hover {
    background-color: #ffffff;
  }
  > img {
    width: 24px;
    height: 24px;
    margin-right: 0;
  }
  > span {
    display: none;
  }
}
}
</style>
