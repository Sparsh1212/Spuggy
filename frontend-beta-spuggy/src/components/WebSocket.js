// import config from '../config';

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(issue_id) {
    //const path = config.API_PATH;
    if (issue_id == 0) {
      return this.socketRef.close();
    }
    const path1 = 'ws://localhost:8000/ws/issue/' + issue_id + '/';
    this.socketRef = new WebSocket(path1);

    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onopen = () => {
      console.log('WebSocket open');
    };

    this.socketRef.onerror = (e) => {
      console.log(e.message);
    };

    this.socketRef.onclose = () => {
      console.log('WebSocket closed, restarting..');
      // this.connect();
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      console.log('okay so this was called');
      this.callbacks[command](parsedData.message);
    }
  }

  initChatUser(username) {
    this.sendMessage({ command: 'init_chat', username: username });
  }

  fetchMessages(issue_id) {
    this.sendMessage({ command: 'fetch_messages', issue_id: issue_id });
  }

  newChatMessage(messageObject) {
    this.sendMessage({
      command: 'new_message',
      comment_project: messageObject.comment_project,
      comment_issue: messageObject.comment_issue,
      commented_by: messageObject.commented_by,
      comment_text: messageObject.comment_text,
    });
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;
  }

  sendMessage(data) {
    try {
      console.log({ ...data });
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }
  state() {
    return this.socketRef.readyState;
  }
  waitForSocketConnection(callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(function () {
      if (socket.readyState === 1) {
        console.log('Connection is made');
        if (callback != null) {
          callback();
        }
        return;
      } else {
        console.log('Wait for connection..');
        recursion(callback);
      }
    }, 1);
  }
}

let WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
