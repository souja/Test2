const api = require('../../utils/api.js');
const py = require('../../utils/py.js');
const app = getApp();

Page({
	data: {
	},
	onReachBottom() {
		this.selectComponent("#order-list-component").onReachBottom()
	}
})