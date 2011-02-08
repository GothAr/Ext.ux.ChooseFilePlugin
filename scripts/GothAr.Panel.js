Ext.ns('GothAr');

GothAr.Panel = Ext.extend(Ext.Panel, {
    initComponent: function () {
        Ext.apply(this,{
			title: 'Sapmle Panel',
			tbar: {
				items:[{
					text: 'Choose file',
					icon: 'images/add.png',
					
					plugins: Ext.ux.ChooseFilePlugin({
						maxFileSize: 20 * 1024 * 1024,
						createNewInput: false,
						OnFileSelected: function(but, name, el){
							console.info('File '+name+' selected');
						},
						FileSizeExceeded: function(but, name, el){
							console.warn('File '+name+' size exceeded');
						}
					})
				}]
			},
			items:[{
				xtype:'panel',
				html: 'Sample example of ChooseFilePlugin usage in toolbar and simple button'
			},{
				xtype: 'button',
				text: 'Choose file',
				icon: 'images/add.png',
					
				plugins: Ext.ux.ChooseFilePlugin({
					createNewInput: false,
					OnFileSelected: function(but, name, el){
						console.info('From Button. File '+name+' selected');
					},
					FileSizeExceeded: function(but, name, el){
						console.warn('From Button. File '+name+' size exceeded');
					}
				})
			}]
        });
		
        GothAr.Panel.superclass.initComponent.apply(this, arguments);
    }
});