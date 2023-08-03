// 地区
const placeArray = [
  {
    "name": "北京",
    "city": [{
      "name": "北京",
      "area": ["东城区", "西城区", "崇文区", "宣武区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "平谷区", "怀柔区", "密云县", "延庆县"]
    }]
  },

  {
    "name": "天津",
    "city": [
      {
        "name": "天津A",
        "area": ["a区", "b区", "c区", "d区", "e区"]
      },
      {
        "name": "天津B",
        "area": ["1区", "2区", "3区", "4区"]
      }
   ]
  },
  {
    "name": "河北",
    "city": [

      {
        "name": "石家庄",
        "area": ["长安区", "新乐市", "鹿泉市"]
      },

      {
        "name": "邯郸",
        "area": ["邯山区", "丛台区", "复兴区", "峰峰矿区", "邯郸县", "临漳县", "成安县", "大名县", "涉  县", "磁  县" ]
      },

      {
        "name": "邢台",
        "area": ["桥东区", "桥西区", "沙河市"]
      },
    ]
  }];

Page({

    /**
     * 页面的初始数据
     */
    data: {
      money:0,
      dataaddress:'姓名',//名字
      dataaddre:'12345678',//手机号
      addressdatea:'地址',
      furnitureQuantity:0,
      // 控制底部按钮
      disabled:'false',
      // 模态框
      showModalStatus: false,
      //输入框的内容
      inputValue: '',
      inputValueo:'',
      // 多行输入内容
      text: '',
      // 下弹出框
      cur: {},
      position: [
        { value: 'bottom', text: '底部弹出' },
      ],
      repoMan:'请输入用户姓名',
      phoneNumber:15890625715,
      inputShow:false,
      // 这里是下滑动块数据
      activity_list: [
        { activity_id: 1, activity_photo: '../img/updimg.png', activity_name: '空调', active: false },
        { activity_id: 2, activity_photo: '../img/updimg.png', activity_name: '电视', active: false },
        { activity_id: 3, activity_photo: '../img/updimg.png', activity_name: '洗衣机', active: false }
      ],
      blockStyles: [],
      blocks:'',
      // 下半部分手风琴数据
      selected: [false, false, false, false, false], // // 这里表示列表项是否展开，默认初始时此数组的元素全为fasle，表示都没展开
    active: null, // 当前展开的项的index值
    listDatas: [
      {
        list_name: '简介',
        list_content:['电脑', '手机', '平板', '洗衣机']
      }
    ],
    selected: [], // 用于跟踪每个列表项是否被选中
    selectedSubIndex: [], // 用于跟踪每个列表项中选中的子索引
    selectedContent:'',
      // 三级联动
    boxShow:false,
    placeArray: placeArray,
    province: placeArray[0].name,
    pIndex: 0,
    city: placeArray[0].city[0].name,
    cIndex: 0,
    area: placeArray[0].city[0].area[0],
    aIndex: 0,
    },
    onListClicks(event) {
      console.log(event);
      const index = event.currentTarget.dataset.index;
      const selected = this.data.selected;
      selected[index] = !selected[index];
  
      this.setData({
        selected: selected
      });
    },
    onOptionClick(event) {
      console.log(event);
      const index = event.currentTarget.dataset.index;
      const subIndex = event.currentTarget.dataset.subindex;
      const selectedSubIndex = this.data.selectedSubIndex;
      selectedSubIndex[index] = subIndex;
      const selectedContent = this.data.listDatas[index].list_content[subIndex]; // 获取选中的内容
      console.log(selectedContent);
      this.setData({
        selectedSubIndex: selectedSubIndex,
        selectedContent:selectedContent
      });
    },
    // 中部弹框
    powerDrawer: function (e) {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
      },
      util: function (currentStatu) {
        var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
        });
        this.animation = animation;
        animation.opacity(0).rotateX(-100).step();
        this.setData({
        animationData: animation.export()
        })
        setTimeout(function () {
          animation.opacity(1).rotateX(0).step();
          this.setData({
          animationData: animation
          })
          if (currentStatu == "close") {
          this.setData(
          {
            // 这里需要改动
          showModalStatus: false
          }
          );
          console.log(this.data.value1);
        }
      }.bind(this), 200)
      if (currentStatu == "open") {
         this.setData(
         {showModalStatus: true});
      }}, 
      handlePopup(e) {
       const { item } = e.currentTarget.dataset;
       this.setData(
    { cur: item,},
    () => {
      this.setData({ visible: true });
    },);
    },
    onVisibleChange(e) {
  this.setData({
    visible: e.detail.visible,
  });},
  handleInput(event) {
    const value = event.detail.value; // 获取输入的值
    this.setData({
      inputValue: value, // 将输入的值赋给 data 中的变量
      dataaddress:value
    });
  },
  handleInputo(event) {
    const value = event.detail.value; // 获取输入的值
    this.setData({
      inputValueo: value, // 将输入的值赋给 data 中的变量
      dataaddre:value
    });
  },
  // 多行输入
  onInput(event) {
    const value = event.detail.value; 
    this.setData({
      text: value,
      addressdatea:value
    })
  },
  // 三级联动
   // 展示弹框
   getbox: function(){
    this.setData({
      boxShow: true
    })
  },
  // 隐藏弹框
  hidebox: function(){
    this.setData({
      boxShow: false
    })
  },
  // 确认按钮
  confirm: function(){
    this.setData({
      boxShow: false,
      inputShow: true,
    })
  },
 changeProvince2: function(e){
  const val = e.detail.value
  this.setData({
    pIndex: val,
    cIndex: 0,
    aIndex: 0,
    province: placeArray[val].name,
    city: placeArray[val].city[0].name,
    area: placeArray[val].city[0].area[0]
  })
},
changeCity2: function(e){
  const val = e.detail.value
  this.setData({
    cIndex: val,
    aIndex: 0,
    city: placeArray[this.data.pIndex].city[val].name,
    area: placeArray[this.data.pIndex].city[val].area[0]
  })
},
changeArea2: function(e){
  const val = e.detail.value
  this.setData({
    aIndex: val,
    area: placeArray[this.data.pIndex].city[this.data.cIndex].area[val],
  })
},
clicktoRender: function(e){
  console.log(e);
  this.setData({
   
  })
},

// 手风琴
// 这里是多个块选择获取信息
changeBlockStyle(event) {
  const index = event.currentTarget.dataset.index;
  const blockStyles = [];
  // 重置所有块的样式为原始样式
  for (let i = 0; i < this.data.activity_list.length; i++) {
    blockStyles[i] = this.data.activity_list[i].active ? 'background-color: red;' : '';
  }
  // 修改点击的块的样式为新样式
  blockStyles[index] = 'background-color: rgb(178, 247, 247); opacity: 0.5; color: rgb(55, 195, 238); border: slateblue solid 1px'; // 修改样式为红色背景，你可以根据需求修改样式
  this.setData({ blockStyles });
},
 // 点击列表,收缩与展示
 onListClick(event) {
  let index = event.currentTarget.dataset.index;
  let active = this.data.active;
  this.setData({
    [`selected[${index}]`]: !this.data.selected[`${index}`],
    active: index,
  });
  if (active !== null && active !== index) {
    this.setData({
      [`selected[${active}]`]: false,
    });
  }
},

});
  