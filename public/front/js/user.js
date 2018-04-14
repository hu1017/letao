$(function(){
  // 一进入页面, 应该请求当前用户信息, 进行页面渲染
  // (1) 登录了, 获取用户信息, 渲染
  // (2) 如果没登陆, 应该跳转到登录页
  $.ajax({
    url:'/user/queryUserMessage',
    type:'get',
    success:function(info){
      if(info.error === 400){
        location.href = "login.html"
        return;
      }
      console.log(info);
      $("#userInfo").html(template("userTpl",info));
    }
  });

  $("#logoutBtn").click(function(){
    $.ajax({
      url:'/user/logout',
      type:'get',
      success:function(info){
        if(info.success){
          location.href = "login.html";
        }
      }
    })
  })
})