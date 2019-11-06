/*====================================================
__                .__                        __
|  | ______   ____ |  |__  __ __  ________  _|  | __
|  |/ /  _ \_/ ___\|  |  \|  |  \/     \  \/ /  |/ /
|    <  <_> )  \___|   Y  \  |  /  Y Y  \   /|    <
|__|_ \____/ \___  >___|  /____/|__|_|  /\_/ |__|_ \
    \/          \/     \/            \/          \/
====================================================*/

function link(holder,width,height,data,custom_options){

var options = {
}
var linkThicknessTargetRange = [1,5];
var linkThicknessRange =[0,0];

options = mergeDeep(options, custom_options);
var clickPoint
//================ SET-UP CANVAS ====================
var linkHolder = document.getElementById(holder);
var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
canvas.id = "link_canvas";
linkHolder.appendChild(canvas);

//================ SET-UP STAGE =====================
var markerGroups = [];
var stage = new createjs.Stage("link_canvas");
    stage.enableMouseOver(10);
    createjs.Ticker.interval = 30;
    createjs.Ticker.addEventListener("tick", stage);

//========= OPTIMISE FOR HIGH PIXEL DENSITY =========
  if (window.devicePixelRatio) {
  var height = canvas.getAttribute('height');
  var width = canvas.getAttribute('width');
  canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));
  canvas.setAttribute('height', Math.round( height * window.devicePixelRatio));
  canvas.style.width = width+"px";
  canvas.style.height = height+"px";
  stage.scaleX = stage.scaleY = window.devicePixelRatio;
}

//================= RENDER NODES ==================
for(var i =0;i<data.nodes.length;i++){
  drawNode(data.nodes[i]);
}

function drawNode(node){
  var node_wrapper = new createjs.Container();
      node_wrapper.id = node.id;
      node_wrapper.name = node.id;
      node_wrapper.cursor = "pointer";
  var node_base = new createjs.Shape();
      node_base.graphics.s(node.color.stroke).ss(1,"round").beginFill(node.color.fill).drawRect(0,0,node.dimension.width,node.dimension.height);
  var node_label = new createjs.Text("", "12px Ubuntu Condensed", node.color.stroke);
      node_label.text = node.label;
      node_label.x = 5;
      node_label.y = node.dimension.height/2 - 6;
      node_wrapper.addChild(node_base,node_label);
      stage.addChild(node_wrapper);
      node_wrapper.addEventListener("pressmove", dragNode);
      node_wrapper.addEventListener("pressup", endDragNode);
      addTerminal(node_wrapper,node);
      return node_wrapper;
}
function addTerminal(node_wrapper,node){
  //console.log(node_wrapper.getBounds());
    var terminal_top = drawTerminal();
        terminal_top.name = "terminal_top";
    var terminal_bottom = drawTerminal();
        terminal_bottom.name = "terminal_bottom";
    var terminal_left = drawTerminal();
        terminal_left.name = "terminal_left";
    var terminal_right = drawTerminal();
        terminal_right.name = "terminal_right";
    terminal_top.x = node.dimension.width / 2 - 2;
    terminal_bottom.x = node.dimension.width / 2 - 2;
    terminal_bottom.y = node.dimension.height;
    terminal_left.y = node.dimension.height/2;
    terminal_right.x = node.dimension.width;
    terminal_right.y = node.dimension.height/2;
    node_wrapper.addChild(terminal_top,terminal_bottom,terminal_left,terminal_right);
}

function drawTerminal(){
    var terminal = new createjs.Shape();
    terminal.graphics.beginFill('#000000').drawCircle(0,0,4);
    terminal.alpha = 0;
    return terminal;
}

