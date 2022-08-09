<script setup lang="ts">
import './index.less';
import { ElButton } from 'element-plus';
import { ref } from 'vue';
// import { getDrives } from '../request/api';
import axios from 'axios';

const fileRef = ref();
const list = ref<Array<string>>([]);
const dir = ref<any>({});

// 获取盘符
const getDrives = () => {
  axios.get('/api/v1/file/getDrives').then((res:any) => {
    list.value = res.data;
    console.log(list);
  });
};

// 根据路径获取目录
const getDir = (path:string) => {
  axios.get('/api/v1/file/readDir?path=' + path)
    .then((res:any) => {
      dir.value = res.data;
    });
};

// 上传文件
const uploadFile = (path:string, name:string) => {
  const ws = new WebSocket('ws://127.0.0.1:5678/v1/doc/upload');
  ws.onopen = (evt) => {
    console.log('Connection open ...');
    ws.send(JSON.stringify({
      type: 'upload',
      data: {
        // （可选）任务id，用于记录上传信息，当下次上传时发现taskId已经存在，会读取上次上传进度。如果不传，表示不记录，每次上传都是重新开始
        // taskId: 'testId',
        // 文档服务地址
        docUri: 'https://panbeta.bingolink.biz/pan',
        // 本地需要上传的文件
        // filePath: "/Users/tanzhihui/Develop/electron/demo/dist/foo.jpg",
        filePath: path,
        // 认证token
        token: 'b21hYkF2OjE1OTM1NTM4LTMyYzEtNDRlYS1hODU4LTRjYWM4YTQyZGUxNQ',
        // 文件名
        fileName: name,
        // 是否加密文件
        useEncrypt: true
      }
    }));
  };
  ws.onerror = (evt:any) => {
    console.log('Received Error: ', evt.data);
  };
  ws.onmessage = (evt:any) => {
    console.log('Received Message: ', evt.data);
  };
  ws.onclose = (evt:any) => {
    console.log('Received Close: ', evt.data);
  };
};

function chooseFile () {
  fileRef.value.click();
  getDrives();
  getDir('D:\\code');
  uploadFile('D:\\code\\README.md', 'README.md');
}

function getFile (e:any) {
  const fileUrl = e.target.value;
  const file = e.target.files[0];
  console.log(`file: ${file}, fileUrl: ${fileUrl}`);
}

</script>

<template>
  <div class="card">
    <ElButton type="primary" @click="chooseFile">选择文件</ElButton>
    <input
      ref="fileRef"
      type="file"
      class="upload-file"
      @change="getFile"
    />
    <a href="BingoFile://">BingoFile run</a>
    <div>{{list}}</div>
    <div>{{dir}}</div>
  </div>
</template>
