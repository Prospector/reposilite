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
  <div id="app">
    <header>
      <div class="navbar">
        <div class="content">
          <router-link class="root" to="/">
            <div class="logo">
              <img src="https://raw.githubusercontent.com/Prospector/images/master/terraformersmc.svg"
                   alt="TerraformersMC Logo">
            </div>
            <span class="title">{{ reposilite.title }}</span>
          </router-link>
        </div>
      </div>
    </header>
    <main>
      <div class="container mx-auto">
        <div class="mx-4 pb-16">
          <FileBrowser :qualifier="qualifier" :auth="{}" prefix=""></FileBrowser>
        </div>
      </div>
    </main>
    <notifications group="index" position="center top"></notifications>
  </div>
</template>

<script>
import Vue from 'vue'
import FileBrowser from '../components/browser/FileBrowser'

export default {
  data: () => ({
    reposilite: Vue.prototype.$reposilite,
    qualifier: undefined
  }),
  components: {
    FileBrowser
  },
  watch: {
    $route: {
      immediate: true,
      handler: function () {
        this.qualifier = this.getQualifier()
      }
    }
  }
}
</script>

<style lang="stylus">
html
  background-color #222222

#app
  font-family 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #D5D5D5
  height 100%
  width 100%

.blue
  background-color #0077dd

.navbar {
  width 100%
  height 3rem
  background-color #fff7e5
  color: #221203
  display: flex
  justify-content: center
  align-items: center

  .content {
    width 80%

    .root {
      display: flex
      flex-direction row

      .logo {
        display: flex
        justify-content: center
        align-items: center
        width: 2rem;
      }

      .title {
        font-size: 1.25rem
        font-weight bold
        margin-left: 0.5rem
        line-height 1.8rem
      }
    }

    @media screen and (max-width: 690px) {
      width: 100%
      .logo {
        margin-left: 0.5rem
      }
    }
  }
}

svg
  z-index -1

.segoe
  font-family 'Segoe UI', 'Manrope'
</style>
