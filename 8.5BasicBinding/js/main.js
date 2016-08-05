// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var isFirstActivation = true;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
			args.setPromise(WinJS.UI.processAll());
		}

		isFirstActivation = false;
	};

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();


    // 这里看不懂？？？？？？？？？？？？
    // 转换为CssColor
	var toCssColor = WinJS.Binding.initializer(
        //source 为下面绑定的原数据，sourceProperty为写的color，dest为整个p标签，destProperty为style.background
        function toCssColor(source, sourceProperty, dest, destProperty) {
            function setBackColor() {
                dest.style.backgroundColor = rgb(source.color.red, source.color.green, source.color.blue);
            }
            return WinJS.Binding.bind(source, {
                color: {
                    red: setBackColor,
                    green: setBackColor,
                    blue: setBackColor,
                }
            });
        }
    );


    //rgb颜色转换为css颜色
	function rgb(r, g, b) { return "rgb(" + [r, g, b].join(",") + ")"; }


	WinJS.Namespace.define("BasicBinding", {
	    toCssColor: toCssColor
	});


    //初始数据
	var bindingSource = {
	    text: "Initial text",
	    color: {
	        red: 128,
	        green: 128,
	        blue: 128
	    }
	};

 
    //textbox的初始数据
	function bindTextBox(selector, initialValue, setterCallback) {
	    var textBox = document.querySelector(selector);
        //给textbox注册事件
	    textBox.addEventListener("change", function (evt) {
	        setterCallback(evt.target.value);
	    }, false);
	    textBox.value = initialValue;
	}


	WinJS.UI.processAll().then(function () {
	    //返回一个observable 对象,这个对象当数据发生变动的时候会自动刷新界面
	    var b = WinJS.Binding.as(bindingSource);
	    //调用bindTextBox方法，传入selector\初始值\回调方法(重新设置b的值)
        //这里不是绑定，而是赋值的关系
	    bindTextBox("#basicBindingInputText", b.text,
            function (value) { b.text = value; });

	    bindTextBox("#basicBindingInputRed", b.color.red,
            function (value) {
                b.color.red = value;
            });

	    bindTextBox("#basicBindingInputGreen", b.color.green,
            function (value) { b.color.green = value; });

	    bindTextBox("#basicBindingInputBlue", b.color.blue,
            function (value) { b.color.blue = value; });


	    //绑定最下面basicBindingOutput的<span>标签的数据
	    WinJS.Binding.processAll(document.querySelector("#basicBindingOutput"), b)
            .done(function () {
                WinJS.log && WinJS.log("Binding wireup complete", "sample", "status");
            });
	});
})();
