const api = require('../../utils/api.js');
const py = require('../../utils/py.js');
const app = getApp();

Page({
  data: {
		id: '',
		status: 'unpaid',
		currentNav: "normal",
		navFirstClass: "nav-item-on",
		navSecondClass: "",
		showCancelDialog: false,
		showCancelSuccessDialog: false
	},
	onLoad(opt) {
		if (opt.id) {
			this.setData({
				id: opt.id
			})
		}
	},
	preventTouchMove() {},
	onTapShowCancelDialog() {
		this.setData({
			showCancelDialog: true
		})
	},
	onTapHideCancelDialog() {
		this.setData({
			showCancelDialog: false
		})
	},
	onTapRealCancelOrder() {
		// TODO test
		this.setData({
			showCancelDialog: false,
			showCancelSuccessDialog: true
		})
	},
	onTapCloseSuccessDialog() {
		this.setData({
			showCancelSuccessDialog: false
		})
	}
})