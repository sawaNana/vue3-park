<template>
  <div id="hello-cognito" class="bg-gradient-to-r from-amber-500 to-amber-400 text-white h-full">
    <NavigationBar brandHref="/" />
    <div>
      <h1 class="text-left text-7xl m-10">AWS Cognitoでログインを試す</h1>
    </div>
    <div class="flex">
      <div class="">
        <div class="text-left m-10">
          <h2 class="text-2xl">Cognito User PoolのCognitoドメイン</h2>
          <div class="w-96 py-5">
            <input type="text" v-model="cognitoDomain" class="rounded-md w-full px-2 text-stone-700" placeholder="your-cognito-domain.com">
          </div>
        </div>
        <div class="text-left m-10">
          <h2 class="text-2xl">Cognito User PoolのCognitoクライアントID</h2>
          <div class="w-96 py-5">
            <input type="text" v-model="cognitoClientId" class="rounded-md w-full px-2 text-stone-700" placeholder="your cognito client ID">
          </div>
        </div>
      </div>
      <div class="text-left m-10">
        <h2 class="text-2xl">現在のユーザー情報</h2>
        <pre class="bg-amber-200 whitespace-pre-wrap rounded-md text-orange-800 p-2">{{ JSON.stringify(user, null, "  ")}}</pre>
      </div>
    </div>
    <div class="text-left m-10">
      <h2 class="text-2xl">CognitoがホストしてくれるUIでのログイン</h2>
      <div class="w-96 py-5">
        <button tyepe="button" id="cognit-hosted-signin"
          v-on:click="showHostedSignInUI" 
          class="w-24 bg-pink-500 rounded-md px-3 py-2 border-solid border-shite hover:bg-pink-400">
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue';
import CognitoHostedUIAuth from '../libs/CognitoHostedUIAuth.js';
export default {
  name: 'HelloCognito',
  components: {
    NavigationBar
  },
  data: function(){
    return {
      cognitoDomain: '',
      cognitoClientId: '',
      accessToken: '',
      idToken: '',
      refreshToken: '',
      user: {},
      hostedUIAuth: null
    };
  },
  mounted: function() {
    if (localStorage.cognitoDomain) {
      this.cognitoDomain = localStorage.cognitoDomain;
    }
    if (localStorage.cognitoClientId) {
      this.cognitoClientId = localStorage.cognitoClientId;
    }
    if (localStorage.accessToken) {
      this.accessToken = localStorage.accessToken;
    }
    this.hostedUIAuth = new CognitoHostedUIAuth(this.cognitoDomain, this.cognitoClientId, this.accessToken);
    const url = new URL(location.href);
    const code = url.searchParams.get('code')
    this.hostedUIAuth.update(code)
      .then(()=> {
        localStorage.accessToken = this.hostedUIAuth.getAccessToken();
      })
      .then(() => {
        this.user = this.hostedUIAuth.getUser();
      });
  },
  methods: {
    showHostedSignInUI: function() {
      this.hostedUIAuth.showLoginUI();
    },
  }
}
</script>
