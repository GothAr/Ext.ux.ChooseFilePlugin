Ext.ux.ChooseFilePlugin = function(pluginConfig){
	var fileTemplate = new Ext.XTemplate('<input type=file size=1 style="position:absolute; right: 0px; -moz-opacity:0; opacity:0; filter: alpha(opacity:0); z-index:2;">');
	
	return {
		init: function(button){
			button.chooseFileConfig = pluginConfig;
			button.on('afterrender', this.AfterRender, this);
			this.addEvents(button);
		},
		AfterRender: function(btn){
			var btnEl = btn.getEl();
			btnEl.applyStyles("position:absolute; right:0px; z-index: 1");
			
			btn.btnWrap = btnEl.wrap({
				style:{
					'width': btn.getWidth(),
					'height': btn.getHeight() + 2,
					'position': 'relative',
					'float': 'left'
				}
			});
			
			this.createFileInput(btn).bindListeners();
		},
		addEvents: function(btn){
			btn.addEvents('fileselected', 'filesizeexceed');
			btn.on('fileselected', btn.chooseFileConfig.OnFileSelected, btn);
			btn.on('filesizeexceed', btn.chooseFileConfig.FileSizeExceed, btn);
		},
		isAllowedFileSize: function (btn, fileEl) {
			var objFSO,
				fsoFile,
				maxSize = btn.chooseFileConfig.fileMaxSize || 10*1024*1024; // 10Mb def
			try {				
				if (fileEl.files){
					return fileEl.files[0].size < maxSize;
				}				
				objFSO = new ActiveXObject('Scripting.FileSystemObject');
			}
			catch (err) {
				return true;
			}

			fsoFile = objFSO.getFile(fileEl.value);
			return (fsoFile.size < maxSize);
		},
		createFileInput: function(btn){
			return {
				plugin: this,
				btn: btn,
				fileEl: fileTemplate.append(btn.btnWrap,{}, true),
				bindListeners: this.bindListeners
			}
		},
		bindListeners: function () {
			var fileEl = this.fileEl, // this is object returned from createFileInput
				me = this,
				plugin = me.plugin;
			fileEl.on({
				scope: this,
				mouseenter: function () {
					me.btn.addClass(['x-btn-over', 'x-btn-focus']);
				},
				mouseleave: function () {
					me.btn.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click']);
				},
				mousedown: function () {
					me.btn.addClass('x-btn-click');
				},
				mouseup: function () {
					me.btn.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click']);
				},
				change: function () {
					var v = fileEl.dom.value,
						btn = me.btn;					
					if (!plugin.isAllowedFileSize(btn, fileEl.dom)) {
						btn.fireEvent('filesizeexceed', btn, v, fileEl);
						return;
					}

					btn.fireEvent('fileselected', btn, v, fileEl);

					if (btn.chooseFileConfig.createNewInput) {
						this.createFileInput(btn).bindListeners();
					}
				}
			});
		}
	}
};