// Use class 'enabled' to force enable an input field or class 'disabled' to disable data collection on a field
//var serverUrl = "http://localhost:3002/track/"; // put the address of your server script here
//var key = null;
var cf_tracker = cf_tracker || [];
var funnel_stat = 0;
if(typeof ecookie === 'undefined'){
  var ecookie = false;
}
cf_tracker.push = function(a)
{
    if(funnel_state === undefined){
      funnel_stat = 0
    }

    action = a[0]
    data1 = a[1]
    data2 = a[2]
    var perform = null;
    push = true;
    action=='record' ? perform = action : null ;
    action=='set' ? perform = action : null ;
    action=='identify' ? perform = action : null ;
    action=='alias' ? perform = action : null ;
    if (perform)
    {
        var location = window.location;
        var referrer = document.referrer;
        var url = serverUrl + '?_unique='+Math.random();
        url += '&_uniqueVisitorID='+cfUniqueVisitorID;
        url += '&_action='+perform;
        url += '&_data1='+formatObject(data1);
        url += '&_data2='+formatObject(data2);
        url += '&_key='+cf_key;
        url += '&_page_key='+page_key;
        url += '&_fid='+fid;
        url += '&_fspos='+fspos;
        url += '&_fvrs='+fvrs;
        url += '&_funnel_stat='+funnel_stat;
        url += '&_location='+location;
        url += '&_referrer='+referrer;
        if(url_params['affiliate_id']){
          url += '&affiliate_id='+url_params['affiliate_id'];
        }
        if(url_params['aff_sub']){
          url += '&aff_sub='+url_params['aff_sub'];
        }
        if(url_params['aff_sub2']){
          url += '&aff_sub2='+url_params['aff_sub2'];
        }
        
        if(action=="identify"){
          url += '&email='+formatObject(data1);
        }
        
        cfUniqueVisitorID = readCookie('cf_uvid');
        sender = document.createElement('script');
        sender.src = url;
        replied = false;
        //sender.onload = function(){if(!replied){answered(instance, attached);}}; // ??? TODO: Fix instance missing - preventing more then 1 record action per page load
        sender.onreadystatechange = function(){if(!replied){(this.readyState=='complete'||this.readyState=='loaded') ? answered(instance, attached) : null; }};
        document.body!=null?document.body.appendChild(sender):postpone();

        return true;
    }

    return false;
}

if(!Array.indexOf)
{
   Array.prototype.indexOf = function(obj)
   {
      for(var i=0; i<this.length; i++)
      {
         if(this[i]==obj)
         {
            return i;
         }
      }
      return -1;
   };
}

var loadScript = function(src, callbackfn) {
    var newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.setAttribute("async", "true");
    newScript.setAttribute("src", src);

    if(newScript.readyState) {
        newScript.onreadystatechange = function() {
            if(/loaded|complete/.test(newScript.readyState)) callbackfn();
        }
    } else {
        newScript.addEventListener("load", callbackfn, false);
    }

    document.documentElement.firstChild.appendChild(newScript);
}


function jQueryCheck() {
    return window.jQuery && jQuery.fn && /^1\.[3-9]/.test(jQuery.fn.jquery);
}

function createCookie(name, value, days, ecookie) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";

    if(ecookie){
      if(jQueryCheck != true){
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js", function() {});
      }
      if (typeof swfobject == "undefined") {
        loadScript("swfobject-2.2.min.js", function() {  });
      }
      loadScript("evercookie.js", function() { 
        var ec = new evercookie();
        ec.set(name, value);
      });

    }
}

