var data = {
  nodes:[
    {id:"0",label:"Node 0",color:{stroke:"#D35353",fill:"#F1CBCB"},dimension:{width:200,height:30}},
    {id:"1",label:"Node 1",color:{stroke:"#D35353",fill:"#F1CBCB"},dimension:{width:200,height:30}},
    {id:"2",label:"Node 2",color:{stroke:"#D35353",fill:"#F1CBCB"},dimension:{width:200,height:30}},
    {id:"3",label:"Node 3",color:{stroke:"#D35353",fill:"#F1CBCB"},dimension:{width:200,height:30}},
    {id:"4",label:"Node 4",color:{stroke:"#D35353",fill:"#F1CBCB"},dimension:{width:200,height:30}},
  ],
  links:[
    {id:"7",from:"1",to:"3",value:4,color:{stroke:"#D35353"}},
    {id:"0",from:"0",to:"2",value:5,color:{stroke:"#D35353"}},
    {id:"1",from:"0",to:"4",value:10,color:{stroke:"#D35353"}},
    {id:"3",from:"0",to:"3",value:5,color:{stroke:"#D35353"}},
    {id:"4",from:"4",to:"3",value:25,color:{stroke:"#D35353"}},
    {id:"5",from:"3",to:"2",value:18,color:{stroke:"#D35353"}},
    {id:"6",from:"1",to:"2",value:3,color:{stroke:"#D35353"}}

  ]
};


function init() {
  var cl = new link("holder",1400,800,data,{
  });
  //cl.onClick(function (loc) {console.log("Navigate code to :"+loc) });
}
