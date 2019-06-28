class RoutingComponent extends BaseComponent{
	public constructor() {
		super();
	}

	public initUI():void{
		App.routing.initialize(this.__core,this);

		for(let i:number=0;i<6;i++){
			let btn:eui.Button=new eui.Button();
			this.addChild(btn);
			btn.label="btn_"+i;
			if(i==5){
				btn.label="yes";
			}
			if(i==6){
				btn.label="home";
			}
				
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.__btnClickHandler,this);
			btn.y=100*i;
		}

		console.log(App.routing.state);
	}

	public __core(from:string,to:string):void{
		console.log("检测到事件派发回调：");
		console.log("from:["+from+"] to:["+to+"]");
		
		

		switch(from){
			case "Games":
				//从games退出 进入Ranking
				App.routing.block();
			break;

			case "Ranking":
				// console.log("Ranking");
				//从ranking->home
				App.routing.homepage();
			break;

			case "Answer":
				if(to=="Ranking"){
					console.log("回到排行榜");
				}else{
					App.routing.homepage();
				}
			break;
		}
	}
	
	private __btnClickHandler(e:egret.TouchEvent):void{
		switch((e.currentTarget as eui.Button).label){
			case "btn_0":
				App.routing.page("Games");
			break;
			case "btn_1":
				App.routing.page("Ranking");
			break;
			case "btn_2":
				App.routing.page("Answer");
			break;

			case "btn_3":;
				// App.routing.comp()
			break;
			case "btn_4":
			break;

			case "home":
				App.routing.homepage();
			break;
			case "yes":
				App.routing.page("Ranking");
			break;
		}
	}

	public initEvent(b:boolean=true):void{

	}

	public initLocation():void{

	}
}