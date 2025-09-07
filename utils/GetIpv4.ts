const os = require("os");

export default function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      // On évite les adresses internes (127.0.0.1, ::1)
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "IP not found";
}

console.log("Local IP:", getLocalIP());
