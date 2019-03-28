<template>
  <div class="sign-up">
    <div class="sign-up-wrapper">
      <h1>Sign Up</h1>
      <v-alert :value="errorMessage" color="error" icon="warning" transition="scale-transition" outline>
        {{ errorMessage }}
      </v-alert>
      <div class="form-wrapper">
        <v-form ref="form" v-model="valid" class="form">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            prepend-icon="mail"
            required=""
          ><!--  --></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :counter="255"
            :type="passwordFieldType"
            :append-icon="passwordFieldAppendIcon"
            label="Password"
            prepend-icon="lock"
            @click:append="changePasswordFieldType"
          ><!--  --></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :rules="confirmPasswordRules"
            :counter="255"
            :type="passwordFieldType"
            :append-icon="passwordFieldAppendIcon"
            label="Confirm Password"
            prepend-icon="lock"
            @click:append="changePasswordFieldType"
          ><!--  --></v-text-field>
          <v-btn :disabled="!valid" color="info" @click="submit">Sign Up</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
        <v-btn flat small color="info" @click="alreadyHaveAccount">Already have an account</v-btn>

      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Signup',
  data () {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\../.test(v) || 'E-mail must be valid'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be more than 6 characters'
      ],
      confirmPassword: '',
      confirmPasswordRules: [
        v => !!v || 'Confirm your password',
        v => (v && v.length >= 6) || 'Confirm password must be more than 6 characters',
        v => (v && v === this.password) || 'Confirm password did not match.'
      ],
      passwordFieldType: 'password',
      errorMessage: ''
    }
  },
  computed: {
    passwordFieldAppendIcon () {
      return (this.passwordFieldType === 'password') ? 'visibility' : 'visibility_off'
    }
  },
  created () {},
  mounted () {},
  methods: {
    alreadyHaveAccount () {
      this.$router.push('/signin')
    },
    changePasswordFieldType () {
      this.passwordFieldType = (this.passwordFieldType === 'password') ? 'text' : 'password'
    },
    submit () {
      this.errorMessage = ''
      if (this.$refs.form.validate()) {
        this.createUserWithEmailAndPassword()
      }
    },
    clear () {
      this.errorMessage = ''
      this.$refs.form.reset()
    },
    createUserWithEmailAndPassword () {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // ...
          console.error(errorCode, errorMessage)
          if (errorCode === 'auth/invalid-email' ||
              errorCode === 'auth/weak-password' ||
              errorCode === 'auth/email-already-in-use') {
            this.errorMessage = errorMessage
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.sign-up {
  &-wrapper{
    margin: 0 auto;
    max-width: 700px;
  }
}
</style>
