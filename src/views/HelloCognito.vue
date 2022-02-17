<template>
  <div id="hello-cognito" class="bg-gradient-to-r from-amber-500 to-amber-400 text-white h-full">
    <NavigationBar brandHref="/" />
    <div>
      <h1 class="text-left text-7xl m-10">AWS Cognitoでログインを試す</h1>
    </div>
    <div class="text-left m-10">
      <h2 class="text-2xl">Cognito User PoolのCognitoドメイン</h2>
      <div class="w-96 py-5">
        <input type="text" v-model="cognitoDomain" class="rounded-md w-full px-2 text-stone-700" placeholder="your-cognito-domain.com">
      </div>
    </div>
    <div class="text-left m-10">
      <h2 class="text-2xl">Cognito User PoolのCognitoクライアントID</h2>
      <div class="w-96 py-5">
        <input type="text" v-model="cognitoClientId" class="rounded-md w-full px-2 text-stone-700" placeholder="your cogunito client ID">
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
import NavigationBar from '../components/NavigationBar.vue'
export default {
  name: 'HelloCognito',
  components: {
    NavigationBar
  },
  data: function(){
    return {
      cognitoDomain: '',
      cognitoClientId: '',
      authCode: ''
    };
  },
  mounted: function() {
    if (localStorage.cognitoDomain) {
      this.cognitoDomain = localStorage.cognitoDomain;
    }
    if (localStorage.cognitoClientId) {
      this.cognitoClientId = localStorage.cognitoClientId;
    }
    const url = new URL(location.href);
    const code = url.searchParams.get('code')
    if(code) {
      this.authCode = code;
      this.getAuthToken();
    }
  },
  methods: {
    showHostedSignInUI: function() {
      localStorage.cognitoDomain = this.cognitoDomain;
      localStorage.cognitoClientId = this.cognitoClientId;
      const endpoint = `${this.cognitoDomain}/login`;
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.cognitoClientId,
        redirect_uri: 'http://localhost:8080/hello-cognito',
        scope: 'openid'
      });
      location.href = `${endpoint}?${params.toString()}`;
    },
    getAuthToken: function() {
      const endpoint = `${this.cognitoDomain}/oauth2/token`;
      const requestData = new URLSearchParams();
      requestData.append('grant_type',   'authorization_code');
      requestData.append('client_id',     this.cognitoClientId);
      requestData.append('redirect_uri', 'http://localhost:8080/hello-cognito');
      requestData.append('code',          this.authCode);
      //const requestData = `grant_type=authorization_code&client_id=${this.cognitoClientId}&scope=openid&redirect_uri=http://localhost:8080/hello-cognito&code=${this.authCode}`;
      fetch(endpoint, {
          method: 'POST',
          cache:  'no-cache',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: requestData
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          console.log(json);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
}
</script>
