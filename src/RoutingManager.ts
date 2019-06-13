class RoutingManager {
	private Intercept:number=0;// 初始指向 history

	private pointer:number=0;//当前指向

	private ring:string[]=[null];//路由数组

	private _history:any;

	public constructor() {

	}

	//由listen开始
	public listen(callback: Function, thisObj: any): void {
		this.Intercept=window.history.length;

		window.addEventListener("popstate", () => {
			//判断前进还是后退

			callback.apply(thisObj);
			this.history=RoutingManager.value;
		}, false);
	}

	public joinHistory(value:string):void{
		if(this.ring.indexOf(value)==-1){
			this.ring.push(value);
			window.history.pushState({page:value},"","");

			this.history=value;
		}

		console.log(RoutingManager.value);
	}

	public homepage():void{
		console.log("历史层:"+window.history.length);
		this.history="";
		let diff:number=window.history.length-this.Intercept;
		if(diff>0){
			window.history.go(-diff );
		}

		this.ring=[null];//路由数组
	}

	/**
	 * 跳转到指定该页面
	 */
	public jumpPage(value:string):void{
		//查询当前
		let cur:number=this.ring.indexOf(this.history);
		if(cur<0)return;
		let tar:number=this.ring.indexOf(value);
		if(tar<0)return;

		this.history="";
		window.history.go(tar-cur);
		// this.history=RoutingManager.value;
	}

	public get history(){
		let str:string=null;
		let obj:Object;
		if(this._history){
			if(this._history.hasOwnProperty("page")){
				str=this._history["page"];
			}
		}
		return str;
	}

	public set history(value:string){
		this._history={page:value};
	}

	public static get value():string{
		let str:string=null;
		let obj:Object;
		if(window.history.state){
			if(window.history.state.hasOwnProperty("page")){
				str=window.history.state["page"];
			}
		}
		return str;
	}

	

}