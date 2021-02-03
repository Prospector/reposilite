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
  <div class="browser">
    <div class="flex justify-between py-4">
      <h1 class="text-xl">Index of<span class="ml-2"><span v-for="(element, idx) in splitQualifier()">
            <router-link :to="pathFragmentUri(idx)">{{ element }}</router-link><span>/</span></span></span>
        <router-link v-if="!isDashboard()" :to="'/dashboard' + this.qualifier"><span class="ml-3"
                                                                                     :style="'color: ' + configuration.accentColor"><i
          class="fas fa-sign-in-alt"></i></span></router-link>
      </h1>
      <router-link v-if="!isRoot()" :to="prefix + parentPath()" class="back-button"><i class="fas fa-chevron-left"></i>
        Back
      </router-link>
    </div>
    <div class="download-info" v-if="mavenMetadata">
      <span class="fileTitle">build.gradle:</span>
      <pre><code>repositories {
  maven {
    name 'TerraformersMC'
    url 'https://maven.terraformersmc.com/'
  }
}

dependencies {
  modImplementation '{{ mavenMetadata.metadata.groupId[0] }}:${project.{{
          mavenMetadata.metadata.artifactId[0]
        }}_version}'
}</code></pre>
      <span class="fileTitle">gradle.properties:</span>
      <pre><code>{{ mavenMetadata.metadata.artifactId[0] }}_version = {{
          mavenMetadata.metadata.versioning[0].latest[0]
        }}</code></pre>
    </div>
    <div class="list overflow-y-auto">
      <FileEntry v-if="!error" v-for="(file, index) in sortedFiles()" :key="file.name" :prefix="prefix" :file="file"
                 :auth="auth" :last="index === files.length - 1"></FileEntry>
      <h1 v-if="!error && files.length === 0">Empty directory</h1>
      <h1 class="font-bold" v-if="error">{{ response.message }}</h1>
    </div>
    <notifications group="index" position="center top"></notifications>
  </div>
</template>

<script>
import Vue from 'vue'
import smoothReflow from 'vue-smooth-reflow'
import FileEntry from './FileEntry'
import axios from 'axios'

const CHUNK_SIZE = 10
const semver = require('semver')
const semverRegex = require('semver-regex')
let mavenMetadata

function sort (semvers, compare) {
  if (!(semvers instanceof Array)) {
    throw new Error('It is not an array')
  }

  return semvers.sort(function (file1, file2) {
    const v1Array = semverRegex().exec(file1.name)
    const v2Array = semverRegex().exec(file2.name)

    const sv1 = (v1Array && v1Array.length > 0 ? v1Array[0] : null) || file1.name
    const sv2 = (v2Array && v2Array.length > 0 ? v2Array[0] : null) || file2.name

    return compare(sv1, sv2)
  })
}

export default {
  mixins: [smoothReflow],
  props: {
    initQualifier: String,
    prefix: String,
    auth: Object
  },
  data () {
    return {
      configuration: Vue.prototype.$reposilite,
      files: [],
      error: undefined,
      taskId: 0,
      qualifier: this.initQualifier,
      mavenMetadata: mavenMetadata
    }
  },
  components: {
    FileEntry
  },
  watch: {
    $route: {
      immediate: true,
      handler: function () {
        this.qualifier = this.getQualifier()
        this.taskId += 1
        this.files = []

        this.api(this.qualifier, this.auth)
          .then(response => this.loadFiles(this.taskId, response.data.files))
          .then(response => console.log(this.response))
          .catch(err => this.$notify({
            group: 'index',
            type: 'error',
            title: (this.error = err.response.data.message)
          }))
      }
    }
  },
  mounted () {
    this.$smoothReflow({
      transition: '.15s'
    })
    // const containsMetadata = false
    // console.log(this.files)
    // console.log(JSON.stringify(this.files))
    // const filesNew = JSON.parse(JSON.stringify(this.files))
    // console.log(filesNew)
    // console.log('File count: ' + filesNeSw.length)
    // console.log('First file: ' + filesNew[0])
    // for (const file in filesNew) {
    //   console.log(file.name)
    // }
    // console.log('Meta? ' + containsMetadata)
    // const parseString = require('xml2js').parseString
    // const url = location.protocol + '//' + location.host + location.pathname + '/maven-metadata.xml'
    // console.log('Loading maven-metadata.xml from: ' + url)
    // axios.get(url)
    //   .then(response => {
    //     parseString(response.data, (err, result) => {
    //       if (err) {
    //         console.error(err)
    //       } else {
    //         this.mavenMetadata = result
    //         console.log(mavenMetadata)
    //       }
    //     })
    //   })
  },
  methods: {
    // replace with virtual scroller in the future
    loadFiles (taskId, files) {
      if (this.taskId !== taskId) {
        return
      }

      let delegatedCount = CHUNK_SIZE

      for (const file of files) {
        Object.freeze(file)
        this.files.push(file)
        delegatedCount--

        if (delegatedCount === 0) {
          setTimeout(() => this.loadFiles(taskId, files.slice(CHUNK_SIZE)), 250)
          break
        }
      }
    },
    pathFragmentUri (index) {
      return this.splitQualifier()
        .slice(0, index + 1)
        .join('/')
    },
    isDashboard () {
      return this.prefix === '/dashboard'
    },
    isRoot () {
      return this.qualifier === undefined || this.qualifier.length < 2
    },
    sortedFiles () {
      function compare (file1, file2, loose) {
        try {
          return semver.rcompare(file1, file2, loose)
        } catch (e) {
          if (semver.valid(file1)) {
            return -1
          }
          if (semver.valid(file2)) {
            return 1
          }
          if (file1 === file2) {
            return 0
          }
          return file1 > file2 ? 1 : -1
        }
      }

      return sort(this.files.slice(), compare)
    }
  }
}
</script>

<style lang="stylus">
.downloadTitle {
  font-weight 900
  margin-left 0.5rem
}

.fileTitle {
  font-weight bold
  margin-left 0.75rem
}

pre {
  margin 0.5rem 1rem
  background-color #4e4e4e
  padding 0.5rem 1rem
  border-radius 0.25rem
}

.list
  border-radius 0.25rem

.download-info
  border-radius 0.25rem
  padding: 0.5rem
  background-color #333333
  margin-bottom: 1rem

.back-button {
  padding: 0.3rem 0.8rem
  border-radius: 0.25rem

  :hover {
    background-color: #333333
    color: white;
  }
}
</style>
