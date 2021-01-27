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
  <div :class="{ 'divider-bottom': !last }" class="flex py-2 px-6">
    <div class="pr-5"><i class="fas fa-folder" v-if="file.type === 'directory'"></i><i class="fas fa-file"
                                                                                       v-if="file.type === 'file'"></i>
    </div>
    <div class="flex justify-between w-full">
      <h1 v-if="file.type === 'file'">{{ file.name }}</h1>
      <h1 class="font-bold" v-else>{{ file.name }}</h1>
      <p v-if="file.type === 'file'">{{ fileSize }}</p>
    </div>
  </div>
</template>

<script>
import prettyBytes from 'pretty-bytes'

export default {
  props: {
    file: Object,
    last: Boolean
  },
  data() {
    return {
      fileSize: prettyBytes(this.file.contentLength)
    }
  }
}
</script>

<style lang="stylus">
.divider-bottom {
  border-bottom: 2px solid #222222
}
</style>
