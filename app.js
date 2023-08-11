const util = require('./utils/comm')
App({
  globalData: {
    company:'一代生活',
    theme: wx.getSystemInfoSync().theme,
    hasLogin: false,
    paypwd:null,
    openid: null,
    appid:null,
    fasttabinfo:[],
    tabbarinfo:[],
    role:1,
    balance:0,
    cash:0,
    recyclerate:0,
    managerrecyclerate:0,
    servicerate:0,
    managerservicerate:0,
    recyclerservicerate:0,
    db:null,
    _command:null,
    userinfo:{},
    defaultLocation:{},
    locationRange:0.003
  },

  initDataBase(){
    wx.cloud.init({
      env: 'cloud1-7go51v8te374de35',
    })
     const db = wx.cloud.database()
     const _ = db.command
    this.globalData.db = db
    this.globalData._command = _
  },

  getDefaultSettings(){
    var self = this
    self.globalData.db.collection('defaultSettings')
    .get({
      success: function(res) {
        var item = res.data[0]
        console.log('settings:',item)
        self.globalData.defaultLocation = item.location
        self.globalData.locationRange = item.range
        self.globalData.company = item.company
        self.globalData.fasttabinfo = item.fastTab
        self.globalData.tabbarinfo = item.tabinfo
        self.globalData.recyclerate = item.recyclerate
        self.globalData.managerrecyclerate = item.managerrecyclerate
        self.globalData.servicerate = item.servicerate
        self.globalData.managerservicerate = item.managerservicerate
        self.globalData.recyclerservicerate = item.recyclerservicerate
      },
      fail:function(err){
        console.log('settings:',err)
      }
    })
  },

  onLaunch: function () {
    this.initDataBase()
    this.getDefaultSettings()
    this.checkSession()
  },

  queryLoginStatus:function(wechatid){
    var self = this
    var coll=self.globalData.db.collection('user_info').where({
      wechatid:wechatid
    })
    coll.field({
      _id:0
    })
    .get({
      success: function(res) {
        if(res.data.length>0 && res.data[0].userinfo){
          self.globalData.hasLogin = true
          self.globalData.paypwd = res.data[0].paypwd
          self.globalData.role = res.data[0].role
          self.globalData.balance = res.data[0].balance
          self.globalData.cash = res.data[0].cash
          self.globalData.userinfo = res.data[0].userinfo
        }else{
          self.globalData.hasLogin = false
        }
        console.log('login status:',self.globalData.hasLogin?'logined':'unlogin'),
        console.log( self.globalData.role);
      }
    })
  },
  saveUserInfo(wechatid,userinfo){
    console.log(wechatid,userinfo)
    this.globalData.db.collection('user_info')
    .where({
      wechatid:wechatid
    })
    .update({
      data:{
         userinfo:userinfo
      },
      success: function(res) {
        console.log(res.data)
      },
      fail: function(err){
        console.log(err)
      }
    })
  },

  checkSession(){
    var self = this
      wx.checkSession({
        success () {
          console.log('checkSession success')
          //session_key 未过期，并且在本生命周期一直有效
          self.getUserOpenID()
        },
        fail () {
            console.log('checkSession fail')
            self.wechatLogin()
            // session_key 已经失效，需要重新执行登录流程
        }
      })
  },

  wechatLogin(){
    var self = this
    wx.login({
      success (res) {
        if (res.code) {
          console.log('登录成功:' + res.code)
          self.getUserOpenID()
        } else {
          console.log('登录失败:' + res.errMsg)
        }
      }
    }) //重新登录
  },

  getUserOpenID(){
    wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      this.globalData.appid = res.result.appid
      console.log('getUserOpenID:',res.result)
      this.checkNewWechatUser(res.result.openid)
    })
  },

  xgetuserInfo(){
    var self = this
    wx.getUserInfo({
      success(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        
        self.setData({
          userInfo: res.userInfo,
        })
        console.log('userinfo:',userInfo)
      }
    })
  },

  checkNewWechatUser(wechatid){
    var self = this
    var coll=this.globalData.db.collection('user_info').where({
      wechatid:wechatid
    })
    coll.field({
      _id:0
    })
    .get({
      success: function(res) {
        if(res.data.length==0){
          self.addNewWechatUser(wechatid)
          self.globalData.hasLogin = false
        }else{
          self.queryLoginStatus(wechatid)
        }
      }
    })
  },
  
  addNewWechatUser(wechatid){
    console.log('add new user:',this.globalData.db)
    this.globalData.db.collection('user_info').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        balance:0,
        cash:0,
        name:'',
        nike:'',
        phone:'',
        paypwd:'123456',
        role:1,
        wechatid:wechatid,
        date:util.formatDateTime(new Date())
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail: console.error,
      complete: console.log
    })
  },
})
