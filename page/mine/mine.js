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
              // {
              //   title: '发布',
              //   tit: '',
              //   url: '',
              //   type: 'coupon',
              // },
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
          ],
          name:'请登录！'
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

    onClickCell({ currentTarget }) {
        // const { type } = currentTarget.dataset;
        var value = currentTarget.dataset.value;
        console.log(value);
        // console.log('type:',type)
        switch (value) {
          // 管理地址
          case 'address': {
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
          case 'service': {
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