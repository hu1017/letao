/**
 * Created by Lenovo on 2018/4/11.
 */
$(function (){
  // 1. 获取地址栏参数传递过来的 productId
  // 2. 发送 ajax 请求, 获取对应的商品数据
  // 3. 根据数据渲染页面
  var productId = getSearch("productId");
  $.ajax({
    type:'get',
    url: '/product/queryProductDetail',
    data:{
      id: productId
    },
    success:function(info){
      console.log(info);
      var htmlStr = template("product",info);
      $("#productDetail").html(htmlStr);

       //重新初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
      });
       //重新初始化input
      mui('.mui-numbox').numbox()
    }
  });

  // 选择尺码的功能
  $(".main").on("click",".size span",function () {
    $(this).addClass("current").siblings().removeClass("current");
  });

  // 加入购物车功能
  // 1. 给按钮注册点击事件
  // 2. 获取用户选择的尺码和数量, (产品id已有)
  // 3. 发送 ajax 请求, 加入购物车
  //    (1) 如果没登陆, 跳到登陆页面
  //    (2) 如果登陆了, 加入购物车成功, 弹出提示框
$('.add_cart').click(function(){
  var size = $('.size span.current').text();
  var num = $('.mui-numbox-input').val();

  if( !size ){
    mui.toast("请选择尺码");
    return;
  }

  $.ajax({
    url:' /cart/addCart',
    type:'post',
    data:{
      productId:productId,
      num:num,
      size:size
    },
    success:function(info){
      console.log(info);
      if(info.success){
        mui.confirm("添加成功","温馨提示",["去购物车","继续浏览"],function(e){
          if(e.index==0){
            location.href = "cart.html";
          }
        })
      }
      if(info.error === 400){
        location.href = "login.html?retUrl=" + location.href;
        // 跳转到登录页面
        // 跳转到登录页, 登录完成, 还要跳回来, 所以应该将当前页面的地址传过去
        // (1) 如果是直接访问的登录页, 应该在登录后, 跳转到个人中心页
        // (2) 如果是从其他页面(购物车), 拦截到登录页时, 需要跳回来, 所以应该将地址传递过去
      }
    }
  })

})

})