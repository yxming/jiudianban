// page/user/recycleaddrlist/recycleaddrlist.js
const preset = require('../../../../resource/presets')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasRecycleAddr:true,
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
        recycleArray: [],
        // 选中的id
        selectedIndex: -1,
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
          // 测试的
          
    },

// 测试的
handleRadioChange(e) {
  const { index } = e.currentTarget.dataset;
  const { recycleArray } = this.data;
  var ceshi = this.data.recycleArray[index]
  console.log(ceshi);
  recycleArray.forEach((item, i) => {
    item.checked = i === index;
  });
  this.setData({
    recycleArray: recycleArray
  });
},


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var _this = this
      this.getRecycleAddr(app.globalData.openid)
      const eventChannel= this.getOpenerEventChannel()
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        // console.log('where from:',data.data.opener)
        _this.setData({
          opener:data.data.opener
        })
        console.log('111111');
      })
    },
    handleRadioClick(event) {
      const index = event.currentTarget.dataset.index;
      this.setData({
        selectedRadioIndex: index,
      });
    },
    dianji(event) {
      const { value } = event.detail;
      this.setData({ currents: value });
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
        var liebiao = item.data
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
        this.setData({
          optionsd:liebiao
     })
     
    },
    onClicked(obj){
      console.log('onClicked:',obj.currentTarget.id,'----',obj.detail.className);
      if('btn edit-btn'==obj.detail.className){
        console.log('onClicked:',obj.currentTarget.id);
      }else{
        this.data.recycleArray.splice(obj.currentTarget.id,1)
        var arr = this.data.recycleArray
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
              console.log('accept event:',data.item)
              if(data.item){
                var list  = _this.data.recycleArray;
                list.splice(0,0,data.item)
                
                _this.setData({
                    recycleArray:list,
                    hasRecycleAddr:true
                })
              }
            },
          },
          success: function (res) {
            res.eventChannel.emit('acceptDataFromOpenerPage', { data: {'opener':'addrlist'} })
          }
        })
    },
    onPulling(e) {
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
      },
    
      onAbort(e) {
      },
      getRecycleAddr(wechatid){
        var _this = this
        wx.cloud.init({
          env: 'cloud1-7go51v8te374de35',
        })
        const db = wx.cloud.database()
        const _ = db.command
        var coll=db.collection('recycleaddr_list').where({
          wechatid:wechatid
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
            if(res.data.length>0){
              //_this.data.recycleArray = res.data
              var arr=[]
              res.data.forEach(element=>{
                var title=element.caller+'----'+element.phonenum
                var detail = element.communityaddress+element.communityname+element.flat
                arr.push({'title':title,
                'detail':detail,
                'latitude':element.latitude,
                'longitude':element.longitude,
                'communitycode':element.communitycode,
                'communityname':element.communityname,
                'flat':element.flat,
                'caller':element.caller,
                'phonenum':element.phonenum
              })
              })
              _this.setData({
                recycleArray:arr,
                hasRecycleAddr:true
              })
            }else{
              _this.setData({
                hasRecycleAddr:false
              })
            }
          },
          fail: function(err){
            _this.setData({
              hasRecycleAddr:false
            })
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
            var addrDic
            res.data.forEach(element => {
              var code = element.communitycode
            })
          },
          fail:function(err){
          }
        })
      },
      funcd(){
        wx.cloud.callFunction({
          // 云函数名称
          name: 'asyncCall',//'getRecycleItemAddr',
          // 传给云函数的参数
          data: {
            wechatid:app.globalData.openid
          },
          success: function(res) {
          },
          fail: console.error
        })
      }
})