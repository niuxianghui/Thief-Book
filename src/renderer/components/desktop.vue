<template>
  <el-container class="container" :style="color">
    <div class="text boss" v-if="is_boss">
      <span>{{text}}</span>
    </div>
    <div v-else>
      <div
        class="texts"
        @click="onMouse(1)"
        @contextmenu.prevent="onMouse(2)"
        @mouseover="onMouse(3)"
        @mouseout="onMouse(4)"
        @dbclick.prevent="onMouse(5)"
        v-show="is_mouse_model=='1'"
      >{{text}}</div>

      <div class="text" v-show="is_mouse_model=='0'">
        <span>{{text.split(' ')[0]}}</span>
        <span 
        style="color:#01c542;white-space: pre-wrap;" v-if="text.split(' ')[1].indexOf('-') > -1"
        >%{{text.split(' ')[1].replace('-','')}}   </span>
        <span style="color:#fd8c89;white-space: pre-wrap;" v-else>{{text.split(' ')[1]}}   </span>
        <span style="color:#fd8c89">{{text.split(' ')[2]}}</span>
        <span style="color:#0ba9f9;white-space: pre-wrap;">{{text.split(' ')[3]}}   </span>
        <span>{{text.split(' ')[4]}}</span>
        <span style="color:#01c542" v-if="text.split(' ')[5].indexOf('-') > -1"
          >{{text.split(' ')[5].replace('-','')}}</span>
        <span style="color:#fd8c89" v-else>{{text.split(' ')[5]}}</span>
        </div>
    </div>
  </el-container>
</template>

<script>
import db from "../../main/utils/db";
import { ipcRenderer, remote } from "electron";
import { on } from "cluster";

export default {
  name: "desktop",
  data() {
    return {
      is_boss: true,
      color: "",
      text: "",
      font_size: "",
      is_mouse_model: "0"
    };
  },
  created() {
    this.onLoad();
  },
  mounted() {
    var that = this;
    ipcRenderer.on("bg_text_color", function(event, message) {
      that.onLoad();
    });

    ipcRenderer.on("text", function(event, message) {
      if (message === "boss") {
        that.is_boss = true;
        that.text = remote.getGlobal("text").text;
      } else {
        that.is_boss = false;
        that.text = remote.getGlobal("text").text;
      }
    });
  },
  methods: {
    onLoad() {
      var bg_color = db.get("bg_color");
      var txt_color = db.get("txt_color");
      var font_size = db.get("font_size");
      this.is_mouse_model = db.get("is_mouse");
      this.color =
        "background: " +
        bg_color +
        ";color:" +
        txt_color +
        ";font-size:" +
        font_size +
        "px;";
    },
    onMouse(type) {
      if (type == 1) {
        // 鼠标左击
        ipcRenderer.send("MouseAction", "1");
      } else if (type == 2) {
        // 鼠标右击
        ipcRenderer.send("MouseAction", "2");
      } else if (type == 3) {
        // 鼠标进入
        ipcRenderer.send("MouseAction", "3");
      } else if (type == 4) {
        // 鼠标移出
        ipcRenderer.send("MouseAction", "4");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;

  .text {
    -webkit-app-region: drag;
    height: 100%;
    padding: 0px 10px;
    margin-top: 3px;
  }

  .texts {
    -webkit-app-region: no-drag;
    height: 100%;
    padding: 0px 10px;
  }

  .boss {
    text-align: center;
    width: 100%;
    display: table;
    overflow: hidden;

    span {
      vertical-align: middle;
      display: table-cell;
    }
  }
}
</style>
