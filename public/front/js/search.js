$(function (){
  // 进行本地存储操作
  // 约定: search_list 为键名

  // 功能1: 渲染搜索历史记录
  // 1. 读取本地历史记录里面的数组
  // 2. 结合模板引擎渲染
  render();

  function getHistory(){
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse( history );
    return arr;
  }

  function  render(){
    var arr = getHistory()
      $(".history").html( template("searchTpl", {arr: arr}))
    }

    // 功能2: 删除功能, 删除本地历史记录数组里面一项
    // 1. 给所有的删除按钮, 添加委托事件
    // 2. 获取索引
    // 3. 读取本地存储中的数组, 进行删除对应索引的那项
    // 4. 同步到本地存储中
    // 5. 页面也需要重新渲染
    $(".history").on("click",".btn_delete",function(){
      var that = this;
      mui.confirm("你确定要删除么？","温馨提示",["确定","取消"],function(e){
        if(e.index === 0){
          var index = $(this).data("index");
          console.log(index);
          var arr = getHistory();
          arr.splice(index,1);

          localStorage.setItem("search_list",JSON.stringify(arr));
         render();
          console.log(arr);
        }
      })
    });

  // 功能3: 清空功能
  // 1. 注册事件(事件委托做)
  // 2. 清掉本地存储中的search_list
  // 3. 页面重新渲染
$(".history").on("click",".btn_empty",function(){
  mui.confirm("你确定要清空所有记录么？","温馨提示",["确定","取消"],function(e) {
    console.log(e.index);
    if(e.index === 0){
      localStorage.removeItem("search_list");
      render();
    }
  })

});

// 功能4: 添加功能
  // 1. 点击搜索按钮, 获取输入框的值
  // 2. 获取数组
  // 3. 将输入框的值, 添加到数组中的最前面
  // 4. 持久化到本地存储中, 修改 search_list
  // 5. 重新渲染页面
  $('.search button').click(function(){
    var key = $('.search input').val().trim();

    if(key === ""){
      mui.toast("请输入关键字");
      return;
    }

    var arr = getHistory();
// 不等于 -1, 说明在数组中可以找到 key, 说明重复了, 需要删除
    if(arr.indexOf(key) !== -1){
      var index = arr.indexOf(key);
      arr.splice(index, 1);
    }
// 超过 10 个删除最后一项
    if(arr.length >= 10){
      arr.pop();
    }
    // 添加到数组最前面
    arr.unshift(key);
    localStorage.setItem("search_list",JSON.stringify(arr));
    render();

    $(".search input").val("");
  })
})