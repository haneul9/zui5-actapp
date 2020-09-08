// URL 파라미터 가지고 오기
function getQuerystring(paramName){
	var _tempUrl = window.location.search.substring(1); //url에서 처음부터 '?'까지 삭제 
	var _tempArray = _tempUrl.split('&'); // '&'을 기준으로 분리하기 
	for(var i=0; i<_tempArray.length; i++) { 
		if(_tempArray[i] && _tempArray[i] != undefined) {
			var _keyValuePair = _tempArray[i].split('='); // '=' 을 기준으로 분리하기 
			if(_keyValuePair[0] == paramName){ // _keyValuePair[0] : 파라미터 명 
				// _keyValuePair[1] : 파라미터 값 
				return _keyValuePair[1] ? _keyValuePair[1] : false; 
			}
		} else {
			return false;
		}
	}
}