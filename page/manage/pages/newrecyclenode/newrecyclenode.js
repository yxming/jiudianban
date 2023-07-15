// pages/newRecycleNode/newRecycleNode.js
const util = require('../../../../util/util.js')
const preset = require('../../../../resource/presets.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false,
        condition:0,
        triggered: false,
        communityArray : [],
        // labelAddr:'站点地址',
        // labelCode:'站点编码',
        // labelName:'站点名称',
        // labelWechat:'微信号',
        latitude : 0,
        longitude : 0,
        address : '',
        nodecode : '',
        nodename : '',
        wechat : '',
        buttonTitleForMap : preset.appPreSets.buttonTitleForMap,
        buttonTitleNewCommunity : preset.appPreSets.buttonTitleNewCommunity,
        labelRecycleNodeAddr : preset.appPreSets.labelRecycleNodeAddr,
        labelRecycleNodeCode : preset.appPreSets.labelRecycleNodeCode,
        labelRecycleNodeName : preset.appPreSets.labelRecycleNodeName,
        labelRecycleNodeWechat : preset.appPreSets.labelRecycleNodeWechat,

        placeholderAddr : preset.appPreSets.placeholderAddr,
        placeholderCode : preset.appPreSets.placeholderCode,
        placeholderName : preset.appPreSets.placeholderName,
        placeholderWechat : preset.appPreSets.placeholderWechat,
        right: [
          {
            text: '编辑',
            icon: {
              name: 'edit',
              size: 16,
            },
            className: 'btn edit-btn',
          },
          {
            text: '删除',
            icon: {
              name: 'delete',
              size: 16,
            },
            className: 'btn delete-btn',
          },
        ],
        rightIcon: [
          {
            icon: 'edit',
            className: 'btn edit-btn',
          },
          {
            icon: 'delete',
            className: 'btn delete-btn',
          },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', { data: this.name })
        // eventChannel.on('acceptDataFromOpenerPage', function (data) {
        //        console.log(data)
        // })
        this.setData({
          nodecode : util.getNodeCode()
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
      //
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
      console.log('page on hide')
      //saveNodeInfo()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
      console.log('page on unload')
      this.saveNodeInfo()
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
    
    wechatFromScan(){
      //
      wx.scanCode({
        success: res=> {
          console.log(res)
          this.setData({
            wechat : res.result
          })
        }
      })
    },
    dataFromMap(){
      var _this = this
      wx.getLocation({
            type: 'wgs84',
            success (locationinfo) {
              console.log(locationinfo)
              _this.data.latitude = locationinfo.latitude
              _this.data.longitude = locationinfo.longitude
              wx.chooseLocation({latitude:locationinfo.latitude,longitude:locationinfo.longitude,success: res=>{
                      console.log('lat:',res.latitude,'longt:',res.longitude)
                      console.log('name:',res.name)
                      console.log('addr:',res.address)
                      _this.setData({
                          address:res.address,
                          nodename:res.name,
                          latitude:res.latitude,
                          longitude:res.longitude
                      })
                }
              })
             
            // const latitude = res.latitude
            // const longitude = res.longitude
            // const speed = res.speed
            // const accuracy = res.accuracy
            //   this.setData({
            //     latitude:res.latitude,
            //     longitude:res.longitude
            // })
            }
           })
    },
    newCommunity(){
      var _this = this;
        wx.navigateTo({
          url: '../newcommunity/newcommunity',
          events: {
            acceptDataFromOpenedPage: function (data) {
              console.log('accept event:',data.data)
              var list  = _this.data.communityArray;
              list.push({title:data.data.name, note:'小区'})
              _this.setData({
                communityArray:list
              })
            },
          },
          success: function (res) {
            console.log(res)
            res.eventChannel.emit('acceptDataFromOpenerPage', { code: _this.data.nodecode, latitude: _this.data.latitude, longitude : _this.data.longitude})
          }
        })
    },

    saveNodeInfo(){
      //
      const eventChannel = this.getOpenerEventChannel()
      if(this.data.nodename==='' || this.data.nodeaddr===''){
        console.log('nodename or nodeaddr is null')
        return
      }
      
            eventChannel.emit('acceptDataFromOpenedPage', { data: this.data.nodename })
            wx.cloud.init({
              env: 'cloud1-7go51v8te374de35',
            })
            const db = wx.cloud.database()
            const _ = db.command
            db.collection('node_info').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                nodecode: this.data.nodecode,
                nodename: this.data.nodename, // 用 {openid} 变量，后台会自动替换为当前用户 openid
                nodeaddr: this.data.address,
                wechatid: app.globalData.openid,
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                recycleamount:0
              },
              success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log(res)
              },
              fail: console.error,
              complete: console.log
            })
    },

    onActionClick({ detail }) {
      console.log('onActionClick:',detail);
      wx.showToast({ title: `你点击了${detail.text}`, icon: 'none' });
  },
  onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  }
})