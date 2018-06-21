// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var path, node_ssh, ssh, fs

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')

const storage = require('electron-json-storage');



ssh = new node_ssh()

let flash = document.getElementById("flash")
let serverIP = document.getElementById("serverIP")
let userName = document.getElementById("userName")
let IDRSA = document.getElementById("IDRSA")
let saveButton = document.getElementById("saveInfo")
let connectButton = document.getElementById("connectSSH")


let stdout = document.getElementById("stdout")
let stderr = document.getElementById("stderr")
let scanSystemCtlAllButton = document.getElementById("scanSystemCtlAll")
let scanSystemCtlButton = document.getElementById("scanSystemCtl")
let systemCtlParsed = document.getElementById("systemCtlParsed")
let serviceFilters = document.getElementById("serviceFilters")


let journalCtlButton = document.getElementById("journalCtlButton")

document.addEventListener("DOMContentLoaded", function(){
  loadStorage();
})

function getFilterNames(){
  return serviceFilters.value
  .split(",")
  .map( x => x.trim())
  .filter(x => ( x.length > 1))
}


saveButton.addEventListener('click', function(){
  storage.set('sshinfo',
   { serverIP: serverIP.value.trim(),
     userName: userName.value.trim(),
     IDRSA: IDRSA.value.trim(),
     serviceFilters: serviceFilters.value.trim()  }, function(error) {
    if (error) throw error;

    
    flash.className = "show"
    flash.innerHTML = "Info saved"
    setInterval(function(){
      flash.className = ""
    }, 5000)
  });

  
})





scanSystemCtlButton.addEventListener('click', function(){

  session.then(function() {
    // Local, Remote
    // Command
    ssh.execCommand('systemctl -a')
    // ssh.execCommand('ls', { cwd:'/var/www' })
    .then(function(result) {
      
      systemCtlParsed.innerHTML = "";
      let filterNames = getFilterNames();
      console.log(filterNames);
      
      let validName = function(name){
        if (filterNames.length == 0) {return true;}

        let valid = filterNames.filter(function(x){
          return name.includes(x) ? true: false
        })
        return valid.length >= 1
      }

      let r = result.stdout.split("\n").map(function(x){
        return x.trim()
      }).filter(function(x){
        let name = x.split(" ")[0]
        if (name.endsWith("service") 
            && validName(name) ){
            
            
           return true
        }else{
          return false
        }
      }).forEach(function(x){
        let text = x.split(" ").filter(function(x){
           return x.length == 0 ? false : true}
          )
        let n = document.createElement("div")
        let serviceName = document.createElement("div")
        serviceName.className="systemctl-service-name"
        // serviceName.innerHTML = x.split(" ", 1)[0]
        let clicker = document.createElement("button")
        clicker.className = "btn btn-outline-secondary"
        clicker.innerHTML = x.split(" ", 1)[0] 
        clicker.addEventListener('click', function(event){
          

          document.getElementById('serviceName').value = x.split(" ", 1)[0]
          journalCtlButton.click();
          

          event.preventDefault();
        })
        serviceName.appendChild(clicker);

        n.appendChild(serviceName)
        let loadActveSub = document.createElement("div")
        loadActveSub.className="systemctl-service-status"
        loadActveSub.innerHTML = text.slice(1,4).join(" ")
        n.appendChild(loadActveSub)
        let desc = document.createElement("span")
        desc.style.backgroundColor = "#DFFFFF"
        desc.innerHTML = text.slice(4, text.length).join(" ")
        n.appendChild(desc)
        systemCtlParsed.appendChild(n)
      })

    })

    
  });
})

journalCtlButton.addEventListener('click', function(){
  
  session.then(function() {
    // Local, Remote
    // Command
    let jDiv = document.getElementById('journalCtlParsed')
    // jDiv.scrollIntoView()
    document.getElementById('loader').style.display = 'block';

    let serviceName = document.getElementById('serviceName').value.trim()
    
    // only show recent 200 lines
    ssh.execCommand('journalctl --reverse --unit ' + serviceName)
    // ssh.execCommand('journalctl --unit ' + serviceName)
    // ssh.execCommand('ls', { cwd:'/var/www' })
    .then(function(result) {
      jDiv.innerHTML = result.stdout
      document.getElementById('loader').style.display = 'none';
    });
  })
});


scanSystemCtlAllButton.addEventListener('click', function(){

  document.getElementById("journalCtlParsed").innerHTML = "";

  session.then(function() {
    // Local, Remote
    // Command
    ssh.execCommand('systemctl -a')
    // ssh.execCommand('ls', { cwd:'/var/www' })
    .then(function(result) {
      stdout.innerHTML = result.stdout;
      stderr.innerHTML = result.stderr;    
    });
  })
});

var session = null;
connectButton.addEventListener("click", function(){

  session = ssh.connect({
    host: serverIP.value,
    username: userName.value,
    privateKey: IDRSA.value
  }).then(function(){
    flash.className = "show"
    flash.innerHTML = "Conected to server"
    setInterval(function(){
      flash.className = ""
    }, 3000)
  }).catch(function(err){
    flash.className = "error"
    flash.innerHTML = "Error connecting"
    setInterval(function(){
      flash.className = ""
    }, 3000)
  })

})

function loadStorage(){
  storage.get('sshinfo', function(error, data) {
     
    if (error){
      throw error;
    } 
    serviceFilters.value = data.serviceFilters
    serverIP.value = data.serverIP
    userName.value = data.userName
    IDRSA.value = data.IDRSA
    console.log(data);

    connectButton.click();
  });
}


function getLoader(divCount=3){
   let divs = Array(divCount).fill("<div class='loaderDiv'></div>").join("")
  return `<div class="loaderContainer>
            <div class="loader loaderContainer" >
              <div class="ball-scale-ripple-multiple">
                ${divs}
              </div>
            </div>
            <div> Loading... </div>
        </div>`
}