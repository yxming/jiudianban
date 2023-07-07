// page/newcommunity/newcommunity.js
const util = require('../../../../util/util.js')
const preset = require('../../../../resource/presets.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude : 0,
        longitude : 0,
        address : '',
        nodecode : '',
        code : '',
        name : '',
        wechat : '',

        buttonTitleForMap : preset.appPreSets.buttonTitleForMap,
        buttonTitleSave : preset.appPreSets.buttonTitleSave,
        labelRecycleNodeCode : preset.appPreSets.labelRecycleNodeCode,
        labelCommunityAddr : preset.appPreSets.labelCommunityAddr,
        labelCommunityCode : preset.appPreSets.labelCommunityCode,
        labelCommunityName : preset.appPreSets.labelCommunityName,
        labelCommunityWechat : preset.appPreSets.labelCommunityWechat,

        placeholderAddr : preset.appPreSets.placeholderAddr,
        placeholderCode : preset.appPreSets.placeholderCode,
        placeholderName : preset.appPreSets.placeholderName,
        placeholderWechat : preset.appPreSets.placeholderWechat
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var _this = this
        const eventChannel = this.getOpenerEventChannel()
        //eventChannel.emit('acceptDataFromOpenedPage', { data: this.name })
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
               console.log(data)
               _this.setData({
                   nodecode : data.code,
                   latitude : data.latitude,
                   longitude: data.longitude
               })
               
        })
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
    dataFromMap(){
        wx.chooseLocation({latitude:this.data.latitude,longitude:this.data.longitude,success: res=>{
            console.log('lat:',res.latitude,'longt:',res.longitude)
            console.log('name:',res.name)
            console.log('addr:',this.address)
            this.setData({
                address : res.address,
                code : util.getCommunityCode(res.name),
                name : res.name,
                latitude : res.latitude,
                longitude : res.longitude
            })
            //const eventChannel = this.getOpenerEventChannel()
            //eventChannel.emit('acceptDataFromOpenedPage', { data: res.name })
            }
        })
    },
    saveCommunity(){
        var community = {name : this.data.name, code : this.data.code, addr : this.data.address}
        console.log('community:', community);
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPage', { data: community })
        wx.cloud.init({
            env: 'cloud1-7go51v8te374de35',
          })
          const db = wx.cloud.database()
          const _ = db.command

          db.collection('community_info').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              nodecode: this.data.nodecode,
              communitycode: this.data.code, // 用 {openid} 变量，后台会自动替换为当前用户 openid
              communityname: this.data.name,
              communityaddress: this.data.address,
              wechatid: 'y7665',
              latitude:this.data.latitude,
              longitude:this.data.longitude,
              recycleamount:0
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            },
            fail: console.error,
            complete: console.log
          })

        this.setData({
            address : '',
            code : '',
            name : '',
            wechat : ''
        })
    }
})