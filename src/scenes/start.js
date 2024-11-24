import fondo from "../public/camp.png";
import botonJugar from "../public/play.png";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("fondo", fondo);
    this.load.image("botonJugar", botonJugar);
  }

  create() {
    const bg = this.add.image(0, 0, "fondo");
    bg.setDisplaySize(this.scale.width, this.scale.height);
    bg.setOrigin(0, 0);

    this.add
      .text(this.scale.width / 2, this.scale.height / 8, "Butterfly Cat", {
        fontSize: "90px",
        fontFamily: "Poppins, sans-serif",
        color: "#4A90E2",
        align: "center",
        stroke: "#FFFFFF",
        strokeThickness: 8,
        shadow: {
          offsetX: 5,
          offsetY: 5,
          color: "#000000",
          blur: 15,
          fill: true,
        },
      })
      .setOrigin(0.5);

    const startButton = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "botonJugar"
    );
    startButton.setScale(3.5);
    startButton.setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");

      const instruccionesDiv = document.getElementById("instrucciones");
      if (instruccionesDiv) instruccionesDiv.remove();
    });

    this.crearCuadroInstrucciones();
  }

  crearCuadroInstrucciones() {
    const instruccionesDiv = document.createElement("div");
    instruccionesDiv.id = "instrucciones";
    instruccionesDiv.innerHTML = `
      <h3>Instrucciones</h3>
      <ul>
        <li>Usa las <b>flechas del teclado</b> para mover al gato.</li>
        <li>Captura <b>mariposas</b> para ganar puntos.</li>
        <li>Evita las <b>flores venenosas</b> para no perder vidas.</li>
        <li>¡No dejes que se te acaben las vidas!</li>
      </ul>
    `;
    document.body.appendChild(instruccionesDiv);

    instruccionesDiv.style.position = "absolute";
    instruccionesDiv.style.bottom = "50px";
    instruccionesDiv.style.right = "50px";
    instruccionesDiv.style.width = "350px";
    instruccionesDiv.style.backgroundColor = "#FFFFFF";
    instruccionesDiv.style.color = "#333";
    instruccionesDiv.style.borderRadius = "20px";
    instruccionesDiv.style.padding = "25px";
    instruccionesDiv.style.fontFamily = "Poppins, sans-serif";
    instruccionesDiv.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)";
    instruccionesDiv.style.border = "3px solid #4A90E2";
    instruccionesDiv.style.textAlign = "left";
    instruccionesDiv.style.lineHeight = "1.6";
    instruccionesDiv.style.zIndex = "10";

    const style = document.createElement("style");
    style.innerHTML = `
      #instrucciones ul {
        list-style-type: disc; /* Viñetas estándar */
        margin-left: 20px; /* Espaciado a la izquierda */
        padding-left: 0;
      }

      #instrucciones ul li {
        margin-bottom: 10px; /* Espaciado entre elementos */
      }
    `;
    document.head.appendChild(style);
  }
}
