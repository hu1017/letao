$(function(){
  var currentPage = 1;

  var pageSize = 5;

  render();
  function render(){

    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data:{
        page: currentPage,
        pageSize: pageSize
      },
      success:function(info){
        //console.log(info);
        var htmlStr = template("secondTpl",info);
        $(".lt_content tbody").html(htmlStr);

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function(a, b, c, page){
            currentPage = page;
              render();
          }
        })
      }
    })

  };

  // 2. 点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function(){
      $('#addModal').modal("show");
      $.ajax({
        url: "/category/queryTopCategoryPaging",
        type: "get",
        data: {
          page: 1,
          pageSize: 100
        },
        success:function(info){
          console.log( info );
          // 将模板和数据相结合, 渲染到下拉菜单中
          var htmlStr = template("dropdownTpl",info);
          $(".dropdown-menu").html( htmlStr);
        }
      })
    });

// 3. 通过注册委托事件, 给 a 添加点击事件
  $(".dropdown-menu").on("click","a",function(){
    // 选中的文本
    var txt = $(this).text();
    var id = $(this).data("id");

    // 修改文本内容
    $("#dropdownText").text( txt );

    // 将选中的 id 设置到 input 表单元素中
    $('[name ="categoryId"]').val( id );
    // 需要将校验状态置成 VALID
    // 参数1: 字段
    // 参数2: 校验状态
    // 参数3: 配置规则, 来配置我们的提示文本
    $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

// 4. 配置图片上传
$("#fileupload").fileupload({
  datetype: "json",
  // done, 当图片上传完成, 响应回来时调用
  done: function( e, data ){
    console.log(data)
    // 获取上传成功的图片地址
    var picAddr = data.result.picAddr;
    // 设置图片地址
    $("#imgBox img").attr("src",picAddr);
    // 将图片地址存在隐藏域中
    $('[name="brandLogo"]').val(picAddr);
    // 重置校验状态
    $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
  }
});

  // 5. 配置表单校
  $("#form").bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
// 校验的字段
    fields:{
      brandName:{
        validators:{
        notEmpty:{
          message:"请输入二级分类名称"
        }
      }
    },
      // 一级分类的id
      categoryId:{
        validators:{
        notEmpty:{
          message:"请输入一级分类名称"
        }
      }
    },
      // 图片的地址
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
  }
});

  // 6. 注册校验成功事件, 通过 ajax 进行添加
$("#form").on("success.form.bv",function(e){
  e.preventDefault();
  console.log("hh");
  $.ajax({
    url:'/category/addSecondCategory',
    type: 'post',
    data: $("#form").serialize(),
    success:function(info){
      console.log(info)
      //关闭模态框
      $("#addModal").modal("hide");
      // 重置表单里面的内容和校验状态
      $('#form').data("bootstrapValidator").resetForm( true );

      currentPage = 1;
      render();
// 找到下拉菜单文本重置
      $("#dropdownText").text("请选择一级分类")
      // 找到图片重置
      $("#imgBox img").attr("src", "images/none.png")
    }

  })
})
});