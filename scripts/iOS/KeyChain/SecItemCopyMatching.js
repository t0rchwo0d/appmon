'use strict';
Interceptor.attach(Module.findExportByName('Security', 'SecItemCopyMatching'), {
  onEnter: function(args) {
    var dict = new ObjC.Object(args[0]);
    var enumerator = dict.keyEnumerator();
    var data = {};
    var key;
    while ((key = enumerator.nextObject()) !== null) {
      var value = dict.objectForKey_(key);
      data[key.toString()] = value.toString();
    }
    this.result = args[1];
    this.query = data;
  },

  onLeave: function(retval) {
    var strSecItemCopyMatchingBlob = {};
    var result = this.result;
    var query = this.query;
    result = Memory.readPointer(result);
    result = new ObjC.Object(result);
    try {
      result = Memory.readUtf8String(result.bytes(), result.length());
    } catch (e) {
      result = Memory.readByteArray(result.bytes(), result.length());
    }
    
    strSecItemCopyMatchingBlob['query'] = query;
    strSecItemCopyMatchingBlob['result'] = result;

    /*   --- Payload Header --- */
    var send_data = {};
    send_data.time = new Date();
    send_data.txnType = 'KeyChain';
    send_data.lib = 'Security';
    send_data.method = 'SecItemCopyMatching';
    send_data.artifact = [];

    /*   --- Payload Body --- */
    var data = {};
    data.name = "Keychain-Query";
    data.value = strSecItemCopyMatchingBlob;
    data.argSeq = 1;
    send_data.artifact.push(data);
    // console.log(JSON.stringify(send_data));
    send(JSON.stringify(send_data));
  }
});