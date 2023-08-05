// page/user/mine/mine.js
const app = getApp()
Page({
  
    /**
     * 页面的初始数据
     */
    data: {
        hasLogin:false,
        role:1,
        showMakePhone: false,
        userInfo: {
            avatarUrl: '',
            nickName: '',
            phoneNumber: '',
        },
        customerServiceInfo: {},
        currAuthStep: 1,
        showKefu: true,
        versionNo: '',
        // 这个是支付密码
        payment :'',
        menuData : [
            // [
              {
                  title: '我的米袋',
                  tit: '',
                  url: '../user/pages/balance/balance',
                  type: '',
                  winner:'1'
                },
                {
                  title: '地址管理',
                  tit: '',
                  url: '../recycleopt/pages/recycleaddrlist/recycleaddrlist',
                  type: '',
                  winner:'1'
                },
                {
                  title: '支付密码',
                  tit: '',
                  url: '',
                  type: '',
                  winner:'1'
                },
                {
                  title: '客服热线',
                  tit: '',
                  url: '../others/pages/customer/service',
                  type: '',
                  winner:'1'
                },
                   {
                title: '站点列表',
                tit: '',
                url: '',
                type: 'nodelist',
                icon: 'logo-codepen',
                winner:'0'
              },
              // {
              //   title: '地址管理',
              //   tit: '',
              //   url: '',
              //   type: 'address',
              //   winner:'1'
              // },
              // {
              //   title: '回收订单',
              //   tit: '',
              //   url: '',
              //   type: 'recycleorders',
              //   winner:'1'
              // },
              // {
              //   title: '余额',
              //   tit: '',
              //   url: '',
              //   type: 'point',
              // },
              // {
              //   title: '家政订单',
              //   tit: '',
              //   url: '',
              //   type: 'domesticorder',
              // },
              // {
              //   title: '本地生活订单',
              //   tit: '',
              //   url: '',
              //   type: 'domesticorder',
              // },
              // {
              //   title: '发布',
              //   tit: '',
              //   url: '',
              //   type: 'coupon',
              // },
            // ],
            // [
              // {
              //   title: '帮助中心',
              //   tit: '',
              //   url: '',
              //   type: 'help-center',
              // },
              // {
              //   title: '客服热线',
              //   tit: '',
              //   url: '',
              //   type: 'service',
              //   icon: 'service',
              // },
              // {
              //   title: '站点列表',
              //   tit: '',
              //   url: '',
              //   type: 'nodelist',
              //   icon: 'logo-codepen',
              // },
              // {
              //   title: '新建小区',
              //   tit: '',
              //   url: '',
              //   type: 'community',
              //   icon: 'service',
              // },
            // ],
          ],
          name:'请登录！',
          // 这个是密码模态框
          cur: {},
          position: [
            { value: 'top', text: '顶部弹出' },
            { value: 'left', text: '左侧弹出' },
            { value: 'center', text: '中间弹出' },
            { value: 'bottom', text: '底部弹出' },
            { value: 'right', text: '右侧弹出' },
          ],
          // 这个是输入内容
          inputValue: ''
    },
    onLoad(){
      if(app.globalData.hasLogin){
        console.log('mine.openid:',app.globalData.openid)
        app.globalData.db.collection('user_info').where({
          wechatid:app.globalData.openid
        }).field({
          _id:0
        })
        .get({
          success: (res)=>{
            console.log('user_info:',res.data)
            if(res.data[0].userinfo){
              this.setData({
                userInfo: res.data[0].userinfo,
                hasLogin:true
            })
            }
          }
        })
      }
    },
    onShow() {
      //this.getTabBar().init()
      var role=app.globalData.role
      this.setData({
        role
      })
    },

    handleGetUserProfile(e) {
      if(app.globalData.hasLogin){
        console.log('user was logined')
        this.setData({
          hasLogin:true
        })
      }else{
        wx.getUserProfile({
          desc:'一袋收生活网',
          success: (res) => {
              this.setData({
                  userInfo: res.userInfo,
                  hasLogin:true
              })
              app.saveUserInfo(app.globalData.openid,res.userInfo)
              app.globalData.hasLogin = true
          },
          fail:(err)=>{
            console.log('getUserProfile:',err)
          }
          })
      }
    },
    // 点击跳转
    jumptopage(event){
      var index = event.currentTarget.dataset.index;
      var item = this.data.menuData[index];
      var url = item.url;
      if(index===2){
         this.setData({ visible: true });
      }else{
        wx.navigateTo({
          url: url
        });
      }
    },
    onClickCells(){
      wx.navigateTo({
        url: '../manage/pages/recyclenodelist/recyclenodelist'
      });
    },
    // 跳转路径
    onClickCell({ currentTarget }) {
      var index = currentTarget.dataset.index;
        // const { type } = currentTarget.dataset;
        console.log(index);
        // console.log('type:',type)
        switch (index) {
          // 管理地址
          case '1': {
            wx.navigateTo({ url: '../recycleopt/pages/recycleaddrlist/recycleaddrlist' });
            break;
          }
          // 发布
          case 'coupon': {
            wx.navigateTo({
              url: '../user/pages/coupon/index',
            })
            break
          }
          // 订单列表
          case 'recycleorders': {
            wx.navigateTo({ url: '../recycleopt/pages/recycleorders/recycleorders' });
            break;
          }
          // 客服
          case '3': {
            wx.navigateTo({ url: '../others/pages/customer/service'})
            break;
          }
          // 这个不能用
          case 'help-center': {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '你点击了帮助中心',
              icon: '',
              duration: 1000,
            });
            break;
          }
          // 米仓
          case 'point': {
            wx.navigateTo({ url: '../user/pages/balance/balance' });
            break;
          }
          // 发布
          case 'coupon': {
            wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
            break;
          }
          // 回收站点管理
          case 'nodelist': {
            wx.navigateTo({ url: '../manage/pages/recyclenodelist/recyclenodelist' });
            break;
          }
          default: {
            // Toast({
            //   context: this,
            //   selector: '#t-toast',
            //   message: '未知跳转',
            //   icon: '',
            //   duration: 1000,
            // });
            break;
          }
        }
    },
    // 这个是密码模态框
    handlePopup(e) {
      const { item } = e.currentTarget.dataset;

      this.setData(
        {
          cur: item,
        },
        () => {
          this.setData({ visible: true });
        },
      );
    },
    onVisibleChange(e) {
      this.setData({
        visible: e.detail.visible,
      });
    },
    onClose() {
      this.setData({
        // 这个是关闭模态框的
        visible: false,
      });
    },
    // 密码内容框
    onInput: function(event) {
      var value = event.detail.value;
      this.setData({
        inputValue: value
      });
    },
  
    onSubmit: function() {
      var value = this.data.inputValue;
      console.log("输入内容为：" + value);
      // 在这里可以对输入内容进行处理或其他操作
    }
})