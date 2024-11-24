import fondo from "../public/camp.png";
import gato from "../public/cat.png";
import mariposita from "../public/butterfly.png";
import florVeneno from "../public/poisonFlower.png";

let jugador,
  cursores,
  mariposas = [],
  floresVeneno = [],
  puntaje = 0,
  tiempoRestante = 60,
  vidas = 3;
let workerMariposas, workerFloresVeneno, workerTemporizador;
let tiempoTexto,
  puntajeTexto,
  vidasTexto,
  partidaTerminada = false;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("fondo", fondo);
    this.load.image("jugador", gato);
    this.load.image("mariposa", mariposita);
    this.load.image("florVeneno", florVeneno);
  }

  inicializarWorkers() {
    workerMariposas = new Worker("../../workers/workersMariposas.js");
    workerFloresVeneno = new Worker("../../workers/workersFlores.js");
    workerTemporizador = new Worker("../../workers/workersTiempo.js");

    workerMariposas.onmessage = (e) => this.generarMariposa(e.data);
    workerFloresVeneno.onmessage = (e) => this.generarFlorVenenosa(e.data);
    workerTemporizador.onmessage = (e) => this.actualizarTiempo(e.data);

    workerTemporizador.postMessage("start");
    workerMariposas.postMessage({
      start: true,
      width: this.scale.width,
      height: this.scale.height,
    });
    workerFloresVeneno.postMessage({
      start: true,
      width: this.scale.width,
      height: this.scale.height,
    });
  }

  create() {
    partidaTerminada = false;
    tiempoRestante = 60;
    puntaje = 0;
    vidas = 3;
    mariposas = [];
    floresVeneno = [];

    const fondo = this.add.image(0, 0, "fondo");
    fondo.setDisplaySize(this.scale.width, this.scale.height);
    fondo.setOrigin(0, 0);

    jugador = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height / 2,
      "jugador"
    );
    jugador.setCollideWorldBounds(true);

    cursores = this.input.keyboard.createCursorKeys();

    this.inicializarWorkers();

    tiempoTexto = this.add
      .text(16, 16, "Tiempo: " + tiempoRestante, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setDepth(1);
    puntajeTexto = this.add
      .text(16, 50, "Puntaje: 0", { fontSize: "32px", fill: "#fff" })
      .setDepth(1);
    vidasTexto = this.add
      .text(16, 84, "Vidas: " + vidas, { fontSize: "32px", fill: "#fff" })
      .setDepth(1);

    const endGameDiv = document.createElement("div");
    endGameDiv.id = "end-game";
    endGameDiv.style.display = "none";
    endGameDiv.innerHTML = `
      <h1 id="end-game-text"></h1>
      <button id="start-button">Iniciar partida</button>
    `;
    document.body.appendChild(endGameDiv);

    document.getElementById("start-button").addEventListener("click", () => {
      endGameDiv.style.display = "none";
      this.resetearWorkers();
      this.scene.restart();
    });
  }

  update() {
    if (!jugador.active || partidaTerminada) return;

    if (cursores.left.isDown) {
      jugador.setVelocityX(-160);
    } else if (cursores.right.isDown) {
      jugador.setVelocityX(160);
    } else if (cursores.up.isDown) {
      jugador.setVelocityY(-160);
    } else if (cursores.down.isDown) {
      jugador.setVelocityY(160);
    } else {
      jugador.setVelocity(0, 0);
    }

    mariposas.forEach((mariposa, indice) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          jugador.getBounds(),
          mariposa.getBounds()
        )
      ) {
        mariposa.destroy();
        mariposas.splice(indice, 1);
        puntaje += 10;
        puntajeTexto.setText("Puntaje: " + puntaje);
      }
    });

    floresVeneno.forEach((flor, indice) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          jugador.getBounds(),
          flor.getBounds()
        )
      ) {
        flor.destroy();
        floresVeneno.splice(indice, 1);
        this.perderVida();
      }
    });
  }

  perderVida() {
    vidas--;
    vidasTexto.setText("Vidas: " + vidas);

    if (vidas <= 0) {
      this.endGame();
    }
  }

  endGame() {
    partidaTerminada = true;
    jugador.setActive(false).setVisible(false);
    this.mostrarFinDePartida(
      `¡Te quedaste sin vidas! Puntuación final: ${puntaje}`
    );
  }

  mostrarFinDePartida(mensaje) {
    document.getElementById("end-game").style.display = "block";
    document.getElementById("end-game-text").innerText = mensaje;
  }

  resetearWorkers() {
    workerTemporizador.terminate();
    workerMariposas.terminate();
    workerFloresVeneno.terminate();
  }

  generarMariposa(posicion) {
    let mariposa = this.physics.add.sprite(posicion.x, posicion.y, "mariposa");
    mariposas.push(mariposa);
  }

  generarFlorVenenosa(posicion) {
    let flor = this.physics.add.sprite(posicion.x, posicion.y, "florVeneno");
    floresVeneno.push(flor);
  }

  actualizarTiempo(nuevoTiempo) {
    if (partidaTerminada) return;

    tiempoRestante = nuevoTiempo;
    tiempoTexto.setText("Tiempo: " + tiempoRestante);

    if (tiempoRestante <= 0) {
      tiempoRestante = 0;
      jugador.setActive(false).setVisible(false);
      this.mostrarFinDePartida(
        `¡Se acabó el tiempo! Puntuación final: ${puntaje}`
      );
      partidaTerminada = true;
    }
  }
}