function readCookie(name, ecookie) {
    if(ecookie){
      if(jQueryCheck != true){
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js", function() {});
      }
      if (typeof swfobject == "undefined") {
        loadScript("swfobject-2.2.min.js", function() {  });
      }
      loadScript("evercookie.js", function() { 
        var ec = new evercookie();
        ec.get(name, function(value) { alert("Cookie value is " + value) });
      });

    }

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function formatObject(object)
{
  if (typeof(object) == "object")
  {
    var output = '{';
    for (property in object)
    {
      output += '"'+property + '":"' + object[property]+'",';
    }
    return output.substring(0, output.length-1)+'}';
  }
  return object;
}
function getFormData(formElement)
{
   var params = '';
   var jsonObject = {};
    // TODO: Don't include utf8 = ✓ or other issues w/ rails/thin server
   for(i=0; i < formElement.elements.length; i++)
   {
      var current = formElement.elements[i];
      sub_name = current.name.replace("_","");
      sub_name = sub_name.replace("\\","");
      sub_name = sub_name.replace("-","");
      if ( (sub_name.match(/utf|pass|billing|creditcard|cardnum|^cc|ccnum|exp|seccode|securitycode|securitynum|cvc|cvv|ssn|socialsec|socsec|csc/i) == null) && (current.type.toLowerCase() != 'hidden') && (current.type.toLowerCase() != 'password') ){

        if (current.nodeName.toLowerCase() == 'input' && current.type.toLowerCase() != 'submit' && current.type.toLowerCase() != 'password' && filteredMatch(current) != true)
        {
          if (current.type.toLowerCase() == 'radio' || current.type.toLowerCase() == 'checkbox')
          {
          
            current.checked ? params += current.name + '=' + current.value + '&' : null ;
            current.checked ? eval('jsonObject[\''+current.name+'\']="'+current.value+'";') : null ;
          }
          else
          {
            //alert('jsonObject[\''+current.name+'\']="'+current.value+'";');
            params += current.name + '=' + filtered_string(current.value) + '&';
            if(current.type == 'email'){
              params += 'email_type=' + filtered_string(current.value) + '&';
            }
            eval('jsonObject[\''+current.name+'\']="'+filtered_string(current.value)+'";');
          }
        }
      }
   }
   return formatObject(jsonObject);
}

function filteredMatch(current){
  // if enabled flagged && and it's not a credit card number 
  if (current.className == "enabled" && current.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/i) == null){
    return false;
  }else{
    if(current.type.toLowerCase() == 'submit' || current.type.toLowerCase() == 'password' || current.className == "disabled" || current.className.match(/acskip/i) != null || current.name.match(/cc/i) != null || current.name.match(/credit/) != null){
      return true;
    }
  }
  return false;
}

function changeText(id, text)
{
 elem = document.getElementById(id);
 elem.innerHTML = text;
}

