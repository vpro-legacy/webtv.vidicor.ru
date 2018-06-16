
//
// RMXF viewer constructor method
// Usage:
//   var viewer = new RMXFViewer("UrlToConnect", tagToInsertViewerInto [ ,
//                               ParameterPair1 [ , ParameterPair2, ...]]);
//
function RMXFViewer(url, tag)
{
  if (url == null) return null;
  if (tag == null) return null;
  rmxfViewers[rmxfViewers.length] = this;

  this.SetSize = RMXFViewer_SetSize;
  this.Destroy = RMXFViewer_Destroy;

  var rawurl = url;
  var proto;
  var pi = rawurl.indexOf("://");
  if (pi >= 0)
  {
    proto = rawurl.substring(0, pi);
    rawurl = rawurl.substring(pi + 3);
  }

  var pp  = rawurl.indexOf("?");
  var pp2 = rawurl.indexOf("#");
  if (pp2 >= 0)
  {
    if (pp < 0)
      pp = pp2;
    else
    if (pp > pp2)
      pp = pp2;
  }
  var si = rawurl.indexOf("/");
  if (pp >= 0)
  {
    if (si < 0)
      si = pp;
    else
    if (si > pp)
      si = pp;
  }

  var host = (si < 0) ? rawurl : rawurl.substring(0, si);
  var uri  = (si < 0) ? ""  : rawurl.substring(si);

  this.rmxfhost = host;
  this.rmxfuri  = uri ;
  this.rmxfurl = url;
  this.rmxftag = tag;
  this.rmxfidx = rmxfViewers.length - 1;
  this.rmxfobj = null;
  this.rmxftag.rmxfviewer = this;
  this.reqW = 360;
  this.reqH = 288;

  this.rmxfprm = new Array;
  for (var i = 2; i < arguments.length; i++)
  {
    this.rmxfprm[this.rmxfprm.length] = arguments[i];
    var s = arguments[i].split("=", 2);
    if (s.length == 2)
    {
      var n = s[0];
      var v = s[1];
      if (n == "width" ) this.reqW = v;
      else
      if (n == "Width" ) this.reqW = v;
      else
      if (n == "WIDTH" ) this.reqW = v;
      else
      if (n == "height") this.reqH = v;
      else
      if (n == "Height") this.reqH = v;
      else
      if (n == "HEIGHT") this.reqH = v;
    }
  }
  if (window.navigator.userAgent.indexOf("MSIE") != -1)
  {
    this.rmxftag.innerHTML =
      "<IFRAME" +
      "  frameborder=no border=0 scrolling=no" +
      "  width=" + this.reqW + " height=" + (parseInt(this.reqH) + 25) +
      "  src='rmxfrecv.html#" + this.rmxfidx + "/" + this.rmxfhost + "'>" +
      "</IFRAME>";
  }
  else
  {
    var instText1 = "If you do not see video/sound then you must install ";
    var instText2 = "Vidicor Watcher";
    var instText3 = "Click this link and run the file then follow his instructions.";
    var instText4 = "Press F5 since installation complete.";
    var instText5 = "Attention! This page requires additional component to work.\n" +
                    "Press OK and follow component installation instructions.";
    if (lang == 'ru')
    {
      instText1 = "Если вы не видите видео и не слышите звука, то вам необходимо установить ";
      instText2 = "приложение просмотра Vidicor";
      instText3 = "Нажмите на эту ссылку, запустите файл и следуйте его инструкциям.";
      instText4 = "После завершения установки нажмите F5.";
      instText5 = "Внимание! Эта страница требует для работы установки дополнительного приложения.\n" +
                  "Нажмите OK и следуйте появившимся инструкциям по установке приложения.";
    }
    this.rmxftag.innerHTML = "<SPAN id=instructions></SPAN>" +
                             "<TABLE width=" + this.reqW + " height=" + this.reqH +
                             " border=0 cellpadding=0 cellspacing=0>" +
                             "<TR><TD align=center valign=middle>" +
                             "<FONT color=#D00000>" + instText1 + "<BR><A href='http://" +
                             this.rmxfhost +
                             "/watcher_setup.exe'>" + instText2 + "</A></FONT><BR>" +
                             "<LI>" + instText3 +
                             "<LI>" + instText4 +
                             "</TD></TR></TABLE>";
    instructions.scrollIntoView(true);
    location.href = this.rmxfurl;
//    alert(instText5);
  }
}

