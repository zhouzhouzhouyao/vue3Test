<script setup lang="ts">
import './index.less';
import { ElButton } from 'element-plus';
import { ref } from 'vue';
import axios from 'axios';
import checkProtocol from '../util/protocol';

const fileRef = ref();
// const list = ref<Array<string>>([]);
const dir = ref<any>({});
const progress = ref<number>(0);
// const hasDir = ref<Boolean>(true);

// 获取盘符
// const getDrives = () => {
//   axios.get('/api/v1/file/getDrives').then((res:any) => {
//     list.value = res.data;
//     console.log(list);
//   });
// };

// 根据路径获取目录
// const getDir = (path:string) => {
//   axios.get('/api/v1/file/readDir?path=' + path)
//     .then((res:any) => {
//       dir.value = res.data;
//     });
// };

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
        filePath: path,
        // 认证token
        token: 'b21hYkF2OjU3ODAwZTI1LTBlMGQtNGZlYS05YjdkLWFmN2NhNDNjZTI4NQ',
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
    const data = JSON.parse(evt.data).data;
    const total:number = data.total;
    if (data.count) {
      const count:number = data.count;
      progress.value = Number((count / total).toFixed(2)) * 100;
    } else {
      const instance = axios.create({
        headers: {
          Authorization: 'Bearer YmluZ286YmluZ29fbWVtYmVyOldfaEhMVVNVSA'
        }
      });
      instance.post('https://pan.bingolink.biz/pan/v1/files/create',
        {
          uploadId: data.uploadId,
          ondup: true,
          size: data.size,
          secret: data.secret,
          name: data.name,
          dirId: 'eef596bb-89ed-49b7-9d4c-6ac6ed64f766',
          storeId: data.storeId
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  ws.onclose = (evt:any) => {
    console.log('Received Close: ', evt.data);
  };
};

function noProtocol () {
  alert('未检测到本地程序，请安装程序');
}

function startProtocol () {
  axios.get('/api/v1/file/select')
    .then((res:any) => {
      console.log(res.data);
      dir.value = res.data;
      return dir;
    })
    .then(dir => {
      uploadFile(dir.value.path, dir.value.name);
    });
}

function websocketTest () {
  const ws = new WebSocket('ws://127.0.0.1:5678/v1/doc/upload');
  ws.onopen = function (res):void {
    if (res.type === 'open') {
      // 可以直接执行程序
      startProtocol();
    }
  };
  ws.onerror = function (res) {
    // 未开启或未安装插件服务
    checkProtocol('BingoFile://', noProtocol, startProtocol); // 打开程序或者安装程序
  };
}

function chooseFile () {
  // fileRef.value.click();
  websocketTest();
  // getDrives();
  // getDir('D:');
  // uploadFile('D:\\code\\README.md', 'README.md');
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
    <el-progress
      class="progress"
      :text-inside="true"
      :stroke-width=35
      :percentage=progress
      status="success"
    />
    <!-- <a href="BingoFile://">BingoFile run</a> -->
    <!-- <div>{{list}}</div>
    <div v-if="hasDir">
      <div v-for="item in dir" :key="item.modTime">
        {{item.path}}
      </div>
    </div>
    <div v-else>
      {{dir}}
    </div> -->
  </div>
</template>
