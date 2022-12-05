$(document).ready(function() {
    PhoneData = new Object();
    
    PhoneData = {
        Number : null,
        IsOpened : false,
        CurrentApp : null,
        Loaded : null,
        Cid : null,
        InCall : null,
        Silence : null,
        VPN : false
    };
    var locked = false;

    var drawer = false
    var messagesacik = false
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    var citizenName = 'Leal Shaw';
    function unlock () {
        locked = false;
    }
    $(document).ready(function() {
        setInterval(function() {
            var d = new Date();
    
            var time = $('.time-stratch');
            var saat = d.getHours();
            var dakika = d.getMinutes();
            if (dakika <= 9) {
                dakika = `0${dakika}`;
            }
            if (saat <= 9) {
                saat = `0${saat}`;
            }
            time.text(`${saat}:${dakika}`);
            if ($('.top-notifications-wrapper-mounted').children().length > 0) {
                $('.top-notifications-wrapper-mounted').css('display', 'flex')
            } else{
                $('.top-notifications-wrapper-mounted').css('display', 'none');
            }
        }, 100)
        let coque = localStorage.getItem('coque');
        if(coque == null){
            localStorage.setItem('coque', "android");
        }
    })
    
    $(document).ready(function() {
        window.addEventListener("message", function (event) {
            let data = event.data;
            switch (data.type) {
                case 'open':
                    $("#main-app-container").css("display", "block");
                    PhoneData.IsOpened = true;
                    if (!PhoneData.Loaded) {
                        LoadPhone(data);
                    }
                    break;
                case 'removeincoming':
                    $(".top-notifications-wrapper-mounted").empty(); // makes it so phone keeps poping up like in a call
                    PhoneData.InCall = false
                    break;
                case 'close':
                    $(".jss1254").css('animation', '500ms ease 0s 1 normal none running usttenalta');
                    $(".jss1255").css('animation', '500ms ease 0s 1 normal none running usttenalta');
                    $(".jss13").css('animation', '500ms ease 0s 1 normal none running usttenalta');
                    setTimeout(function() {
                        $("#main-app-container").css("display", "none");
                        $(".jss1254").css('animation', '500ms ease 0s 1 normal none running alttanuste');
                        $(".jss1255").css('animation', '500ms ease 0s 1 normal none running alttanuste');
                        $(".jss13").css('animation', '500ms ease 0s 1 normal none running alttanuste');
                    }, 500);
                    break;
                case 'incomingcall':
                    if($('.arama-notify-check').length <= 1){
                        incomingCall(data);
                    }
                    break;
                case 'updateTweets':
                    updateTweets();
                    break;
                case 'updateAdverts':
                    updateAdverts();
                    break;
                case 'incall':
                    acceptcall(data);
                    break;
                case 'endcall':
                    endcall();
                    break;
                case 'addignored':
                    addignored(data);
                    break;
                case 'vpn':
                    if (data.status) {
                        OpenVPN();
                    } else {
                        CloseVPN();
                    }
                    break;
                case 'changeCoque':
                    if(data.coque == "ios"){
                        $("#android").hide();
                        $("#ios").show();
                        localStorage.setItem('coque', "ios")
                    } else {
                        localStorage.setItem('coque', "ios");
                        $("#ios").hide();
                        $("#android").show();
                    }
                    break;
                case 'updatemails':
                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-envelope fa-w-16 fa-1x"><path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" class=""></path></svg>`,
                    "e-Mails", `Subject: ${data.subject}`, `From: ${data.sender}`, "linear-gradient(0deg, rgba(158,219,228,1) 0%, rgba(85,144,229,1) 100%)")
                    break;
                case 'notification':
                    if(data.attachment){ 
                    //    console.log("Picture Shown")
                        createNotifyPictureAction(data.svg, data.title, data.message, `From: ${data.sender}`, "linear-gradient(0deg, rgba(158,219,228,1) 0%, rgba(85,144,229,1) 100%)", data.attachment)
                    } else {
                        if(data.svg){
                            createNotifyAction(data.svg, data.title, data.message, `From: ${data.sender}`, "linear-gradient(0deg, rgba(158,219,228,1) 0%, rgba(85,144,229,1) 100%)")
                        } else {
                            createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                            60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                            464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>`, 
                            data.title, data.message, `From: ${data.sender}`, "linear-gradient(0deg, rgba(158,219,228,1) 0%, rgba(85,144,229,1) 100%)")
                        }
                    }
                    break;
            }
    
            if (event.data.type === 'messageslog') {
                $('#listealmessage').prepend(createMessage(event.data.number, event.data.sonmsj, event.data.name, event.data.time));
                $("#"+event.data.number+"").click(function () {
                    messagesacik = 1
                    $("#messages-container").hide();
                    $("#messages-second-container").show();
                    $("#numbermessagesinner").html(event.data.name)
                    $("#numbermessagesinner").attr("data-number", event.data.number)
                    $.post('http://dev-phone/loadcontactmessages', JSON.stringify({
                        number: this.id
                    }));
                });
            }
        
            if (event.data.type === 'showmessages') {
                var date = new Date(event.data.time);
                var timer = moment(date).fromNow();
                if (event.data.gonderenumber === event.data.menumbermynumber) {
                    html1 = `
                    <li class="message message-out">
                        <div class="inner inner-out"> 
                            <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">`+ event.data.message +`</p> 
                        </div> 
        
                        <div class="timestamp timestamp-in">
                            <p class="MuiTypography-root timestamp MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${timer}</p> 
                        </div>
                    </li>
                    `
                    $(".messages").prepend(html1)
                } else {
                    html2 = `
                    <li class="message message-in">
                        <div class="inner inner-in"> 
                            <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">`+ event.data.message +`</p> 
                        </div> 
        
                        <div class="timestamp timestamp-in">
                            <p class="MuiTypography-root timestamp MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${timer}</p> 
                        </div>
                    </li>
                    `
                    $(".messages").prepend(html2)
                }
        
            }
        
            if (event.data.type === 'clearmessages') {
                $(".messages").html("")
            }
    
            if (event.data.type === 'msgclear') {
                $("#listealmessage").empty()
                $("#nothingmsg").css('display', 'none');
            }
        });
    })
    
    
    
    function LoadPhone(data){
        PhoneData.Loaded = true;
        PhoneData.Number = data.phonenumber;
        PhoneData.Cid = data.id;
        $("#playerserverid").html("#"+data.id);
        if (data.applications.TaxiApp.enable){
            $("#abdu").attr("title", data.applications.TaxiApp.name)
            $("#abdu").css('background', 'url(images/phone-icons/'+data.applications.TaxiApp.icon)
            $(".abdultaxi-driverslist img").attr('src', data.applications.TaxiApp.screenLogo)
        }
        if (!data.applications.ShowNotAvailableApps.enable){
            for (let i = 0; i < data.applications.ShowNotAvailableApps.apps.length; i++) {
                $("#"+data.applications.ShowNotAvailableApps.apps[i]).remove()
            }
        }
        updateAdverts();
        updateTweets();
    }
    var htmlcalls = "";
    function addignored(data){
        createCalls()
        // var phone = data.number;
        // htmlcalls +=
        //     `<div class="component-paper arama-div arama-count">
        //     <div class="main-container">
        //        <div class="image">
        //           <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" class="svg-inline--fa fa-phone-alt fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        //              <path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z">
        //              </path>
        //           </svg>
        //        </div>
        //        <div class="details ">
        //           <div class="title ">
        //              <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${phone}</p>
        //           </div>
        //           <div class="description ">
        //              <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">just now</p>
        //           </div>
        //        </div>
        //     </div>
        //  </div>`
        // $('.jss17911').prepend(htmlcalls);
    }
    
    function OpenVPN(){
        CloseVPN();
        PhoneData.VPN = true;
        var html = $(`
        <div class="jss1875 jss1880 anon-ping">
        <div class="fa hacker" style="font-size:1.8em;margin-left: 4%"">&#xf21b;</div>
        <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
           style="word-break: break-word;margin-left: 4%">Anon Ping</h6>
        </div>
        `);
        html.insertAfter(".send-ping");
        $('.anon-ping').click(function() {
            var ping = $('.send-value').val();
            $.post('http://dev-phone/SendPing', JSON.stringify({
                "id": ping,
                "anon": true,
            }), function(data) {
                if (data){
                    $('.send-value').val('');
                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                    "Pinger", `Ping request sended!`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                } else {
                    $('.send-value').val('');
                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                    "Pinger", `Something went wrong!`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                }
            })
        });
    }
    
    function CloseVPN(){
        $(".anon-ping").remove();
        PhoneData.VPN = false;
    }
    
    function createMessage(number, sonmsg, name, time) {
        var date = new Date(time);
        var timer = moment(date).fromNow();
        var html = "";
        html +=
            `
            <div id="`+number+`" class="component-paper cursor-pointer message-paper">
               <div class="main-container">
                  <div class="image">
                     <svg aria-hidden="true" focusable="false" data-prefix="fas"
                        data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16 fa-fw fa-3x " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                        <path fill="currentColor"
                           d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
                        </path>
                     </svg>
                  </div>
                  <div class="details ">
                     <div class="title ">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                           style="word-break: break-word;">`+name+`</p>
                     </div>
                     <div class="description ">
                        <div class="flex-row">
                           <svg aria-hidden="true" focusable="false" data-prefix="fas"
                              data-icon="share" class="svg-inline--fa fa-share fa-w-16 fa-fw fa-sm " role="img"
                              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-right: 8px;">
                              <path fill="currentColor"
                                 d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z">
                              </path>
                           </svg>
                           <p class="MuiTypography-root text-clip MuiTypography-body2 MuiTypography-colorTextPrimary"
                              style="word-break: break-word;">`+ sonmsg +`</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>`
        return html;
    };
    
    function updateAdverts() {
        $.post('http://dev-phone/GetAdverts', function(adverts){
            $.each(adverts, function(__, advert){
                var sariName = advert.company
                var sariDetail = advert.text
                var phoneNumber = advert.number;
                var html = "";
            //    console.log(sariDetail.search(".jpg"))
                if (sariDetail.search(".jpg") > 0 || sariDetail.search(".gif") > 0 || sariDetail.search(".png") > 0)
                    {
                    html +=
                    `
                    <div class="jss1995 jss2010 sari-count">
                        <div style="padding: 8px;">
                            <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                            <img src="${sariDetail}" style="position:center" width="220" height="120">
                            </p>
                        </div>
                        <div class="jss1996 jss2011">
                            <div class="jss1997 jss2012" title="Sky Turner" style="flex: 1 1 0%;">
                                <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;"> ${sariName}</p>
                            </div>
                            <button title="Call" class="call-sari" style="flex: 1 1 0%; background-color: transparent; outline: none; border: none;">
                                <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;">${phoneNumber}</p>
                            </button>
                        </div>
                    </div>`
                    $('.jss2003').prepend(html);
                    $('.call-sari').click(function() {
                        var number = $(this).children('p').text();
                        createNotifyCallAction("Dialing...", `${number}`);
                    });  
                } else {
                html +=
                `
                <div class="jss1995 jss2010 sari-count">
                    <div style="padding: 8px;">
                        <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                        ${sariDetail}
                        </p>
                    </div>
                    <div class="jss1996 jss2011">
                        <div class="jss1997 jss2012" title="Sky Turner" style="flex: 1 1 0%;">
                            <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;"> ${sariName}</p>
                        </div>
                        <button title="Call" class="call-sari" style="flex: 1 1 0%; background-color: transparent; outline: none; border: none;">
                            <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;">${phoneNumber}</p>
                        </button>
                    </div>
                </div>`
                $('.jss2003').prepend(html);
                $('.call-sari').click(function() {
                    var number = $(this).children('p').text();
                    createNotifyCallAction("Dialing...", `${number}`);
                });
                }
            })
        })
    };
    
    function updateTweets() {
        $(".jss2277").empty();
        $.post('http://dev-phone/GetTweets', function(tweets){
            $.each(tweets, function(__, tweet){
                var nameOf = tweet.name;
                var detailOf = tweet.text;
                var photoOf = tweet.attachment;
                var date = new Date(tweet.time);
                var timer = moment(date).fromNow();
                var imageCheck;
                var number;
                var hide;
                var enlargedImg = false
                if (photoOf == '') {
                    imageCheck = 'none'
                    number = 0;
                    hide = '';
                } else {
                    imageCheck = 'flex';
                    number = 1;
                    hide = 'Hide (click image to copy URL)';
                }
                var html = "";
                html +=
                    `<div id="twat-box">
                <div class="twat-user">
                   <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary" style="word-break: break-word;">@${nameOf}</p>
                </div>
                <div id="twat-comment">
                   <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">
                        ${detailOf}
                   </p>
                </div>
                <div class="component-image-container" style="min-height: 0;">
                   <div>
                      <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">Images attached: ${number}</p>
                      <div>
                         <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" photourl="${photoOf}" style="text-decoration: underline;" id="hide-tweet">${hide}</p>
                      </div>
                   </div>
                   <div class="container container-max-height" style="display: ${imageCheck}">
                      <div class="blocker">
                         <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                            </path>
                         </svg>
                         <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary" style="word-break: break-word;">Click to View</p>
                         <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="text-align: center; margin-top: 8px;">Only reveal images from those you know are not
                            total pricks
                         </p>
                      </div>
                      <div class="image twat-image-con" style="background-image: url(${photoOf}); display: none; ">
                      </div>
                      <!-- <div class=""></div>
                      <div class="spacer"></div> -->
                   </div>
                </div>
                <div class="twat-low" style="margin-top: 8px;">
                   <div class="twat-low-icons">
                      <div title="Reply" class="t-reply-button">
                         <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="reply" class="svg-inline--fa fa-reply fa-w-16 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z">
                            </path>
                         </svg>
                      </div>
                      <div title="RT" class="rt-btn">
                         <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="retweet" class="svg-inline--fa fa-retweet fa-w-20 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path fill="currentColor" d="M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z">
                            </path>
                         </svg>
                      </div>
                      <div title="Report" class="twat-report">
                         <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flag" class="svg-inline--fa fa-flag fa-w-16 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z">
                            </path>
                         </svg>
                      </div>
                   </div>
                   <div class="twat-low-time">
                      <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${timer}</p>
                   </div>
                </div>
             </div>`
                
                $('.jss2277').prepend(html);
                $('.blocker').click(function() {
                    $(this).css('display', 'none');
                    $(this).parent('.container-max-height').children('.twat-image-con').css('display', 'block')
                });
                $('.rt-btn').click(function() {
                    $('.send-twat-form').css('display', 'flex');
                    rtMessageUser = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('.twat-user').children('p').html();
                    rtMessageDetail = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('#twat-comment').children('p').html();
                    var valueRt = `RT ${rtMessageUser} ${rtMessageDetail}`
                    $('.twat-message').val(`${valueRt}`);
                });
                $('.t-reply-button').click(function() {
                    $('.send-twat-form').css('display', 'flex');
                    rtMessageUser = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('.twat-user').children('p').html();
                    var valueRt = `${rtMessageUser}`
                    $('.twat-message').val(`${valueRt}`);
                });
                $('.twat-report').click(function() {
                    complateInputJustGreen();
                });
                $('.twat-image-con').click(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var bg = $(this).css('background-image');
                    bg = /^url\((['"]?)(.*)\1\)$/.exec(bg);
                    bg = bg ? bg[2] : ""; // If matched, retrieve url, otherwise ""                
                   copyToClipboard(bg);

                   if (bg != "" && !enlargedImg) {
                            enlargedImg = true
                            var htmlImage = `<img src="${bg}" style="position:absolute" width="600" height="337" />`
                            $('.PictureEnlarger').prepend(htmlImage);
                          }
                    else if (bg != "" && enlargedImg) {
                            // Set image size to original
                            enlargedImg = false
                            $('.PictureEnlarger').html('');
                          }
                });
            })
        })
    };
    
    
    function endcall(){
        var topNotifyReversVar = document.getElementsByClassName("notification-container")
        for (i = 0; i < topNotifyReversVar.length; i++) {
            topNotifyReversVar[i].style.animation = "cometopaparevers 0.5s";
            setTimeout(function() {
                for (i = 0; i < topNotifyReversVar.length; i++) {
                    topNotifyReversVar[i].innerHTML = "";
                    topNotifyReversVar[i].remove();
                    notifymevcut = false
                    PhoneData.InCall = false
                    $("#main-app-container").css("display", "none");
                    $.post('http://dev-phone/EndCall');
                    $.post('http://dev-phone/ClosePhone');
                    $(".jss1255").css('bottom', '18px');
                    $(".jss1251").css('bottom', '18px');
                }
            }, 499)
        }
    }
    
    function acceptcall(data) {
        $('.timer-sc-min').html('00')
        $('.timer-dot').html(':')
        var milisecond = 00;
        var seconds = 00;
        var minutes = 00;
        $('.app-bar .name .call-div-name').text(data.name)
        $('.call-div2').remove()
        var appendMin = $('.content .timer-sc-min');
        var appendSecond = $('.content .timer-sc-sec')
        var Interval;
        clearInterval(Interval);
        Interval = setInterval(startTimer, 17);
    
        function startTimer() {
            milisecond++;
            if (seconds <= 9) {
                appendSecond.html("0" + seconds);
            }
            if (seconds > 9) {
                appendSecond.html(seconds);
            }
            if (milisecond > 60) {
                seconds++;
                if (seconds >= 10) {
                    appendSecond.html(seconds);
                } else {
                    appendSecond.html("0" + seconds);
                }
                milisecond = 0;
            }
            if (seconds > 59) {
                minutes++;
                if (minutes >= 10) {
                    appendMin.html(minutes);
                } else {
                    appendMin.html("0" + minutes);
                }
                seconds = 0;
                appendSecond.html("0" + 0);
            }
            if (minutes > 9) {
                appendMin.html(minutes);
            }
        }
    }
    
    $(document).ready(function() {
    
        // $("#app-container").hide();
        $("#contacts-container").hide();
        $("#details-container").hide();
        $("#calls-container").hide();
        $("#ping-container").hide();
        $("#mail-container").hide();
        $(".documents-container").hide();
        $(".wbank-container").hide();
        $("#yellow-pages-container").hide();
        $('#camera-container').hide();
        $("#messages-container").hide();
        $(".diamondsports-container").hide();
        $("#messages-second-container").hide();
        $("#twatter-container").hide();
        $("#garage-container").hide();
        $("#housing-container").hide();
        $("#tinder-container").hide();
        $(".lsbn-container").hide();
        $(".crypto-container").hide();
        $("#calculator-container").hide();
        $(".jobcenter-container").hide();
        $(".abdultaxi-container").hide();
        $(".documents-container22").hide();
        $(".justice-container").hide();
        $(".debt-container").hide();
        $(".employees-container").hide();
        $("#notifyy").hide();
        $("#match-2").hide();
        $("#match-3").hide();
        $("#tb-1").css("color", "#FFB6C1");
        $("#tb-2").css("color", "rgba(255, 255, 255, 0.7)");
        $("#tb-3").css("color", "rgba(255, 255, 255, 0.7)");
        $(".jss2179").click(function() {
            cont = $(this).attr("id")
            if (cont == undefined) {
                cont = $(this).attr("class")
            }
            eval(cont + "()")
        });
    
        $(".home").click(function() {
            mainmenu()
        });
    
        $("#hb-1").click(function() {
            $("#house-1").show();
            $("#house-2").hide();
            $(".jss2907").css("left", (0));
            $("#hb-1").css("color", "#95ef77");
            $("#hb-2").css("color", "rgba(255, 255, 255, 0.7)");
        });
    
    
        $("#hb-2").click(function() {
            $("#house-1").hide();
            $("#house-2").show();
            $(".jss2907").css("left", ("50%"));
            $("#hb-2").css("color", "#95ef77");
            $("#hb-1").css("color", "rgba(255, 255, 255, 0.7)");
        });

        $("#tb-1").click(function() {
            $("#match-1").show();
            $("#match-2").hide();
            $("#match-3").hide();
            $(".jss2917").css("left", (0));
            $("#tb-1").css("color", "#FFB6C1");
            $("#tb-2").css("color", "rgba(255, 255, 255, 0.7)");
            $("#tb-3").css("color", "rgba(255, 255, 255, 0.7)");
        });
    
        $("#tb-2").click(function() {
            $("#match-1").hide();
            $("#match-2").show();
            $("#match-3").hide();
            $(".jss2917").css("left", ("33%"));
            $("#tb-2").css("color", "#FFB6C1");
            $("#tb-1").css("color", "rgba(255, 255, 255, 0.7)");
            $("#tb-3").css("color", "rgba(255, 255, 255, 0.7)");
        });

        $("#tb-3").click(function() {
            $("#match-1").hide();
            $("#match-2").hide();
            $("#match-3").show();
            $(".jss2917").css("left", ("66%"));
            $("#tb-3").css("color", "#FFB6C1");
            $("#tb-2").css("color", "rgba(255, 255, 255, 0.7)");
            $("#tb-1").css("color", "rgba(255, 255, 255, 0.7)");
        });

        $(".component-paper").mouseover(function() {
            overid = $(this).attr("hoverid")
            $(".actions[hoverid=" + overid + "]").css("display", "flex");
        }).mouseout(function() {
            $(".actions").css("display", "none");
        });
        $(".component-paper").mouseover(function() {
            overid = $(this).attr("camerahover")
            $(".actions[camerahover=" + overid + "]").css("display", "flex");
        }).mouseout(function() {
            $(".actions").css("display", "none");
        });
        $(".compaperjobs").mouseover(function() {
            overid = $(this).attr("hoverid")
            $(".actions[hoverid=" + overid + "]").css("display", "flex");
        }).mouseout(function() {
            $(".actions").css("display", "none");
        });
        $('.arama-div').click(function() {
            var number = $(this).children('div').children('.details').children('.title').children('p').text();
            createNotifyCallAction("Dialing...", `${number}`);
        })
        $(".component-paper").mouseover(function() {
            overid = $(this).attr("hoverid")
            $(".actions[hoverid=" + overid + "]").css("display", "flex");
        }).mouseout(function() {
            $(".actions").css("display", "none");
        });
    
        $(".message-paper").click(function() {
            var message = document.getElementsByClassName('message-container')
            for (var i = 0; i < message.length; i++) {
                message[i].style.display = "none";
            }
            randomid = $(this).attr("randomid")
            $(".messageaction[randomid=" + randomid + "]").css("display", "flex");
        })
        $('.call-call-div').click(function() {
            callNumber = $(this).attr("numbers");
            createNotifyCallAction("Dialing...", `${callNumber}`);
        });
        // $(".blocker").click(function() {
        // 	$(".blocker>img").hide()
        // });s
    
        // $(".component-paper").mouseover(function() {
        // 	overid = $(this).attr("hoverid")
        // 	$(".actions[hoverid=" + overid + "]").css("display", "flex");
        // }).mouseout(function() {
        // 	$(".actions").css("display", "none");
        // });
    
        // input
        $("#add-contact").click(function() {
            $("#input-box").css("display", "flex")
        });
    
        $(".send-money").click(function() {
            $(".paragonderform").css("display", "flex")
        });

        $(".create-doj").click(function() {
            $(".paragonderform2").css("display", "flex")
        });

        $(".change-background").click(function() {
            $(".paragonderform3").css("display", "flex")
        });

        $(".clear-email").click(function() {
            $('.e-upgrade').css('display', 'flex');
            $('#close-e-sure').click(function() {
                $('.e-upgrade').css('display', 'none');
            });
            $('#confirm-e-sure').click(function() {
                $.post('http:/dev-phone/ClearEmails', JSON.stringify({
                }), function(data){
                    if(data){
                        complateInput();
                        updateMails();
                        setTimeout(function() {
                            $('.e-upgrade').css('display', 'none');
                            createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                            "Dev-Mail", `Email has been wiped!`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                        }, 3700)
                    } else {
                        complateInput();
                        setTimeout(function() {
                            $('.e-upgrade').css('display', 'none');
                            createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                            "Dev-Mail", `No emails found.`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                        }, 3700)
                    }
                })
            });
        })
    
        $("#close-input").click(function() {
            $("#input-box").css("display", "none")
            console.log("bobers")
        });
    
    });

    function createNotifyPicture(image, title, detail, time, color, url) {
        var htmlse = "";
        htmlse +=
            `<div class="notification-container not-the-call">
                  <div class="app-bar">
                    <div class="icon" style="background: ${color}; color: white;">${image}</div>
                    <div class="name">
                      <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${title}</p>
                    </div>
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                      style="word-break: break-word;">${time}</p>
                  </div>
                  <div class="content">
                    <div class="text">
                      <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${detail}</p>
                    </div>
                  </div>
                  <img src="${url}" style="position:center" width="220" height="120" />
                </div>`
        $(document).ready(function(){
            $(".not-the-call").click(function() {
                var removed = document.getElementsByClassName("not-the-call");
                for (i = 0; i < removed.length; i++) {
                    removed[i].style.animation = "cometopaparevers 0.5s";
                    setTimeout(function() {
                        for (i = 0; i < removed.length; i++) {
                            removed[i].innerHTML = "";
                            removed[i].remove();
                            notifymevcut = false
                        }
                    }, 499)
                }
            });
        })
        setTimeout(function() {
            var topNotifyReversVar = document.getElementsByClassName("notification-container")
                for (i = 0; i < topNotifyReversVar.length; i++) {
                    topNotifyReversVar[i].style.animation = "cometopaparevers 0.5s";
                    setTimeout(function() {
                        for (i = 0; i < topNotifyReversVar.length; i++) {
                            topNotifyReversVar[i].innerHTML = "";
                            topNotifyReversVar[i].remove();
                            notifymevcut = false
                        }
                    }, 499)
                }
        }, 5300)
        return htmlse;
    };

    function createNotifyPictureAction(image, title, detail, time, color, url) {
        if (!PhoneData.Silence){
            if (!PhoneData.IsOpened){
                $('.top-notifications-wrapper').prepend(createNotifyPicture(image, title, detail, time, color, url));
                $(".jss1255").css('bottom', '-450px');  
                    $(".jss1251").css('bottom', '-450px');
                    $("#main-app-container").fadeIn()
                    notifymevcut = true
                    setTimeout(function() {

                        $("#main-app-container").fadeOut()
                        setTimeout(function() {
                            $(".jss1255").css('bottom', '18px');  
                            $(".jss1251").css('bottom', '18px');
                        }, 5000)
                    }, 4000)
            } else {
                $('.top-notifications-wrapper').prepend(createNotifyPicture(image, title, detail, time, color, url));
            }
        }
    }
    
    function createNotify(image, title, detail, time, color) {
        var htmlse = "";
        htmlse +=
            `<div class="notification-container not-the-call">
                  <div class="app-bar">
                    <div class="icon" style="background: ${color}; color: white;">${image}</div>
                    <div class="name">
                      <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${title}</p>
                    </div>
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                      style="word-break: break-word;">${time}</p>
                  </div>
                  <div class="content">
                    <div class="text">
                      <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${detail}</p>
                    </div>
                    
                  </div>
                </div>`
        $(document).ready(function(){
            $(".not-the-call").click(function() {
                var removed = document.getElementsByClassName("not-the-call");
                for (i = 0; i < removed.length; i++) {
                    removed[i].style.animation = "cometopaparevers 0.5s";
                    setTimeout(function() {
                        for (i = 0; i < removed.length; i++) {
                            removed[i].innerHTML = "";
                            removed[i].remove();
                            notifymevcut = false
                        }
                    }, 499)
                }
            });
        })
        setTimeout(function() {
            var topNotifyReversVar = document.getElementsByClassName("notification-container")
                for (i = 0; i < topNotifyReversVar.length; i++) {
                    topNotifyReversVar[i].style.animation = "cometopaparevers 0.5s";
                    setTimeout(function() {
                        for (i = 0; i < topNotifyReversVar.length; i++) {
                            topNotifyReversVar[i].innerHTML = "";
                            topNotifyReversVar[i].remove();
                            notifymevcut = false
                        }
                    }, 499)
                }
        }, 5300)
        return htmlse;
    };
    
    function createNotifyAction(image, title, detail, time, color) {
        if (!PhoneData.Silence){
            if (!PhoneData.IsOpened){
                $('.top-notifications-wrapper').prepend(createNotify(image, title, detail, time, color));
                $(".jss1255").css('bottom', '-550px');  
                    $(".jss1251").css('bottom', '-550px');
                    $("#main-app-container").fadeIn()
                    notifymevcut = true
                    setTimeout(function() {
                        $("#main-app-container").fadeOut()
                        setTimeout(function() {
                            $(".jss1255").css('bottom', '18px');  
                            $(".jss1251").css('bottom', '18px');
                        }, 5000)
                    }, 4000)
            } else {
                $('.top-notifications-wrapper').prepend(createNotify(image, title, detail, time, color));
            }
        }
    }
    
    function createNotifyCallAction(title, detail) {
        if (PhoneData.InCall) return;
        phoneNumber = detail
        if (detail.startsWith("(")) {
            phoneNumber = detail.slice(1,4) + detail.slice(6,9) + detail.slice(10, 14);
        }
        
        if (PhoneData.Number != phoneNumber) {

            if (!locked) {
                locked = true;
                setTimeout(unlock, 5000);
                $.post('http://dev-phone/CallContact', JSON.stringify({
                    number: phoneNumber
                }), function(callback){
                    if (callback){
                        var htmlse = "";
                        htmlse +=
                        `<div class="notification-container arama-notify-check">
                                <div class="app-bar">
                                <div class="icon" style="background: linear-gradient(0deg, rgba(9,147,59,1) 0%, rgba(71,216,124,1) 100%); color: white;"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                                60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                                464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg></div>
                                <div class="name">
                                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary call-div-name"
                                    style="word-break: break-word;">${title}</p>
                                </div>
                                <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                    style="word-break: break-word;"></p>
                                </div>
                                <div class="content">
                                <div class="text">
                                    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary call-div2">${detail}</p>
                                    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary timer-sc"
                                    style="word-break: break-word;"><span class="timer-sc-min"></span><span class="timer-dot"></span><span class="timer-sc-sec"></span></p>
                                </div>
                                <div class="action-button">
                                        <div class="action action-reject not-but" title="Hang Up"><svg aria-hidden="true" focusable="false"
                                        data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16 fa-fw "
                                        role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor"
                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
                                        </path>
                                        </svg>
                                    </div>
                                </div>
                                </div>
                        </div>`
                        if($('.arama-notify-check').length < 1){
                            PhoneData.InCall = true
                            $('.top-notifications-wrapper-mounted').prepend(htmlse);
                        }
                        $(document).ready(function() {
                            $(".not-but").click(function() {
                                notifymevcut = false
                                var topNotifyReversVar = document.getElementsByClassName("notification-container")
                                for (i = 0; i < topNotifyReversVar.length; i++) {
                                    topNotifyReversVar[i].style.animation = "cometopaparevers 0.5s";
                                    setTimeout(function() {
                                        for (i = 0; i < topNotifyReversVar.length; i++) {
                                            topNotifyReversVar[i].innerHTML = "";
                                            topNotifyReversVar[i].remove();
                                            
                                        }
                                    }, 499)
                                }
                                $.post('http://dev-phone/EndCall');
                                PhoneData.InCall = false
                                $.post('http://dev-phone/ClosePhone');
                                $("#main-app-container").css("display", "none");
                                $(".jss1255").css('bottom', '18px');
                                $(".jss1251").css('bottom', '18px');
                            });
                        })
                    } else {
                        createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                        60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                        464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>`,
                            "Phone", `${detail} is not available now! `, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
                    }                
                })
            }
        } else {
            createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
            60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
            464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>`,
                "Phone", `You can't call yourself!`, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
        }
    };
    
    function incomingCall(detail) {
        if (PhoneData.InCall) return;
        numer = detail.number.toString()
        var detailSlice = '(' + numer.slice(0, 3) + ') ' + (numer.slice(3, 6)) + '-' + numer.slice(6, 10);
        var detailFormat = detail.name ? detail.name : detailSlice;
        var htmlse = "";
        htmlse +=
            `<div class="notification-container arama-notify-check">
                  <div class="app-bar">
                  <div class="icon" style="background: linear-gradient(0deg, rgba(9,147,59,1) 0%, rgba(71,216,124,1) 100%); color: white;"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                  60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                  464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg></div>
                    <div class="name">
                      <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${detailFormat}</p>
                    </div>
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                      style="word-break: break-word;"></p>
                  </div>
                  <div class="content">
                    <div class="text">
                      <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary timer-sc"
                        style="word-break: break-word;"><span class="timer-sc-min">Incoming Call...</span><span class="timer-dot"></span><span class="timer-sc-sec"></span></p>
                    </div>
                    <div class="action-button">
                        <div class="action action-reject not-but" title="Hang Up"><svg aria-hidden="true" focusable="false"
                            data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16 fa-fw "
                            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor"
                              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
                            </path>
                          </svg>
                        </div>
                        <div class="action action-reject accept-call" title="Hang Up"><svg style="color: #93eb73" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check-circle fa-w-16 fa-1x"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" class=""></path></svg>
                          </svg>
                        </div>
                    </div>
                  </div>
                </div>`
        $(document).ready(function() {
            $(".not-but").click(function() {
                notifymevcut = false
                var topNotifyReversVar = document.getElementsByClassName("notification-container")
                for (i = 0; i < topNotifyReversVar.length; i++) {
                    topNotifyReversVar[i].style.animation = "cometopaparevers 0.5s";
                    setTimeout(function() {
                        for (i = 0; i < topNotifyReversVar.length; i++) {
                            topNotifyReversVar[i].innerHTML = "";
                            topNotifyReversVar[i].remove();
                        }
                    }, 499)
                }
                $.post('http://dev-phone/EndCall');
                PhoneData.InCall = false
                $("#main-app-container").css("display", "none");
                $.post('http://dev-phone/ClosePhone');
                $(".jss1255").css('bottom', '18px');
                $(".jss1251").css('bottom', '18px');
            });
            $('.accept-call').click(function() {
                let testdoc = this
                PhoneData.InCall = true
                $.post('http://dev-phone/AcceptCall', JSON.stringify({
                    "number": detail.number,
                    "name": detail.name,
                }), function(data) {
                    if (data){
                        $(testdoc).remove();
                        $('.timer-sc-min').html('00')
                        $('.timer-dot').html(':')
                        var milisecond = 00;
                        var seconds = 00;
                        var minutes = 00;
                        var appendMin = $('.timer-sc-min');
                        var appendSecond = $('.timer-sc-sec')
                        var Interval;
                        clearInterval(Interval);
                        Interval = setInterval(startTimer, 17);
            
                        function startTimer() {
                            milisecond++;
                            if (seconds <= 9) {
                                appendSecond.html("0" + seconds);
                            }
                            if (seconds > 9) {
                                appendSecond.html(seconds);
                            }
                            if (milisecond > 60) {
                                seconds++;
                                if (seconds >= 10) {
                                    appendSecond.html(seconds);
                                } else {
                                    appendSecond.html("0" + seconds);
                                }
                                milisecond = 0;
                            }
                            if (seconds > 59) {
                                minutes++;
                                if (minutes >= 10) {
                                    appendMin.html(minutes);
                                } else {
                                    appendMin.html("0" + minutes);
                                }
                                seconds = 0;
                                appendSecond.html("0" + 0);
                            }
                            if (minutes > 9) {
                                appendMin.html(minutes);
                            }
                        }
                    }
                })
            })
        })
        
        if (!PhoneData.IsOpened || !PhoneData.InCall ){
            $('.top-notifications-wrapper-mounted').prepend(htmlse)
            $(".jss1255").css('bottom', '-550px');  
                $(".jss1251").css('bottom', '-550px');
                $("#main-app-container").fadeIn()
                notifymevcut = true
                setTimeout(function() {
                    if (!PhoneData.IsOpened || !PhoneData.InCall){
                    setTimeout(function() {
                        $(".jss1255").css('bottom', '18px');  
                        $(".jss1251").css('bottom', '18px');
                    }, 5000)
                    }
                }, 4000)
        } else {
            $('.top-notifications-wrapper-mounted').prepend(htmlse)
        }
    
    };
    notifymevcut = false
    setInterval(function() {
        if (PhoneData.IsOpened || PhoneData.InCall) {
            if (notifymevcut) {
                $(".jss1255").css('bottom', '18px');  
                $(".jss1251").css('bottom', '18px');
            }
        }
    }, 500)
    
    // #Input Complate Function
    function complateInput(app) {
        $(".jss1539").each(function(i) {
            this.style.display = "none";
        });
        $('.complate-marks').css("display", "flex");
        $('.spinner-wrapper').css("display", "flex");
        setTimeout(function() {
            $('.spinner-wrapper').css("display", "none");
            $('.component-checkmark').css("display", "flex");
            setTimeout(function() {
                $('.complate-marks').css("display", "none");
                $('.component-checkmark').css("display", "none");
            }, 1700)
        }, 2000)
    }
    
    function complateInputJustGreen() {
        $(".jss1539").each(function(i) {
            this.style.display = "none";
        });
        $('.complate-marks').css("display", "flex");
        $('.component-checkmark').css("display", "flex");
        setTimeout(function() {
            $('.complate-marks').css("display", "none");
            $('.component-checkmark').css("display", "none");
        }, 1700)
    }
    $(".dc2-save2").click(function() {
        complateInput();
    })
    
    // #Bank Input Functions
    function phoneBankFocus() {
        $('#wb-phone').addClass('Mui-focused');
        $('#message-form').addClass('Mui-focused');
        $('#arama-form').addClass('Mui-focused');
        $('.wbp-text').addClass('MuiInputLabel-shrink Mui-focused')
    };
    
    function reversedPhoneBankFocus() {
        $('#message-phone').removeClass('Mui-focused');
        $('#wb-phone').removeClass('Mui-focused');
        $('.wbp-text').removeClass('Mui-focused')
    };
    
    function amounthBankFocus() {
        $('#wb-amount').addClass('Mui-focused');
        $('.wba-text').addClass('Mui-focused');
        $('.wba-icon').css("color", "#95ef77")
    }
    
    function reverseAmounthBankFocus() {
        $('#wb-amount').removeClass('Mui-focused');
        $('.wba-text').removeClass('Mui-focused');
        $('.wba-icon').css("color", "white")
    }
    
    function commentBankFocus() {
        $('#wb-comment').addClass('Mui-focused');
        $('.wbc-text').addClass('Mui-focused');
        $('.wbc-icon').css("color", "#95ef77")
    }
    
    function reverseCommentBankFocus() {
        $('#wb-comment').removeClass('Mui-focused');
        $('.wbc-text').removeClass('Mui-focused');
        $('.wbc-icon').css("color", "white")
    }
    
    function updateBankLogs() {
        $('.wbank-container4').empty();
        $.post('http://dev-phone/GetBankLogs', function(data){
            $.each(data, function(__, log){
                var random = Math.floor(Math.random() * 10000) + 1;
                var miktar = log.amount
                var aciklama = log.comment
                var name = log.name;
    
                var dateObj = new Date();
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var tarih = day + "/" + month + '/' + year;
                
                if (log.type == "send"){
                    var html = "";
                    html +=
                        `<li id="${random}" class="component-paper bank-count">
                        <div class="main-container clicked-function-container">
                           <div style="width:100%;">
                              <div class="wbank-jss140">
                                 <p class="MuiTypography-root out MuiTypography-body2 MuiTypography-colorTextPrimary gidenpara" style="word-break: break-word;">-$${miktar}.00</p>
                              </div>
                              <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${name}</p>
                           </div>
                        </div>
                        <div class="drawer">
                           <div class="item">
                              <div class="icon">
                                 <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path>
                                 </svg>
                              </div>
                              <div class="text">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${aciklama}</p>
                              </div>
                           </div>
                           <div class="item">
                              <div class="icon">
                                 <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path>
                                 </svg>
                              </div>
                              <div class="text">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${tarih}</p>
                              </div>
                           </div>
                        </div>
                     </li>`
                    } else{
                    var html = "";
                    html +=
                        `<li id="${random}" class="component-paper bank-count">
                        <div class="main-container clicked-function-container">
                            <div style="width:100%;">
                                <div class="wbank-jss140">
                                    <p class="MuiTypography-root out MuiTypography-body2 MuiTypography-colorTextPrimary gelenpara" style="word-break: break-word;">+$${miktar}.00</p>
                                </div>
                                <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${name}</p>
                            </div>
                        </div>
                        <div class="drawer">
                            <div class="item">
                                <div class="icon">
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path>
                                    </svg>
                                </div>
                                <div class="text">
                                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${aciklama}</p>
                                </div>
                            </div>
                            <div class="item">
                                <div class="icon">
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path>
                                    </svg>
                                </div>
                                <div class="text">
                                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${tarih}</p>
                                </div>
                            </div>
                        </div>
                        </li>`      
                }
            
                $('.wbank-container4').prepend(html);
                $("#" + random).click(function() {
                    if (drawer) {
                        $(this).children('.main-container').next().css("display", "none");
                        drawer = 0
                    } else {
                        $(this).children('.main-container').next().css("display", "flex");
                        drawer = 1
                    }
                });
            })
        })
    };
    // #Banka Para Transfer
    $(document).ready(function() {
    
        function clearBankForm() {
            $('.bank-transfer-ammount').val('');
            $('.bank-transfer-aciklama').val('');
            $('.bank-transfer-no').val('');
            $('#bankammounttext').html('');
        };

        function clearDOJForm() {
            $('.doj-transfer-time').val('');
            $('.doj-transfer-aciklama').val('');
            $('.doj-transfer-name').val('');
            $('#timeammounttext').html('');
        };

        function clearBackgroundForm() {
            $('.background-transfer-url').val('');
        };
    
        $('.wb-submit').click(function() {
            var valueNo = $('.bank-transfer-no').val();
            var valueAm = $('.bank-transfer-ammount').val();
            var valueCom = $('.bank-transfer-aciklama').val();
            if (valueNo.length > 0 && valueAm.length >= 1 && valueCom.length >= 1) {
                $.post('http://dev-phone/SendMoneyToNumber', JSON.stringify({
                    number: valueNo,
                    amount: valueAm,
                    comment: valueCom
                }), function(data){
                    if (data.status){
                        complateInput();
                        updateBankLogs();
                        $('#wb-phone').removeClass('Mui-focused');
                        $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                        createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="university" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                        class="svg-inline--fa fa-university fa-w-16 fa-1x"><path fill="currentColor" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 
                        12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 
                        304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 
                        192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z" class=""></path></svg>`, "Bank", `${data.text}`, "just now", "linear-gradient(45deg, rgba(12,235,255,1) 0%, rgba(76,177,254,1) 100%)")
                        clearBankForm();
                    } else {
                        createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="university" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                        class="svg-inline--fa fa-university fa-w-16 fa-1x"><path fill="currentColor" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 
                        12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 
                        304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 
                        192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z" class=""></path></svg>`, "Bank", `${data.text}`, "just now", "linear-gradient(45deg, rgba(12,235,255,1) 0%, rgba(76,177,254,1) 100%)")
                        clearBankForm();
                        $('#wb-phone').removeClass('Mui-focused');
                        $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                    }
                })
            }
        });

        $('.doj-submit').click(function() {
            var valueNo = $('.doj-transfer-name').val();
            var valueTime = $('.doj-transfer-time').val();
            var valueDate = $('.doj-transfer-aciklama').val();
            var valueTime = valueTime.slice(0, 2) + ":" + valueTime.slice(2, 4);
            if (valueNo.length >= 5 && valueTime.length == 5 && valueDate.length >= 5) {
                $.post('http://dev-phone/CreateCase', JSON.stringify({
                    name: valueNo,
                    time: valueTime,
                    date: valueDate
                }), function(data){
                    if (data.status){
                        complateInput();
                        createdoj();
                        $('#doj-phone').removeClass('Mui-focused');
                        $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                        createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="university" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                        class="svg-inline--fa fa-university fa-w-16 fa-1x"><path fill="currentColor" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 
                        12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 
                        304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 
                        192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z" class=""></path></svg>`, "Department of Justice", `${data.text}`, "just now", "linear-gradient(45deg, rgba(12,235,255,1) 0%, rgba(76,177,254,1) 100%)")
                        clearDOJForm();
                    } else {
                        createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="university" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                        class="svg-inline--fa fa-university fa-w-16 fa-1x"><path fill="currentColor" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 
                        12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 
                        304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 
                        192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z" class=""></path></svg>`, "Department of Justice", `${data.text}`, "just now", "linear-gradient(45deg, rgba(12,235,255,1) 0%, rgba(76,177,254,1) 100%)")
                        clearDOJForm();
                        $('#doj-phone').removeClass('Mui-focused');
                        $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                        $('.paragonderform2').css('display', 'none');
                    }
                })
            }
        });
        $("#wb-clear").click(function() {
            $('.bank-phone-input').val('');
            $('#wb-phone').removeClass('Mui-focused');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });
        $('.close-bank').click(function() {
            $('#wb-phone').removeClass('Mui-focused');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
            clearBankForm();
            $('.paragonderform').css('display', 'none');
        })

        $("#doj-clear").click(function() {
            $('.doj-phone-input').val('');
            $('#doj-phone').removeClass('Mui-focused');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });

        $('.close-createdoj').click(function() {
            $('#doj-phone').removeClass('Mui-focused');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
            clearDOJForm();
            $('.paragonderform2').css('display', 'none');
        })
        $('.changebackground-submit').click(function() {
            var backgroundurl = $('.background-transfer-url').val();
            if (backgroundurl.length >= 4) {
              //  document.getElementsByClassName('jss1255').setAttribute("style", "background-image: url(" + backgroundurl + ")  100% 100% / cover no-repeat;");
                    var elements = document.getElementsByClassName('jss1255'); // get all elements
                    for(var i = 0; i < elements.length; i++){
                        elements[i].style.backgroundImage = "url(" + backgroundurl + ")";
                        elements[i].style.backgroundRepeat = "repeat-y";
                        elements[i].style.backgroundSize = "280px 652px";
                    }
                        $('#background-phone').removeClass('Mui-focused');
                        $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                        clearBackgroundForm();
                        $('.paragonderform3').css('display', 'none');
                // $.post('http://dev-phone/CreateCase', JSON.stringify({
                //     name: valueNo,
                //     time: valueTime,
                //     date: valueDate
                // }), function(data){
                //     if (data.status){
                //         complateInput();
                //         createdoj();
                //         $('#background-phone').removeClass('Mui-focused');
                //         $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                //         createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="university" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                //         class="svg-inline--fa fa-university fa-w-16 fa-1x"><path fill="currentColor" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 
                //         12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 
                //         304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 
                //         192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z" class=""></path></svg>`, "Department of Justice", `${data.text}`, "just now", "linear-gradient(45deg, rgba(12,235,255,1) 0%, rgba(76,177,254,1) 100%)")
                //         clearBackgroundForm();
                //     } else {
                //         createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="university" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                //         class="svg-inline--fa fa-university fa-w-16 fa-1x"><path fill="currentColor" d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 
                //         12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 
                //         304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 
                //         192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z" class=""></path></svg>`, "Department of Justice", `${data.text}`, "just now", "linear-gradient(45deg, rgba(12,235,255,1) 0%, rgba(76,177,254,1) 100%)")
                //         clearBackgroundForm();
                //         $('#background-phone').removeClass('Mui-focused');
                //         $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                //         $('.paragonderform3').css('display', 'none');
                //     }
                // })
            }
        });
        $("#background-clear").click(function() {
            $('.background-phone-input').val('');
            $('#background-phone').removeClass('Mui-focused');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });

        $('.close-changebackground').click(function() {
            $('#background-phone').removeClass('Mui-focused');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
            clearBackgroundForm();
            $('.paragonderform3').css('display', 'none');
        })
    });
    
    function contacts() {
        PhoneData.CurrentApp = "Contacts";
        $("#app-container").hide();
        $("#contacts-container").fadeIn();
        updateContactList();
    }
    
    function updateContactList() {
        $.post('http://dev-phone/GetContacts', {
        }, function (data) {
            if (data){
                $('.jss1481').html('');
                $.each(data, function(index, value) {
                    var random = Math.floor(Math.random() * 10000) + 1;
                    var userNumber = "(" + value.number.slice(0, 3) + ") " + value.number.slice(3, 6) + "-" + value.number.slice(6, 10);
                    var colors = ["lightgreen","salmon", "lightcoral","peru","aquamarine","violet","lightseagreen","lightpink","lightblue","lemonchiffon","khaki","mediumorchid","lightgreen","salmon", "lightcoral","peru","aquamarine","violet","lightseagreen","lightpink","lightblue","lemonchiffon","khaki","mediumorchid","lightgreen","salmon", "lightcoral","peru","aquamarine",
                    "violet","lightseagreen","lightpink","lightblue","lemonchiffon","khaki","mediumorchid","lightgreen","salmon", "lightcoral","peru","aquamarine","violet","lightseagreen","lightpink","lightblue","lemonchiffon","khaki","mediumorchid"]
                    var svgcolorfill = colors[value.name.length];
                    var html = "";
                    html +=
                    `<div hoverid=${random} class="component-paper contract-count">
                    <div class="main-container">
                    <div class="image">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle"
                    class="svg-inline--fa fa-user-circle fa-w-16 fa-fw fa-3x " role="img"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                    <path fill=${svgcolorfill}
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
                    </path>
                    </svg>
                    </div>
                    <div class="details ">
                    <div class="title ">
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">${value.name}</p>
                    </div>
                    <div class="description ">
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">${userNumber}</p>
                    </div>
                    </div>
                    <div hoverid="${random}" class="actions actions-show" style="display: none;">
                    <div title="Yeet" class="yeet-button" id="remove-contact" number="${value.number}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-slash" class="svg-inline--fa fa-user-slash fa-w-20 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path fill="currentColor" d="M633.8 458.1L362.3 248.3C412.1 230.7 448 183.8 448 128 448 57.3 390.7 0 320 0c-67.1 0-121.5 51.8-126.9 117.4L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3zM96 422.4V464c0 26.5 21.5 48 48 48h350.2L207.4 290.3C144.2 301.3 96 356 96 422.4z">
                    </path>
                    </svg>
                    </div>
                    <div title="Call" class="call-call-div" numbers="${userNumber}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" class="svg-inline--fa fa-phone fa-w-16 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z">
                    </path>
                    </svg>
                    </div>
                    <div class="send-message-button-kisi" title="Message" number="${value.number}" name="${value.name}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z">
                    </path>
                    </svg>
                    </div>
                    <div title="Copy Number" class="copy-number-c" number="${value.number}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard" class="svg-inline--fa fa-clipboard fa-w-12 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path fill="currentColor" d="M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z">
                    </path>
                    </svg>
                    </div>
                    </div>
                    </div>
                    </div>`
                    $('.jss1481').prepend(html);
                    $(".component-paper").mouseover(function() {
                        overid = $(this).attr("hoverid")
                        $(".actions[hoverid=" + overid + "]").css("display", "flex");
                    }).mouseout(function() {
                        $(".actions").css("display", "none");
                    });
                    $('.call-call-div').click(function() {
                        callNumber = $(this).attr("numbers");
                        createNotifyCallAction("Dialing...", `${callNumber}`);
                    });
                    $(".send-message-button-kisi").click(function() {
                        let number = $(this).attr("number");
                        let name = $(this).attr("name");
                        messagesacik = 1
                        $("#contacts-container").hide();
                        $("#messages-second-container").show();
                        $("#numbermessagesinner").html(name)
                        $("#numbermessagesinner").attr("data-number", number)
                        $.post('http://dev-phone/loadcontactmessages', JSON.stringify({
                            number: number
                        }));
                    });
                    $(".copy-number-c").click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        let copynumber = $(this).attr("number");
                        copyToClipboard(copynumber);
                    });
                    $("#remove-contact").click(function(){
                        let number = $(this).attr("number")
                        $.post('http://dev-phone/RemoveContact', JSON.stringify({
                            number: number
                        }), function(data){
                            if (data){
                                updateContactList();
                            }
                        });
                    })
                })
            }
        })
    }
    
    function copyToClipboard(text) {
        setTimeout(function() {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            
            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
          
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
          
            try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
            } catch (err) {
            }
          
            document.body.removeChild(textArea);
        }, 300);
    }
    
    // #Contract Oluştur
    $(document).ready(function() {
        function createContract(name, phone) {
            $.post('http://dev-phone/AddContact', JSON.stringify({
                name: name,
                phone: phone
            }), function(data) {
                clearContractForm();
                if (data){
                    updateContactList();
                }
            })
        };
                    
        function clearContractForm() {
            $('#co-name').val('');
            $('#kisimessageinput').val('');
            $('#copyinputmessage').html('');
        };
                    
        function createContractAction() {
            var name = $('#co-name').val();
            var phone = $('#kisimessageinput').val();
            createContract(name, phone);
        };
        $('.submit-kisi').click(function() {
            var phone = $('#kisimessageinput').val();
            if (phone.length >= 10) {
                setTimeout(function() {
                    createContractAction();
                }, 3700)
            };
        });
        $('.close-kisi').click(function() {
            clearContractForm();
        });
    });
    $(document).ready(function() {
        $('#messages-call-contact').click(function() {
            var number = $("#numbermessagesinner").attr("data-number");
            createNotifyCallAction("Dialing...", `${number}`);
        });
        $(".copy-number-c").click(function() {
            copydnumber = $(this).attr("number");
            navigator.clipboard.writeText(copydnumber);
        })
    });
    //
    
    var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    
    function details() {
        $("#app-container").hide();
        $("#details-container").fadeIn();
        PhoneData.CurrentApp = "details";
        $.post('http://dev-phone/GetDetails', {
        }, function(data) {
            $('.jss1648').html('');
            $('.jss1646').html('');
    
            phonenumber = "("+data.phonenumber.substring(0, 3)+") "+data.phonenumber.substring(3, 6)+"-"+data.phonenumber.substring(6, 10);
            $(".jss1646").append(`
            <div class="" title="Phone Number">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="mobile" class="svg-inline--fa fa-mobile fa-w-10 fa-fw fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path fill="currentColor" d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z">
            </path>
            </svg>
            <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary" style="word-break: break-word;">${phonenumber}</h6>
            </div>
            <div class="cash" title="Wallet">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="wallet" class="svg-inline--fa fa-wallet fa-w-16 fa-fw fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z">
            </path>
            </svg>
            <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary" style="word-break: break-word;">${formatter.format(data.cash)}</h6>
            </div>
            <div class="bank" title="Personal Bank Balance">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="piggy-bank"
            class="svg-inline--fa fa-piggy-bank fa-w-18 fa-fw fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path fill="currentColor" d="M560 224h-29.5c-8.8-20-21.6-37.7-37.4-52.5L512 96h-32c-29.4 0-55.4 13.5-73 34.3-7.6-1.1-15.1-2.3-23-2.3H256c-77.4 0-141.9 55-156.8 128H56c-14.8 0-26.5-13.5-23.5-28.8C34.7 215.8 45.4 208 57 208h1c3.3 0 6-2.7 6-6v-20c0-3.3-2.7-6-6-6-28.5 0-53.9 20.4-57.5 48.6C-3.9 258.8 22.7 288 56 288h40c0 52.2 25.4 98.1 64 127.3V496c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-48h128v48c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-80.7c11.8-8.9 22.3-19.4 31.3-31.3H560c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16zm-128 64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zM256 96h128c5.4 0 10.7.4 15.9.8 0-.3.1-.5.1-.8 0-53-43-96-96-96s-96 43-96 96c0 2.1.5 4.1.6 6.2 15.2-3.9 31-6.2 47.4-6.2z">
            </path>
            </svg>
            <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary" style="word-break: break-word;">${formatter.format(data.bank)}</h6>
            </div>
            `);
           // <div title="State ID" class="">
           //  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="id-card" class="svg-inline--fa fa-id-card fa-w-18 fa-fw fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
           //  <path fill="currentColor" d="M528 32H48C21.5 32 0 53.5 0 80v16h576V80c0-26.5-21.5-48-48-48zM0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V128H0v304zm352-232c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zM176 192c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zM67.1 396.2C75.5 370.5 99.6 352 128 352h8.2c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h8.2c28.4 0 52.5 18.5 60.9 44.2 3.2 9.9-5.2 19.8-15.6 19.8H82.7c-10.4 0-18.8-10-15.6-19.8z">
           //  </path>
           //  </svg>
           //  <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary" style="word-break: break-word;">${data.cid}</h6>
           //  </div> 

            // <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary" style="word-break: break-word;">${data.banknumber}</h6>
            // </div>

            if (data.casino > 0 ){
                $(".jss1646").append(`
                <div class="casino" title="Casino Balance">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-three"
                class="svg-inline--fa fa-dice-three fa-w-14 fa-fw fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M384 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V96c0-35.35-28.65-64-64-64zM128 192c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm96 96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm96 96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z">
                </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary" style="word-break: break-word;">${formatter.format(data.casino)}</h6>
                </div>
                `);
            }

    
            if (data.UsePlayerLicenses){
                $.each(data.licenses, function(__, license){
                    if (license.name == "DMV License"){ 
                    }
                    else {
                    $(".jss1648").prepend(`\ 
                    <div class="testing-alt-alt">\
                    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary" style="word-break: break-word;">${license.name}</p>\
                    <div class="icon icon-green" style="max-width: 60px;">\
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="svg-inline--fa fa-check-circle fa-w-16 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
                    <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">\
                    </path>\
                    </svg>\
                    </div></div>`)
                    }
                })
            } else {
                $(".jss1647").hide();
            }
        });
    }
    
    
    function camera() {
        $("#app-container").hide();
        $('#camera-container').fadeIn();
        PhoneData.CurrentApp = "camera";
        createCamera();
    }
    
    function calls() {
        $("#app-container").hide();
        $("#calls-container").fadeIn();
        PhoneData.CurrentApp = "calls";
        createCalls()
    }
    
    function ping() {
        $("#app-container").hide();
        $("#ping-container").fadeIn();
        PhoneData.CurrentApp = "ping";
    }
    
    function mail() {
        $("#app-container").hide();
        $("#mail-container").fadeIn();
        PhoneData.CurrentApp = "mail";
        updateMails();
    }
    
    function yellowpages() {
        $("#app-container").hide();
        $("#yellow-pages-container").fadeIn();
        PhoneData.CurrentApp = "yellowpages";
    }
    
    function twatter() {
        $("#app-container").hide();
        $("#twatter-container").fadeIn();
        PhoneData.CurrentApp = "twatter";
    }
    
    function createCar(value) {
        // $.each(value, function(k, v){ console.log(k) })
        var plateNumber = value.plate;
        var name = value.modelname.charAt(0).toUpperCase() + value.modelname.slice(1).toLowerCase();

        if (value.houseId){
            var status = "Parked"
            var location = "House: "+value.houseId;
        } else {
            var status = value.state ? 'Available' : 'Impounded';
            var location = "Garage: "+value.Garage;
        }
        var fuel = Math.floor(value.fuel);
        var damage = Math.floor(value.engine);
        var html = "";
        html +=
            `<div class="component-paper car-count">
            <div class="main-container clicked-function-container">
                <div class="image">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car"
                        class="svg-inline--fa fa-car fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <path fill="currentColor"
                        d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z">
                        </path>
                    </svg>
                </div>
                <div class="details ">
                    <div class="title ">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${plateNumber}</p>
                    </div>
                    <div class="description ">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${name}</p>
                    </div>
                </div>
                <div class="details-aux ">
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${status}</p>
                    </div>
                </div>
            </div>
            <div class="drawer">
                <div class="item">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt"
                        class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-fw " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="currentColor"
                            d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z">
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${location}</p>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="closed-captioning"
                        class="svg-inline--fa fa-closed-captioning fa-w-16 fa-fw " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M464 64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM218.1 287.7c2.8-2.5 7.1-2.1 9.2.9l19.5 27.7c1.7 2.4 1.5 5.6-.5 7.7-53.6 56.8-172.8 32.1-172.8-67.9 0-97.3 121.7-119.5 172.5-70.1 2.1 2 2.5 3.2 1 5.7l-17.5 30.5c-1.9 3.1-6.2 4-9.1 1.7-40.8-32-94.6-14.9-94.6 31.2.1 48 51.1 70.5 92.3 32.6zm190.4 0c2.8-2.5 7.1-2.1 9.2.9l19.5 27.7c1.7 2.4 1.5 5.6-.5 7.7-53.5 56.9-172.7 32.1-172.7-67.9 0-97.3 121.7-119.5 172.5-70.1 2.1 2 2.5 3.2 1 5.7L420 222.2c-1.9 3.1-6.2 4-9.1 1.7-40.8-32-94.6-14.9-94.6 31.2 0 48 51 70.5 92.2 32.6z">
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${plateNumber}</p>
                    </div>
                </div>
                <div class="item" title="Engine">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="oil-can"
                        class="svg-inline--fa fa-oil-can fa-w-20 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512">
                        <path fill="currentColor"
                            d="M629.8 160.31L416 224l-50.49-25.24a64.07 64.07 0 0 0-28.62-6.76H280v-48h56c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h56v48h-56L37.72 166.86a31.9 31.9 0 0 0-5.79-.53C14.67 166.33 0 180.36 0 198.34v94.95c0 15.46 11.06 28.72 26.28 31.48L96 337.46V384c0 17.67 14.33 32 32 32h274.63c8.55 0 16.75-3.42 22.76-9.51l212.26-214.75c1.5-1.5 2.34-3.54 2.34-5.66V168c.01-5.31-5.08-9.15-10.19-7.69zM96 288.67l-48-8.73v-62.43l48 8.73v62.43zm453.33 84.66c0 23.56 19.1 42.67 42.67 42.67s42.67-19.1 42.67-42.67S592 288 592 288s-42.67 61.77-42.67 85.33z">
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${fuel}%</p>
                    </div>
                </div>
                <div class="item" title="Body">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car-crash"
                        class="svg-inline--fa fa-car-crash fa-w-20 fa-fw " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path fill="currentColor"
                            d="M143.25 220.81l-12.42 46.37c-3.01 11.25-3.63 22.89-2.41 34.39l-35.2 28.98c-6.57 5.41-16.31-.43-14.62-8.77l15.44-76.68c1.06-5.26-2.66-10.28-8-10.79l-77.86-7.55c-8.47-.82-11.23-11.83-4.14-16.54l65.15-43.3c4.46-2.97 5.38-9.15 1.98-13.29L21.46 93.22c-5.41-6.57.43-16.3 8.78-14.62l76.68 15.44c5.26 1.06 10.28-2.66 10.8-8l7.55-77.86c.82-8.48 11.83-11.23 16.55-4.14l43.3 65.14c2.97 4.46 9.15 5.38 13.29 1.98l60.4-49.71c6.57-5.41 16.3.43 14.62 8.77L262.1 86.38c-2.71 3.05-5.43 6.09-7.91 9.4l-32.15 42.97-10.71 14.32c-32.73 8.76-59.18 34.53-68.08 67.74zm494.57 132.51l-12.42 46.36c-3.13 11.68-9.38 21.61-17.55 29.36a66.876 66.876 0 0 1-8.76 7l-13.99 52.23c-1.14 4.27-3.1 8.1-5.65 11.38-7.67 9.84-20.74 14.68-33.54 11.25L515 502.62c-17.07-4.57-27.2-22.12-22.63-39.19l8.28-30.91-247.28-66.26-8.28 30.91c-4.57 17.07-22.12 27.2-39.19 22.63l-30.91-8.28c-12.8-3.43-21.7-14.16-23.42-26.51-.57-4.12-.35-8.42.79-12.68l13.99-52.23a66.62 66.62 0 0 1-4.09-10.45c-3.2-10.79-3.65-22.52-.52-34.2l12.42-46.37c5.31-19.8 19.36-34.83 36.89-42.21a64.336 64.336 0 0 1 18.49-4.72l18.13-24.23 32.15-42.97c3.45-4.61 7.19-8.9 11.2-12.84 8-7.89 17.03-14.44 26.74-19.51 4.86-2.54 9.89-4.71 15.05-6.49 10.33-3.58 21.19-5.63 32.24-6.04 11.05-.41 22.31.82 33.43 3.8l122.68 32.87c11.12 2.98 21.48 7.54 30.85 13.43a111.11 111.11 0 0 1 34.69 34.5c8.82 13.88 14.64 29.84 16.68 46.99l6.36 53.29 3.59 30.05a64.49 64.49 0 0 1 22.74 29.93c4.39 11.88 5.29 25.19 1.75 38.39zM255.58 234.34c-18.55-4.97-34.21 4.04-39.17 22.53-4.96 18.49 4.11 34.12 22.65 39.09 18.55 4.97 45.54 15.51 50.49-2.98 4.96-18.49-15.43-53.67-33.97-58.64zm290.61 28.17l-6.36-53.29c-.58-4.87-1.89-9.53-3.82-13.86-5.8-12.99-17.2-23.01-31.42-26.82l-122.68-32.87a48.008 48.008 0 0 0-50.86 17.61l-32.15 42.97 172 46.08 75.29 20.18zm18.49 54.65c-18.55-4.97-53.8 15.31-58.75 33.79-4.95 18.49 23.69 22.86 42.24 27.83 18.55 4.97 34.21-4.04 39.17-22.53 4.95-18.48-4.11-34.12-22.66-39.09z">
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${damage}%</p>
                    </div>
                </div>
                <div class="flex-centered flex-space-around">
                    <div>
                        <button
                        class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall track-button"
                        tabindex="0" type="button" data-plate="${value.plate}" data-model="${value.modelname}">
                        <span class="MuiButton-label">Track</span>
                        <span class="MuiTouchRipple-root"></span>
                        </button>
                    </div>
                </div>
            </div>
            </div>`
        return html;
    };

    function createCarAction() {
        $(".jss2717").empty();
        $.post('http://dev-phone/GetPlayerVehicles', {
        }, function(data){
            $.each(data, function(k, v){
                $('.jss2717').prepend(createCar(v));
                $(".clicked-function-container").click(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var check = $(this).parent('.component-paper').children(".drawer").css('display')
                    if (check == "flex") {
                        $(this).parent('.component-paper').children(".drawer").css("display", "none");
                        // drawer = 0
                    } else {
                        $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                        // drawer = 1
                    }
                });
                $('.track-button').click(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var modelName = $(this).attr('data-model');
                    var carPlate = $(this).attr('data-plate');
                    if (!locked) {
                            locked = true;
                            setTimeout(unlock, 5000);
                        $.post('http://dev-phone/SpawnVehicle', JSON.stringify({
                            model: modelName,
                            plate: carPlate,
                        }), function(data){
                            if (data){
                                complateInputJustGreen();
                                setTimeout(function() {
                                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car" class="svg-inline--fa fa-car fa-w-16 fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z">
                                    </path>
                                        </svg>`,
                                        "Vehicles", `Car has been located!`, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
                                }, 1700);
                            } else {
                                createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car" class="svg-inline--fa fa-car fa-w-16 fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z">
                                </path>
                                </svg>`,
                                "Vehicles", `Vehicle is Impounded!`, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
                            }
                        })
                    }
                })
            })
        });
    };


        // recent calls Create Function
    function createCalls() {
        $.post('http://dev-phone/GetRecentCalls', {
        }, function (data) {
            if (data){
                $('.jss17911').html('');
                $.each(data, function(index, value) {
                    var random = Math.floor(Math.random() * 10000) + 1;
                    var userNumber = "(" + value.number.slice(0, 3) + ") " + value.number.slice(3, 6) + "-" + value.number.slice(6, 10);
                    var date = new Date(value.time);
                    var timer = moment(date).fromNow();
                    var html = "";

                    if (value.incoming === 0) {
                        //outgoing call
                        html +=
                        `<div hoverid=${random} class="component-paper contract-count">
                        <div class="main-container">
                        <div class="image">
                        <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="phone-arrow-up-right"

                        class="svg-inline--fa fa-phone-arrow-up-right fa-w-16 fa-fw fa-2x " role="img"

                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                        d="M493.1 351.2L384.6 304.7c-12.78-5.531-27.8-1.812-36.48 8.969l-44.05 53.81c-69.25-34-125.5-90.28-159.5-159.5l53.83-44.09c10.75-8.781 14.42-23.66 8.984-36.44L160.8 18.93C154.7 5.027 139.7-2.598 124.1 .8079L24.22 24.06C9.969 27.31 0 39.84 0 54.5C0 306.8 205.2 512 457.5 512c14.67 0 27.2-9.969 30.47-24.22l23.25-100.8C514.6 372.4 507 357.2 493.1 351.2zM480 0h-96c-17.67 0-32 14.33-32 32s14.33 32 32 32h18.75l-105.4 105.4c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0L448 109.3V128c0 17.67 14.33 32 32 32s32-14.33 32-32V32C512 14.33 497.7 0 480 0z">                        
                        </path>
                        </svg>
                        </div>`

                    } else {
                        if (value.accepts === 0) {
                            //missed call
                            html +=
                            `<div hoverid=${random} class="component-paper contract-count">
                            <div class="main-container">
                            <div class="image">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-missed"
                            class="svg-inline--fa fa-phone-missed fa-w-16 fa-fw fa-2x " role="img"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path fill="currentColor"
                            d="M631.1 376.4c-171.6-171.6-450.7-171.6-622.3 .0085c-9.967 9.969-11.71 25.26-4.23 37.16l52.71 84.3c7.674 12.3 23.11 17.37 36.72 12.06l105.5-42.17c12.39-4.994 20.01-17.6 18.67-30.88l-6.621-66.57c70.19-23.96 146.8-23.95 216.1 .0202l-6.641 66.53c-1.424 13.24 6.26 25.97 18.71 30.9l105.4 42.14c13.54 5.377 28.1 .2285 36.63-11.99l52.73-84.32C642.9 401.6 641.1 386.4 631.1 376.4zM112.5 157.1c12.16 5.027 23.31-.0273 29.06-5.781L172.2 121.5l53.71 53.71C246.9 196.2 273.8 211.5 303.3 215.2C343.6 220.2 382.4 206.8 410.5 178.7l128.8-128.8c6.248-6.248 6.248-16.38 0-22.63L516.7 4.686c-6.248-6.248-16.38-6.248-22.63 0l-128.8 128.8c-24.89 24.89-65.61 24.89-90.5 0l-57.28-57.28L248.2 45.52c7.629-7.631 9.922-19.09 5.781-29.06C249.8 6.498 240.1 0 229.3 0H115.1C104.1 0 96 8.953 96 19.1v113.3C96 144.1 102.5 153.8 112.5 157.1z">
                            </path>
                            </svg>
                            </div>`
                        } else {
                            //answered call
                             html +=
                            `<div hoverid=${random} class="component-paper contract-count">
                            <div class="main-container">
                            <div class="image">
                            <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="phone-arrow-down-left"
                            class="svg-inline--fa fa-phone-arrow-down-left fa-w-16 fa-fw fa-2x " role="img"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor"
                            d="M493.1 351.2L384.6 304.7c-12.78-5.531-27.8-1.812-36.48 8.969l-44.05 53.81c-69.25-34-125.5-90.28-159.5-159.5l53.83-44.09c10.75-8.781 14.42-23.66 8.984-36.44L160.8 18.93C154.7 5.027 139.7-2.598 124.1 .8079L24.22 24.06C9.969 27.31 0 39.84 0 54.5C0 306.8 205.2 512 457.5 512c14.67 0 27.2-9.969 30.47-24.22l23.25-100.8C514.6 372.4 507 357.2 493.1 351.2zM320 224h96c17.67 0 32-14.33 32-32s-14.33-32-32-32h-18.75l105.4-105.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0L352 114.8V96c0-17.67-14.33-32-32-32s-32 14.33-32 32v96C288 209.7 302.3 224 320 224z">
                            </path>
                            </svg>
                            </div>`                           
                        }
                    }



                    html +=`
                    <div class="details ">
                    <div class="title ">
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">${userNumber}</p>
                    </div>
                    <div class="description ">
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">${timer}</p>
                    </div>
                    </div>
                    <div hoverid="${random}" class="actions actions-show" style="display: none;">
                    <div title="Yeet" class="yeet-button" id="remove-call" number="${value.number}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-slash" class="svg-inline--fa fa-user-slash fa-w-20 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path fill="currentColor" d="M633.8 458.1L362.3 248.3C412.1 230.7 448 183.8 448 128 448 57.3 390.7 0 320 0c-67.1 0-121.5 51.8-126.9 117.4L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3zM96 422.4V464c0 26.5 21.5 48 48 48h350.2L207.4 290.3C144.2 301.3 96 356 96 422.4z">
                    </path>
                    </svg>
                    </div>
                    <div title="Call" class="call-calls-div" numbers="${userNumber}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" class="svg-inline--fa fa-phone fa-w-16 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z">
                    </path>
                    </svg>
                    </div>
                    <div class="send-message-button-kisi2" title="Message" number="${value.number}" name="${userNumber}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z">
                    </path>
                    </svg>
                    </div>
                    <div title="Copy Number" class="copy-number-call" number="${value.number}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard" class="svg-inline--fa fa-clipboard fa-w-12 fa-fw fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path fill="currentColor" d="M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z">
                    </path>
                    </svg>
                    </div>
                    </div>
                    </div>
                    </div>`
                    $('.jss17911').prepend(html);
                    $(".component-paper").mouseover(function() {
                        overid = $(this).attr("hoverid")
                        $(".actions[hoverid=" + overid + "]").css("display", "flex");
                    }).mouseout(function() {
                        $(".actions").css("display", "none");
                    });
                    $('.call-calls-div').click(function() {
                        callNumber = $(this).attr("numbers");
                        createNotifyCallAction("Dialing...", `${callNumber}`);
                    });
                    $(".send-message-button-kisi2").click(function() {
                        let number = $(this).attr("number");
                        let name = $(this).attr("name");
                        messagesacik = 1
                        $("#contacts-container").hide();
                        $("#messages-second-container").show();
                        $("#numbermessagesinner").html(name)
                        $("#numbermessagesinner").attr("data-number", number)
                        $.post('http://dev-phone/loadcontactmessages', JSON.stringify({
                            number: number
                        }));
                    });
                    $(".copy-number-call").click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        let copynumber = $(this).attr("number");
                        copyCallToClipboard(copynumber);
                    });
                    $("#remove-call").click(function(){
                        let number = $(this).attr("number")
                        $.post('http://dev-phone/RemoveCall', JSON.stringify({
                            number: number
                        }), function(data){
                            if (data){
                                createCalls();
                            }
                        });
                    })
                })
            }
        })
    }
    
    function copyCallToClipboard(text) {
        setTimeout(function() {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            
            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
          
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
          
            try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
            } catch (err) {
            }
          
            document.body.removeChild(textArea);
        }, 300);
    }

    function garage() {
        $("#app-container").hide();
        $("#garage-container").fadeIn();
        PhoneData.CurrentApp = "garage";
        createCarAction();
    }
    
    function housing() {
        $("#app-container").hide();
        $("#housing-container").fadeIn();
        PhoneData.CurrentApp = "housing";
        UpdateHouseList();
    }

    function tinder() {
        $("#app-container").hide();
        $("#tinder-container").fadeIn();
        PhoneData.CurrentApp = "tinder";
        swipedprofiles = {};
        UpdateTinderProfileList();
        UpdateTinderMatchList();
    }
    
    function crypto() {
        $("#app-container").hide();
        $(".crypto-container").fadeIn();
        PhoneData.CurrentApp = "crypto";
    }
    
    function jobcenter() {
        $("#app-container").hide();
        $(".jobcenter-container").fadeIn();
        PhoneData.CurrentApp = "jobcenter";
    }
    
    function updateMails() {
        $('.jss1944').empty();
        $.post('http://dev-phone/GetPlayerMails', function(data){
            if (data.length == 0) {
                var html = "";
                html += 
                `<div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">Nothing Here!</h6>
                </div>`;
                $('.jss1944').append(html);
            } else {
                
                $.each(data, function(__, mail){
                    var subject = mail.subject
                    var name = mail.sender;
                    var date = new Date(mail.time);
                    var timer = moment(date).fromNow();
                    var message = mail.message;
                    var html = "";
                    html +=
                        `
                        <div class="mail-container">
                           <div>
                              <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                                 From: ${name}
                              </p>
                              <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                                 Subject: ${subject}
                              </p>
                           </div>
                           <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.61);">
                              <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                                ${message}
                              </p>
                           </div>
                           <div class="mail-timer">
                              <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                                ${timer}
                              </p>
                           </div>
                        </div>`
                    $('.jss1944').prepend(html);
                })
            }
        })
    }
    
    function abdu() {
        PhoneData.CurrentApp = 'abdu';
        $("#app-container").hide();
        $(".abdultaxi-container").fadeIn();
        $('.jss179111').empty();
        $.post('http://dev-phone/GetEmployees', JSON.stringify({
            "job": "taxi"
        }), function(drivers){
            $.each(drivers, function(__, driver) {
                var name = driver.name;
                var numer = driver.number;
                numer = '(' + numer.slice(0, 3) + ') ' + (numer.slice(3, 6)) + '-' + numer.slice(6, 10);
                var html = "";
                html +=
                    `<div class="component-paper taxi-div taxi-count">
                    <div class="main-container">
                        <div class="image">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="taxi" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-taxi fa-w-16 fa-3x"><path fill="currentColor" d="M462 241.64l-22-84.84c-9.6-35.2-41.6-60.8-76.8-60.8H352V64c0-17.67-14.33-32-32-32H192c-17.67 0-32 14.33-32 32v32h-11.2c-35.2 0-67.2 25.6-76.8 60.8l-22 84.84C21.41 248.04 0 273.47 0 304v48c0 23.63 12.95 44.04 32 55.12V448c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-40.88c19.05-11.09 32-31.5 32-55.12v-48c0-30.53-21.41-55.96-50-62.36zM96 352c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm20.55-112l17.2-66.36c2.23-8.16 9.59-13.64 15.06-13.64h214.4c5.47 0 12.83 5.48 14.85 12.86L395.45 240h-278.9zM416 352c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z" class=""></path></svg>
                        </div>
                        <div class="details">
                            <div class="title">
                                <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${name}</p>
                            </div>
                            <div class="description">
                                <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${numer}</p>
                            </div>
                        </div>
                    </div>
                    </div>`
                    $('.jss179111').prepend(html);
                    $('.taxi-div').click(function() {
                        var number = $(this).children('.main-container').children('.details').children('.description').children('p').html();
                        createNotifyCallAction("Dialing...", `${number}`);
                    });
            })
        })
    }


    function createEmployees(value) {
        // $.each(value, function(k, v){ console.log(k) })
        var name = value.name
        var label2 = value.label;
        var label = value.label ? 'Available' : 'Impounded';
        var sex = "Sex: "+value.sex;
        var phoneNumber = "(" + value.number.slice(0, 3) + ") " + value.number.slice(3, 6) + "-" + value.number.slice(6, 10);
        var html = "";
        html +=
            `<div class="component-paper car-count">
            <div class="main-container clicked-function-container">
                <div class="image">
                    <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="user-helmet-safety"
                        class="svg-inline--fa fa-user-helmet-safety fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512">
                        <path fill="currentColor"
                        d="M88 176h272c4.375 0 8-3.625 8-8V136c0-4.375-3.625-8-8-8H352c0-45-26.88-85.62-68.38-103.2L256 80V16c0-8.875-7.125-16-16-16h-32c-8.875 0-16 7.125-16 16V80L164.4 24.75C122.9 42.38 96 83 96 128H88c-4.375 0-8 3.625-8 8v31.1C80 172.4 83.63 176 88 176zM314.7 352H133.3C59.7 352 0 411.7 0 485.3c0 14.73 11.94 26.67 26.66 26.67H421.3c14.72 0 26.66-11.94 26.66-26.67C448 411.7 388.3 352 314.7 352z"/><path class="fa-secondary" d="M352 192c0 70.69-57.31 128-128 128S96 262.7 96 192c0-5.48 .9453-10.7 1.613-16h252.8C351.1 181.3 352 186.5 352 192z">
                        </path>
                    </svg>
                </div>
                <div class="details ">
                    <div class="title ">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${name}</p>
                    </div>
                    <div class="description ">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${phoneNumber}</p>
                    </div>
                </div>
                <div class="details-aux ">
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${label}</p>
                    </div>
                </div>
            </div>
            <div class="drawer">
                <div class="item">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt"
                        class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-fw " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="currentColor"
                            d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z">
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${label2}</p>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="closed-captioning"
                        class="svg-inline--fa fa-closed-captioning fa-w-16 fa-fw " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M464 64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM218.1 287.7c2.8-2.5 7.1-2.1 9.2.9l19.5 27.7c1.7 2.4 1.5 5.6-.5 7.7-53.6 56.8-172.8 32.1-172.8-67.9 0-97.3 121.7-119.5 172.5-70.1 2.1 2 2.5 3.2 1 5.7l-17.5 30.5c-1.9 3.1-6.2 4-9.1 1.7-40.8-32-94.6-14.9-94.6 31.2.1 48 51.1 70.5 92.3 32.6zm190.4 0c2.8-2.5 7.1-2.1 9.2.9l19.5 27.7c1.7 2.4 1.5 5.6-.5 7.7-53.5 56.9-172.7 32.1-172.7-67.9 0-97.3 121.7-119.5 172.5-70.1 2.1 2 2.5 3.2 1 5.7L420 222.2c-1.9 3.1-6.2 4-9.1 1.7-40.8-32-94.6-14.9-94.6 31.2 0 48 51 70.5 92.2 32.6z">
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${phoneNumber}</p>
                    </div>
                </div>
                <div class="item" title="Engine">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="mars-and-venus"
                        class="svg-inline--fa fa-mars-and-venus fa-w-20 fa-fw " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M480 .0002l-112.4 .0001c-21.38 0-32.09 25.85-16.97 40.97l29.56 29.56l-27.11 27.11C326.1 76.85 292.7 64 256 64c-88.37 0-160 71.63-160 160c0 77.4 54.97 141.9 128 156.8v19.22H192c-8.836 0-16 7.162-16 16v31.1c0 8.836 7.164 16 16 16l32 .0001v32c0 8.836 7.164 16 16 16h32c8.838 0 16-7.164 16-16v-32l32-.0001c8.838 0 16-7.164 16-16v-31.1c0-8.838-7.162-16-16-16h-32v-19.22c73.03-14.83 128-79.37 128-156.8c0-28.38-8.018-54.65-20.98-77.77l30.45-30.45l29.56 29.56C470.1 160.5 496 149.8 496 128.4V16C496 7.164 488.8 .0002 480 .0002zM256 304c-44.11 0-80-35.89-80-80c0-44.11 35.89-80 80-80c44.11 0 80 35.89 80 80C336 268.1 300.1 304 256 304z"/>
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${sex}</p>
                    </div>
                </div>
                <div class="item" title="Body">
                    <div class="icon">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="person-digging"
                        class="svg-inline--fa fa-person-digging fa-w-20 fa-fw " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor"
                            d="M272 95.93c26.5 0 47.99-21.47 47.99-47.97S298.5 0 272 0C245.5 0 224 21.47 224 47.97S245.5 95.93 272 95.93zM209.7 357.3c-25.75-17.25-52.25-33.24-79.5-48.11L58.62 270.2L1.246 471.1c-4.875 16.1 4.1 34.74 22 39.62s34.63-4.998 39.5-21.99l36.63-128.1l60.63 40.37v78.86c0 17.62 14.38 31.99 32 31.99s32-14.37 32-31.99l.0022-95.93C224 373.2 218.6 363.2 209.7 357.3zM311.1 416c-13.88 0-25.95 8.863-30.33 21.86l-24.75 74.07h319.9l-101.9-206.3c-11.38-22.49-43.1-23.63-56.1-2.01l-31.89 54.21l-65.26-35.64l-24-121.2C288.1 161.3 263.2 127.7 227.1 109.7c-1-.4999-2.125-.625-3.125-1.125c-2.25-1.125-4.752-1.1-7.252-2.625C201.5 99.85 185.2 95.98 168.7 95.98H95.1c-9.25 0-18.05 4.061-24.18 10.93l-55.95 63.92c-.75 .9998-1.5 2.124-2.25 3.249c-8.875 13.1-3 32.87 11.63 40.74l336.6 184.3l-9.837 16.87H311.1zM105.9 204.1l-23.5-12.87l28.13-32.12h34.38L105.9 204.1zM199.5 256.1l34.9-41.28l13.5 67.61L199.5 256.1z"/>
                        </path>
                        </svg>
                    </div>
                    <div class="text">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${value.grade}</p>
                    </div>
                </div>
                <div class="flex-centered flex-space-around">
                    <div>
                        <button
                        class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall call-button"
                        tabindex="0" type="button" data-phoneNumber="${value.number}" data-cid="${value.cid}">
                        <span class="MuiButton-label">Call</span>
                        <span class="MuiTouchRipple-root"></span>
                        </button>
                    </div>
                </div>
            </div>
            </div>`
        return html;
    };

    function createEmployeesAction() {
        $(".jss1791111").empty();
        $.post('http://dev-phone/GetEmployeeInfo', {
        }, function(data){
            if ( data == false) {
                var html = "";
                html += 
                `<div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">Unemployed!</h6>
                </div>`;
                $('.jss1791111').append(html);
            } else {
                $.each(data, function(k, v){
                    $('.jss1791111').prepend(createEmployees(v));
                    $(".clicked-function-container").click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var check = $(this).parent('.component-paper').children(".drawer").css('display')
                        if (check == "flex") {
                            $(this).parent('.component-paper').children(".drawer").css("display", "none");
                            // drawer = 0
                        } else {
                            $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                            // drawer = 1
                        }
                    });
                    $('.call-button').click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var cid = $(this).attr('data-cid');
                        var number = $(this).attr('data-phoneNumber');
                        if (PhoneData.Number != number) {


                        if (!locked) {
                            locked = true;
                            setTimeout(unlock, 5000);

                            $.post('http://dev-phone/CallEmployee', JSON.stringify({
                                cid: cid,
                                number: number,
                            }), function(callback){
                                if (callback){
                                    complateInputJustGreen();
                                    var htmlse = "";
                                    htmlse +=
                                    `<div class="notification-container arama-notify-check">
                                            <div class="app-bar">
                                            <div class="icon" style="background: linear-gradient(0deg, rgba(9,147,59,1) 0%, rgba(71,216,124,1) 100%); color: white;"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                                            60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                                            464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg></div>
                                            <div class="name">
                                                <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary call-div-name"
                                                style="word-break: break-word;">"Dialing..."</p>
                                            </div>
                                            <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                                style="word-break: break-word;"></p>
                                            </div>
                                            <div class="content">
                                            <div class="text">
                                                <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary call-div2">${number}</p>
                                                <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary timer-sc"
                                                style="word-break: break-word;"><span class="timer-sc-min"></span><span class="timer-dot"></span><span class="timer-sc-sec"></span></p>
                                            </div>
                                            <div class="action-button">
                                                    <div class="action action-reject not-but" title="Hang Up"><svg aria-hidden="true" focusable="false"
                                                    data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16 fa-fw "
                                                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="currentColor"
                                                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
                                                    </path>
                                                    </svg>
                                                </div>
                                            </div>
                                            </div>
                                    </div>`
                                    if($('.arama-notify-check').length < 1){
                                        PhoneData.InCall = true
                                        $('.top-notifications-wrapper-mounted').prepend(htmlse);
                                    }
                                    $(document).ready(function() {
                                        $(".not-but").click(function() {
                                            notifymevcut = false
                                            var topNotifyReversVar = document.getElementsByClassName("notification-container")
                                            for (i = 0; i < topNotifyReversVar.length; i++) {
                                                topNotifyReversVar[i].style.animation = "cometopaparevers 0.5s";
                                                setTimeout(function() {
                                                    for (i = 0; i < topNotifyReversVar.length; i++) {
                                                        topNotifyReversVar[i].innerHTML = "";
                                                        topNotifyReversVar[i].remove();
                                                        
                                                    }
                                                }, 499)
                                            }
                                            $.post('http://dev-phone/EndCall');
                                            PhoneData.InCall = false
                                            $.post('http://dev-phone/ClosePhone');
                                            $("#main-app-container").css("display", "none");
                                            $(".jss1255").css('bottom', '18px');
                                            $(".jss1251").css('bottom', '18px');
                                        });
                                    })
                                } else {
                                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                                    60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                                    464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>`,
                                        "Phone", `${detail} is not available now! `, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
                                }                
                            })
                        }
                        } else {
                        createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
                        60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
                        464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>`,
                            "Phone", `You can't call yourself!`, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
                        }
                    })
                })
            }
        });
    };
    
    function justice() {
        $("#app-container").hide();
        $(".justice-container").fadeIn();
        PhoneData.CurrentApp = "justice";
        createdoj()

    }
    
    function employees() {
        $("#app-container").hide();
        $(".employees-container").fadeIn();
        PhoneData.CurrentApp = "employees";
        createEmployeesAction();
    }
    
    function debt() {
        $("#app-container").hide();
        $(".debt-container").fadeIn();
        PhoneData.CurrentApp = "debt";
        createDebt();
    }
    
    function lsbn() {
        $("#app-container").hide();
        $(".lsbn-container").fadeIn();
        PhoneData.CurrentApp = "lsbn";
    }
    
    function message() {
        $("#app-container").hide();
        $.post('http://dev-phone/messagesdatas', JSON.stringify({}));
        $("#messages-container").fadeIn();
        PhoneData.CurrentApp = "messages";
    }
    
    function documents() {
        $("#app-container").hide();
        $(".documents-container").show();
        PhoneData.CurrentApp = "documents";
    }
    
    function wbank() {
        $("#app-container").hide();
        $(".wbank-container").show();
        updateBankLogs();
        PhoneData.CurrentApp = "wbank";
    }
    
    function diamond() {
        PhoneData.CurrentApp = "diamond";
        $("#app-container").hide();
        $(".diamondsports-container").show();
    }
    
    function NotAvailableApp(){
         createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone-alt fa-w-16 fa-1x"><path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 
         60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 
         464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" class=""></path></svg>`,
             "Phone", `This application is not available`, "just now", "linear-gradient(167deg, rgba(249,129,121,1) 0%, rgba(184,52,96,1) 100%)")
    };
    
    PhoneData.InCall = null
    setInterval(function() {
        if(PhoneData.InCall){
            if (!PhoneData.IsOpened){
                if ($("#main-app-container").css("display") == "none"){
                    $("#main-app-container").css("display", "block");
                    $(".jss1255").css('bottom', '-550px');  
                    $(".jss1251").css('bottom', '-550px');
                } else {
                    $(".jss1255").css('bottom', '-550px');  
                    $(".jss1251").css('bottom', '-550px');
                }
            } else {
                $(".jss1255").css('bottom', '18px');  
                $(".jss1251").css('bottom', '18px');
            }
        }
    }, 400)
    
    function mainmenu() {
        if ($("#app-container").is(":visible")) {
            $.post('http://dev-phone/ClosePhone');
            PhoneData.IsOpened = false;
        } else {
            $('#camera-container').hide();
            $("#contacts-container").hide();
            $("#details-container").hide();
            $("#calls-container").hide();
            $("#ping-container").hide();
            $("#mail-container").hide();
            $("#yellow-pages-container").hide();
            $("#twatter-container").hide();
            $(".diamondsports-container").hide();
            $("#garage-container").hide();
            $("#housing-container").hide();
            $("#tinder-container").hide();
            $("#calculator-container").hide();
            $(".lsbn-container").hide();
            $(".abdultaxi-container").hide();
            $(".crypto-container").hide();
            $(".documents-container").hide();
            $("#messages-container").hide();
            $("#messages-second-container").hide();
            $(".documents-container").hide();
            $(".wbank-container").hide();
            $(".documents-container22").hide()
            $(".jobcenter-container").hide();
            $(".justice-container").hide();
            $(".debt-container").hide();
            $(".employees-container").hide();
            $("#app-container").fadeIn();
            PhoneData.CurrentApp = null;
            $.post('http://dev-phone/kapatildi', JSON.stringify({}));
        }
    }
    
    document.onkeyup = function(data) {
        if (data.which == 27) {
            mainmenu();
        }
    };
    
    
    var drawer = false
    
    $(document).ready(function() {
        $(".crypt-container").click(function() {
            if (drawer) {
                $(this).parent('.component-paper').children(".drawer").css("display", "none");
                drawer = 0
            } else {
                $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                drawer = 1
            }
        });
    })
    $(document).ready(function() {
        $(".clicked-function-container").click(function() {
            var check = $('.clicked-function-container').css('display')
            if (check == "flex") {
                $(this).parent('.component-paper').children(".drawer").css("display", "none");
                // drawer = 0
            } else {
                $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                // drawer = 1
            }
        });
    });
    // MESAJ GÖNDERME
    
    
    $(document).ready(function() {
        $(".jss47").click(function() {
            $("#messages-container").css("display", "flex");
            $("#messages-second-container").css("display", "none");
            // burdaıym kanka alo
            $.post('http://dev-phone/kapatildi', JSON.stringify({}));
    
            messagesacik = 0
        });
    
        $('#searchmessage').keyup(debounce(function() {
            messageFilter();
        }, 500));
        $('.contact-search-input').keyup(debounce(function() {
            contactsFilter();
        }, 500));
        $('.contact-search-input').keyup(debounce(function() {
            contactsFilter();
        }, 500));
        $('.emails-search-input').keyup(debounce(function() {
            emailsFilter();
        }, 500));
        $('.yellowpages-search-input').keyup(debounce(function() {
            yPagesFilter();
        }, 500));
        $('.wenmo-search-input').keyup(debounce(function() {
            wenmoFilter();
        }, 500));
        $('.debt-search-input').keyup(debounce(function() {
            debtFilter();
        }, 500));
        $('.twitter-search-input').keyup(debounce(function() {
            twitterFilter();
        }, 500));
        $('.vehicles-search-input').keyup(debounce(function() {
            vehiclesFilter();
        }, 500));
        $('.employees-search-input').keyup(debounce(function() {
            employeeFilter();
        }, 500));
        $('.jobcenter-search-input').keyup(debounce(function() {
            jobcenterFilter();
        }, 500));
        $('.doj-search-input').keyup(debounce(function() {
            dojFilter();
        }, 500));
        $('.calls-search-input').keyup(debounce(function() {
            callsFilter();
        }, 500));
    })
    
    function callsFilter(){
        var filter = $(".calls-search-input").val();
        $(".contract-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };
    
    function dojFilter(){
        var filter = $(".doj-search-input").val();
        $(".doj-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };
    
    function jobcenterFilter(){
        var filter = $(".jobcenter-search-input").val();
        $(".jobcenter-two").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };

    function employeeFilter(){
        var filter = $(".employees-search-input").val();
        $(".car-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };

    function vehiclesFilter(){
        var filter = $(".vehicles-search-input").val();
        $(".car-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };
    
    function twitterFilter(){
        var filter = $(".twitter-search-input").val();
        $(".twat-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };
    
    function debtFilter(){
        var filter = $(".debt-search-input").val();
        $(".debt-papers").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };
    
    function wenmoFilter(){
        var filter = $('.wenmo-search-input').val();
        $(".bank-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    };
    
    function yPagesFilter(){
        var filter = $('.yellowpages-search-input').val();
        $(".sari-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        }); 
    };
    
    function emailsFilter(){
        var filter = $('.emails-search-input').val();
        $(".mail-container").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        }); 
    }
    
    function messageFilter() {
        var filter = $('#searchmessage').val();
        $("ul.messages li").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    }
    
    function contactsFilter(){
        var filter = $(".contact-search-input").val();
        $(".contract-count").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        })
    }
    
    
    $(document).on('keypress', function (e) {
        let sender = $("#sendmessage").val();
        let karsinumber = $("#numbermessagesinner").attr("data-number")
        if (e.which === 13) {
            if (!sender == "") {
                if (messagesacik) {
                    $.post('http://dev-phone/sendmessagebut', JSON.stringify({
                        number: karsinumber,
                        mesaj: sender
                    }));
                    setTimeout(function(){
                        $.post('http://dev-phone/loadcontactmessages', JSON.stringify({
                            number: karsinumber
                        }));
                    }, 500);
                    $("#sendmessage").val('').empty()
                    e.preventDefault();
                }
            }
        }
    });
    
    let id = 0
    let text = "a"
    let notifytweet = "false"
    
    
    // MESAJ GÖNDERME SON
    $(document).on('keypress', function(e) {
        if (e.which === 75) {
            $("#notifyy").show()
            id = id + 1
            text = text + "qwe" + 1
            notifytweet = 1
            let username = "@pwais"
            let element = `
            <li id=` + id + ` class="notification-container">
                <div class="app-bar">
                    <div class="icon" style="background-color: rgb(0, 176, 255); color: white;"><svg aria-hidden="true"
                        focusable="false" data-prefix="fab" data-icon="twitter"
                        class="svg-inline--fa fa-twitter fa-w-16 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <path fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                        </path>
                    </svg></div>
                    <div class="name">
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">` + username + `</p>
                    </div>
                    <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">just now</p>
                </div>
                <div class="content">
                    <div class="text">
                    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">` + text + `</p>
                    </div>
                    `
            if (notifytweet == 1) {
                `
                        <div class="actions">
                        <div class="action action-reject" title="Hang Up"><svg aria-hidden="true" focusable="false"
                            data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16 fa-fw "
                            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor"
                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
                            </path>
                            </svg>
                        </div>
                        <div class="action action-accept" title="Hang On">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle"
                            class="svg-inline--fa fa-check-circle fa-w-16 fa-fw " role="img"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor"
                                d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z">
                            </path>
                            </svg>
                        </div>
                        </div>
                        `
            }
    
            `
                </div>
                </li>
            `
            $("#notifyy").prepend(element);
    
            setTimeout(function() {
                $('#' + id + '').remove();
                $("#notifyy").hide()
            }, 4000)
        }
    });
    
    
    // DOCUMENTS
    
    $(document).ready(function() {
        $("#note").click(function() {
            $(".documents-container").hide()
            $(".documents-container22").show()
        })
    
        $(".goback").click(function() {
            $(".documents-container").show()
            $(".documents-container22").hide()
        })
    })

    
    // Phone Kişi Menüler
    $(document).ready(function() {
        $(".close-kisi").click(function() {
            $(".phone-add-kisi").css("display", "none");
        });
        $(".submit-kisi").click(function() {
            var phone = $('#kisimessageinput').val();
            if (phone.length >= 10) {
                complateInput();
            }
        });
    })
    
    
    $(document).ready(function() {
        $('#kisiphoneinput').keyup(debounce(function() {
            $('#copyinputphone').text('(' + $('#kisiphoneinput').val().slice(0, 3) + ')' + ($('#kisiphoneinput').val().slice(3, 6)) + '-' + $('#kisiphoneinput').val().slice(6, 10));
        }, 1));
    })
    
    $(document).ready(function() {
        $(".yeet-button").click(function() {
            $(".phone-yett-click").css("display", "flex");
        });
    })
    
    
    $(document).ready(function() {
        $(".close-yeet").click(function() {
            $(".phone-yett-click").css("display", "none");
        });
        $(".submit-yeet").click(function() {
            complateInput();
        });
    })
    
    $(document).ready(function() {
        $(".send-message-button-kisi").click(function() {
            $(".phone-mesage-kisi").css("display", "flex");
        });
    })
    
    $(document).ready(function() {
        $(".close-message").click(function() {
            $(".phone-mesage-kisi").css("display", "none");
        });
        $(".submit-message").click(function() {
            complateInput();
        });
    })

    $(document).ready(function() {
        $(".tinderbuttondislike").click(function() {
            UpdateTinderProfileList()
        });
        $(".tinderbuttonlike").click(function() {
            complateInputJustGreen();
            UpdateTinderProfileList()
        }); 
    })   
    
    $(document).ready(function() {
        $('#kisimessageinput').keyup(debounce(function() {
            $('#copyinputmessage').text('(' + $('#kisimessageinput').val().slice(0, 3) + ')' + ($('#kisimessageinput').val().slice(3, 6)) + '-' + $('#kisimessageinput').val().slice(6, 10));
        }, 1));
    })
    
    $(document).ready(function() {
        $('#bankammount').keyup(debounce(function() {
            $('#bankammounttext').text('$' + $('#bankammount').val() + '.00');
        }, 1));
    })

    $(document).ready(function() {
        $('#timeammount').keyup(debounce(function() {
        //    $('#timeammounttext').text('$' + $('#timeammount').val() + '.00');
            $('#timeammounttext').text($('#timeammount').val().slice(0, 2) +':'+ $('#timeammount').val().slice(2, 4));
        }, 1));
    })
    
    $(document).ready(function() {
        $('.jss1793').click(function() {
            $('.callform').css('display', 'flex')
        });
        $('#contract-clear').click(function() {
            $('.contract-phone-input').val('');
            $('#arama-form').removeClass('Mui-focused');
            $('#copycontractnumber').text('');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });
        $('#close-contract').click(function() {
            $('.callform').css('display', 'none');
            $('.contract-phone-input').val('');
            $('#arama-form').removeClass('Mui-focused');
            $('#copycontractnumber').text('');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });
        $('.contract-phone-input').keyup(debounce(function() {
            // $('#copycontractnumber').text('(' + $('.contract-phone-input').val().slice(0, 3) + ') ' + ($('.contract-phone-input').val().slice(3, 6)) + '-' + $('.contract-phone-input').val().slice(6, 10));
            $("#copycontractnumber").text($(".contract-phone-input").val());
        }, 1));
    
        function createArama() {
            var phone = $('#copycontractnumber').text();
            var html = "";
            html +=
                `<div class="component-paper arama-div arama-count">
                <div class="main-container">
                   <div class="image">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone-alt" class="svg-inline--fa fa-phone-alt fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                         <path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z">
                         </path>
                      </svg>
                   </div>
                   <div class="details ">
                      <div class="title ">
                         <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${phone}</p>
                      </div>
                      <div class="description ">
                         <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">just now</p>
                      </div>
                   </div>
                </div>
             </div>`
            return html;
        };
    
        function createAramaAction() {
            $('.jss17911').prepend(createArama());
            $('.arama-div').click(function() {
                var number = $(this).children('div').children('.details').children('.title').children('p').text();
                createNotifyCallAction("Dialing...", `${number}`);
            })
        };
        $('.call-contract').click(function() {
            if ($('.contract-phone-input').val().length > 0) {
                var phoneAm = $('#copycontractnumber').text();
                createNotifyCallAction("Dialing...", `${phoneAm}`);
                $('.callform').css('display', 'none');
                createAramaAction();
                $('.contract-phone-input').val('');
                $('#arama-form').removeClass('Mui-focused');
                $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                $('#copycontractnumber').text('');
            }
        });
    })
    
    $(document).ready(function() {
        $('.contract-message-input').keyup(debounce(function() {
            $('#copymessagenumber').text('(' + $('.contract-message-input').val().slice(0, 3) + ') ' + ($('.contract-message-input').val().slice(3, 6)) + '-' + $('.contract-message-input').val().slice(6, 10));
        }, 1));
        var randomId = Math.floor(Math.random() * 100) + 1;
    
        function createInsideMessage() {
            var messageNumber = $('#copymessagenumber').text();
            var messageText = $('.message-text').val();
            var html = "";
            html += `
            <div class="messages-container messages-container-undefined messageaction" randomid=${randomId}>
               <div class="contact-info">
                  <div class="icon">
                     <svg aria-hidden="true" focusable="false" data-prefix="fas"
                        data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16 fa-fw fa-2x " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                        <path fill="currentColor"
                           d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
                        </path>
                     </svg>
                  </div>
                  <div class="text">
                     <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">${messageNumber}</p>
                  </div>
               </div>
               <ul class="messages">
                       <li class="message message-out">
                       <div class="inner inner-out">
                          <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                             style="word-break: break-word;">${messageText}</p>
                       </div>
                       <div class="timestamp timestamp-out">
                          <p class="MuiTypography-root timestamp MuiTypography-body2 MuiTypography-colorTextPrimary"
                             style="word-break: break-word;">just now</p>
                       </div>
                    </li>
               </ul>
               <div class="send-message"><textarea id="sendmessage" placeholder="Send message..."></textarea></div>
            </div>`
            $(".message-paper").click(function() {
                let elements = document.getElementsByClassName('messageaction')
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].style.display === "none") {
                        elements[i].style.display = "none";
                    } else {
                        elements[i].style.display = "none";
                    }
                }
                randomid = $(this).attr("randomid")
            });
            return html;
        };
    
        function createInsideMessageAction() {
            $('.jss1166').append(createInsideMessage());
        }
    
        $('.jss1161').click(function() {
            $('.messageform').css('display', 'flex');
        })
        $('.m-b1').click(function(){
            var messageNumber = $('.contract-message-input').val();
            var messageText = $('.message-text').val();
    
            if(messageNumber.length == 10 && messageText.length >= 1){
                complateInput();
                setTimeout(function(){
                    $.post('http://dev-phone/sendmessagebut', JSON.stringify({
                        number: messageNumber,
                        mesaj: messageText
                    }));
                    $('.nothing-message').css('display', 'none');
                    $('.messageform').css('display', 'none');
                    $('.contract-message-input').val('');
                    $('#message-form').removeClass('Mui-focused');
                    $('#copymessagenumber').text('');
                    $('.message-text').val('');
                    $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
                },3700)
            }
        })
        $('#message-clear').click(function() {
            $('.contract-message-input').val('');
            $('#message-form').removeClass('Mui-focused');
            $('#copymessagenumber').text('');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });
        $('#close-message').click(function() {
            $('.messageform').css('display', 'none');
            $('.contract-message-input').val('');
            $('#message-form').removeClass('Mui-focused');
            $('.message-text').val('');
            $('#copymessagenumber').text('');
            $('.wbp-text').removeClass('MuiInputLabel-shrink Mui-focused')
        });
    })
    
    $(document).ready(function() {
        function createSari() {
            $.post('http://dev-phone/GetAdverts', function(adverts){
                $.each(adverts, function(__, advert){
                    var sariName = advert.company
                    var sariDetail = advert.text
                    var phoneNumber = advert.number;
                    var html = "";

                    if (sariDetail.search(".jpg") > 0 || sariDetail.search(".gif") > 0 || sariDetail.search(".png") > 0)
                    {
                    html +=
                    `
                    <div class="jss1995 jss2010 sari-count">
                        <div style="padding: 8px;">
                            <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                            <img src="${sariDetail}" style="position:center" width="220" height="120">
                            </p>
                        </div>
                        <div class="jss1996 jss2011">
                            <div class="jss1997 jss2012" title="Sky Turner" style="flex: 1 1 0%;">
                                <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;"> ${sariName}</p>
                            </div>
                            <button title="Call" class="call-sari" style="flex: 1 1 0%; background-color: transparent; outline: none; border: none;">
                                <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;">${phoneNumber}</p>
                            </button>
                        </div>
                    </div>`
                    $('.jss2003').prepend(html);
                    $('.call-sari').click(function() {
                        var number = $(this).children('p').text();
                        createNotifyCallAction("Dialing...", `${number}`);
                    });  
                    } else {
                    html +=
                    `
                    <div class="jss1995 jss2010 sari-count">
                        <div style="padding: 8px;">
                            <p class="MuiTypography-root MuiTypography-body2" style="word-break: break-word;"> 
                            ${sariDetail}
                            </p>
                        </div>
                        <div class="jss1996 jss2011">
                            <div class="jss1997 jss2012" title="Sky Turner" style="flex: 1 1 0%;">
                                <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;"> ${sariName}</p>
                            </div>
                            <button title="Call" class="call-sari" style="flex: 1 1 0%; background-color: transparent; outline: none; border: none;">
                                <p class="MuiTypography-root MuiTypography-body2" style="font-size: 0.75rem;">${phoneNumber}</p>
                            </button>
                        </div>
                    </div>`
                    $('.jss2003').prepend(html);
                    $('.call-sari').click(function() {
                        var number = $(this).children('p').text();
                        createNotifyCallAction("Dialing...", `${number}`);
                    });
                    }
                })
            })
        };
    
        $('.jss2005').click(function() {
            $('.sari-add').css('display', 'flex');
        })
        $('.close-sari').click(function() {
            $('.sari-add').css('display', 'none');
            $('#saridetailinput').val('');
            $('#sari-name').val('');
        });
        $('.submit-sari').click(function() {
            var sariName = $('#sari-name').val();
            var sariDetail = $('#saridetailinput').val();
            if (sariDetail.length >= 1 && sariName.length >= 1) {
                $.post('http://dev-phone/SendAdvert', JSON.stringify({
                    "name": sariName,
                    "detail": sariDetail
                }))
                complateInput();
                $(".jss2003").empty()
                setTimeout(function(){
                    createSari();
                }, 1000)
                $('.sari-add').css('display', 'none');
                $('#saridetailinput').val('');
                $('#sari-name').val('');
            }
        });
        createSari()
    })
    
    //#LSBN
    $(document).ready(function() {
        $('.ls-1').click(function() {
            $('.jss2675').css('left', '-37px');
        })
        $('.ls-2').click(function() {
            $('.jss2675').css('left', '122px');
        })
    })
    
    //#Camera 
    function createCamera() {
        $.post('http://dev-phone/TakePhoto')
        $(".camera-inside").empty();
        $.post('http:/dev-phone/GetCameras', function(cameras){
            if (cameras.length == 0) {
                let html = "";
                html += `
                <div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">Nothing Here!</h6>
                </div>
                `
                $(".camera-inside").append(html);
            }
            $.each(cameras, function(__, camera){
                var random = Math.floor(Math.random() * 100000) + 1;
                var name = camera.name;
                var html = "";
                html +=
                `
                <div camerahover=${random} class="component-paper camera-count" style="width: 100%;">
                    <div class="main-container">
                        <div class="image">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="camera" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-camera fa-w-16 fa-3x"><path fill="currentColor" d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z" class=""></path></svg>
                        </div>
                        <div class="details ">
                            <div class="title ">
                            <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${name}</p>
                            </div>
                        </div>
                        <div camerahover="${random}" class="actions actions-show">
                            <div title="View" class="eye-camera" cameraid="${name}">
                            <svg style="font-size: 2.3vh;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-1x"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                            </div>
                        </div>
                    </div>
                </div>`
                $('.camera-inside').append(html);
                $(".eye-camera").click(function() {
                    var cameraId = $(this).attr('cameraid');
                    $.post('http:/dev-phone/OpenCamera', JSON.stringify({
                        "name": cameraId
                    }));
                })
                $(".component-paper").mouseover(function() {
                    overid = $(this).attr("camerahover")
                    $(".actions[camerahover=" + overid + "]").css("display", "flex");
                }).mouseout(function() {
                    $(".actions").css("display", "none");
                });
            })
        })
    };

    function CreateTinderProfile(value){
        var random = Math.floor(Math.random() * 10000) + 1;
        var html = "";
            html += 
            `<div hoverid=${random} class="component-paper" style="width: 100%;" id="current-profile-list">
                <div class="main-container">
                    <div class="image">
                        <img src=${value.picture} style="position:center" width="220" height="120">
                    </div>
                </div>
                <div class="details">
                    <div class="title">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                            style="word-break: break-word;">Name: ${value.userName}</p>
                    </div>
                    <div class="description">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                            style="word-break: break-word;">Bio: ${value.bio}</p>
                    </div>
                </div>
            </div>
            `;
    return html;
    }

    function CreateTinderMatch(value){
        var random = Math.floor(Math.random() * 10000) + 1;
        var html = "";
            html += 
            `<div hoverid=${random} class="component-paper" style="width: 100%;" id="current-match-list">
                <div class="main-container">
                    <div class="image">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="house-user"
                        class="svg-inline--fa fa-house-user fa-w-18 fa-fw fa-3x " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor"
                            d="M570.69,236.27,512,184.44V48a16,16,0,0,0-16-16H432a16,16,0,0,0-16,16V99.67L314.78,10.3C308.5,4.61,296.53,0,288,0s-20.46,4.61-26.74,10.3l-256,226A18.27,18.27,0,0,0,0,248.2a18.64,18.64,0,0,0,4.09,10.71L25.5,282.7a21.14,21.14,0,0,0,12,5.3,21.67,21.67,0,0,0,10.69-4.11l15.9-14V480a32,32,0,0,0,32,32H480a32,32,0,0,0,32-32V269.88l15.91,14A21.94,21.94,0,0,0,538.63,288a20.89,20.89,0,0,0,11.87-5.31l21.41-23.81A21.64,21.64,0,0,0,576,248.19,21,21,0,0,0,570.69,236.27ZM288,176a64,64,0,1,1-64,64A64,64,0,0,1,288,176ZM400,448H176a16,16,0,0,1-16-16,96,96,0,0,1,96-96h64a96,96,0,0,1,96,96A16,16,0,0,1,400,448Z">
                        </path>
                    </svg>
                    </div>
                    <div class="details">
                    <div class="title">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                            style="word-break: break-word;">Name: ${value.userName}</p>
                    </div>
                    <div class="description">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                            style="word-break: break-word;">Number: ${value.number}</p>
                    </div>
                    </div>
                </div>
            </div>
            `;
    return html;
    }

    function UpdateTinderProfileList(){
        $.post('http:/dev-phone/GetTinderProfileList', function(data){
            $("#current-profile-list").empty();
            if ( data == false) {
                var html = "";
                html += 
                `<div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">No one around you!</h6>
                </div>`;
                $('#current-profile-list').append(html);
            }
            else {
                var random = Math.floor(Math.random() * data.length );
    //            const uniqueArr = [... new Set(swipedprofiles.map(data => data.name))]
                // console.log(swipedprofiles.length)
                // if (swipedprofiles[random] == true) {
                //     random = Math.floor(Math.random() * data.length - swipedprofiles.length);
                // }
                //   swipedprofiles[random] = true;
            //    console.log(random)
                $('#current-profile-list').prepend(CreateTinderProfile(data[random]));
            }
        })
    }
    
    function UpdateTinderMatchList(){
        $.post('http:/dev-phone/GetTinderMatchList', function(data){
         //   console.log(data)
            $("#current-match-list").empty();
            if ( data == false) {
                var html = "";
                html += 
                `<div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">No one loves you!</h6>
                </div>`;
                $('#current-match-list').append(html);
            }
            else {
                $.each(data, function(k, v){
                $('#current-match-list').prepend(CreateTinderMatch(v));
                })
            }
        })
    }


    function CreateHouse(value){
        var html = "";
            html += 
            `<div hoverid="3" class="component-paper" style="width: 100%;" id="current-house-list">
                <div class="main-container">
                    <div class="image">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="house-user"
                        class="svg-inline--fa fa-house-user fa-w-18 fa-fw fa-3x " role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor"
                            d="M570.69,236.27,512,184.44V48a16,16,0,0,0-16-16H432a16,16,0,0,0-16,16V99.67L314.78,10.3C308.5,4.61,296.53,0,288,0s-20.46,4.61-26.74,10.3l-256,226A18.27,18.27,0,0,0,0,248.2a18.64,18.64,0,0,0,4.09,10.71L25.5,282.7a21.14,21.14,0,0,0,12,5.3,21.67,21.67,0,0,0,10.69-4.11l15.9-14V480a32,32,0,0,0,32,32H480a32,32,0,0,0,32-32V269.88l15.91,14A21.94,21.94,0,0,0,538.63,288a20.89,20.89,0,0,0,11.87-5.31l21.41-23.81A21.64,21.64,0,0,0,576,248.19,21,21,0,0,0,570.69,236.27ZM288,176a64,64,0,1,1-64,64A64,64,0,0,1,288,176ZM400,448H176a16,16,0,0,1-16-16,96,96,0,0,1,96-96h64a96,96,0,0,1,96,96A16,16,0,0,1,400,448Z">
                        </path>
                    </svg>
                    </div>
                    <div class="details">
                    <div class="title">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                            style="word-break: break-word;">House: ${value.id}</p>
                    </div>
                    <div class="description">
                        <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                            style="word-break: break-word;">Tier ${value.shell}</p>
                    </div>
                    </div>
                </div>
            </div>
            `;
    return html;
    }

    function UpdateHouseList(){
        $.post('http:/dev-phone/GetHouseList', function(data){
         //   console.log(data)
            $("#current-house-list").empty();
            if ( data == false) {
                var html = "";
                html += 
                `<div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">No houses owned!</h6>
                </div>`;
                $('#current-house-list').append(html);
            }
            else {
                $.each(data, function(k, v){
                $('#current-house-list').prepend(CreateHouse(v));
                })
            }
            // let html = "";
            // html += `
            // <div class="main-container">
            //     <div class="image">
            //     <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="house-user"
            //         class="svg-inline--fa fa-house-user fa-w-18 fa-fw fa-3x " role="img"
            //         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            //         <path fill="currentColor"
            //             d="M570.69,236.27,512,184.44V48a16,16,0,0,0-16-16H432a16,16,0,0,0-16,16V99.67L314.78,10.3C308.5,4.61,296.53,0,288,0s-20.46,4.61-26.74,10.3l-256,226A18.27,18.27,0,0,0,0,248.2a18.64,18.64,0,0,0,4.09,10.71L25.5,282.7a21.14,21.14,0,0,0,12,5.3,21.67,21.67,0,0,0,10.69-4.11l15.9-14V480a32,32,0,0,0,32,32H480a32,32,0,0,0,32-32V269.88l15.91,14A21.94,21.94,0,0,0,538.63,288a20.89,20.89,0,0,0,11.87-5.31l21.41-23.81A21.64,21.64,0,0,0,576,248.19,21,21,0,0,0,570.69,236.27ZM288,176a64,64,0,1,1-64,64A64,64,0,0,1,288,176ZM400,448H176a16,16,0,0,1-16-16,96,96,0,0,1,96-96h64a96,96,0,0,1,96,96A16,16,0,0,1,400,448Z">
            //         </path>
            //     </svg>
            //     </div>
            //     <div class="details">
            //     <div class="title">
            //         <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
            //             style="word-break: break-word;">House: ${v.id}</p>
            //     </div>
            //     <div class="description">
            //         <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
            //             style="word-break: break-word;">Tier ${v.shell}</p>
            //     </div>
            //     </div>
            //     <div hoverid="3" class="actions actions-show">
            //     <div title="Set GPS" class="">
            //         <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marked"
            //             class="svg-inline--fa fa-map-marked fa-w-18 fa-fw fa-lg " role="img"
            //             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            //             <path fill="currentColor"
            //                 d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z">
            //             </path>
            //         </svg>
            //     </div>
            //     </div>
            // </div>
            // `;
 //           $("#current-house-list").append(html);
        })
    }
    //#Twat
    $(document).ready(function() {
        var rtMessageUser;
        var rtMessageDetail;
        $('.rt-btn').click(function() {
            $('.send-twat-form').css('display', 'flex');
            rtMessageUser = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('.twat-user').children('p').html();
            rtMessageDetail = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('#twat-comment').children('p').html();
            var valueRt = `RT ${rtMessageUser} ${rtMessageDetail}`
            $('.twat-message').val(`${valueRt}`);
        });
        $('.t-reply-button').click(function() {
            $('.send-twat-form').css('display', 'flex');
            rtMessageUser = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('.twat-user').children('p').html();
            var valueRt = `${rtMessageUser}`
            $('.twat-message').val(`${valueRt}`);
        });
    
        function createTwat() {
            $(".jss2277").empty();
            $.post('http://dev-phone/GetTweets', function(tweets){
                $.each(tweets, function(__, tweet){
                    var nameOf = tweet.name;
                    var detailOf = tweet.text;
                    var photoOf = tweet.attachment;
                    var date = new Date(tweet.time);
                    var timer = moment(date).fromNow();
                    var imageCheck;
                    var number;
                    var hide;
                    if (photoOf == '') {
                        imageCheck = 'none'
                        number = 0;
                        hide = '';
                    } else {
                        imageCheck = 'flex';
                        number = 1;
                        hide = 'Hide (click image to copy URL)';
                    }
                    var html = "";
                    html +=
                        `<div id="twat-box" class="twat-count">
                    <div class="twat-user">
                       <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary" style="word-break: break-word;">@${nameOf}</p>
                    </div>
                    <div id="twat-comment">
                       <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">
                            ${detailOf}
                       </p>
                    </div>
                    <div class="component-image-container" style="min-height: 0;">
                       <div>
                          <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">Images attached: ${number}</p>
                          <div>
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" photourl="${photoOf}" style="text-decoration: underline;" id="hide-tweet">${hide}</p>
                          </div>
                       </div>
                       <div class="container container-max-height" style="display: ${imageCheck}">
                          <div class="blocker">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                                </path>
                             </svg>
                             <p class="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextPrimary" style="word-break: break-word;">Click to View</p>
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="text-align: center; margin-top: 8px;">Only reveal images from those you know are not
                                total pricks
                             </p>
                          </div>
                          <div class="image twat-image-con" style="background-image: url(${photoOf}); display: none;">
                          </div>
                          <!-- <div class=""></div>
                          <div class="spacer"></div> -->
                       </div>
                    </div>
                    <div class="twat-low" style="margin-top: 8px;">
                       <div class="twat-low-icons">
                          <div title="Reply" class="t-reply-button">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="reply" class="svg-inline--fa fa-reply fa-w-16 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z">
                                </path>
                             </svg>
                          </div>
                          <div title="RT" class="rt-btn">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="retweet" class="svg-inline--fa fa-retweet fa-w-20 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path fill="currentColor" d="M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z">
                                </path>
                             </svg>
                          </div>
                          <div title="Report" class="twat-report">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flag" class="svg-inline--fa fa-flag fa-w-16 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z">
                                </path>
                             </svg>
                          </div>
                       </div>
                       <div class="twat-low-time">
                          <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary" style="word-break: break-word;">${timer}</p>
                       </div>
                    </div>
                 </div>`
                    $('.jss2277').prepend(html);
                    $('.blocker').click(function() {
                        $(this).css('display', 'none');
                        $(this).parent('.container-max-height').children('.twat-image-con').css('display', 'block')
                    });
                    $('.rt-btn').click(function() {
                        $('.send-twat-form').css('display', 'flex');
                        rtMessageUser = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('.twat-user').children('p').html();
                        rtMessageDetail = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('#twat-comment').children('p').html();
                        var valueRt = `RT ${rtMessageUser} ${rtMessageDetail}`
                        $('.twat-message').val(`${valueRt}`);
                    });
                    $('.t-reply-button').click(function() {
                        $('.send-twat-form').css('display', 'flex');
                        rtMessageUser = $(this).parent('.twat-low-icons').parent('.twat-low').parent('#twat-box').children('.twat-user').children('p').html();
                        var valueRt = `${rtMessageUser}`
                        $('.twat-message').val(`${valueRt}`);
                    });
                    $('.twat-report').click(function() {
                        complateInputJustGreen();
                    });
                    $('.twat-image-con').click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
    
                        var bg = $(this).css('background-image');
                        bg = /^url\((['"]?)(.*)\1\)$/.exec(bg);
                        bg = bg ? bg[2] : ""; // If matched, retrieve url, otherwise ""                
                        copyToClipboard(bg);

                        if (bg != "" && !enlargedImg) {
                            enlargedImg = true
                            var htmlImage = `<img src="${bg}" style="position:absolute" width="600" height="337" />`
                            $('.PictureEnlarger').prepend(htmlImage);
                          }
                        else if (bg != "" && enlargedImg) {
                            // Set image size to original
                            enlargedImg = false
                            $('.PictureEnlarger').html('');
                        }
                    });
                })
            })
        };
    
        function cleareTwat() {
            $('.twat-message').val('');
            $('.twat-attach').val('');
            $('#twat-lenght').text('0/255');
        }
    
        $('.blocker').click(function() {
            $(this).css('display', 'none');
            $(this).parent('.container-max-height').children('.twat-image-con').css('display', 'block')
        });
        $('.jss2279').click(function() {
            $('.send-twat-form').css('display', 'flex');
        });
    
        function cleareTwatForm() {
            $('.twat-message').val('');
            $('.twat-attach').val('');
            $('#twat-lenght').text('');
        }
        $('.twat-message').keyup(debounce(function() {
            var i = $('.twat-message').val().length;
            $('#twat-lenght').text(`${i}` + '/255');
        }, 1));
        $('.close-twat').click(function() {
            $('.send-twat-form').css('display', 'none');
            cleareTwat();
        });
        $('.submit-twat').click(function() {
            if ($('.twat-message').val() == '') {
    
            } else {
                var msg = $('.twat-message').val()
                var attach = $('.twat-attach').val()
                $.post('http://dev-phone/SendTweet', JSON.stringify({
                    "message": msg,
                    "attachment": attach,
                    "VPN": PhoneData.VPN
                }))
                complateInputJustGreen();
                cleareTwatForm();
                cleareTwat();
                $('.jss2277').empty();
                createTwat();
            }
        });
        $('.twat-report').click(function() {
            complateInputJustGreen();
        });
        createTwat();
    })
    
    //#House Button Functions
    $(document).ready(function() {
        function noPropty() {
            $('.h-no').css('display', 'flex');
            $('.h-no-close').click(function() {
                $('.h-no').css('display', 'none');
            })
        }
        $('.h-check').click(function() {
            noPropty();
        });
        $('.h-edit').click(function() {
            noPropty();
        });
        // $(".upgrade-button").click(function(){
        //     $.post('http:/dev-phone/UpgradeHouse', JSON.stringify({
        //         "level": upgrade
        //     }), function(data){
        //         if(data){
        //             setTimeout(function(){
        //                 UpdateHouseList();
        //             })
        //         }
        //     })
        // })
        $('.upgrade-button').click(function() {
            let upgrade = $(this).attr("data-level");
            $('.h-upgrade').css('display', 'flex');
            $('#close-h-sure').click(function() {
                $('.h-upgrade').css('display', 'none');
            });
            $('#confirm-h-sure').click(function() {
                $.post('http:/dev-phone/UpgradeHouse', JSON.stringify({
                    "level": upgrade
                }), function(data){
                    if(data){
                        complateInput();
                        UpdateHouseList();
                        setTimeout(function() {
                            $('.h-upgrade').css('display', 'none');
                            createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                            "Housing", `Property has been sold!`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                        }, 3700)
                    }
                })
            });
        })

        $('.t-check').click(function() {
            underconstruction();
        });
        $('.t-edit').click(function() {
            underconstruction();
        });

        function underconstruction() {
            $('.t-no').css('display', 'flex');
            $('.t-no-close').click(function() {
                $('.t-no').css('display', 'none');
            })
        }
    })
    
    //Send Ping
    $(document).ready(function() {
        $('.send-ping').click(function() {
            var ping = $('.send-value').val();
            $.post('http://dev-phone/SendPing', JSON.stringify({
                "id": ping,
                "anon": false,
            }), function(data) {
                if (data){
                    $('.send-value').val('');
                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                    "Pinger", `Ping request sended!`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                } else {
                    $('.send-value').val('');
                    createNotifyAction(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-1x"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" class=""></path></svg>`,
                    "Pinger", `Something went wrong!`, "just now", "linear-gradient(180deg, rgba(109,0,251,1) 0%, rgba(93,89,252,1) 100%);")
                }
            })
    
        });
    })
    
    // Car Create Function
        function createdoj() {
            $(".jss27173").empty();
            $.post('http://dev-phone/GetCases', function(data) {
                if (data.length == 0) {
                    let html = "";
                    html += `
                    <div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                    class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                        <path fill="currentColor"
                        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                        </path>
                    </svg>
                    <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">Nothing Here!</h6>
                    </div>
                    `
                    $(".jss27173").append(html);
                }
            $.each(data, function(__, cases) {
                var judge = cases.judge;
                var date = cases.date;
                var time = cases.time;
                var criminal = cases.victim;
                var html = "";
                html +=
                    `<div class="component-paper doj-count">
                    <div class="main-container clicked-function-container">
                       <div class="image">
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gavel" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-gavel fa-w-16 fa-3x"><path fill="currentColor" d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657L329.608 69.255l5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l124.451-124.451c9.372-9.372 9.372-24.568 0-33.941z" class=""></path></svg>
                       </div>
                       <div class="details ">
                          <div class="title ">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">Case</p>
                          </div>
                          <div class="description ">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${date} | ${time}</p>
                          </div>
                       </div>
                    </div>
                    <div class="drawer">
                       <div class="item">
                          <div class="icon" title="Location">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt"
                                class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-fw " role="img"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path fill="currentColor"
                                   d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z">
                                </path>
                             </svg>
                          </div>
                          <div class="text">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">Department Of Justice</p>
                          </div>
                       </div>
                       <div class="item">
                          <div class="icon" title="Criminal">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="briefcase" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-briefcase fa-w-16 fa-1x"><path fill="currentColor" d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z" class=""></path></svg>
                          </div>
                          <div class="text">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${criminal}</p>
                          </div>
                       </div>
                       <div class="item" title="Judge">
                          <div class="icon">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="balance-scale" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-balance-scale fa-w-20 fa-1x"><path fill="currentColor" d="M256 336h-.02c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0C-2.06 328.75.02 320.33.02 336H0c0 44.18 57.31 80 128 80s128-35.82 128-80zM128 176l72 144H56l72-144zm511.98 160c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0-87.12 174.26-85.04 165.84-85.04 181.51H384c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02zM440 320l72-144 72 144H440zm88 128H352V153.25c23.51-10.29 41.16-31.48 46.39-57.25H528c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H383.64C369.04 12.68 346.09 0 320 0s-49.04 12.68-63.64 32H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h129.61c5.23 25.76 22.87 46.96 46.39 57.25V448H112c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" class=""></path></svg>
                          </div>
                          <div class="text">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${judge}</p>
                          </div>
                       </div>
                       <div class="item" title="Clock">
                          <div class="icon">
                             <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-clock fa-w-16 fa-1x"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z" class=""></path></svg>
                          </div>
                          <div class="text">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${time}</p>
                          </div>
                       </div>
                       <div class="item" title="Date">
                          <div class="icon">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-day" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-calendar-day fa-w-14 fa-1x"><path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-96zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z" class=""></path></svg>
                          </div>
                          <div class="text">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${date}</p>
                          </div>
                       </div>
                    </div>
                 </div>`
                 
                $('.jss27173').append(html);

                $(".clicked-function-container").click(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var check = $(this).parent('.component-paper').children(".drawer").css('display')
                    if (check == "flex") {
                        $(this).parent('.component-paper').children(".drawer").css("display", "none");
                        // drawer = 0
                    } else {
                        $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                        // drawer = 1
                    }
                });

                })
            });
        };
    
        function createdojAction() {
            createdoj()
        };
    // Debt Functions
    function createDebt() {
        $.post('http://dev-phone/GetDebts', {}, function(data) {
            $(".jss271711").empty();
            if (data.length == 0) {
                let html = "";
                html += `
                <div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                    <path fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                    </path>
                </svg>
                <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                    style="word-break: break-word;">Nothing Here!</h6>
                </div>
                `
                $(".jss271711").append(html);
            }
            $.each(data, function(__, debt) {
                var price = debt.amount;
                var date = debt.date;
                var title = debt.label;
                var html = "";
                html +=
                    `<div class="component-paper debt-papers" id="debt-${debt.id}">
                    <div class="main-container clicked-function-container debt-count" id="${debt.id}">
                       <div class="image">
                       <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="receipt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-receipt fa-w-12 fa-3x"><path fill="currentColor" d="M358.4 3.2L320 48 265.6 3.2a15.9 15.9 0 0 0-19.2 0L192 48 137.6 3.2a15.9 15.9 0 0 0-19.2 0L64 48 25.6 3.2C15-4.7 0 2.8 0 16v480c0 13.2 15 20.7 25.6 12.8L64 464l54.4 44.8a15.9 15.9 0 0 0 19.2 0L192 464l54.4 44.8a15.9 15.9 0 0 0 19.2 0L320 464l38.4 44.8c10.5 7.9 25.6.4 25.6-12.8V16c0-13.2-15-20.7-25.6-12.8zM320 360c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h240c4.4 0 8 3.6 8 8v16zm0-96c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h240c4.4 0 8 3.6 8 8v16zm0-96c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h240c4.4 0 8 3.6 8 8v16z" class=""></path></svg>
                       </div>
                       <div class="details ">
                          <div class="title ">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">$${price}</p>
                          </div>
                          <div class="description ">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${title}</p>
                          </div>
                       </div>
                    </div>
                    <div class="drawer" id="drawer-${debt.id}">
                       <div class="item">
                          <div class="icon">
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-calendar fa-w-14 fa-1x"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z" class=""></path></svg>
                          </div>
                          <div class="text">
                             <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                style="word-break: break-word;">${date}</p>
                          </div>
                       </div>
                       <div class="flex-centered flex-space-around">
                          <div>
                             <button
                                class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall pawynow-button"
                                tabindex="0" type="button" debt-id="${debt.id}">
                             <span class="MuiButton-label">PAY NOW</span>
                             <span class="MuiTouchRipple-root"></span>
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>`
                $('.jss271711').append(html);
                $(".clicked-function-container").click(function(e) {
                    let div = this
                    var check = $("#drawer-"+$(div).attr("id")).css('display')
                    if (check == "flex") {
                        $("#drawer-"+$(div).attr("id")).css("display", "none");
                    } else {
                        $("#drawer-"+$(div).attr("id")).css("display", "flex");
                    }
                });
                $(".pawynow-button").click(function(e) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                    let debtId = $(this).attr("debt-id")
                    $.post('http://dev-phone/PayInvoice', JSON.stringify({
                        "id": debtId
                    }), function(data) {
                        if (data.status == true){
                            $("#debt-"+debtId).remove();
                            createNotifyAction(`<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>`,
                             "Debt", data.text, "just now", "linear-gradient(0deg, rgba(215,231,254,1) 0%, rgba(255,255,255,1) 100%)");
                        } else {
                            createNotifyAction(`<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>`,
                             "Debt", data.text, "just now", "linear-gradient(0deg, rgba(215,231,254,1) 0%, rgba(255,255,255,1) 100%)");
                        }
                    })
                });
            })
        })
    };
    // $(document).ready(function() {
    
    //     // function createDebtAction() {
    //     //     createNotifyAction(`<svg style="color: #ff1449" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="donate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-donate fa-w-16 fa-1x"><path fill="currentColor" d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z" class=""></path></svg>`,
    //     //         "Debt", `You have a new debt`, "just now", "linear-gradient(0deg, rgba(215,231,254,1) 0%, rgba(255,255,255,1) 100%)");
    //     // };
    //     createDebt()
    // });
    // DOJ Functions
    $(document).ready(function() {
        createdojAction()
    });
    
    // #Diamond App
    $(document).ready(function() {
        function createDiamond() {
            $.post('http://dev-phone/GetEvents', JSON.stringify({
            }), function(events){
                if (events.length == 0) {
                    let html = "";
                    html += `
                    <div class="flex-centered" style="padding: 32px; flex-direction: column; text-align: center;">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="frown"
                    class="svg-inline--fa fa-frown fa-w-16 fa-fw fa-3x " role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496 512" style="color: white; margin-bottom: 32px;">
                        <path fill="currentColor"
                        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm170.2 218.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320s86.3 19.6 114.7 53.8c13.6 16.2-11 36.7-24.5 20.4z">
                        </path>
                    </svg>
                    <h6 class="MuiTypography-root MuiTypography-h6 MuiTypography-colorTextPrimary"
                        style="word-break: break-word;">Nothing Here!</h6>
                    </div>
                    `
                    $(".jss271733").append(html);
                }
                $.each(events, function(__, event){
                    var date = event.date;
                    var time = event.time;
                    var html = "";
                    html +=
                        `<div class="component-paper diamond-count">
                        <div class="main-container clicked-function-container">
                           <div class="image">
                              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="gem" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-gem fa-w-18 fa-3x"><path fill="currentColor" d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z" class=""></path></svg>
                           </div>
                           <div class="details ">
                              <div class="title ">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                    style="word-break: break-word;">Event</p>
                              </div>
                              <div class="description ">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                    style="word-break: break-word;">${date} | ${time}</p>
                              </div>
                           </div>
                        </div>
                        <div class="drawer">
                           <div class="item">
                              <div class="icon" title="Location">
                                 <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt"
                                    class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-fw " role="img"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path fill="currentColor"
                                       d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z">
                                    </path>
                                 </svg>
                              </div>
                              <div class="text">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                    style="word-break: break-word;">Diamond Casino</p>
                              </div>
                           </div>
                           <div class="item" title="Clock">
                              <div class="icon">
                                 <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-clock fa-w-16 fa-1x"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z" class=""></path></svg>
                              </div>
                              <div class="text">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                    style="word-break: break-word;">${time}</p>
                              </div>
                           </div>
                           <div class="item" title="Date">
                              <div class="icon">
                                 <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-day" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-calendar-day fa-w-14 fa-1x"><path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-96zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z" class=""></path></svg>
                              </div>
                              <div class="text">
                                 <p class="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextPrimary"
                                    style="word-break: break-word;">${date}</p>
                              </div>
                           </div>
                        </div>
                     </div>`
                     $('.jss271733').prepend(html);
                     $(".clicked-function-container").click(function() {
                        if (drawer) {
                            $(this).parent('.component-paper').children(".drawer").css("display", "none");
                            drawer = 0
                        } else {
                            $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                            drawer = 1
                        }
                    });
                })
            })
        };
    
        function createDiamondAction() {
            createDiamond()
            $(".clicked-function-container").click(function() {
                if (drawer) {
                    $(this).parent('.component-paper').children(".drawer").css("display", "none");
                    drawer = 0
                } else {
                    $(this).parent('.component-paper').children(".drawer").css("display", "flex");
                    drawer = 1
                }
            });
        }
        createDiamondAction();

    })
    
    var telefonduz = 0;
    var togglesound = 0;
    
    $('#switchphone').click(function(){
        if (telefonduz == 1) {
            telefonduz = 0
            $(".jss1251").removeClass("jss1251yatmishal");
            $(".jss1255").removeClass("jss1255yatmishal");
        } else {
            telefonduz = 1
            $(".jss1251").addClass("jss1251yatmishal");
            $(".jss1255").addClass("jss1255yatmishal");
        }
    })
    
    $('.toggle-camera').click(function(){
        $.post('http://dev-phone/TakePhoto')
    })
    
    $('#togglesounds').click(function(){
        if (togglesound == 1) {
            togglesound = 0
            PhoneData.Silence = false;
            html = `
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell"class="svg-inline--fa fa-bell fa-w-14 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg"viewBox="0 0 448 512"><path fill="currentColor"d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path></svg>
            `
            $("#togglesounds").html(html)
        } else {
            togglesound = 1
            PhoneData.Silence = true;
            html = `
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell-slash" class="svg-inline--fa fa-bell-slash fa-w-20 fa-fw fa-sm " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M633.82 458.1l-90.62-70.05c.19-1.38.8-2.66.8-4.06.05-7.55-2.61-15.27-8.61-21.71-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84c-40.33 8.38-74.66 31.07-97.59 62.57L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.35 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.42-6.97 4.17-17.02-2.81-22.45zM157.23 251.54c-8.61 67.96-36.41 93.33-52.62 110.75-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h241.92L157.23 251.54zM320 512c35.32 0 63.97-28.65 63.97-64H256.03c0 35.35 28.65 64 63.97 64z"></path></svg>
            `
            $("#togglesounds").html(html)
        }
        $.post('http://dev-phone/ToggleSound')
    })
    
    // $("input[type=text], textarea, input[type=number]").focusin(function() {
    //     $.post("http://dev-phone/LockKeyboard", JSON.stringify({}));
    // });
    
    // $("input[type=text], textarea, input[type=number]").focusout(function() {
    //     $.post("http://dev-phone/ReleaseKeyboard", JSON.stringify({}));
    // });
    
});