<template>
	<div class="login">
		<section class="hero is-primary">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">
						Developer SignUp
					</h1>
					<h2 class="subtitle">
						You must register before continue!
					</h2>
				</div>
			</div>
		</section>

		<section class="section">
			<div class="container">
				<div class="columns is-mobile">
					<div class="column is-half is-offset-one-quarter">
						<form @submit.prevent="signUpForm">
							<div class="box">
				                <div v-show="errors.any()" class="notification is-danger">
				                  Please correct below errors
				                </div>
				                <div v-show="!errors.any()" class="notification is-primary">
				                  You Must Register Before Continue
				                </div>
								<div class="field">
									<p class="control has-icons-left">
										<input name="email" type="email" placeholder="Email"
					                      v-model="user.email"
					                      v-validate="'required|email'" 
					                      :class="{'input': true, 'is-danger': errors.has('email') }">
										<span class="icon is-small is-left"> <i class="material-icons">email</i> </span>
										<span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
									</p>
								</div>
								<div class="field">
									<p class="control has-icons-left">
										<input name="password" type="password" placeholder="Password" 
					                      v-model="user.password"
					                      v-validate="'required|min:6'" 
					                      :class="{'input': true, 'is-danger': errors.has('password') }">
										<span class="icon is-small is-left"> <i class="material-icons">lock</i> </span>
										<span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
									</p>
								</div>
								<div class="field">
									<p class="control has-icons-left">
										<input name="confirm_password" type="password" placeholder="Confirm Password" 
					                      v-model="user.confirm_password"
					                      v-validate="'required|confirmed:password'" 
					                      data-vv-as="confirm password"
					                      :class="{'input': true, 'is-danger': errors.has('confirm_password') }">
										<span class="icon is-small is-left"> 
											<i class="material-icons">lock</i> 
										</span>
										<span v-show="errors.has('confirm_password')" class="help is-danger">
											{{ errors.first('confirm_password') }}
										</span>
									</p>
								</div>
								<div class="field">
									<p class="control">
										<button type="submit" class="button is-primary"> SignUp </button>
									</p>
								</div>
								<div class="field">
									<p class="control"> 
										<router-link :to="{ name: 'login' }"> Already have an account </router-link> 
									</p>
								</div>
							</div>
						</form>		
					</div>	
				</div>	
			</div>
		</section>
	</div>	
</template>

<script>
import Auth from '@/lib/Auth'
export default {
  data: () => ({
    user: {
      email: '',
      password: '',
      confirm_password: ''
    }
  }),
  methods: {
    signUpForm () {
      this.$validator.validateAll().then(() => {
        let auth = new Auth(this.user)
        auth.register()
      }).catch(() => {})
    }
  }
}
</script>
