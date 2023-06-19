var Ajax = function () {
  return {
    xhr: new XMLHttpRequest(),
    request: function (method, url, data, successCallback, errorCallback) {
      console.log(method, url, data);
      this.xhr.open(method, url, true);
      this.xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      var that = this;
      this.xhr.onload = function () {
        if (that.xhr.status >= 200 && that.xhr.status < 400) {
          var response = JSON.parse(that.xhr.responseText);
          if (typeof successCallback === "function") {
            successCallback(response);
          }
        } else {
          if (typeof errorCallback === "function") {
            errorCallback(that.xhr.status);
          }
        }
      };

      this.xhr.onerror = function () {
        if (typeof errorCallback === "function") {
          errorCallback(that.xhr.status);
        }
      };

      if (data) {
        this.xhr.send(JSON.stringify(data));
      } else {
        this.xhr.send();
      }
    },
    abort: function () {
      if (
        this.xhr &&
        this.xhr.readyState !== XMLHttpRequest.UNSENT &&
        this.xhr.readyState !== XMLHttpRequest.DONE
      ) {
        this.xhr.abort();
      }
    },
  };
};
