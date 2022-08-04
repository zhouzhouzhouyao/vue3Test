<script setup lang="ts">
import './index.less';
import { ElButton } from 'element-plus';
import { ref } from 'vue';

// defineProps<{ msg: string }>();
const fileRef = ref();
const list: Array<number> = [1, 2, 3, 4, 5];

function chooseFile () {
  fileRef.value.click();
}

function getFile (e:any) {
  console.log(e);
  console.log('123');
  const fileUrl = e.target.value;
  const file = e.target.files[0];
  console.log(`file: ${file}, fileUrl: ${fileUrl}`);
}

</script>

<template>
  <div class="card">
    <ElButton type="primary" @click="chooseFile">Upload File</ElButton>
    <input
      ref="fileRef"
      type="file"
      class="upload-file"
      @change="getFile"
    />
    <div>
      {{list}}
    </div>
    <a href="BingoFile://">BingoFile run</a>
  </div>
</template>
