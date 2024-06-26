// 放置所有的请求接口地址

const url = 'https://meituan.thexxdd.cn/apit/'
const myurl = ' http://localhost:8000/'
//const url = ' 192.168.216.215:8000/'

const urls = class{
	static m(){
		// 注册接口
		const register = `${url}register`
		// 登录接口
		const login = `${url}login`
		// 后台登录接口
		const admin_login = `${myurl}admin_login/`
		// 用户列表
		const pulluserlist = `${url}pulluserlist`
		// 获取维修需求列表
		const admin_getrepair = `${myurl}admin_getrepair/` 
		// 获取单个维修需求
		const admin_viewrepair = `${myurl}admin_viewrepair/` 
		// 获取技术支援列表
		const admin_getsupport = `${myurl}admin_getsupport/` 
		// 获取单个技术支援
		const admin_viewsupport = `${myurl}admin_viewsupport/`
		// 修改维修申请单状态
		const admin_changerepairstate = `${myurl}admin_changerepairstate/`
		// 修改维修申请单状态
		const admin_changesupportstate = `${myurl}admin_changesupportstate/`

		// 获取桌号
		const gettable = `${url}gettable`
		// 获取订单
		const obtainorder = `${url}obtainorder`
		// 获取详细菜单
		const vieworder = `${url}vieworder`
		//图片上传接口
		const uploadres = `${url}uploadres`
		// 获取菜品类目
		const obtaincate = `${url}obtaincate`
		// 获取菜品单位
		const obtainunit = `${url}obtainunit`
		// 添加菜品单位
		const dishunit = `${url}dishunit`
		// 提交菜品
		const putdishes = `${url}putdishes`
		// 获取菜品数据
		const obtaindishes = `${url}obtaindishes`
		// 下架菜品
		const fromsale = `${url}fromsale`
		// 编辑菜品
		const editdishes = `${url}editdishes`
		// 提交员工数据
		const addem = `${url}addem`
		// 获取员工数据
		const getemployees = `${url}getemployees`
		// 修改员工离职状态
		const modifyresi = `${url}modifyresi`
		// 删除员工数据
		const deleteemp = `${url}deleteemp`
		// 数据分析
		const analysis = `${url}analysis`
		// 折线图的更新数据
		const switchcate = `${url}switchcate`
		
		return{
			register,
			login,
			admin_login,
			admin_getrepair,
			admin_viewrepair,
			admin_changerepairstate,
			admin_getsupport,
			admin_viewsupport,
			admin_changesupportstate,
			pulluserlist,
			gettable,
			obtainorder,
			vieworder,
			uploadres,
			obtaincate,
			obtainunit,
			dishunit,
			putdishes,
			obtaindishes,
			fromsale,
			editdishes,
			addem,
			getemployees,
			modifyresi,
			deleteemp,
			analysis,
			switchcate
		}
	}
}

export default urls