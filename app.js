const GAAZIBOKON_BROADCAST_PORT = 64006;
var socket = null;
var selected_mapping = null;
const MAPPINGS = [
  {
    name: "Arrows + Enter",
    mapping: {
      ArrowUp: "Up",
      ArrowDown: "Down",
      ArrowLeft: "Left",
      ArrowRight: "Right",
      Enter: "Return",
      "5": "Return",
      "4": "Left",
      "6": "Right",
      "8": "Down",
      "2": "Up",
    }
  },
  {
    name: "Arrows + Space",
    mapping: {
      ArrowUp: "Up",
      ArrowDown: "Down",
      ArrowLeft: "Left",
      ArrowRight: "Right",
      Enter: "space",
      "5": "space",
      "4": "Left",
      "6": "Right",
      "8": "Down",
      "2": "Up",
    },
  },
  {
    name: "WASD + QER",
    mapping: {
      ArrowUp: "w",
      ArrowDown: "s",
      ArrowLeft: "a",
      ArrowRight: "d",
      Enter: "q",
      SoftLeft: "e",
      SoftRight: "r",
      "5": "q",
      "4": "a",
      "6": "d",
      "8": "s",
      "2": "w",
      "1": "q",
      "3": "r",
      "7": "e",
    },
  },
  {
    name: "Arrows + Space + BN",
    mapping: {
      ArrowUp: "Up",
      ArrowDown: "Down",
      ArrowLeft: "Left",
      ArrowRight: "Right",
      Enter: "space",
      SoftLeft: "b",
      SoftRight: "n",
      "5": "space",
      "4": "Left",
      "6": "Right",
      "8": "Down",
      "2": "Up",
      "1": "b",
      "3": "n",
    },
  },
];


function lf(s) {
  return s + "\n";
}

function send_event(event) {
  if (selected_mapping === null) {
    let valids = MAPPINGS.map((_, index) => index + 1);
    valids = valids.map((i) => String(i));
    if (valids.includes(event.key)) {
      selected_mapping = MAPPINGS[parseInt(event.key) - 1].mapping;
      document.getElementById("layout").innerText = "";
    }
  }
  let key = selected_mapping[event.key];
  if (!key) return;
  let updown = event.type.replace("key", "");
  socket.send(lf(`${key} ${updown}`));
}

window.onload = document.onload = () => {
  if (!window.navigator.onLine) {
    window.alert("Please connect to an access point");
    window.close();
  }
  let ping = document.getElementById("ping");  
  let layout = document.getElementById("layout");  
  let log = document.getElementById("log");
  let addr = "";
  addr = window.prompt("Enter GB server IP and port separated by space");
  if (!addr) window.close();
  let ip = addr.split(" ")[0];
  let port = parseInt(addr.split(" ")[1]);
  layout.innerText = MAPPINGS.map((m, index) => `${index + 1}. ${m.name}`).join("\n");
  document.onkeydown = send_event;
  document.onkeyup = send_event;
  socket = navigator.mozTCPSocket.open(ip, port);
  socket.onopen = () => {
    let password = window.prompt("Enter password(if any)");
    socket.send(lf(password));
    setInterval(() => {
      socket.send(lf("ping"));
      window.pingTime = new Date();
    }, 200);
  };
  socket.ondata = (e) => {
    if (!e.data.includes("pong")) return;
    ping.innerText = (new Date() - window.pingTime).toString() + "ms";
  };
};
