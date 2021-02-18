window.addEventListener('load',()=>{
  registerSW();
})

async function registerSW(params) {
  if('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker is registered', registration);
    })
    .catch(err => {
      console.error('Registration failed:', err);
    });
  } 
}
// Check service worker

// let deferredPrompt;
// let btnAdd = document.getElementById('btnAdd');
// let txtBrowser = document.getElementById('txtBrowser');
// let txtMobile = document.getElementById('txtMobile');
// let divAdd = document.querySelector('.divAdd');
// let divInstalled = document.querySelector('.divInstalled');
// let PWADisplay = getPWADisplayMode();

// showInstalledText()
// Check if user doesnt install apps
// window.addEventListener('beforeinstallprompt', (e) => {
//   // e.preventDefault();
//   // Stash the event so it can be triggered later.
//   deferredPrompt = e;
//   divInstalled.style.display = 'none';
//   // showInstallPromotion();
//   console.log('Apps not installed')

//   // Button add apps clicked
//   btnAdd.addEventListener('click', async (e) =>{
    
//     // Show Prompt
//     deferredPrompt.prompt();
//     // Check user response
//     const { outcome } = await deferredPrompt.userChoice;
//     if(outcome === 'accepted'){
//       divAdd.style.display = 'none';
//     }
//     deferredPrompt = null;
    
//   })
// });

// // If user install the apps
// window.addEventListener('appinstalled', () => {
//   // Hide the app-provided install promotion
//   hideInstallPromotion();
//   // Clear the deferredPrompt so it can be garbage collected
//   deferredPrompt = null;
//   // Show Text
//   showInstalledText()
//   // Optionally, send analytics event to indicate successful install
//   console.log('PWA was installed');
// });



// Show Install Div
function showInstallPromotion(){
  // Show button for add apps
  divAdd.style.display = 'block';
}

// Hide Install Div
function hideInstallPromotion(){
  // Hide button for add apps
  divAdd.style.display = 'none';
}

function showInstalledText() {
  divInstalled.style.display = 'block';
  if(PWADisplay == 'browser') txtBrowser.style.display = 'block';
  if(PWADisplay == 'mobile') txtMobile.style.display = 'block';
}


function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}