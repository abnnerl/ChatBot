"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const axios=require("axios");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });

    function crearTramite(agent) {
      let DNI = agent.parameters["DNI"];
      let Nombres = agent.parameters["Nombres"];
      let Apellidos = agent.parameters["Apellidos"];
      let Archivo = agent.parameters["Archivo"];
      let NroSeguimiento = Date.now();
      let Estado = "PENDIENTE";
      axios.post(
        "https://sheet.best/api/sheets/d0503346-ec09-489d-9393-75f6c602d38a",
        { NroSeguimiento, DNI, Nombres, Apellidos, Archivo, Estado }
      );
      agent.add("Tu trámite fue registrado correctamente. ");
      agent.add("Tu número de seguimiento es: "+NroSeguimiento);
    }

    let intentMap = new Map();
    intentMap.set("Tramites.crear", crearTramite);

    agent.handleRequest(intentMap);
  }
);
