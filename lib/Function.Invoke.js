Function.prototype.invoke = (function(){
	var me,
		showErrorMessage,
        errorHandler,
        args,
		invokeCall = function (onError, scope) {
			var args = [].slice.call(arguments, 2, arguments.length),
				toReturn;    
			scope = scope || null;    
			onError = onError || function () { };
			try {
				toReturn = me.apply(scope, args);
			}
			catch (err) {
				onError.call(scope, {
					'func': me.toString(),
					'scope': scope,
					'arguments': args,
					'message': err
				});
			}
			return toReturn;
        };
      
	return function (handleError, scope) {
		me = this;
		args = [].slice.call(arguments, 2, arguments.length);
		scope = scope || null;
		if (typeof handleError !== "function") {
			showErrorMessage = handleError.showMessage || alert;
			errorHandler = handleError.fn || function errorHandler(error) {
				if (typeof console !== "undefined") {
					console.log(error);
				}
				else {
					showErrorMessage(error.message);
				}
			};
		}
		args.splice(0, 0, scope);
		args.splice(0, 0, errorHandler);
		return invokeCall.apply(this, args);
	};
}());

Function.prototype.profile = function (reportProfile, totalCount, reportIterations, scope) {
    var startTime, endTime,
        args = [].slice.call(arguments, 3, arguments.length),
		toReturn, i = 0, profileData = [], profileItem, isEnd;
		
	totalCount = totalCount || 1;
	reportIterations = reportIterations || false;

    reportProfile = reportProfile || function () { };
    scope = scope || null;
	
	for (;i<totalCount;i+=1){
		startTime = new Date();
		toReturn = this.apply(this, args);
		endTime = new Date();
		
		isEnd = !(totalCount - i - 1);
		afterProfile = (!reportIterations && !isEnd) ? function(){} : reportProfile;
		
		profileItem = {
			'startTime': startTime,
			'endTime': endTime,
			'runTime': (+endTime) - (+startTime),

			'function': this.name,
			'body': this.toString(),
			'result': toReturn,
			'scope': scope,
			'arguments': args
		};
		
		profileData.push(profileItem);

		afterProfile.call(scope, isEnd && totalCount > 1 ? profileData : profileItem, !isEnd ? 'continue' : 'end');
	}
	
	return toReturn;
};