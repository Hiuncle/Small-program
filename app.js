//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("202a79685ddae0278d6113fe62987627", "0383e80086e3c00f11f27e36bb8687b5");
App({
  onLaunch: function (options) {
    try {
      var value = wx.getStorageSync('openid');
      if (value) {

      }
      else {
        wx.login({
          success: function (res) {
            if (res.code) {// 登录成功
              Bmob.User.requestOpenId(res.code, {
                success: function (userData) {//获取userData成功
                  console.log(userData);
                  var openid = userData.openid;
                  wx.getUserInfo({
                    success: function (result) {//获取用户信息成功
                      console.log(result)
                      var userInfo = result.userInfo;
                      var gender = userInfo.gender;
                      var nickName = userInfo.nickName;
                      var userpic = userInfo.avatarUrl;
                      Bmob.User.logIn(openid, openid, {
                        success: function (user) {//登录成功
                          console.log(user)
                          try {
                            wx.setStorageSync('openid', user.get('username'));
                            wx.setStorageSync('user_id', user.id);
                            wx.setStorageSync('nickName', user.get("nickName"));

                            wx.setStorageSync('userpic', user.get("userpic"));
                            wx.setStorageSync('gender', user.get("gender"));

                          } catch (e) {

                          }
                        },
                        error: function (user, error) {//登录失败
                          console.log("error:" + error.code)
                          if (error.code == "101") {
                            Bmob.User.logIn(openid, openid, {
                              success: function (user) {//登录成功
                                try {
                                  wx.setStorageSync('openid', user.get('username'));
                                  wx.setStorageSync('user_id', user.id);
                                  wx.setStorageSync('nickName', user.get("nickName"));
                                  wx.setStorageSync('userpic', user.get("userpic"));
                                  wx.setStorageSync('gender', user.get("gender"));
                                } catch (e) {

                                }
                              },
                              error: function (user, error) {//登录失败
                                console.log("error:" + error.code)
                                if (error.code == "101") {
                                  var user = new Bmob.User();//开始注册用户
                                  user.set("username", openid);
                                  user.set("password", openid);
                                  user.set("nickName", nickName);
                                  user.set("userpic", userpic);
                                  user.set("userData", userData);
                                  user.set("userInfo", userInfo);
                                  user.set("gender", gender);
                                  user.signUp(null, {
                                    success: function (results) {
                                      console.log("注册成功!");
                                      try {
                                        wx.setStorageSync('openid', user.get('username'));
                                        wx.setStorageSync('user_id', user.id);
                                        wx.setStorageSync('nickName', user.get("nickName"));
                                        wx.setStorageSync('userpic', user.get("userpic"));
                                        wx.setStorageSync('gender', user.get("gender"));
                                      } catch (e) {

                                      }
                                    },
                                    error: function (userData, error) {
                                      console.log(error)
                                      wx.showModal({
                                        title: '发生错误',
                                        content: 'error:' + error.code + ";请联系客服",
                                        showCancel: false,
                                      })
                                    }
                                  });
                                }
                              }
                            });
                          }
                        }
                      });
                    }
                  })
                },
                error: function (error) {
                  console.log("Error: " + error.code + " " + error.message);
                }
              });

            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    } catch (e) {

    }
    wx.checkSession({
      success: function () {
      },
      fail: function () {
        //登录态过期
        wx.login()
      }
    })

  },
  allData: {
    banben: 'V1.4.1 ©大来也科技'
  }
})