const params = new URLSearchParams(window.location.search);

const ccm_url = decodeURIComponent(params.get('ccmUrl'));
const customer_channel_identifier = decodeURIComponent(params.get('customerIdentifier'));
const channel_type_code = decodeURIComponent(params.get('channelType'));
const conversation_id = decodeURIComponent(params.get('conversationId'));

console.log("configurations :", ccm_url,customer_channel_identifier,channel_type_code,conversation_id);
var messages = [];

// Chat API Call
const request = new XMLHttpRequest ();
request.open("GET", `${ccm_url}/message/?customerChannelIdentifier=${customer_channel_identifier}&channelTypeCode=${channel_type_code}&conversationId=${conversation_id}`);
request.send();
request.onload = () => {
  if(request.status === 200) {
    messages = JSON.parse(request.response);
    console.log("Messages :",messages);
    messageFunction();
  }else{
  console.log(`error ${request.status} ${request.status} ${request.statusText}`)
  }
}

//Function for Chat Messages Of BOT , AGENT and CUSTOMER
function messageFunction() {
    let chatDiv = `<div>`;
    for (const msg in messages) {

        const message = messages[msg];
        let time = message.header.timestamp.slice(11, 16);
        let date = message.header.timestamp.slice(0, 10).replace(/-/g, "/");
        document.getElementById("chatDate").innerHTML = date;

      if (message.header.sender.type == 'BOT') {

        if (message.body.type == 'BUTTON') {
          chatDiv += `
          <div class="chat-message agent-message bot-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img"> <img src="./images/robot-dark.svg" alt="Bot"> </div>
            </div>
            <div class="chat-message-content structured-message">
              <p><b>${message.body.additionalDetails.interactive.header.text}</b>
              <span>${message.body.additionalDetails.interactive.body.text}</span></p>`;
              chatDiv += `<ul class="structured-actions">`;
                for(const btn in message.body.buttons){
                    const button = message.body.buttons[btn];
                    chatDiv += `<li class="">${button.title}</li>`;
                }
            chatDiv += `</ul><span class="message-stamp"><span class="chat-time">16:20</span></span></div></div>`;
        }

        if (message.body.type == 'URL') {
          chatDiv += `
          <div class="chat-message agent-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/robot-dark.svg" alt="bot"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p>
                <span>${message.body.markdownText}</span>
                <a href="${message.body.mediaUrl}"><span>${message.body.mediaUrl}</span></a>
                <span class="message-stamp">
                  <span class="chat-time">${time}</span>
                </span>
              </p>
            </div>
          </div>`;
        }

        if (message.body.type == 'VIDEO') {
          chatDiv += `
          <div class="chat-message user-message ">
            <div class="profile-pic">
                <div class="profile-pic-area user-img">
                  <img src="./images/robot-dark.svg" alt="bot"/>
                </div>
            </div>
            <div class="chat-message-content file-type-message image-type">
              <p>
                <span>
                  <video width="200px" height="200px" autoplay>
                    <source src="${message.body.attachment.mediaUrl}" type="video/mp4">
                  Your browser does not support the video tag.
                  </video>
                </span>
                <span class="message-stamp">
                  <span class="chat-time">${time}</span>
                </span></p>

          </div>
      </div>`;
        }

        if (message.body.type == 'IMAGE') {
          chatDiv += `
          <div class="chat-message agent-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/robot-dark.svg" alt="bot"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p>
                <span>${message.body.caption}</span>
                <a target="_blank"
                href="${message.body.attachment.mediaUrl}"><img
                src="${message.body.attachment.mediaUrl}"
                height="50px" width="50px">
              </a>
                <span class="message-stamp">
                  <span class="chat-time">${time}</span>
                </span>
              </p>
            </div>
          </div>`;
        }

        if (message.body.type == 'FILE') {
          chatDiv += `
          <div class="chat-message agent-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/robot-dark.svg" alt="bot"/>
              </div>
            </div>
            <div class="chat-message-content file-type-message contact-type">
            <span class="display-file contact-logo">
            <img src="./images/genaric.svg"></span>
            <div class="contact-inner">
                <span class="card-label">${message.body.additionalDetails.fileName}</span>
                <span class="card-description">
                    <a class="file-download" href="${message.body.attachment.mediaUrl}"> Download </a> </span>
            </div>
            <span class="message-stamp"><span class="chat-time">${time}</span></span>
        </div>
          </div>`;
        }

        if (message.body.type == 'LOCATION') {
          chatDiv += `
          <div class="chat-message agent-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/robot-dark.svg" alt="bot"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p><b>${message.body.additionalDetails.name}</b></p>
              <div class="mapouter">
                <div class="gmap_canvas"><iframe width="235" height="190" id="gmap_canvas"
                        src="https://maps.google.com/maps?q=${message.body.location.latitude},${message.body.location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><br>
                    <a href="https://www.embedgooglemap.net">google maps api html</a>
                </div>
            </div>
            <p>
                <span class="message-stamp"><span class="chat-time">${time}</span></span>
            </p>
            </div>
          </div>`;
        }

        if (message.body.type == 'CONTACT') {
          chatDiv += `
          <div class="chat-message agent-message bot-message">
            <div class="profile-pic">
                <div class="profile-pic-area user-img"> <img src="./images/robot-dark.svg" alt="Bot"> </div>
            </div>
            <div class="chat-message-content file-type-message contact-type">
                <span class="display-file contact-logo">
                    <img src="/assets/images/dummy-user.svg"></span>
                    <div class="contact-inner">`;
                    for(const phone in message.body.contacts){
                        const contact = message.body.contacts[phone];
                        chatDiv +=`<span class="card-label">${contact.name.formattedName}</span>
                        <span class="card-description"><a href="https://api.whatsapp.com/send?phone=${contact.phones[0].phone}&text=Hello%2C%20I%20want%20more%20info%20about%20the%20product." target="_blank">
                        ${contact.phones[0].phone}</a></span>`;
                      }
                    chatDiv +=`</div>
                <span class="message-stamp"><span class="chat-time">${time}</span></span>
            </div>
          </div>`;
        }

        if (message.body.type == 'PLAIN') {
          chatDiv += `
          <div class="chat-message agent-message bot-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/robot-dark.svg" alt="bot"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p><span>${message.body.markdownText}</span>
                <span class="message-stamp"><span class="chat-time">${time}</span></span></p>
            </div>
          </div>`;
        }
      }
      if(message.header.sender.type == 'AGENT') {

        if (message.body.type == 'NOTIFICATION') {
            if (message.body.notificationType == 'AGENT_UNSUBSCRIBED') {
              chatDiv += `
              <div class="line-info"><span>${message.header.sender.participant.keycloakUser.username} left the Conversation</span></div>
              `;
            }
            if (message.body.notificationType == 'AGENT_SUBSCRIBED') {
              chatDiv += `
              <div class="line-info"><span>${message.header.sender.participant.keycloakUser.username} joined the Conversation</span></div>
              `;
            }
        }

        if (message.body.type == 'PLAIN') {
          chatDiv += `
          <div class="chat-message agent-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/agent.png" alt="agent"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p><span>${message.body.markdownText}</span>
                <span class="message-stamp"><span class="chat-time">${time}</span></span></p>
            </div>
          </div>`;
        }

        if (message.body.type == 'IMAGE') {
          chatDiv += `
          <div class="chat-message agent-message">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/agent.png" alt="agent"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p><a target="_blank" href="${message.body.attachment.mediaUrl}"><img src="${message.body.attachment.mediaUrl}" height="200px" width="200px"></a>
              <span>${message.body.caption}</span>
              <span class="message-stamp"><span class="chat-time">${time}</span></span></p>
            </div>
          </div>`;
        }

        if (message.body.type == 'FILE') {
          chatDiv += `
          <div class="chat-message agent-message">
          <div class="profile-pic">
            <div class="profile-pic-area user-img">
              <img src="./images/agent.png" alt="agent"/>
            </div>
          </div>
          <div class="chat-message-content file-type-message contact-type">
            <span class="display-file contact-logo">
              <img src="./images/genaric.svg"></span>
              <div class="contact-inner">
                <span class="card-label">${message.body.additionalDetails.fileName}</span>
                <span class="card-description">
                  <a class="file-download" href="${message.body.attachment.mediaUrl}"> Download </a> </span>
              </div>
              <span class="message-stamp"><span class="chat-time">${time}</span></span>
            </div>
          </div>`;
        }
      }
      if(message.header.sender.type == 'CUSTOMER') {
        if (message.body.type == 'PLAIN') {

          chatDiv += `
          <div class="chat-message user-message ">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/agent.png" alt="customer"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p><span>${message.body.markdownText}</span>
                <span class="message-stamp"><span class="chat-time">${time}</span></span></p>
            </div>
          </div>`;

        }

        if (message.body.type == 'IMAGE') {
          chatDiv += `
          <div class="chat-message user-message ">
            <div class="profile-pic">
              <div class="profile-pic-area user-img">
                <img src="./images/agent.png" alt="customer"/>
              </div>
            </div>
            <div class="chat-message-content">
              <p><a target="_blank" href="${message.body.attachment.mediaUrl}"><img src="${message.body.attachment.mediaUrl}" height="200px" width="200px"></a>
              <span>${message.body.caption}</span>
              <span class="message-stamp"><span class="chat-time">${time}</span></span></p>
            </div>
          </div>`;
        }

        if (message.body.type == 'FILE') {
          chatDiv += `
          <div class="chat-message user-message ">
          <div class="profile-pic">
            <div class="profile-pic-area user-img">
              <img src="./images/agent.png" alt="customer"/>
            </div>
          </div>
            <div class="chat-message-content file-type-message contact-type">
              <span class="display-file contact-logo">
                <img src="./images/genaric.svg"></span>
              <div class="contact-inner">
                <span class="card-label">${message.body.additionalDetails.fileName}</span>
                <span class="card-description">
                    <a class="file-download" href="${message.body.attachment.mediaUrl}"> Download </a> </span>
              </div>
              <span class="message-stamp"><span class="chat-time">${time}</span></span>
            </div>
          </div>`;
        }
      }
    }
    chatDiv+='</div>';
    document.getElementById("msg").innerHTML = chatDiv;

    setTimeout(function(){
      window.print();
   }, 2000);//wait 2 seconds
    // printToPDF();
}

// function printToPDF() {
//   var element = document.getElementById('transcriptPrint');
//   var opt =
//   {
//     margin:       1,
//     filename:     'chat-transcript.pdf',
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//   };

//   html2pdf().set(opt).from(element).save();
// }