//================= RENDER LINKS ==================
for(var i =0;i<data.links.length;i++){
  console.log("Link :"+data.links[i].value );
  if(linkThicknessRange[0] == 0 || linkThicknessRange[0]>data.links[i].value){
    linkThicknessRange[0] = data.links[i].value;
  }
  if(linkThicknessRange[1] == 0 || linkThicknessRange[1]<data.links[i].value){
    linkThicknessRange[1] = data.links[i].value;
  }
}
console.log("linkThicknessRange:");
console.log(linkThicknessRange);
for(var i =0;i<data.links.length;i++){
  console.log("Link :"+data.links[i].to )
  drawLink(data.links[i]);
}

function drawLink(link){
  var from = stage.getChildByName(link.from);
  var to = stage.getChildByName(link.to);
  var link_wrapper = new createjs.Container();
      link_wrapper.name = "link"+link.id ;
      link_wrapper.cursor = "pointer";
  var link_base = new createjs.Shape();
      link_base.name = link_base;
      link_base.graphics.s("#00C5D1").ss(convertToRange(linkThicknessRange,linkThicknessTargetRange,link.value),"round").moveTo(from.getChildByName("terminal_top").x,from.getChildByName("terminal_top").y)
                        .lineTo(to.getChildByName("terminal_top").x,to.getChildByName("terminal_top").y);
  var link_label_wrapper = new createjs.Container();
  var link_label = new createjs.Shape();
      link_label.graphics.f("#00C5D1").drawRoundRect(-10,-6,20,12,6);
  var link_label_text = new createjs.Text("", "10px Ubuntu Condensed", "white");
      link_label_text.text = link.value;
  var bounds = link_label_text.getBounds();
      link_label_text.x = -bounds.width/2;
      link_label_text.y = -bounds.height/2;
      link_label_wrapper.addChild(link_label,link_label_text);
      link_wrapper.addChild(link_base,link_label_wrapper,drawArrow());
      stage.addChild(link_wrapper);

      //return link_wrapper;
}

function drawArrow(){
  var arrow = new createjs.Shape();
      arrow.graphics.f("#00C5D1").moveTo(0,0).lineTo(10,10).lineTo(0,20).lineTo(0,0);
      arrow.regY = 10;
      arrow.regX = 5;
      arrow.alpha = 0;
      return arrow;
}

