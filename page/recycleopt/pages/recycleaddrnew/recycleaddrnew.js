// page/user/recycleaddrnew/recycleaddrnew.js
const preset = require('../../../../resource/presets')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      opener:'',
      hasCommunity:true,
      range:app.globalData.locationRange,
      caller:'',
      flat:'',
      phoneError: false,
      phoneNumber: '',
      buttonTitleSave : preset.appPreSets.buttonTitleSave,
      seletedIndex:0,
      latitude:0,
      longitude:0,
      communityArray : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var _this = this
      const eventChannel= this.getOpenerEventChannel()
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('where from:',data.data.opener)
      _this.setData({
          opener:data.data.opener
        })
      })
      wx.getLocation({
          type: 'gcj02',//wgs84
          success (res) {
            _this.data.latitude = res.latitude
            _this.data.longitude = res.longitude
            const speed = res.speed
            const accuracy = res.accuracy
            console.log('location:',res)
            _this.getUseableCommnity(res.latitude,res.longitude)
          },
          fail (err){
            console.log('fail-location:',err)
            _this.data.latitude = res.latitude
            _this.data.longitude = res.longitude
            _this.getUseableCommnity(res.latitude,res.longitude)
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
      db.collection('community_info').where(
        _.and([
          {
            latitude: _.lt(latitude+this.data.range)
          },
          {
            latitude: _.gt(latitude-this.data.range)
          },
          {
            longitude: _.lt(longitude+this.data.range)
          },
          {
            longitude: _.gt(longitude-this.data.range)
          }
        ])
      )
      .get({
        success: function(res) {
          if(res.data.length>0){
            _this.updateCommunityList(res.data)
          }else{
            _this.setData({
              hasCommunity:false
            })
            if(_this.data.opener=='request'){
              _this.emitData(_this.packetdata())
            }
          }
        }
      })
    },

    updateCommunityList(list){
      var arr = []
      list.forEach(element => {
        arr.push({'code':element.communitycode,
                  'name':element.communityname,
                  'addr':element.communityaddress,
                  'latitude':element.latitude,
                  'longitude':element.longitude
                })
      });
      this.setData({
        communityArray : arr,
        hasCommunity:true
      })
    },

    saveRecycleAddress(){
      var _this = this
      const item = this.packetdata()
      const db = app.globalData.db
      db.collection('recycleaddr_list').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          communitycode: item.communitycode, // 用 {openid} 变量，后台会自动替换为当前用户 openid
          caller: item.caller,
          flat: item.flat,
          phonenum:item.phonenum,
          communityname:item.communityname,
          communityaddress:item.communityaddress,
          latitude:item.latitude,
          longitude:item.longitude,
          wechatid: app.globalData.openid
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          _this.setData({
            caller:'',
            flat:'',
            phoneNumber:''
          })
          _this.emitData(item)
          _this.backToOpener()
        },
        fail: console.error,
        complete: console.log
      })
    },

    packetdata(){
      var caller = this.data.caller
      var phone = this.data.phoneNumber
      var flat = this.data.flat
      var index = this.data.seletedIndex
      var communityaddress = ''
      var communityname = ''
      var communitycode = ''
      var latitude = this.data.latitude
      var longitude= this.data.longitude
      if(this.data.communityArray.length>0)
      {
         communityaddress = this.data.communityArray[index].addr
         communityname = this.data.communityArray[index].name
         communitycode = this.data.communityArray[index].code
         latitude = this.data.communityArray[index].latitude
         longitude= this.data.communityArray[index].longitude
      }

      var title=caller+'----'+phone
      var detail = communityaddress+communityname+flat
      var item = {
        'title':title,
        'detail':detail,
        'latitude':latitude,
        'longitude':longitude,
        'communitycode':communitycode,
        'communityname':communityname,
        'communityaddress':communityaddress,
        'flat':flat,
        'caller':caller,
        'phonenum':phone
      }
      return item
    },

    emitData(item){
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('acceptDataFromOpenedPage', { item: item })
    },

    backToOpener(){
      switch(this.data.opener){
        case 'request':
          wx.navigateBack({
            delta: 1
          })
          break
        case 'list':
          break
      }
    }

})