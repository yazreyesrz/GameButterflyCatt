let tiempo = 60;

self.onmessage = (e) => {
  if (e.data === "start") {
    setInterval(() => {
      tiempo--;
      postMessage(tiempo);
    }, 1000);
  }
};
