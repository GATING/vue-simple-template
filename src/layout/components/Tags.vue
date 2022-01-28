<template>
  <div class="flex-between h-38 bg-white">
    <el-scrollbar view-class="hp-100">
      <div class="flex-1 pl-10 hp-100 align-center">
        <el-tag
          v-for="(tag, index) in tagList"
          closable
          :type="nowPath === tag.fullPath ? 'primary' : 'info'"
          :key="tag.fullPath"
          :title="tag.meta ? tag.meta.title : ''"
          :disable-transitions="true"
          class="mr-10 cursor"
          @click="changeRouter(index)"
          @close="canIClose(index)"
        >
          {{ tag.meta ? tag.meta.title : '' }}
        </el-tag>
      </div>
    </el-scrollbar>
    <el-dropdown placement="bottom" @command="handleTags">
      <el-button :style="{ border: 0 }">
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu size="small">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tagList: [],
      lastRoute: { fullPath: '/' },
      currentPath: this.$route.path,
      needAskUrls: [] // 关闭前需要问询的页面路径 不是全路径
    }
  },
  watch: {
    $route: function (n, o) {
      this.lastRoute = o
      if (n !== o) {
        this.$nextTick(() => {
          this.setTags(n)
        }, 0)
        //console.log(n);
      }
    },
    '$store.state.app.currentTags': {
      handler: function (n) {
        this.tagList = [...n]
      },
      deep: true
    },
    '$store.state.app.needClosePath': function (n) {
      if (n) {
        this.$store.commit('clearNowTag', '')
        this.closeRouter(n)
      }
    }
  },
  computed: {
    nowPath() {
      return this.$route.fullPath
    }
  },
  mounted() {
    if (this.$store.state.app.currentTags.length == 0) {
      this.setTags(this.$route)
    } else {
      this.tagList = this.$store.state.app.currentTags
    }
    window.addEventListener('popstate', this.goBack, false)
  },
  unmounted() {
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
    setTags(route) {
      if (
        !this.tagList.some(item => item.fullPath === this.$route.fullPath) &&
        this.$route.path !== '/' &&
        this.$route.path !== '/index'
      ) {
        // let index = this.tagList.findIndex(
        //   item => item.path === this.$route.path
        // );
        this.tagList.push({
          path: route.path,
          fullPath: route.fullPath,
          query: route.query,
          meta: route.meta || {}
        })
        // if (index > -1) {
        //   this.tagList.splice(index, 1, route);
        // } else {
        //   this.tagList.push(route);
        // }
      }
      if (this.tagList.length > 12) {
        this.tagList.shift()
      }
      this.$store.commit('setCurrentTags', this.tagList)
    },
    canIClose(index) {
      if (this.needAskUrls.includes(this.tagList[index].path)) {
        //需要问询后关闭
        const fullPath = this.tagList[index].fullPath
        if (this.$route.fullPath !== fullPath) {
          this.$router.push(fullPath)
        }
        this.$nextTick(() => {
          this.$store.commit('setAskingPath', fullPath)
        })
      } else {
        // 直接关闭
        this.handleClose(index)
      }
    },
    handleClose(index) {
      setTimeout(() => {
        const closePath = this.tagList[index].fullPath
        // 当只有一个tag的时候，并且这个tag就是首页，那么就不需要删除
        const needDelete = !(closePath === '/home/index' && this.tagList.length === 1)
        if (closePath === this.$route.fullPath) {
          if (index > 0) {
            this.$router.push(this.tagList[index - 1].fullPath)
          } else {
            if (this.tagList.length > 1) {
              this.$router.push(this.tagList[index + 1].fullPath)
            } else {
              if (needDelete) {
                this.$router.push('/')
              }
            }
          }
        }
        if (needDelete) {
          this.tagList.splice(index, 1)
          this.$store.commit('setCurrentTags', this.tagList)
        }
      }, 10)
    },
    changeRouter(index) {
      const router = this.tagList[index]
      if (router.fullPath === this.$route.fullPath) return
      // console.log(this.tagList)
      this.$router.push(router)
    },
    closeRouter(fullPath) {
      //关闭指定路由
      let path = this.lastRoute.fullPath
      if (fullPath) {
        path = fullPath
      }
      let index = this.tagList.findIndex(item => item.fullPath === path)
      if (index > -1) {
        this.handleClose(index)
      }
    },
    goBack() {
      console.log('返回', this.lastRoute)
      this.closeRouter()
    },
    // 关闭全部标签
    closeAll() {
      const indexArr = []
      this.tagList.map((e, i) => (this.needAskUrls.includes(e.path) ? indexArr.push(i) : ''))
      if (indexArr.length > 0) {
        this.canIClose(indexArr[0])
        return
      }
      this.tagList = []
      this.$store.commit('setCurrentTags', this.tagList)
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther() {
      const indexArr = []
      this.tagList.map((e, i) =>
        this.needAskUrls.includes(e.path) && e.fullPath !== this.$route.path ? indexArr.push(i) : ''
      )
      if (indexArr.length > 0) {
        this.canIClose(indexArr[0])
        return
      }
      const curItem = this.tagList.filter(item => {
        return item.path === this.$route.fullPath
      })
      this.tagList = curItem
      this.$store.commit('setCurrentTags', this.tagList)
    },
    handleTags(command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  }
}
</script>