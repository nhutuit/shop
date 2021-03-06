/**
 * @Author: Tran Van Nhut <nhutdev>
 * @Date:   2017-02-26T22:06:38+07:00
 * @Email:  tranvannhut4495@gmail.com
 * @Last modified by:   nhutdev
 * @Last modified time: 2017-03-23T18:25:15+07:00
 */

const helpers = require('../../helpers/index');
import loginActions from '../login/index';
import popUpActions from '../header/pop-up';
import config from '../../config/index';
import ReactBase from 'react-base';
import buttonStatus from '../../const/button-status';
import notifyActions from '../header/notify';
import apiQuoteActions from './quote';
import { push } from 'react-router-redux';
import apiAddressActions from './address';

let apiLoginActions = {

	login: (data, statePopup) => {
		return (dispatch) => {
			return helpers.requestBasic({
				uri: '/customers/login',
				method: 'POST',
				body: {
					data: {
						login: data.email,
						password: data.password
					}
				}
			}, dispatch, true).then(data => {
				dispatch(popUpActions.setStatePopupLogin(ReactBase.helpers.Data.assign(statePopup, {
					disableButtonLogin: buttonStatus.clickedSuccess
				})));
				dispatch(loginActions.setDataLoginSuccess(data));
				dispatch(notifyActions.setDataNotify({
					uiMessage: `${data.customer.fullName} login successfully`,
					type: 'success',
					show: true
				}));
				dispatch(apiQuoteActions.getQuote());
				dispatch(apiAddressActions.getListAddress());

				return null;

			}).catch(err => {
				return dispatch(popUpActions.setStatePopupLogin(ReactBase.helpers.Data.assign(statePopup, {
					disableButtonLogin: buttonStatus.clickedError
				})));
			});

		}
	},
	forgot: (data, statePopup) => {

		return (dispatch) => {
			return helpers.requestBasic({
				uri: '/customers/forgot-password',
				method: 'POST',
				body: {
					data: {
						login: data.email
					}
				}
			}, dispatch, true).then(data => {

				dispatch(notifyActions.setDataNotify({
					uiMessage: `Đã gửi mật khẩu vào email của bạn. Vui lòng kiểm tra email`,
					type: 'success',
					show: true
				}));

				dispatch(popUpActions.setStatePopupLogin(ReactBase.helpers.Data.assign(statePopup, {
					login: false
				})));

			});
		}

	},
	signin: (data, statePopup) => {
		return (dispatch) => {
			return helpers.requestBasic({
				uri: '/customers/register',
				method: 'POST',
				body: {
					data: {
						email: data.email,
						password: data.password,
						phone: data.phone,
						gender: data.gender,
						fullName: data.fullName,
						dob: data.dob,
						address: {
							street: data.street,
							provinceCode: data.province,
							districtCode: data.district,
							wardCode: data.ward
						}
					}
				}
			}, dispatch, true).then(data => {
				dispatch(popUpActions.setStatePopupLogin(ReactBase.helpers.Data.assign(statePopup, {
					disableButtonSignin: buttonStatus.clickedSuccess
				})));
				dispatch(loginActions.setDataLoginSuccess(data));
				dispatch(notifyActions.setDataNotify({
					uiMessage: `${data.customer.fullName} signin successfully`,
					type: 'success',
					show: true
				}));
				return null;
			}).catch(err => {
				return dispatch(popUpActions.setStatePopupLogin(ReactBase.helpers.Data.assign(statePopup, {
					disableButtonSignin: buttonStatus.clickedError
				})));
			});

		}
	},
	profile: (data) => {
		return (dispatch) => {
			return helpers.request({
				uri: '/customers',
				method: 'GET',
				headers: {
					accessToken: data[config.login.keyAccessToken]
				}
			}, dispatch).then(data => {
				return dispatch(loginActions.setDataLoginSuccess(data));
			}).catch(err => {
				return localStorage.removeItem(config.login.keyAccessToken);
			});
		}
	},
	logoutApi: () => {
		return (dispatch) => {
			return helpers.request({
				uri: '/customers/logout',
				method: 'POST'
			}, dispatch, true).then(data => {
				dispatch(loginActions.logout());
				dispatch(apiQuoteActions.getQuote());
				dispatch(push('/'));
			})
		}
	},
	editProfile: (form) => {
		return (dispatch) => {
			return helpers.request({
				uri: '/customers',
				method: 'POST',
				body: {
					data: form
				}
			}, dispatch, true).then(data => {
				dispatch(loginActions.setDataLoginSuccess(data));
				dispatch(notifyActions.setDataNotify({
					uiMessage: `Profile update successfully`,
					type: 'success',
					show: true
				}));
			});
		}
	}

};

export default apiLoginActions;
