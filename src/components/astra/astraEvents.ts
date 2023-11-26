import { EventEmitter } from "events";
import axios from "axios";

export class AstraEvents extends EventEmitter {
  async status() {
    const data = (await axios.get(`https://ares.lunxi.dev/status`)).data.data;

    if (!data)
      return console.log(
        "Conexão com a API do Counter-Strike perdida, pulando cronjob..."
      );

    //Counter-Strike's Sessions Servers switch case emitter;
    switch (data.status.services.SessionsLogon) {
      case "normal":
        this.emit("sessionsNormal");
        break;
      case "delayed":
        this.emit("sessionsDelayed");
        break;
      case "surge":
        this.emit("sessionsSurge");
        break;
      case "offline":
        this.emit("sessionsOffline");
    }

    //Counter-Strike's Community Servers switch case emitter;
    switch (data.status.services.SteamCommunity) {
      case "normal":
        this.emit("communityNormal");
        break;
      case "delayed":
        this.emit("communityDelayed");
        break;
      case "surge":
        this.emit("communitySurge");
        break;
      case "offline":
        this.emit("communityOffline");
    }

    //Counter-Strike's Matchmaker Servers switch case emitter;
    switch (data.status.matchmaker.scheduler) {
      case "normal":
        this.emit("matchmakerNormal");
        break;
      case "delayed":
        this.emit("matchmakerDelayed");
        break;
      case "surge":
        this.emit("matchmakerSurge");
        break;
      case "offline":
        this.emit("matchmakerOffline");
    }
  }
}
