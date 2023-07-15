// page/user/recycleaddrnew/recycleaddrnew.js
const preset = require('../../../../resource/presets')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      caller:'',
      flat:'',
      phoneError: false,
      phoneNumber: '',
      location : false,
      buttonTitleSave : preset.appPreSets.buttonTitleSave,
      seletedIndex:0,
      communityArray : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var _this = this
        wx.getLocation({
            type: 'wgs84',
            success (res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
              console.log('location:',res)
              _this.setData({
                location : true
              })
              _this.getUseableCommnity(latitude,longitude)
              // _this.getUseableCommnity(res.latitude,res.longitude)
            }
           })

       /* wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success (res) {
              const latitude = res.latitude
              const longitude = res.longitude
              wx.openLocation({
                latitude,
                longitude,
                scale: 18
              })
            }
           })*/
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
    radioChange(){

    },
    
    onChecked(obj){
      console.log('onChecked:',obj)
      this.data.seletedIndex = obj.currentTarget.id
    },
    onClicked(obj){
      console.log('onClicked:',obj)
    },
    onPhoneInput(e) {
      const { phoneError } = this.data;
      const isPhoneNumber = /^[1][3,4,5,7,8,9][0-9]{9}$/.test(e.detail.value);
      if (phoneError === isPhoneNumber) {
        this.setData({
          phoneError: !isPhoneNumber,
        });
      }
    },
    getUseableCommnity(latitude,longitude){
      var _this = this
      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('community_info').where({
        latitude: _.lt(latitude+0.005),
        latitude: _.gt(latitude-0.005),
        longitude: _.lt(longitude+0.005),
        longitude: _.gt(longitude-0.005)
      })
      .get({
        success: function(res) {
          if(res.data.length>0){
            _this.updateCommunityList(res.data)
          }
        }
      })
    },

    updateCommunityList(list){
      var arr = []
      list.forEach(element => {
        console.log('communitycode:',element.communitycode)
        console.log('communityname:',element.communityname)
        console.log('communityaddress:',element.communityaddress)
        arr.push({'code':element.communitycode,
                  'name':element.communityname,
                  'addr':element.communityaddress,
                  'latitude':element.latitude,
                  'longitude':element.longitude
                })
      });
      this.setData({
        communityArray : arr
      })
    },

    saveRecycleAddress(){
      var _this = this
      var user = this.data.caller
      var phone = this.data.phoneNumber
      var index = this.data.seletedIndex
      var address = this.data.communityArray[index].addr
      var name = this.data.communityArray[index].name
      var latitude = this.data.communityArray[index].latitude
      var longitude= this.data.communityArray[index].longitude

      wx.cloud.init({
        env: 'cloud1-7go51v8te374de35',
      })
      const db = wx.cloud.database()
      const _ = db.command

      db.collection('recycleaddr_list').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          communitycode: this.data.communityArray[index].code, // 用 {openid} 变量，后台会自动替换为当前用户 openid
          caller: user,
          flat: this.data.flat,
          phonenum:phone,
          communityname:name,
          communityaddress:address,
          latitude:latitude,
          longitude:longitude,
          wechatid: app.globalData.openid
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          _this.setData({
            caller:'',
            flat:'',
            phoneNumber:''
          })
        },
        fail: console.error,
        complete: console.log
      })
    }

})