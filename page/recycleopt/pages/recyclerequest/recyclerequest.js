// page/user/recyclerequest/recyclerequest.js
const util = require('../../../../util/util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      messages:'',
      communitycode:'',
      title:'',
      detail:'选择详细地址',
      caller:'',
      phonenum:'',
      theme: 'light',
      latitude: 23.099994,
      longitude: 113.324520,
      markers: [{
        latitude: 23.099994,
        longitude: 113.324520,
        name: 'T.I.T 创意园'
    }],
    polygons: [{
      points: [
        {
          latitude: 23.099994,
          longitude: 113.324520,
        },
        {
          latitude: 23.098994,
          longitude: 113.323520,
        },
        {
          latitude: 23.098994,
          longitude: 113.325520,
        }
      ],
      strokeWidth: 3,
      strokeColor: '#FFFFFFAA',
    }],
    subKey: 'B5QBZ-7JTLU-DSSVA-2BRJ3-TNXLF-2TBR7',
    enable3d: false,
    showCompass: false,
    enableOverlooking: false,
    enableZoom: true,
    enableScroll: true,
    enableRotate: false,
    drawPolygon: false,
    enableSatellite: false,
    enableTraffic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setDefaultRecycleAddr(app.globalData.openid)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    setDefaultRecycleAddr(wechatid){
      var _this = this
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      var coll=db.collection('recycleaddr_list').where({
        wechatid:app.globalData.openid
      })
      
      coll.field({
        _id:0,
        caller:1,
        flat:1,
        phonenum:1,
        latitude:1,
        longitude:1,
        communitycode:1,
        communityname:1,
        communityaddress:1
      })
      .get({
        success: function(res) {
          console.log(res)
          if(res.data.length>0){
            //_this.data.recycleArray = res.data
            var item=res.data[res.data.length-1]  
            var title=item.caller+'----'+item.phonenum
            var detail = item.communityaddress+item.communityname+item.flat   
            var array=[{latitude:item.latitude,longitude:item.longitude,name:'UU'}]
            console.log('default code:',item.communitycode)
            _this.setData({
              title:title,
              detail:detail,
              caller:item.caller,
              phonenum:item.phonenum,
              communityname:item.communityname,
              flat:item.flat,
              latitude:item.latitude,
              longitude:item.longitude,
              markers:array,
              communitycode:item.communitycode
            })
          }
        }
      })
    },

    selectedAddr(e){
        var _this = this;
        wx.navigateTo({
          url: '../recycleaddrlist/recycleaddrlist',
          events: {
            acceptDataFromOpenedPage: function (data) {
              console.log('accept event:',data.data)
              var array=[{latitude:data.data.latitude,longitude:data.data.longitude,name:'UU'}]
              console.log('selected code:',data.data.communitycode)
              _this.setData({
                title:data.data.title,
                detail:data.data.detail,
                caller:data.data.caller,
                phonenum:data.data.phonenum,
                communityname:data.data.communityname,
                flat:data.data.flat,
                latitude:data.data.latitude,
                longitude:data.data.longitude,
                markers:array,
                communitycode:data.data.communitycode
              })
            },
          },
          success: function (res) {
            console.log(res)
            res.eventChannel.emit('acceptDataFromOpenerPage', { data: {'opener':1} })
          }
        })
    },

    onCommit(){
      var _this = this
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('community_info').where({
        communitycode:this.data.communitycode
      }).field({
        _id:0,
        nodecode:1
      }).get({
        success:function(res){
          db.collection('node_info').where({
            nodecode:res.data.nodecode
          }).field({
            _id:0,
            wechatid:1
          }).get({
            success:function(res){
              _this.saveRecycleOrder(db,res.data[0].wechatid)
            }
          })
        }
      })
    },
    saveRecycleOrder(db,wechatbuy){
      var timestamp = new Date().getTime()
      var orderid = this.data.communitycode+timestamp
      console.log('orderid:',this.data.communitycode,timestamp)
      db.collection('order_recycle').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        orderid:orderid,
        wechatsale: app.globalData.openid, // 用 {openid} 变量，后台会自动替换为当前用户 openid
        wechatbuy: wechatbuy,
        type: 0,
        amount:0,
        cost:0,
        price:0,
        status:0,
        communitycode:this.data.communitycode,
        communityname:this.data.communityname,
        flat:this.data.flat,
        caller:this.data.caller,
        phonenum:this.data.phonenum,
        messages:this.data.messages,
        date:util.formatDateTime(new Date())
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        _this.setData({
          caller:'',
          detail:'',
          phoneNumber:''
        })
      },
      fail: console.error,
      complete: console.log
    })
    }
})