var replied = false;
var sender = null;
var cfUniqueVisitorID;
function cfSetUniqueVisitorID(visitorID)
{
  if(visitorID != undefined && visitorID != ''){
    cfUniqueVisitorID = visitorID;
    createCookie('cf_uvid', cfUniqueVisitorID, 100);
  }
}
function SendData(instance, attached)
{
     //alert("Send Data "+instance + " attached: "+attached);
     var attached = String(attached);
     attached = attached.substring(attached.indexOf('{')+1, attached.length-1);
     if (attached.indexOf('return')!=-1)
     {
        var returnStart = attached.indexOf('return');
        var sub = attached.substring(returnStart+1);
        var returnEnd = returnStart+2+sub.indexOf(';');
        attached = attached.substring(0, returnStart) + attached.substring(returnEnd, attached.length);
     }


     cfUniqueVisitorID = readCookie('cf_uvid',ecookie);
     instance = document.getElementById(instance)==null? instance : document.getElementById(instance) ;
     var id = instance.id;
     var name = instance.name;
     var href = instance.href;
     var type = (instance==window?'WINDOW':instance.nodeName);
     var location = window.location;
     var referrer = document.referrer;
     var url = serverUrl + '?_unique='+Math.random();

     if(type == "FORM"){
      if(instance.attributes["name"] !== undefined){
        var name = instance.attributes["name"].nodeValue;
      }else{
        var name = "Unnamed";
      }
      //alert(name);
     }
     
     root_url = url;

     url = '&_uniqueVisitorID='+cfUniqueVisitorID;
     if(id){url+='&_id='+id;}
     if(name){url+='&_name='+name;}
     if(type){url+='&_type='+type;}
     if(href){url+='&_href='+href;}
     if(location){url+='&_location='+String(escape(location)).substring(1);}
     if(referrer&&type=='WINDOW'){url+='&_referrer='+String(escape(referrer)).substring(1);}
     if(type=='WINDOW'){url+='&_title='+String(encodeURIComponent(document.title));}
    
     if (!navigator.cookieEnabled){url+='&_cookiesDisabled=1';}
     if (instance.nodeName != undefined){
       if (instance.nodeName.toLowerCase() == 'form'){url+='&_formData='+escape(getFormData(instance));}
     }
     url += '&_key='+cf_key;
     url += '&_page_key='+page_key;
     url += '&_fid='+fid;
     url += '&_fspos='+fspos;
     url += '&_fvrs='+fvrs;
     url += '&_funnel_stat='+funnel_stat;
     url += '&_location='+location;
      url += '&_referrer='+referrer;
      if(url_params['affiliate_id']){
        url += '&affiliate_id='+url_params['affiliate_id'];
      }
      if(url_params['aff_sub']){
        url += '&aff_sub='+url_params['aff_sub'];
      }
      if(url_params['aff_sub2']){
        url += '&aff_sub2='+url_params['aff_sub2'];
      }
      

     //alert("SEND DATA URL: "+url);
     
     // Use AJAX sending
     replied = false;
     var request =  get_XmlHttp();    // call the function for the XMLHttpRequest instance
    request.onreadystatechange = function(){
      //alert("checkresponse");
      checkresponse(instance, attached, request, true);
      //alert("checked response");
    };
    request.open("GET", root_url + url, true);
    request.send(null);

    wait(instance);


     //alert(request.responseText);
     // Check request status
    // If the response is received completely
    //alert(request.readyState + " replied?: "+replied);
    
    
    

    //sender = document.createElement('script');
     //sender.type= 'text/javascript';
     //sender.src = root_url + url;
     //replied = false;
     //alert("sender: "+sender);
     //sender.onload = function(){if(!replied){answered(instance, attached);}};
     //sender.onreadystatechange = function(){if(!replied){(this.readyState=='complete'||this.readyState=='loaded') ? answered(instance, attached) : null; }};
     //alert("doc.body "+document.body);
     //document.body!=null?document.body.appendChild(sender):postpone();
     //
}

