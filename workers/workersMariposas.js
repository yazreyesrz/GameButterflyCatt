self.onmessage = (e) => {
  if (e.data.start) {
    setInterval(() => {
      const width = e.data.width;
      const height = e.data.height;
      const posicion = {
        x: Math.random() * width,
        y: 100 + Math.random() * (height - 100),
      };
      postMessage(posicion);
    }, 3000);
  }
};
