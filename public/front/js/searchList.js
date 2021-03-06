$(function() {

  function render(){
    // 请求渲染时, 将product结构重置成 loading
    $(".product").html('<div class="loading"></div>');

    var obj = {};
    obj.proName = $(".search input").val();
    obj.page = 1;
    obj.pageSize = 100;

    var $current = $(".sort .current");

    if ( $current.length > 0 ){
      console.log(11);
      // 有这个类, 说明需要排序, 需要加参数,
      // 参数名和参数值  （1升序，2降序）
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa fa-angle-down") ? 2 : 1;
      obj[ sortName ] = sortValue;
    }

    setTimeout( function(){
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: obj,
        success:function(info){
          console.log(info);
          $(".product").html(template("productTpl",info))
        }
      })
    },500);
  }
// 功能1: 页面一进来, 需要渲染一次, proName 来自于 input 框
  var key = getSearch( "key" );
  $(".search input").val(key);
  render();

  // 功能2: 点击搜索按钮, 需要渲染一次, 用户修改了proName
  $(".search button").click(function(){
    render();

    var key = $(".search input").val();
    var history = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(history);
    var index = arr.indexOf(key);
    if(index !== -1){
      arr.splice( index, 1);
    }
    if( arr.length >= 10){
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem("search_list",JSON.stringify(arr));
  })

  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  $(".sort a[data-type]").click(function(){
    if($(this).hasClass("current")){
      // 判断当前点击的 a 有没有 current 类
      // 如果有, 切换类
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    }else{
      // 没有这个类 进行排他
      $(this).addClass("current").siblings().removeClass("current");
      // 需要重置所有的箭头, 向下
      $(".sort a i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }
    render();
  })
})