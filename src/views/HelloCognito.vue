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
        <input type="text" v-model="cognitoClientId" class="rounded-md w-full px-2 text-stone-700" placeholder="your cognito client ID">
      </div>
    </div>
    <div class="text-left m-10">
      <h2 class="text-2xl">現在のユーザー情報</h2>
      <pre>{{ JSON.stringify(user, null, "  ")}}</pre>
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
      user: {}
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
    const url = new URL(location.href);
    const code = url.searchParams.get('code')
    if(code) {
      this.getAuthToken(code);
    }
    this.updateUser();
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
    getAuthToken: function(authCode) {
      const endpoint = `${this.cognitoDomain}/oauth2/token`;
      const requestData = new URLSearchParams();
      requestData.append('grant_type',   'authorization_code');
      requestData.append('client_id',     this.cognitoClientId);
      requestData.append('redirect_uri', 'http://localhost:8080/hello-cognito');
      requestData.append('code',          authCode);
      fetch(endpoint, {
          method: 'POST',
          cache:  'no-cache',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: requestData
        })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          if (json.error) {
            console.log(json);
            return;
          }
          console.log(json);
          this.accessToken  = json.access_token
          this.idToken      = json.id_token
          this.refreshToken = json.refresh_token
        })
        .then(()=> {
          localStorage.accessToken = this.accessToken;
          localStorage.idToken = this.idToken;
          localStorage.refreshToken = this.refreshToken;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateUser: function() {
      if (!this.accessToken) {
        this.user = {};
        return;
      }
      const endpoint = `${this.cognitoDomain}/oauth2/userInfo`;
      fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }).then((response) => {
        console.log(response);
        return response.json()
      }).then((userData) => {
        this.user = userData;
        console.log(userData);
      }).catch((error) => {
        this.accessToken = '';
        localStorage.accessToken = '';
        this.user = {};
        console.log(error);
      });
    }
  }
}
</script>