function wait(instance){
  if (!replied){
    //console.log("waiting 100");
    setTimeout(wait,100);
    sleep(100);
  } else {
    replied = false;
  }
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function checkresponse(instance, attached, request, postpone){
  //alert("checkresponse");
  now = false;
  timeout=0;
  // don't wait for response if link or form
  if(instance.href){now=true;timeout=500;}else if(instance.action){ now = true; timeout=500;}
  setTimeout(
    function(){
      if(!replied){(request.readyState==4||(now==true && request.readyState>0)) ? answered(instance, attached, request) : postpone?setTimeout(function(){checkresponse(instance, attached, request)}, 500):null; }
    },timeout);
}

//attached != 'undefine' && attached != 'nul' && attached !== undefined && 
function answered(instance, attached, request){
  replied=true;
  if(attached != 'undefine' && attached != 'nul' && attached !== undefined && attached){eval(attached);}

  if(request != 'undefine' && request != 'nul' && request !== undefined && request){eval(request.responseText);}
  
  if(instance.href){window.location=instance.href;}else if(instance.action && instance.push == undefined){ 
    // try{
    //   //TODO: Fix stripping on submit value from submit button clicked
    //   try{
    //     console.log("attempting form.submit.apply method")
    //     var form = document.createElement("form");
    //     form.submit.apply(instance);
    //   }catch(err){
    //     console.log("attempting instance.submit method")
    //     instance.submit();
    //   }
    // }catch(err){
    //   try{
    //     HTMLFormElement.prototype.submit.call($('#'+instance.id)[0]);
    //   }catch(err){
    //     console.log("prototype.submit.call failure");
    //     console.log(err);
    //   }
    //   console.log(err);
    // }
    
    //alert("waittt");
  }

}

function postpone(){if(document.body!=null){document.body.appendChild(sender);}else{setTimeout('postpone()', 500);}
}


var formSubmitFunctions = {};
function formAttach()
{
        var forms = document.getElementsByTagName('form');
        var counter;
        //alert("forms "+forms);
        for (counter=0; counter<forms.length; counter++)
        {
          //alert(forms[counter]); #don't track acskip class or forms direct to self/clickfunnels.com
          if((forms[counter].className != "acskip") && (forms[counter].action != window.location) && (forms[counter].action.indexOf("clickfunnels.com") == -1) && (forms[counter].action.indexOf("/members") == -1)){
            if (!forms[counter].id)
            {
                forms[counter].id = 'acform'+counter;
            }

            f = document.getElementById(forms[counter].id);
            eval('formSubmitFunctions["'+forms[counter].id+'"] = function(){SendData("'+forms[counter].id+'", '+forms[counter].onsubmit+');return false;};');
            
            //eval('formSubmitFunctions.'+forms[counter].id+' = function(){ SendData("'+forms[counter].id+'", '+forms[counter].onsubmit+'); return true;};');
            
            //forms[counter].onsubmit = eval('formSubmitFunctions["'+forms[counter].id+'"];');
            // TODO: Test this against above line
            //alert("addevent" + forms[counter].id);
            addEvent(forms[counter], 'submit', function() {
              if(typeof(forms[counter]) != "undefined"){
                console.log("sending data - counter: " + counter + " - forms: " + document.getElementsByTagName('form') + " - id: " + document.getElementsByTagName('form')[counter].id);
                SendData(forms[counter].id, forms[counter].onsubmit);
                console.log("sent data");
                return true;
              }
            });            
            // TODO FIX to only use addEvent - make work w/ scripts that should be stopping form submission like validates jquery
            for (var i=0;i<forms[counter].elements.length;i++){
              if(forms[counter].elements[i].type == 'submit'){
                addEvent(forms[counter].elements[i],'click',function(){
                  this.form.submited = this.value;
                });
              }
            }
          }
        }
}




// http://www.scottandrew.com/weblog/articles/cbs-events
function addEvent(obj, evType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evType, fn, false);
        return true;
    } else if (obj.attachEvent) {
        var r = obj.attachEvent("on" + evType, fn);
        return r;
    } else {
        obj.onclick = function () {
          if(obj.target != undefined){
            var link = obj.target;
          }else{
            var link = obj.srcElement;
          }
          SendData(link);
        }
    }
}

function filtered_string(s){
  regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$./;
  return s.replace(regex,"FILTERED_CC");
}

// Set URL params into variable
var url_params = {};
if (location.search) {
    var parts = location.search.substring(1).split('&');

    for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        url_params[nv[0]] = nv[1] || true;
    }
}


function cf_load(){
  formAttach();
  // set cf uvid if passed by param
  if(url_params.cf_uvid != undefined){
    cfSetUniqueVisitorID(url_params.cf_uvid);
  }
  if(readCookie(page_key) == 'true' || readCookie(fid.toString()+'_viewed_'+(fspos).toString()) == fvrs.toString()){
    // already cookied for page key or funnel_step (prevent dup recording w/ split tests)
  }else{
    if(typeof(fid) != 'undefined'){
      if(readCookie(fid.toString()+'_viewed_'+(fspos-1).toString()) == fvrs.toString() && readCookie(fid.toString()+'_viewed_1') != null && readCookie(fid.toString()+'_viewed_1').toString() == fvrs.toString() ){
        // viewed previous funnel step && funnel version
        funnel_stat = 1
      }
      if(fspos.toString() == "1"){
        // (or first fspos)
        funnel_stat = 1
      }
      SendData(this);
    }
  }
  
};

if (window.attachEvent){
  window.attachEvent('onload', cf_load);
}else{
  window.addEventListener('load', cf_load, false);
}


// create the XMLHttpRequest object, according browser
function get_XmlHttp() {
  // create the variable that will contain the instance of the XMLHttpRequest object (initially with null value)
  var xmlHttp = null;

  if(window.XMLHttpRequest) {   // for Forefox, IE7+, Opera, Safari, ...
    xmlHttp = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) { // for Internet Explorer 5 or 6
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  return xmlHttp;
}

// process queued commands
for (var i = 0; i < cf_tracker.length; i++) {
  cf_tracker.push(cf_tracker[i]);
}
