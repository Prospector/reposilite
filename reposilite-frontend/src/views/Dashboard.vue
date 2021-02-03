<!--
  - Copyright (c) 2020 Dzikoysk
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="flex justify-center items-center" id="app">
    <form class="p-8 text-center border-dashed border-black rounded bg-white" id="login" v-if="!auth.verified"
          method="post">
      <h1 class="font-bold pb-4 text-xl">Login</h1>
      <div class="py-1">
        <input class="w-96 bg-gray-100 p-2 rounded" placeholder="Alias" name="alias" v-model="auth.alias">
      </div>
      <div class="py-1">
        <input class="w-96 bg-gray-100 p-2 rounded" name="token" v-model="auth.token" type="password"
               placeholder="Token" autocomplete="on">
      </div>
      <div class="py-1 text-right px-2 mt-1">
        <router-link class="text-blue-400 text-xs" :to="this.qualifier">← Back to index</router-link>
      </div>
      <div class="py-3">
        <button class="bg-gray-200 px-6 py-1 mt-1 w-96" v-on:click="login">Login</button>
      </div>
      <notifications group="login" position="center top"></notifications>
    </form>
    <div class="p-6 container" id="panel" v-else>
      <header class="pb-4">
        <router-link class="px-4 tab" exact to="/dashboard">Index</router-link>
        <router-link class="px-4 tab" to="/dashboard/cli" v-if="auth.manager">Cli</router-link>
        <router-link class="px-4 tab" to="/dashboard/settings" v-if="auth.manager">Settings</router-link>
        <button class="px-4" v-on:click="logout">Logout</button>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const defaultAuth = {
  alias: '',
  token: '',
  path: '',
  repositories: [],
  manager: false,
  verified: false,
  qualifier: ''
}

export default {
  data: () => ({
    auth: Object.assign({}, defaultAuth),
    qualifier: ''
  }),
  mounted() {
    this.qualifier = this.getQualifier()

    if (sessionStorage.auth) {
      this.auth = JSON.parse(sessionStorage.auth)
    }
  },
  methods: {
    login(event) {
      event.preventDefault()

      this.api('/auth', this.auth)
        .then(response => {
          console.log(response.data)
          this.auth.verified = true
          this.auth.path = response.data.path
          this.auth.manager = response.data.permissions.includes('m')
          this.auth.repositories = response.data.repositories
          sessionStorage.auth = JSON.stringify(this.auth)
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            group: 'login',
            type: 'error',
            title: err.response.data.message
          })
        })
    },
    logout() {
      sessionStorage.removeItem('auth')
      this.auth = Object.assign({}, defaultAuth)
      this.error = undefined
    }
  }
}
</script>

<style lang="stylus" scoped>
html, body
  height 100vh
  width 100vw

#app
  height 100%
  width 100%
  display: flex
  justify-content center
  align-items center

#panel
  background-color transparent
  max-height: 90vh

.bg-white {
  background-color #333333
}

input {
  background-color #222222 !important
  border-radius 0.25rem
}

.bg-gray-200 {
  background-color #484848
}

button {
  border-radius 0.25rem
  background-color #545454
  padding: 0.3rem 0.8rem
}

.rounded {
  border-radius 0.25rem
}

header {
  .router-link-active {
    background-color: #333333 !important;
    color: white;
  }
  .tab {
    padding: 0.4rem 1rem;
    margin-right: 0.25rem;
    border-radius: 0.25rem;
  }
}
</style>
