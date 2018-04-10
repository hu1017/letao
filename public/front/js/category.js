/**
 * Created by Lenovo on 2018/4/9.
 */
$(function () {
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    success:function (info) {
      console.log(info);
      var htmlStr = template("left_tpl",info);
      $(".category_left ul").html(htmlStr);
      //刚进页面默认渲染第一个
      renderById( info.rows[0].id );
    }
  });
  // 给左侧添加事件委托, 点击左侧一级分类, 渲染二级分类
$(".category_left ul").on("click","a",function(){
  // 拿到一级分类id
    var id = $(this).data("id");
  // 重新渲染
    renderById(id);
  $(this).addClass("current").parent().siblings().find("a").removeClass("current");
})
  function renderById(id){
    $.ajax({
      url:"/category/querySecondCategory",
      type: "get",
      data: {
        id:id
      },
      success: function(info){
        console.log(info);
        var htmlStr = template("right_tpl",info);
        $(".category_right ul").html(htmlStr);
      }
    })
  }
})
