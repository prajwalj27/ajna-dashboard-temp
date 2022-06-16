import React, { useState } from "react";
import axios from "axios";
// import crypto from "crypto";
import { JSEncrypt } from "jsencrypt";

const App = () => {
  const [token, setToken] = useState("");
  const [encryptData, setEncryptData] = useState("");

  const userData = {
    apikey: "api-key",
    uid: "1234567890",
    client_id: "client-id-1",
    privilege: ["prvg1", "prvg2"],
  };

  const onChange = (tokenValue) => {
    setToken(tokenValue);
  };

  const dataEncryption = (data) => {
    var encrypt = new JSEncrypt();

    var publicKey = `
    -----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
    FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
    xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
    gwQco1KRMDSmXSMkDwIDAQAB
    -----END PUBLIC KEY-----`;

    encrypt.setPublicKey(publicKey);

    var encrypted = encrypt.encrypt(JSON.stringify(data));

    // Convert all the '+' symbols in the encrypted string to %2B
    var encryptedForURI = encodeURIComponent(encrypted);
    console.log("Encrypted Data: ", encryptedForURI);
    setEncryptData(encryptedForURI);
    return encryptedForURI;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // const encryptedData = dataEncryption(userData);
    // const response = await axios.get(
    //   `http://localhost:8080/redirect-login/?data=${encryptedData}`
    // );
    // console.log(response.data);
    // console.log("Let's navigate to the dashboard");
    window
      .open(`http://localhost:3000/#/pages/login/?token=${token}`, "_blank")
      .focus();
  };
  
  // http://localhost:3000/dashboard/?token=${token}
  return (
    <div className="App">
      <h1>App 2</h1>
      <p>
        <b> Data</b>
      </p>
      <textarea
        rows={10}
        cols={100}
        value={JSON.stringify(JSON.parse(JSON.stringify(userData)), null, 2)}
        readOnly
      />
      <br />
      <button
        onClick={() => {
          dataEncryption(userData);
        }}
      >
        Encrypt
      </button>

      <br />
      {encryptData ? (
        <>
          <p>
            <b>Encrypted Data</b>
          </p>
          <textarea rows={5} cols={100} value={encryptData} readOnly />
        </>
      ) : (
        <></>
      )}
      <br />
      <br />
      <br />  

      <label htmlFor="token">Token -</label>
      <input
        type="text"
        value={token}
        placeholder="Enter Token received from response"
        style={{ width: "800px" }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <br />
      <button onClick={handleLogin}>View the ESPL Dashboard</button>
    </div>
  );
};

export default App;
