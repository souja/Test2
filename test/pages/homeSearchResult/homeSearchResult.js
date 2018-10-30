Page({
	data: {
		curCity: null,
		priceDialogVisible: false,
		slider: {
			min: 0,
			max: 10000,
			step: 10,
			left: 0,
			right: 10000
		},
		houseType: 'single', // single | all
		payType: 'day', // day | month
		list: [],
		isScrollLoading: false,
		isScrollLoadingComplete: false
	},
	onLoad(opt) {
		var cityStr = opt.city;
		var cityObj = JSON.parse(cityStr);
		console.log("搜索：" + cityObj.text);
		this.setData({
			curCity: cityObj.text
		})
	},
	goSearch(e) {
		wx.navigateTo({
			url: '../searchCity/searchCity'
		})
	},
	onLoad() {
		this.search(true)
	},
	search(showLoading) {
		if (showLoading) {
			wx.showLoading({
				title: '加载中..',
				mask: true
			})
		}
		this.setData({
			isScrollLoading: true
		})
		// 模拟
		setTimeout(()=>{
			for (let i=0;i< 10; i++) {
				this.data.list.push(1)
			}
			wx.hideLoading()
			this.setData({
				list: this.data.list,
				isScrollLoading: false
			})
		},500)
	},
	onReachBottom() {
		if(!this.data.isScrollLoading && !this.data.isScrollLoadingComplete){
			this.setData({
				isScrollLoading: true
			})
			this.search();
		}
	},
	preventTouchMove(){},
	onTapPriceNav() {
		this.setData({
			priceDialogVisible: !this.data.priceDialogVisible
		})
	},
	onTapHidePriceSelect() {
		// TODO search
		this.setData({
			priceDialogVisible: false
		})
	},
	onTapPayType(e) {
		let value = e.currentTarget.dataset.type
		if (this.data.payType == value) {
			return
		}
		this.setData({
			payType: value
		})
	},
	onTapHouseType(e) {
		let value = e.currentTarget.dataset.type
		if (this.data.houseType == value) {
			return
		}
		this.setData({
			houseType: value
		})
	},
	leftSchange(e) {
		var left = e.detail.value
		let right = this.data.slider.right
		if (left > right) {
			this.setData({
				["slider.left"]: right,
				["slider.right"]: left
			})
		} else {
			this.setData({
				["slider.left"]: left
			})
		}
	},
	rightSchange: function (e) {
		var right = e.detail.value
		let left = this.data.slider.left
		if (right < left) {
			this.setData({
				["slider.left"]: right,
				["slider.right"]: left
			})
		} else {
			this.setData({
				["slider.right"]: right
			})
		}
	}
})