//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        const result = await RES.getResAsync("description_json")


        this.initScene();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private routing: RoutingManager = new RoutingManager();

    private label:eui.Label;

    private initScene(): void {
        console.log(RoutingManager.value);

        this.routing.listen(this.backgoHandler, this);


        let btn: eui.Button = new eui.Button();
        this.addChild(btn);
        btn.x = 100;
        btn.y = 100;
        btn.label = "page test";
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__testClickHandler, this);


        let btn2: eui.Button = new eui.Button();
        this.addChild(btn2);
        btn2.x = 300;
        btn2.y = 100;
        btn2.label = "clear history";
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__homeClickHandler, this);

        let btn3: eui.Button = new eui.Button();
        this.addChild(btn3);
        btn3.x = 100;
        btn3.y = 300;
        btn3.label = "print info";
        btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__levelClickHandler, this);

        let btn4: eui.Button = new eui.Button();
        this.addChild(btn4);
        btn4.x = 300;
        btn4.y = 300;
        btn4.label = "goto>>>>";
        btn4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__gotoClickHandler, this);

        this.label=new eui.Label();
        this.addChild(this.label);
        this.label.text="";
        this.label.verticalCenter=0;
        this.label.horizontalCenter=0;
        this.label.size=30;
    }
    private __levelClickHandler(e: egret.Event):void{
        console.log("len:"+window.history.length);
        console.log("当前状态:"+RoutingManager.value);
        console.log("记录:"+this.routing.history);
        
    }

    private __gotoClickHandler(e: egret.Event):void{
        this.routing.jumpPage("页面2");

        this.label.text=RoutingManager.value;
    }

    public num: number = 0;
    private __testClickHandler(e: egret.Event): void {
        this.routing.joinHistory("页面" + this.num);
        this.num++;


        this.label.text=RoutingManager.value;
    }

    private __homeClickHandler(e: egret.Event): void {
        this.routing.homepage();
        this.num=0;
        this.label.text=RoutingManager.value;
    }

    private backgoHandler(data): void {
        if (this.routing.history == "页面3") {
            console.log("当前是特殊页面");
            window.history.pushState({ page: this.routing.history }, "", "");//断在此处
        }

        this.label.text=RoutingManager.value;
    }




}



enum PAGES {
    GAME = 3,
}