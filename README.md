# Issuer

## Disclaimer

This Issuer web app adapts code (specifically regarding the creation of Verifiable Credentials) from the [original User web app](https://github.com/ben3101/my-demo-app-user) used in the VC-based protocol for Solid.

It also has original functionality to interact with the mobile app wallet via QR codes and WebSockets.

## Usage

Note that the issuer **will not work properly** without my-demo-app running at the same time. This is because the issuer app uses the same WebSockets server provided by my-demo-app.

To run the issuer:

run `npm install`

Followed by:

`npm run dev`

The issuer should start on http://localhost:5173

Fill in your DID and your computer's local IP address (this can be found with `ipconfig` on Windows, and `ip a` on Linux.

Click "Create VC".

The issuer will create and sign a Verifiable Credential for your DID. It will also show a QR code. Scan the QR code in the mobile wallet app to receive the credential.

The DID of the issuer is hardcoded: did:web:raw.githubusercontent.com:euan-gilmour:dids:main:issuer

If you are having trouble, try resolving https://raw.githubusercontent.com/euan-gilmour/dids/main/issuer/did.json

If you do not get a DID Document, this may indicate that there is an problem on github.
