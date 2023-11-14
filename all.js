const firebaseConfig = {
  apiKey: "AIzaSyADjSOnJQQaogVmujJEk9sVDObdDiy5Z04",
  authDomain: "child-record-website-v01.firebaseapp.com",
  databaseURL: "https://child-record-website-v01-default-rtdb.firebaseio.com",
  projectId: "child-record-website-v01",
  storageBucket: "child-record-website-v01.appspot.com",
  messagingSenderId: "1039516848415",
  appId: "1:1039516848415:web:4f92d99913b9f63893202a",
  measurementId: "G-131DZEZ5C9",
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const inp = document.querySelector(".inp");
const progressbar = document.querySelector(".progress");
const img = document.querySelector(".img");
const fileData = document.querySelector(".filedata");
const loading = document.querySelector(".loading");
let file;
let fileName;
let progress;
let isLoading = false;
let uploadedFileName;
const selectImage = () => {
  inp.click();
};
const getImageData = (e) => {
  file = e.target.files[0];
  fileName = Math.round(Math.random() * 9999) + file.name;
  if (fileName) {
    fileData.style.display = "block";
  }
  fileData.innerHTML = fileName;
  console.log(file, fileName);
};

// Object
let imageObject = {};

const uploadImage = () => {
  loading.style.display = "block";
  const storageRef = storage.ref().child("myimages");
  const folderRef = storageRef.child(fileName);
  const uploadtask = folderRef.put(file);
  uploadtask.on(
    "state_changed",
    (snapshot) => {
      console.log("Snapshot", snapshot.ref.name);
      progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress = Math.round(progress);
      progressbar.style.width = progress + "%";
      progressbar.innerHTML = progress + "%";
      uploadedFileName = snapshot.ref.name;
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage
        .ref("myimages")
        .child(uploadedFileName)
        .getDownloadURL()
        .then((url) => {
          //   // 新增image url至user路由
          //   axios.post("http://localhost:3000/users", { url: url })
          axios.get("http://localhost:3000/users").then((response) => {
            console.log(response);
            //
            const existingData = response.data;
            const nextId = Number(existingData.length) + 1;
            const newData = { id: nextId, url: url };
            axios
              .post("http://localhost:3000/users", newData)
              .then((res) => console.log(res));
            console.log("URL", url);
            if (!url) {
              img.style.display = "none";
            } else {
              img.style.display = "block";
              loading.style.display = "none";
            }
            img.setAttribute("src", url);
          });
        });
    }
  );
};
