//Constants and Variables

let APP_ID = "9b59bf70325740249e2b4d54c7c330bb";

let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room");

if (!roomId) {
  window.location = "index.html";
}

let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    { urls: ["stun:hk-turn1.xirsys.com"] },
    {
      username:
        "vxHqUvcuCUikn3SZjJAienuvOE7F_gK_CsIykNtzmjEuqVexTKA9ljAi6X_9vCbyAAAAAGVbcDRtYXR0bGluZw==",
      credential: "f3df7cb2-87b2-11ee-b530-0242ac120004",
      urls: [
        "turn:hk-turn1.xirsys.com:80?transport=udp",
        "turn:hk-turn1.xirsys.com:3478?transport=udp",
        "turn:hk-turn1.xirsys.com:80?transport=tcp",
        "turn:hk-turn1.xirsys.com:3478?transport=tcp",
        "turns:hk-turn1.xirsys.com:443?transport=tcp",
        "turns:hk-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};

let constraints = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
  audio: true,
};

//init
let init = async () => {
  client = await AgoraRTM.createInstance(APP_ID);
  await client.login({ uid, token });

  //index.html room=???
  channel = client.createChannel(roomId);
  await channel.join();

  channel.on("MemberJoined", handleUserJoined);
  channel.on("MemberLeft", handleUserLeft);
  client.on("MessageFromPeer", handleMessageFromPeer);

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById("user-1").srcObject = localStream;
};

//users left
let handleUserLeft = (MemberId) => {
  document.getElementById("user-2").style.display = "none";
  document.getElementById("user-1").classList.remove("smallFrame");
};
//when user join
let handleMessageFromPeer = async (message, MemberId) => {
  message = JSON.parse(message.text);

  if (message.type === "offer") {
    await createPeerConnection(MemberId);
    await peerConnection.setRemoteDescription(message.offer);
    createAnswer(MemberId);
  }

  if (message.type === "answer") {
    await peerConnection.setRemoteDescription(message.answer);
  }

  if (message.type === "candidate") {
    if (peerConnection) {
      try {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(message.candidate);
        } else {
          peerConnection.queuedCandidates =
            peerConnection.queuedCandidates || [];
          peerConnection.queuedCandidates.push(message.candidate);
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  }
};

let handleUserJoined = async (MemberId) => {
  console.log("a new user joined the channel", MemberId);
  createOffer(MemberId);
};

let createPeerConnection = async (MemberId) => {
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;
  document.getElementById("user-2").style.display = "block";

  document.getElementById("user-1").classList.add("smallFrame");

  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    document.getElementById("user-1").srcObject = localStream;
  }

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      client.sendMessageToPeer(
        {
          text: JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
          }),
        },
        MemberId
      );
    }
  };

  if (peerConnection.queuedCandidates) {
    for (const candidate of peerConnection.queuedCandidates) {
      try {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(candidate);
        }
      } catch (error) {
        console.error("Error adding queued ICE candidate:", error);
      }
    }
    peerConnection.queuedCandidates = []; // Clear queued candidates
  }
};

let createOffer = async (MemberId) => {
  await createPeerConnection(MemberId);
  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  await client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: offer }) },
    MemberId
  );
};

let createAnswer = async (MemberId) => {
  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  await client.sendMessageToPeer(
    { text: JSON.stringify({ type: "answer", answer: answer }) },
    MemberId
  );
};

//leave channel
let leaveChannel = async () => {
  await channel.leave();
  await client.logout();
};
// toggle camera and video
let toggleCamera = async () => {
  let videoTrack = localStream
    .getTracks()
    .find((track) => track.kind === "video");

  if (videoTrack.enabled) {
    videoTrack.enabled = false;
    document.getElementById("camera-btn").style.backgroundColor =
      "rgb(255,80,80)";
  } else {
    videoTrack.enabled = true;
    document.getElementById("camera-btn").style.backgroundColor =
      "rgb(179,102,249, .9)";
  }
};

let toggleMic = async () => {
  let audioTrack = localStream
    .getTracks()
    .find((track) => track.kind === "audio");

  if (audioTrack.enabled) {
    audioTrack.enabled = false;
    document.getElementById("mic-btn").style.backgroundColor =
      "rgb(255, 80, 80)";
  } else {
    audioTrack.enabled = true;
    document.getElementById("mic-btn").style.backgroundColor =
      "rgb(179, 102, 249, .9)";
  }

  if (peerConnection) {
    peerConnection.getSenders().forEach((sender) => {
      if (sender.track.kind === "audio") {
        sender.track.enabled = audioTrack.enabled;
      }
    });
  }
};

window.addEventListener("beforeunload", leaveChannel);

document.getElementById("camera-btn").addEventListener("click", toggleCamera);

document.getElementById("mic-btn").addEventListener("click", toggleMic);

init();
