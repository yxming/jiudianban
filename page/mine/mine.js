// page/user/mine/mine.js
const app = getApp()
Page({
  
    /**
     * 页面的初始数据
     */
    data: {
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
        menuData : [
            [
              {
                title: '地址管理',
                tit: '',
                url: '',
                type: 'address',
              },
              {
                title: '回收订单',
                tit: '',
                url: '',
                type: 'recycleorders',
              },
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
              {
                title: '发布',
                tit: '',
                url: '',
                type: 'coupon',
              },
              {
                title: '余额',
                tit: '',
                url: '',
                type: 'point',
              },
            ],
            [
              // {
              //   title: '帮助中心',
              //   tit: '',
              //   url: '',
              //   type: 'help-center',
              // },
              {
                title: '客服热线',
                tit: '',
                url: '',
                type: 'service',
                icon: 'service',
              },
              {
                title: '站点列表',
                tit: '',
                url: '',
                type: 'nodelist',
                icon: 'logo-codepen',
              },
              // {
              //   title: '新建小区',
              //   tit: '',
              //   url: '',
              //   type: 'community',
              //   icon: 'service',
              // },
            ],
          ]
    },
    onLoad(){
      if(app.globalData.hasLogin){
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
            })
            }
          }
        })
      }
    },
    onShow() {
      this.getTabBar().init()
    },

    handleGetUserProfile(e) {
      if(app.globalData.hasLogin){
        console.log('user was logined')
      }else{
        wx.getUserProfile({
          desc:'九点伴',
          success: (res) => {
              this.setData({
                  userInfo: res.userInfo,
              })
              app.saveUserInfo(app.globalData.openid,res.userInfo)
              app.globalData.hasLogin = true
          }
          })
      }
    },

    onClickCell({ currentTarget }) {
        const { type } = currentTarget.dataset;
        console.log('type:',type)
        switch (type) {
          case 'address': {
            wx.navigateTo({ url: '../recycleopt/pages/recycleaddrlist/recycleaddrlist' });
            break;
          }
          case 'coupon': {
            wx.navigateTo({
              url: '../user/pages/coupon/index',
            })
            break
          }
          case 'recycleorders': {
            wx.navigateTo({ url: '../recycleopt/pages/recycleorders/recycleorders' });
            break;
          }
          case 'service': {
            this.openMakePhone();
            break;
          }
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
          case 'point': {
            wx.navigateTo({ url: '../user/pages/balance/balance' });
            break;
          }
          case 'coupon': {
            wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
            break;
          }
          case 'nodelist': {
            wx.navigateTo({ url: '../manage/pages/recyclenodelist/recyclenodelist' });
            break;
          }
          default: {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '未知跳转',
              icon: '',
              duration: 1000,
            });
            break;
          }
        }
    }
})