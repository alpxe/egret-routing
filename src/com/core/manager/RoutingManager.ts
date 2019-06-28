/**
 * 路由管理
 */
class RoutingManager extends SingleInstance {
	public list: string[] = [];
	private Intercept: number = 0;// 初始指向 history
	public pointer: number;

	private _history: any;

	private callback: Function;
	private thatObj: any;

	private iscall: boolean = true;

	public constructor() {
		super();
	}

	public initialize(callback: Function, thatObj: any): void {
		console.log("初始化：【length】" + window.history.length);
		this.Intercept = this.pointer = window.history.length - 1;

		for (let i: number = 0; i < window.history.length; i++) {
			this.list.push(null);
		}

		this.callback = callback;
		this.thatObj = thatObj;
		
		window.addEventListener("popstate",this.__popstateHandler.bind(this),false);
	}

	private __popstateHandler() {
		if(this.iscall)
			this.callback.apply(this.thatObj, [this.history, this.state]);
		else{
			setTimeout(()=>{this.iscall=true}, 100);
		}
		this.history = this.state;
		this.pointer = this.list.indexOf(this.history);
	}

	public gotoHistory(val:string):void{
		// console.log("当前："+this.pointer);//当前指针
		// console.log("目标位置"+this.list.indexOf(val));
		let diff=this.list.indexOf(val)-this.pointer;
		let symbol=diff>0?1:-1;
		for(let i:number=0;i<diff;i++){
			this.iscall = false;
			window.history.go(symbol);
			this.pointer+=symbol;
		}
	}

	public page(val: string): void {
		if (!this.has(val)) {
			this.list.push(val);
			window.history.pushState({ page: val }, "", "");
		} else {
			this.gotoHistory(val);
			window.history.replaceState({ page: val }, "", "");
		}

		this.history = this.state;
		this.pointer = this.list.indexOf(val);
		console.log("当前[history]>>" + this.history + "len=" + window.history.length);
	}


	public block(): void {
		if (this.iscall)
			window.history.pushState({ page: this.history }, "", "");
	}

	public homepage(): void {
		console.log("this.pointer:this.Intercept" + this.pointer + "/" + this.Intercept);
		this.pointer = this.list.indexOf(this.history);
		while (this.pointer != this.Intercept) {
			this.iscall = false;
			window.history.go(-1);
			this.pointer--;
		}

		this.list=[];
		for (let i: number = 0; i < this.Intercept+1; i++) {
			this.list.push(null);
		}
	}

	private pushState(val: string): void {
		window.history.pushState({ page: val }, "", "");
	}

	private has(val: string): boolean {
		return this.list.indexOf(val) == -1 ? false : true;
	}

	public set history(value: string) {
		this._history = { page: value };
	}

	public get history() {
		let str: string = null;
		let obj: Object;
		if (this._history) {
			if (this._history.hasOwnProperty("page")) {
				str = this._history["page"];
			}
		}
		return str;
	}

	public get state(): string {
		let str: string = null;
		let obj: Object;
		if (window.history.state) {
			if (window.history.state.hasOwnProperty("page")) {
				str = window.history.state["page"];
			}
		}
		return str;
	}
}