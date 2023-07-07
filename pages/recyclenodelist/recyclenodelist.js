// page/recyclenodelist/recyclenodelist.js
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
        recycleArray: [{
            title: 'foo',
            note:''
          },{
            title: 'bar',
            note:''
          },{
            title: 'bar',
            note:''
          },{
            title: 'bar',
            note:''
          },{
            title: 'bar',
            note:''
          },{
            title: 'bar',
            note:''
          },{
            title: 'bar',
            note:''
          }],
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
      //console.log(this.recycleArray)
       /* wx.getLocation({
            type: 'wgs84',
            success (res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
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
      this.getTabBar().init();
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
    onActionClick({ detail }) {
        console.log('onActionClick:',detail);
        wx.showToast({ title: `你点击了${detail.text}`, icon: 'none' });
    },

    onDelete() {
        wx.showToast({ title: '你点击了删除2222', icon: 'none' });
    },
    onEdit() {
        console.log('onEdit:');
        wx.showToast({ title: '你点击了编辑111', icon: 'none' });
    },
    onFavor() {
        wx.showToast({ title: '你点击了收藏', icon: 'none' });
    },
    onChoice() {
        wx.showToast({ title: '你点击了选择', icon: 'none' });
    },
    newRecycleNode(){
        var _this = this;
        wx.navigateTo({
          url: '../newrecyclenode/newrecyclenode',
          events: {
            acceptDataFromOpenedPage: function (data) {
              console.log('accept event:',data.data)
              var list  = _this.data.recycleArray;
              list.push({title:data.data, note:''})
              _this.setData({
                recycleArray:list
              })
            },
          },
          success: function (res) {
            console.log(res)
            //res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'send from opener page：index' })
          }
        })
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