function updateLinks() {
  for(var i =0;i<data.links.length;i++){
    var link  = data.links[i];
    var from = stage.getChildByName(link.from);
    var to = stage.getChildByName(link.to);
    var link_name = "link"+link.id;
    var specific_link = stage.getChildByName(link_name).getChildAt(0);
    var specific_link_label = stage.getChildByName(link_name).getChildAt(1);
    var specific_link_arrow = stage.getChildByName(link_name).getChildAt(2);

      specific_link.graphics.clear().s("#000000");
        // specific_link.graphics.moveTo(from.x+from.getChildByName("terminal_top").x,from.y)
        //                   .lineTo(to.x+to.getChildByName("terminal_top").x,to.y);

        // define 8 pointer
        // find nearest 2 points
        // draw line

        var point_1 = from.localToGlobal(from.getChildByName("terminal_top").x,from.getChildByName("terminal_top").y);
        var point_2 = from.localToGlobal(from.getChildByName("terminal_right").x,from.getChildByName("terminal_right").y);
        var point_3 = from.localToGlobal(from.getChildByName("terminal_bottom").x,from.getChildByName("terminal_bottom").y);
        var point_4 = from.localToGlobal(from.getChildByName("terminal_left").x,from.getChildByName("terminal_left").y);

        var point_5 = to.localToGlobal(to.getChildByName("terminal_top").x,to.getChildByName("terminal_top").y);
        var point_6 = to.localToGlobal(to.getChildByName("terminal_right").x,to.getChildByName("terminal_right").y);
        var point_7 = to.localToGlobal(to.getChildByName("terminal_bottom").x,to.getChildByName("terminal_bottom").y);
        var point_8 = to.localToGlobal(to.getChildByName("terminal_left").x,to.getChildByName("terminal_left").y);

        var ar1 = [point_1,point_2,point_3,point_4];
        var ar2 = [point_5,point_6,point_7,point_8];
        var optimal_points = findClosesPair(ar1,ar2);
        //console.log(specific_link);
        var distanceX  = Math.abs(optimal_points.a.x - optimal_points.b.x);
        var distanceY  = Math.abs(optimal_points.a.y - optimal_points.b.y);
        var arrow_rotation = Math.atan(distanceX/distanceY) * (180 / Math.PI);
        specific_link.graphics.s("#00C5D1").ss(convertToRange(linkThicknessRange,linkThicknessTargetRange,link.value),"round").moveTo(optimal_points.a.x/2,optimal_points.a.y/2)
                          //.lineTo((optimal_points.a.x/2)+distanceX/2,optimal_points.a.y/2)
                          //.lineTo(optimal_points.a.x/2+distanceX/2,optimal_points.b.y/2)
                          .lineTo(optimal_points.b.x/2,optimal_points.b.y/2);
                          if(optimal_points.a.x <= optimal_points.b.x){
                            specific_link_label.x =  (optimal_points.a.x + distanceX/2)/2;
                            specific_link_arrow.x = (optimal_points.a.x + distanceX/2)/2 +20;
                          }
                          else{
                              specific_link_label.x =  (optimal_points.b.x + distanceX/2)/2;
                              specific_link_arrow.x =  (optimal_points.b.x + distanceX/2)/2+20;
                          }
                          if(optimal_points.a.y <= optimal_points.b.y){
                            specific_link_label.y =  (optimal_points.a.y+ distanceY/2)/2;
                            specific_link_arrow.y =  (optimal_points.a.y+ distanceY/2)/2;
                          }
                          else{
                              specific_link_label.y =  (optimal_points.b.y+ distanceY/2)/2;
                              specific_link_arrow.y =  (optimal_points.b.y+ distanceY/2)/2;
                          }
                          specific_link_arrow.rotation = arrow_rotation-90;
                          console.log("arrow_rotation:"+arrow_rotation);


                        }
}

function findClosesPair(array1,array2){

    var combos = [];

    for(var i = 0; i < array1.length; i++)
    {
         for(var j = 0; j < array2.length; j++)
         {
           var dx = array1[i].x - array2[j].x;
           var dy = array1[i].y - array2[j].y;
            combos.push({a:array1[i],b:array2[j],c:Math.sqrt( dx*dx + dy*dy )})
         }
    }
    combos.sort(function(a, b){
    return a.c-b.c
    })
    //console.log(combos[0]);
    return combos[0];
}
//==================== EVENTS =====================
function dragNode(evt){
  if(clickPoint==undefined){
    clickPoint = evt.currentTarget.globalToLocal(evt.stageX, evt.stageY);
    evt.currentTarget.parent.setChildIndex(evt.currentTarget,evt.currentTarget.parent.numChildren-1);
    }
    //stage.setChildIndex(evt.currentTarget,stage.numChildren-1);
    evt.currentTarget.x = stage.mouseX/window.devicePixelRatio - clickPoint.x;
    evt.currentTarget.y = stage.mouseY/window.devicePixelRatio - clickPoint.y;
    //console.log(point);
    updateLinks();
}
function endDragNode(evt){
  clickPoint = undefined;
  updateLinks();
}

//node_wrapper.on("pressup", function(evt) { console.log("up"); })
//==================== RETURN =====================
return {
  onClick:function(callBack){
    callBacks.click = callBack;
  }
}
//==================== UTILITY ====================
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }else{
          target[key] = Object.assign({}, target[key])
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
function convertToRange(or,nr,val) {
  var oldRange = (or[1] - or[0]);
  var NewRange = (nr[1] - nr[0]);
  var NewValue = (((val - or[0]) * NewRange) / oldRange) + nr[0];
  return NewValue;
}


//=== END OF COMPONENT ===
}
