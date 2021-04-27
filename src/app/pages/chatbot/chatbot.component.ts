import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatBotService } from './chatbot.service';


@Component({
  selector: 'sapper-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  @ViewChild('chats') chats:ElementRef;

  showWidget: Boolean = false;
  userInput;
  bot_avatar_png = "sapper_avatar.png";
  constructor(private service: ChatBotService) { }

  ngOnInit(): void {
  }

  openChatWindow(): void {
    this.showWidget = this.showWidget ? false : true;
  }

  showBotTyping(): void {
    let botTyping = '<img class="botAvatar" id="botAvatar" src="assets/images/'+this.bot_avatar_png+'"/><div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
    this.chats.nativeElement.insertAdjacentHTML('beforeend', botTyping);
  }

  hideBotTyping(): void {
    // $('#botAvatar').remove();
    // const element = document.getElementById('botAvatar');
    // element.remove();
    // this.chats.nativeElement.remove();
  }

  sendMessage(event) {
    console.log('event.keyCode -- ', event.keyCode, this.userInput);
    if (event.keyCode === 13) {
      if (this.userInput === '') {
          event.preventDefault();
          return false;
      } else {
        this.setUserResponse();
        this.setBotResponse();
      }
    }
  }
  setUserResponse() {
    this.service.sendMessage({message: this.userInput}).subscribe((res) => {
      let userResponse = '<img class="userAvatar" src=' + "./assets/images/userAvatar.jpg" + '><p class="userMsg">' + res.message + ' </p><div class="clearfix"></div>';
      this.chats.nativeElement.insertAdjacentHTML('beforeend', userResponse);
    });
    let userResponse = '<img class="userAvatar" src=' + "./assets/images/userAvatar.jpg" + '><p class="userMsg">' + this.userInput + ' </p><div class="clearfix"></div>';
    this.chats.nativeElement.insertAdjacentHTML('beforeend', userResponse);

    this.userInput = '';

    setTimeout(() => {
      this.showBotTyping();
    }, 500);
    // this.setBotResponse();
  }

  setBotResponse() {

    setTimeout(() => {
      this.hideBotTyping();
    }, 500);

      var fallbackMsg = "I am facing some issues, please try again later!!!";
      var BotResponse = '<img class="botAvatar" src="assets/images/'+this.bot_avatar_png+'"/><p class="botMsg">' + fallbackMsg + '</p><div class="clearfix"></div>';

      //             $(BotResponse).appendTo(".chats").hide().fadeIn(1000);

      this.chats.nativeElement.insertAdjacentHTML('beforeend', BotResponse);
  }

}
