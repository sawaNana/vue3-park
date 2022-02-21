class CognitoHostedUIAuth {
  constructor(cognitoDomain, cognitoClientId, accessToken) {
    this.cognitoDomain = cognitoDomain;
    this.cognitoClientId = cognitoClientId;
    this.user = {};
    this.accessToken  = accessToken;
  }
  showLoginUI() {
    const endpoint = `${this.cognitoDomain}/login`;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.cognitoClientId,
      redirect_uri: 'http://localhost:8080/hello-cognito',
      scope: 'openid'
    });
    location.href = `${endpoint}?${params.toString()}`;
  }
  update(authCode) {
    this.authCode = authCode;
    if (this.authCode) {
      return this.getAuthToken()
                 .then(() => { return this.updateUser(); });
    }
    return this.updateUser();
  }
  getAuthToken() {
    const endpoint = `${this.cognitoDomain}/oauth2/token`;
    const requestData = new URLSearchParams();
    requestData.append('grant_type',   'authorization_code');
    requestData.append('client_id',     this.cognitoClientId);
    requestData.append('redirect_uri', 'http://localhost:8080/hello-cognito');
    requestData.append('code',          this.authCode);
    return fetch(endpoint, {
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
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  updateUser() {
    if (!this.accessToken) {
      this.user = {};
      return Promise.resolve();
    }
    const endpoint = `${this.cognitoDomain}/oauth2/userInfo`;
    return fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    }).then((response) => {
      console.log(response);
      return response.json()
    }).then((userData) => {
      if (userData.error) {
        throw userData.error
      }
      this.user = userData;
    }).catch((error) => {
      this.accessToken = '';
      this.user = {};
      console.log(error);
    });
  }
  getUser() {
    return this.user;
  }
  getAccessToken() {
    return this.accessToken;
  }
}
export default CognitoHostedUIAuth;