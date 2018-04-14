$(function(){

  function render() {
    // 重新渲染页面, 需要将价格重置
    $('.totalPrice').text("00.00");

    setTimeout(function(){
      $.ajax({
        type:'get',
        url:'/cart/queryCart',
        success:function (info){
          console.log(info);
          $("#productList").html(template("cartTpl",{ list: info}));
          //需要手动结束刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        }
      })
    },500)
  }
        //配置下拉刷新
        mui.init({
          pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，
            down : {
              height:50,//可选,默认50.触发下拉刷新拖动距离,
              auto: true,//可选,默认false.首次加载自动下拉刷新一次
              callback :function() {
                render();
              }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
          }
        });
  // 删除功能
  // 1. 给删除按钮, 注册点击事件(事件委托)
  // 2. 根据购物车id, 发送删除 ajax 请求
  // 3. 重新渲染, 调用下拉刷新
  $('#productList').on("tap",".btn-delete",function(){
    console.log(111);
    //获取购物车id
    var id = $(this).data("id");
    mui.confirm("你是否要删除该商品", "温馨提示", ["确认", "取消"], function(e){
      if(e.index === 0){
        $.ajax({
          url: "/cart/deleteCart",
          type: "get",
          data: {
            // 需要注意这里 id 传的是一个数组
            id: [ id ]
          },
          success: function( info ) {
            if ( info.success ) {
              // 删除成功
              // 需要重新渲染页面, 就是重新调用一次下拉刷新即可
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        })
      }
    })
  });

  // 修改功能
  // 1. 给修改按钮, 注册点击事件(事件委托)
  // 2. 将数据存储在 btn_edit 中
  // 3. 弹出确认框, 根据存储在 btn_edit 里面的数据进行渲染确认框
  // 4. 注册选择尺码委托事件, 让用户修改尺码
  // 5. 根据 id, size, num, 进行 ajax 提交, 修改购物车数据
  // 6. 重新刷新页面进行页面的重新加载

  $('#productList').on("tap",".btn-edit",function(){
    console.log(this.dataset)

    var htmlStr = template("editTpl", this.dataset);
    //获取购物车id
    var id = $(this).data("id");

    // 在进行传入确认框时, 需要先将所有 \n 干掉
    htmlStr = htmlStr.replace(/\n/g,"");
    mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function(e){
      if(e.index === 0){
        // 点击了确认, 发送编辑商品 ajax 请求
        var size = $('.size span.current').text();
        var num = $('.num .mui-numbox-input').val();

        $.ajax({
          url: "/cart/updateCart",
          type: "post",
          data: {
            // 需要注意这里 id 传的是一个数组
            id: id,
            size: size,
            num:num
          },
          success: function( info ) {
            console.log(info);
            if ( info.success ) {
              // 删除成功
              // 需要重新渲染页面, 就是重新调用一次下拉刷新即可
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        })
      }
    });
    // 进行input数字框初始化
    mui('.mui-numbox').numbox();
  });
// 选择尺码, 注册委托事件
  $('body').on("tap",".size span",function(){
    $(this).addClass("current").siblings().removeClass("current");
  })

  // 计算价格功能
  // 1. 肯定要将 价格 和 数量, 存在 checkbox 中
  // 2. 注册 checkbox 点击事件(事件委托), 获取到所有被选中的 checkbox
  $('#productList').on('change', ".ck", function() {
    console.log( $('.ck:checked') )

    var $checks = $('.ck:checked');

    var total = 0;

    // 遍历所有选中的 checkbox 进行计算价格
    $checks.each(function() {
      console.log( this );
      var price = $(this).data("price");
      var num = $(this).data("num");
      total += price * num;
    })

    // 保留两位小数
    total = total.toFixed( 2 );
    // 设置到span中
    $('.totalPrice').text( total );
  })
})