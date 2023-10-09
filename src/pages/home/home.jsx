import React, { useEffect, useState } from "react";
import axios from "axios";
const { ipcRenderer } = window.require("electron");

const style = {
  margin: 10,
  padding: 10,
  border: "1px solid",
  borderRadius: 8,
};

const Home = () => {
  const [version, setVersion] = useState("");
  const [files, setFiles] = useState([]);

  const getTwitchEvent = async () => {
    const result = await axios.get(
      "http://localhost:3001/twitch-zomboid/logs/242748389"
    );

    if (result && result.status === 200) {
      if (result.data.rows.length > 0) {
        console.log(result.data.rows);
        ipcRenderer.send("appendFile");
      }
    }
  };

  const updateTwitchEvent = async () => {
    const result = await axios.post(
      "http://localhost:3001/twitch-zomboid/logs/242748389"
    );
  };

  useEffect(() => {
    setInterval(() => {
      getTwitchEvent();
    }, 10000);
  });

  useEffect(() => {
    ipcRenderer.send("app_version");

    ipcRenderer.on("app_version", (event, args) => {
      setVersion(args.version);
    });

    ipcRenderer.on("files", (event, args) => {
      setFiles(args.files);
    });

    ipcRenderer.on("done", (event, args) => {
      console.log("done");
      updateTwitchEvent();
    });
  }, []);

  return (
    <div>
      <div style={style}>
        <p>This is first electron desktop app.</p>
        <p>This application version is {version}</p>
      </div>
      <div style={style}>
        <button
          onClick={() => {
            ipcRenderer.send("files");
          }}
        >
          파일 명 가져오기
        </button>
        {files.map((file) => (
          <p key={file}>{file}</p>
        ))}
      </div>
      <div style={style}>
        <button
          onClick={() => {
            ipcRenderer.send("appendFile");
          }}
        >
          이벤트 발생
        </button>
      </div>
    </div>
  );
};

export default Home;
