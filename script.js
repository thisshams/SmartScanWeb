import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
import { getDatabase , ref, set} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import { getStorage,ref as sRef, getDownloadURL,uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyAaa8Fv5r8l3AjLfFlw4CZk48oNLk-iXfc",
    authDomain: "smartscan-7d1a3.firebaseapp.com",
    projectId: "smartscan-7d1a3",
    storageBucket: "smartscan-7d1a3.appspot.com",
    messagingSenderId: "427150561575",
    appId: "1:427150561575:web:ded4c273c16eba27d85902"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

const loginBtn = document.getElementById('login')
const createBtn = document.getElementById('create_button')
const uploadBtn = document.getElementById('upload')
const findBtn = document.getElementById('find')
const logout = document.getElementById('logout')


onAuthStateChanged(auth, (user) => {
    if(user==null) {
        console.log('n user')
        //window.location.href='../index.html'
      // ...
    } else {
        const uid = user.uid;
        console.log('user'+uid)
    }
  });

if(loginBtn){
    loginBtn.addEventListener('click',function(){
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        console.log(email)
        console.log(password)
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("uid",user.uid)
        alert('Login Successful')
        window.location.href="./templates/home.html"
        })
        .catch((error) => {
        alert(error)
        });
    })
}

if(logout){
    logout.addEventListener('click',function(){
        signOut(auth).then(() => {
            console.log('Sign-out successful.')
            window.location.href='../index.html'
          }).catch((error) => {
            console.log(error)
          });
    })
}

if(createBtn){
    createBtn.addEventListener('click',function(){
        var first_name = document.getElementById('first_name').value
        var last_name = document.getElementById('last_name').value
        var email_id = document.getElementById('email_id').value
        var mobile_number = document.getElementById('mobile_number').value
        var gender = document.getElementById('gender').value
        var dob = document.getElementById('dob').value
        //var docx_file = document.getElementById('docx').src
        var unique_id= makeid();
        const metadata = {
            contentType: 'application/pdf'
        };
        const storageRef = sRef(storage, 'Data/'+unique_id+'/output.pdf');
        const uploadTask = uploadBytesResumable(storageRef, localStorage.getItem('url'),metadata);


        if(first_name=="" ||last_name==""||email_id==""||mobile_number==""||gender==""||dob==""){
            alert('Please fill all details')
        }
        else{ 
            console.log(first_name+last_name+email_id+mobile_number+gender+dob+"\n"+localStorage.getItem('url'))
            uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + ' % done');
            },
            (error) => {
                console.log('error '+error)
            },
            () => {
                console.log('Uploaded')
            }
            )
            set(ref(database,unique_id),{
                first_name : first_name,
                last_name : last_name,
                email_id : email_id,
                mobile_number : mobile_number,
                gender : gender,
                dob:dob
        })
        .then(()=>{
            document.getElementById('first_name').value=""
            document.getElementById('last_name').value=""
            document.getElementById('email_id').value=""
            document.getElementById('mobile_number').value=""
            document.getElementById('dob').value=""
            alert('New ID created successfully\n\nYour Unique ID is : '+ unique_id)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    })
}


if(uploadBtn){
    uploadBtn.addEventListener('click',function(){
        var uid = document.getElementById('uid').value
        var email_id = document.getElementById('email_id').value
        var mobile_number = document.getElementById('mobile_number').value
        set(ref(database,uid),{
            email_id : email_id,
            mobile_number : mobile_number
        })
        .then(()=>{
            alert('Your ID is updated successfully')
        })
        .catch((error)=>{
            console.log(error)
        })
    })
}



if(findBtn){
    findBtn.addEventListener('click',function(){
        getDownloadURL(sRef(storage, localStorage.getItem("uid")+"/"+qrtext+"/output.pdf"))
        .then((url) => {
            console.log("wait\n"+localStorage.getItem("uid")+"\n"+qrtext)
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
            const blob = xhr.response;
        };
        xhr.open('GET', url);
        //xhr.send();
        const pdf  = document.getElementById('docx')
        pdf.setAttribute('src',url)
        console.log(url)
        localStorage.setItem('url', url)
        modal.style.display = "none";
        })
        .catch((error) => {
            console.log(error)
        });
        })
}


function makeid(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
   return result;
}


//QR CODE GENERATOR
const btn = document.getElementById("document");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
    var qrtext=''
    var qr;
    if(btn){
        btn.addEventListener('click',function(){
            (function () {
                qr = new QRious({
                    element: document.getElementById('qr-code'),
                    size: 200,
                    value: ''
                });
            })();
            qrtext = makeid()
            console.log(qrtext)
            modal.style.display = "block";
            qr.set({
                foreground: 'black',
                size: 200,
                value: qrtext
                });
        })
    }
