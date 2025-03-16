import { createVerifiableCredentialJwt } from "did-jwt-vc";

import { ES256KSigner, hexToBytes } from "did-jwt";

import QRCode from "qrcode";

const VcIssuerKey =
  "3ed49e3382e31b3b952e4d87a41046b01f55b622c3d4fe6a991b47cd37e048ea";

const VcSigner = ES256KSigner(hexToBytes(VcIssuerKey));

//Prepare an issuer (of VC)

const vcIssuer = {
  did: "did:web:raw.githubusercontent.com:euan-gilmour:dids:main:issuer",

  signer: VcSigner,
};

const userDidField = document.getElementById("userDidField");
const ipAddressField = document.getElementById("ipAddressField");
const createVcButton = document.getElementById("createVcButton");
const qrCanvas = document.getElementById("qrCanvas");

createVcButton.addEventListener("click", () => {
  createVc(userDidField.value);
});

function createVc(userDid) {
  //Create a VC:

  //Use today's date for issuance

  let today = Math.ceil(Date.now() / 1000); //Expiry in ten years

  let tenYearsFromNow = today + 315569260; //Payload

  const vcPayload = {
    sub: userDid,

    nbf: today,

    exp: tenYearsFromNow,

    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",

        "https://www.w3.org/2018/credentials/examples/v1",
      ],

      type: ["VerifiableCredential", "UniversityDegreeCredential"],

      credentialSubject: {
        degree: {
          type: "BachelorDegree",

          name: "Bachelor of Science",
        },
      },
    },
  };

  createVerifiableCredentialJwt(vcPayload, vcIssuer).then((vcJwt) => {
    console.log(vcJwt);

    setupWebSocket(vcJwt);

    setupQr();
  });
}

function setupWebSocket(vc) {
  const ws = new WebSocket("ws://localhost:8081/");

  createVcButton.addEventListener("click", () => {
    ws.close();
  });

  window.addEventListener("beforeunload", () => {
    ws.close();
  });

  ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

  ws.onmessage = (event) => {
    console.log("Recieved: ", event.data);

    const message = JSON.parse(event.data);

    switch (message.type) {
      case "READY":
        const message = JSON.stringify({ type: "VC", vc: vc });
        ws.send(message);
        ws.close();
        clearQr();
        alert("Credential Sent");
    }
  };
}

function setupQr() {
  const localIp = ipAddressField.value;

  const qrPayload = {
    issuer: vcIssuer.did,
    recipient: userDidField.value,
    type: "UniversityDegreeCredential",
    webSocketsUrl: `ws://${localIp}:8081/`,
  };

  const qr = QRCode.toCanvas(qrCanvas, JSON.stringify(qrPayload), (err) => {
    if (err) console.log(err);
    else console.log("QR Code Successful");
  });
}

createVcButton.addEventListener("click", () => {
  createVc(userDidField.value);
});

function clearQr() {
  const ctx = qrCanvas.getContext("2d");
  ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
}
