function createButton(value,id,icon,tooltip,clazz){
    var button=$("<button>").addClass("btn btn-primary").attr("id",id).html(value);
    if(icon){
        var i=$("<i>").addClass(icon).prependTo(button);
    }
    if(tooltip){
        button.attr({"data-toggle":"tooltip","title":tooltip,"data-placement":"bottom"});
        button.tooltip({"container":"body"});
    }

    return button;
}

function createDropdown(list){
    var ul=$("<ul>").addClass("dropdown-menu");
    for(var i=0;i<list.length;i++){
        var li=$("<li>").appendTo(ul);
        if(list[i].id){
            var link=$("<a href='#'>").html(list[i].label).attr("id",list[i].id).appendTo(li);
        }else{
            li.addClass("divider");
        }
    }
    return ul;
}

function createButtons(list,group){
    var ul=$("<ul>").addClass("dropdown-menu");
    for(var i=0;i<list.length;i++){
        createButton(list[i].label,list[i].id,list[i].icon,list[i].tooltip).appendTo(group);
    }

}
function addFolder(panel){
    var newDir=$("<ul>").addClass("nav nav-list accordion-group");
    newDir.appendTo(panel);
    var li=$("<li>").addClass("nav-header").appendTo(newDir)
        $("<i>").addClass("icon-plus icon-white").appendTo(li).css(
                {
                    "margin-top": "5px"
                });
    var div=$("<span>").addClass("preview").appendTo(li).css({"display":"inline"});
    $("<input>").appendTo(div).attr({
        "type":"text",
        "value":"New Dir"

    }).css({"margin-top":"10px","margin-bottom":"0px"});;
    var file=  $("<li>").addClass("boxes").appendTo(newDir).css("display","none")
        addFile(file);
}
function addFile(file){
    var file= $("<div>").addClass("box box-element").appendTo(file).html("index.html");
}
$.fn.asFileTab=function(){
    var panel=this;
    var div=$("<div>").addClass("span12 btn-group").appendTo(this);



    var dropdown=createButtons([{
        "id":"createDir",
        "label":"",
        "icon":" icon-folder-close icon-white",
        "tooltip":"\u65B0\u5EFA\u76EE\u5F55"
    },

    {
        "id":"createFile",
        "label":"",
        "tooltip":"\u65B0\u5EFA\u6587\u4EF6",
        "icon":"icon-file icon-white"
    },
    {
        "id":"rename",
        "label":"",
        "tooltip":"\u91CD\u547D\u540D",
        "icon":"icon-edit icon-white"

    },
    {
        "id":"remove",
        "label":"",
        "tooltip":"\u5220\u9664",
        "icon":"icon-remove icon-white"

    },
    {
        "id":"downloadall",
        "label":"",
        "tooltip":"\u6253\u5305\u4E0B\u8F7D",
        "icon":"icon-briefcase icon-white"

    }
    ],div);


    var tree=$("<div>").appendTo(this).attr("id","fileTree").addClass("span12");//.css({"minHeight":"100px"})
    var ul=$("<ul>").appendTo(tree);
    $("<li>").appendTo(ul).append($("<a>").html("index.html")).attr({"id":"__index","data-index":"true","rel":"file"});
    var fileTree= $("#fileTree")
        .jstree({
            "plugins" : ["themes","html_data","ui","crrm","hotkeys",],
            "ui" : {
                "select_limit" : 2,
                 "initially_select" : [ "__index" ]
            
            },
            "themes" : {
                "theme" : "proton"
            }
        }).bind("select_node.jstree", function (event, data) {
            if(data.rslt.obj.attr("data-index")){
                 $("#remove").attr('disabled', 'disabled').addClass('disabled');
                  $("#rename").attr('disabled', 'disabled').addClass('disabled');
            }else{

              $("#remove").removeAttr('disabled').removeClass('disabled');
              $("#rename").removeAttr('disabled').removeClass('disabled');
            }
        });
    $("#createDir").click(function(){
        //addFolder(panel);
        var selectedNode=$("#fileTree").jstree("get_selected");
        if(selectedNode.size()==0){

            $("#fileTree").jstree("create", null, "first", "New Folder");
        }else if(selectedNode.attr("rel")=="file"){
            $("#fileTree").jstree("create", selectedNode, "before","New Folder") ;
        }else{
            $("#fileTree").jstree("create", selectedNode, "first","New Folder");
        }


    });
    $("#createFile").click(function(){
        //addFolder(panel);
        var selectedNode=$("#fileTree").jstree("get_selected");
        if(selectedNode.size()==0){
            $("#fileTree").jstree("create", null, "last", "New File").attr("rel","file");
        }else if(selectedNode.attr("rel")=="file"){
            $("#fileTree").jstree("create", selectedNode, "after","New File").attr("rel","file");
        }else{
            $("#fileTree").jstree("create", selectedNode, "last","New File").attr("rel","file");
        }


    });
    $("#rename").click(function(){
        //addFolder(panel);
        $("#fileTree").jstree("rename");

    });

    $("#remove").click(function(){
        //addFolder(panel);
        $("#fileTree").jstree("remove");

    });


}

$.fn.asTab=function(container,title){
    var tabNav,tabContent;
    if(!container){
        container=$("<div>").addClass("tabbable").attr("id","leftTabset");
    }
    tabNav=$("ul",container);
    tabContent=$(".tab-content",container)
        if(tabNav.size()==0){
            tabNav=$("<ul>").addClass("nav nav-tabs").appendTo(container).css({
                "background-color":"#fff",
                "margin-bottom":"0px"

            });
        }
    if(tabContent.size()==0){
        tabContent=$("<div>").addClass("tab-content").appendTo(container).css({
            "border-top":"5px solid #fff",
            "overflow-x":"hidden"

        });;
    }
    var controlTabId="controltab"
        var tabTitle= $("<li>").addClass("active").appendTo(tabNav);
    $("<a>").attr({
        "href":"#"+controlTabId,
        "data-toggle":"tab"

    }).html(title).appendTo(tabTitle);

    var fileTabId="filetab";
    tabTitle= $("<li>").addClass("").appendTo(tabNav);
    $("<a>").attr({
        "href":"#"+fileTabId,
        "data-toggle":"tab"

    }).html("\u6587\u4EF6").appendTo(tabTitle);

    var tabPanel=$("<div>").addClass("tab-pane active").attr("id",controlTabId).appendTo(tabContent);

    var children=this.children();
    container.appendTo(this);
    children.appendTo(tabPanel);
    tabPanel=$("<div>").addClass("tab-pane").attr("id",fileTabId).appendTo(tabContent);
    tabPanel.asFileTab();


}
$(document).ready(function(){
    $(".sidebar-nav").asTab(null,"\u7EC4\u4EF6");
});
