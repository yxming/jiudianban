// page/user/recycleaddrlist/recycleaddrlist.js
const preset = require('../../../../resource/presets')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        opener: 0,
        buttonTitleNewRecycleAddr : preset.appPreSets.buttonTitleNewRecycleAddr,
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false,
        condition:0,
        triggered: false,
        codeArray:[],
        recycleArray: [{
            title: 'foo',
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
      var _this = this
      this.getRecycleAddr('y7665')
      const eventChannel= this.getOpenerEventChannel()
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        console.log('where from:',data.data.opener)
        _this.setData({
          opener:data.data.opener
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
      // if(this.getTabBar())
      //     this.getTabBar().init();
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
    onActionClick( detail ) {
        const eventChannel= this.getOpenerEventChannel()
        var index = detail.currentTarget.id;
        var item = this.data.recycleArray[index];
        console.log('index:',index, item)
        switch(this.data.opener){
          case 1: 
              eventChannel.emit('acceptDataFromOpenedPage', { data: item })
              wx.navigateBack({
                delta: 1
              })
              break;
          case 2: 
              break;
          default :
        }
    },
    onClicked(obj){
      console.log('onClicked:',obj.currentTarget.id,'----',obj.detail.className);
      if('btn edit-btn'==obj.detail.className){
        console.log('onClicked:',obj.currentTarget.id);
      }else{
        this.data.recycleArray.splice(obj.currentTarget.id,1)
        var arr = this.data.recycleArray
        console.log('list:',arr)
        this.setData({
             recycleArray:arr
        })
      }
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
    newRecycleAddress(){
        var _this = this;
        wx.navigateTo({
          url: '../recycleaddrnew/recycleaddrnew',
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
            //res.eventChannel.emit('acceptDataFromOpenerPage', { data: {'opener':1} })
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
      },
      getRecycleAddr(wechatid){
        var _this = this
        wx.cloud.init({
          env: 'cloud1-7go51v8te374de35',
        })
        const db = wx.cloud.database()
        const _ = db.command
        var coll=db.collection('recycleaddr_list').where({
          wechatid:'y7665'
        })
        
        coll.field({
          _id:0,
          caller:1,
          detail:1,
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
              var arr=[]
              res.data.forEach(element=>{
                var title=element.caller+'----'+element.phonenum
                var detail = element.communityaddress+element.communityname+element.detail
                arr.push({'title':title,'detail':detail,'latitude':element.latitude,'longitude':element.longitude,'communitycode':element.communitycode})
              })
              _this.setData({
                recycleArray:arr
              })
            }
          }
        })

        // const db = wx.cloud.database()
        // const _ = db.command
        //var $ = db.command.aggregate
        // db.collection('recycleaddr_list').aggregate()
        //   .lookup({
        //     from: "community_info",
        //     localField: "communitycode",
        //     foreignField: "communitycode",
        //     as: "communityList"
        //   })
          // .replaceRoot({
          //   newRoot: $.mergeObjects([ $.arrayElemAt(['$communityList', 0]), '$$ROOT' ])
          // })
          // .project({
          //   communityList: 0
          // })
          // .end()
          // .then(res => console.log(res))
          // .catch(err => console.error(err))
      },

      getCommunityInfo(db,_){
        //
        var _this = this
        db.collection('community_info').where({
          communitycode: _.in(this.data.codeArray)
        })
        .field({
          _id:0,
          communitycode:1,
          communityname:1,
          communityaddress:1
        })
        .get({
          success: function(res) {
            console.log(_this.data.recycleArray)
            console.log(res.data)
            var addrDic
            res.data.forEach(element => {
              var code = element.communitycode
              console.log(code)
            })
            console.log(addrDic)
          },
          fail:function(err){
            console.log(err)
          }
        })
      },
      funcd(){
        wx.cloud.callFunction({
          // 云函数名称
          name: 'asyncCall',//'getRecycleItemAddr',
          // 传给云函数的参数
          data: {
            wechatid:'y7665'
          },
          success: function(res) {
            console.log(res.result) // 3
          },
          fail: console.error
        })
      }
})