//
// RMXF viewer video size method
// Usage:
//   viewer.SetSize(360, 288);
// or
//   viewer.SetSize("360x288");
//
function RMXFViewer_SetSize()
{
  var instText1 = "You must install ";
  var instText2 = "Vidicor View Component";
  var instText3 = "Click this link and run the file then follow his instructions.";
  var instText4 = "Press F5 since installation complete.";
  var instText5 = "Attention! This page requires additional component to work.\n" +
                  "Press OK and follow component installation instructions.";
  if (lang == 'ru')
  {
    instText1 = "Вам необходимо установить ";
    instText2 = "компонент просмотра Vidicor";
    instText3 = "Нажмите на эту ссылку, запустите файл и следуйте его инструкциям.";
    instText4 = "После завершения установки нажмите F5.";
    instText5 = "Внимание! Эта страница требует для работы установки дополнительного компонента.\n" +
                "Нажмите OK и следуйте появившимся инструкциям по установке компонента.";
  }

  var w = -1;
  var h = -1;
  if (arguments.length == 2)
  {
    w = parseInt(arguments[0]);
    h = parseInt(arguments[1]);
  }
  else
  if (arguments.length == 1)
  {
    var str = new String(arguments[0]);
    var xi = str.indexOf('x', 0);
    if (xi < 0) xi = str.indexOf('X', 0);
    if (xi < 0) xi = str.indexOf('*', 0);
    if (xi >= 0)
    {
      w = parseInt(str.substring(0, xi));
      h = parseInt(str.substring(xi + 1));
    }
  }
  else
  if (arguments.length == 0)
  {
    w = this.reqW;
    h = this.reqH;
  }
  if ((w >= 0) && (h >= 0))
  {
    this.reqW = w;
    this.reqH = h;
    if ((this.rmxfobj != null) &&
        (this.rmxfobj.readyState >= 4))
    {
      if (this.rmxfobj.URL != null)
        window.setTimeout('RMXFCallSetVideoSize(' + this.rmxfidx + ', ' + w + ', ' + h + ')', 10);
      else
      {
        this.rmxftag.innerHTML = "<SPAN id=instructions></SPAN><TABLE" +
                                 " width=" + this.reqW +
                                 " height=" + this.reqH +
                                 " border=0 cellpadding=0 cellspacing=0>" +
                                 "<TR><TD align=center valign=middle>" +
                                 "<FONT color=#D00000>" + instText1 + 
                                 "<BR><A href='http://" + this.rmxfhost +
                                 "/activex_setup.exe'>" + instText2 + 
                                 "</A></FONT><BR>" +
                                 "<LI>" + instText3 +
                                 "<LI>" + instText4 +
                                 "</TD></TR></TABLE>";
        instructions.scrollIntoView(true);
        alert(instText5);
      }
    }
  }
}

//
// RMXF viewer destroying method
// Usage:
//   viewer.Destroy();
//
function RMXFViewer_Destroy()
{
  rmxfViewers[this.rmxfidx] = null;
  this.rmxfobj = null;
  if (this.rmxftag != null)
  {
    this.rmxftag.innerHTML = "";
    this.rmxftag.rmxfviewer = null;
  }
  this.rmxftag = null;
}

//
// Destroy all constructed viewers
// Usage:
//   DestroyAllViewers();
//
function DestroyAllViewers()
{
  if (rmxfViewers != null)
    for (var i = 0; i < rmxfViewers.length; i++)
      if (rmxfViewers[i] != null)
        rmxfViewers[i].Destroy();
  rmxfViewers = null;
}

//
// Internal function. DO NOT CALL IT !!!
//
function RMXFCallSetVideoSize(idx, w, h)
{
  var va = rmxfViewers;
  if (va == null) return;
  if (idx < 0) return;
  if (idx >= va.length) return;
  var vw = va[idx];
  if (vw == null) return;
  var vo = vw.rmxfobj;
  if (vo == null) return;
  vo.setVideoSize(w, h);
}

//
// Internal function. DO NOT CALL IT !!!
//
function RMXFTagCallback(rmxfHash, tagProc)
{
  var s = unescape(rmxfHash).split("/", 2)
  var rmxfIdx = parseInt(s[0]);
  eval(unescape(tagProc));
  RMXF_TagProc(rmxfViewers[rmxfIdx]);
}

//
// RMXF viewers internal array. DO NOT USE IT!!!
//
var rmxfViewers = new Array();

//
// Language
//
var lang = '';
if (navigator.userLanguage != null)
  lang = navigator.userLanguage.toLowerCase().substr(0, 2);


