/**
 * Created by Lenovo on 2018/4/13.
 */
$(function(){
  // 点击登录按钮, 获取输入的用户名和密码, 进行 ajax 请求登录
  $("#btnLogin").click(function(){
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();

    if( !username ){
      mui.toast("请输入用户名");
      return;
    }
    if( !password ){
      mui.toast("请输入密码");
      return;
    }

    $.ajax({
      url:'/user/login',
      type:'post',
      data:{
        username:username,
        password:password
      },
      success:function(info){
        console.log(info);
        if( info.error ){
          mui.toast("用户名或密码错误");
        }
        if( info.success){
          if( location.search.indexOf("retUrl") !== -1){
            location.href = location.search.replace("?retUrl=","")
          }else{
            location.href = "user.html"
          }
        }
      }
    })
  })
})