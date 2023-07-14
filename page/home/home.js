// page/home/home.js
Page({
    data: {
        imgSrcs: [
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner1.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner2.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner3.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner4.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner6.png'
        ],
        tabList: [],
        goodsList: [],
        goodsListLoadStatus: 0,
        pageLoading: false,
        current: 1,
        autoplay: true,
        duration: '500',
        interval: 5000,
        navigation: {
            type: 'dots'
        },
        swiperImageProps: {
            mode: 'scaleToFill'
        },
        // --------------  关于有偿服务的变量
        content: "需求: 1、不要告诉任何人，你不堪的过往。2、不要轻易原谅，一个伤害过你的人。3、越是进入到一个新的环境，就越要保持低调。需求: 1、不要告诉任何人，你不堪的过往。2、不要轻易原谅，一个伤害过你的人。3、越是进入到一个新的环境，就越要保持低调。",
        isExpanded: false,
        // -------------- 关于图片的变量
        images: [ 
                  'https://keling-1318428607.cos.ap-nanjing.myqcloud.com/xiyi.png',
                  'https://keling-1318428607.cos.ap-nanjing.myqcloud.com/h1.png',
                  'https://keling-1318428607.cos.ap-nanjing.myqcloud.com/h2.png',
                  'https://keling-1318428607.cos.ap-nanjing.myqcloud.com/h3.png'
                ],
        isImageExpanded: false,
        currentImageIndex: 0,
        startX: 0,
        endX: 0
    },
    toggleImage(event) {
        console.log(event);
        const index = event.currentTarget.dataset.index;
        if (this.data.isImageExpanded && this.data.currentImageIndex === index) {
          this.setData({
            isImageExpanded: false
          });
        } else {
          this.setData({
            isImageExpanded: true,
            currentImageIndex: index
          });
        }
      },
      touchStart(event) {
        this.setData({
          startX: event.changedTouches[0].clientX
        });
      },
      touchEnd(event) {
        this.setData({
          endX: event.changedTouches[0].clientX
        });
        const diffX = this.data.startX - this.data.endX;
        if (diffX > 50 && this.data.isImageExpanded) {
          this.nextImage();
        } else if (diffX < -50 && this.data.isImageExpanded) {
          this.prevImage();
        }
      },
      touchCancel(event) {
        this.setData({
          endX: event.changedTouches[0].clientX
        });
        const diffX = this.data.startX - this.data.endX;
        if (diffX > 50 && this.data.isImageExpanded) {
          this.nextImage();
        } else if (diffX < -50 && this.data.isImageExpanded) {
          this.prevImage();
        }
      },
      touchMove(event) {
        this.setData({
          endX: event.changedTouches[0].clientX
        });
      },
      prevImage() {
        let currentIndex = this.data.currentImageIndex;
        currentIndex = currentIndex === 0 ? this.data.images.length - 1 : currentIndex - 1;
        this.setData({
          currentImageIndex: currentIndex
        });
      },
      nextImage() {
        let currentIndex = this.data.currentImageIndex;
        currentIndex = currentIndex === this.data.images.length - 1 ? 0 : currentIndex + 1;
        this.setData({
          currentImageIndex: currentIndex
        });
      },
      closeExpandedImage() {
        this.setData({
          isImageExpanded: false
        });
      },
    toggleExpand() {
        this.setData({
            isExpanded: !this.data.isExpanded
        });
    },
    gotoRecycle() {
        wx.navigateTo({
            url: '../recycleopt/pages/recyclerequest/recyclerequest'
        })
    },
    gotoCategory() {
        wx.navigateTo({
            url: '../others/pages/document/category'
        })
    },
    gotoBalance() {
        wx.navigateTo({
            url: '../user/pages/balance/balance'
        })
    },

    gotoService() {
        wx.navigateTo({
            url: '../others/pages/customer/service'
        })
    },
})