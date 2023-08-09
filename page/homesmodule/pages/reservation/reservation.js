// page/homesmodule/pages/reservation/reservation.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      activity_list: [
        { activity_id: 1, activity_photo: '../image/chair.png', activity_name: '椅子', active: false },
        { activity_id: 2, activity_photo: '../image/Sofa .png', activity_name: '沙发', active: false },
        { activity_id: 3, activity_photo: '../image/bed .png', activity_name: '床', active: false },
        { activity_id: 4, activity_photo: '../image/cabinet .png', activity_name: '柜子', active: false },
        { activity_id: 5, activity_photo: '../image/equipment.png', activity_name: '器材', active: false },
        { activity_id: 6, activity_photo: '../image/others.png', activity_name: '其他', active: false }
      ],
      scrollLeft: 0,
      blockStyles: [],
      scrollLeft: 0, // 滚动位置
    underlineLeft: 0, // 横线位置
      // 这里是弹出层的控建
      position: [
        { value: 'bottom', text: '底部弹出' },
      ],
    },
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    // 这里是弹出层空间
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
    onScroll(event) {
      const { scrollLeft } = event.detail;
      this.setData({
        scrollLeft,
        underlineLeft: scrollLeft,
      });
    },
  
    jumpLargeItems(){
      console.log('111111111111111111');
      wx.navigateTo({
        url: '../address/address'
      });
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

    }
})