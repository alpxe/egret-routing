class Main extends BaseComponent {
    private loadingUI: LoadingUI;

    public constructor() {
        super();
    }

    public initUI(): void {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        }

        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        App.StageUtils.setScaleMode(egret.StageScaleMode.FIXED_WIDTH);
        App.StageUtils.startFullscreenAdaptation(750, 1334, () => {
            console.log("resize");
        })

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.onloadConfig();
        await this.onloadTheme();


        this.loadingUI = new LoadingUI();
        this.addChild(this.loadingUI);
        this.loadingUI.tips = "正在连接服务器...";

        var groupName: string = "main_load";
        var subGroups: Array<string> = [
            "preload"
        ];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }

    public onloadConfig() {
        App.ResourceUtils.addConfig("resource/default.res.json", "resource/");

        return new Promise((resolve, reject) => {
            App.ResourceUtils.loadConfig(() => {
                console.log("配置加载完成");
                resolve();//该方法中 调用这个exetucor 跳出await
            }, this);
        });
    }

    public onloadTheme() {
        return new Promise((resolve, reject) => {
            let theme: eui.Theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this)
        });
    }

    private label: eui.Label;
    public cont: eui.UILayer;
    public onResourceLoadComplete() {
        this.removeChild(this.loadingUI);


        // this.initScene();
        this.initMVC();

        // console.log("浏览器类型："+Systool.systemType());
        // console.log("平台:"+Systool.platformType());

        let routingCmp:RoutingComponent=new RoutingComponent();
        this.addChild(routingCmp);
    }

    public initMVC(): void {
        ApplicationFacade.getInstance(ApplicationFacade.NAME).startup(this);
        ApplicationFacade.getInstance(ApplicationFacade.NAME).sendNotification(ApplicationFacade.INSTALL_MAIN_EVENT);
    }

    public onResourceLoadProgress(itemsLoaded: number, itemsTotal: number) {
        console.log(itemsLoaded + "/" + itemsTotal);
        this.loadingUI.onProgress(itemsLoaded, itemsTotal);
    }
}