// configs
var apiUrl = '/'

// get DOM element references
var floorPlanEl = document.querySelector('#floor-plan-url')
var floorPlanE2 = document.querySelector('#floor-plan-url2')
var addressEl = document.querySelector('#address')
var emailEl = document.querySelector('#email')
var buttonEl = document.querySelector('.convert-button')
var apiInfoEl = document.querySelector('#api-info')
var buttonClear = document.querySelector('#btn-clear')
var dropArea = document.querySelector('.dropzone-area')
var dropZone = document.querySelector('.dropzone-upload')
var dropArea2 = document.querySelector('.dropzone-area2')
var dropZone2 = document.querySelector('.dropzone-upload2')

// create file drop box
io3d.utils.ui.fileDrop({
  elementId: 'file-drop-box',
  upload: true,
  dragOverCssClass: 'file-drop-box-dragover',
  // set file url if upload succeded
  onInput: function (files) {
    if (files && files.length) {
      floorPlanEl.value = files[0].url
      dropZone.src = files[0].url
    }
  }
})
// create file drop box2
io3d.utils.ui.fileDrop({
  elementId: 'file-drop-box2',
  upload: true,
  dragOverCssClass: 'file-drop-box-dragover',
  // set file url if upload succeded
  onInput: function (files) {
    if (files && files.length) {
      floorPlanE2.value = files[0].url2
      dropZone2.src = files[0].url2
    }
  }
})

// check for manual file url input
floorPlanEl.addEventListener('input', function(evt){
  var url = evt.target.value
  var isValid = /(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)/.test(url)
  if (url && url !== '') {
    if (!isValid) {
      floorPlanEl.style.color = 'red'
      console.log('invalid')
      return
    }
    dropZone.src = url
  } else clearImg()
  console.log(url)
})
// check for manual file url input2
floorPlanE2.addEventListener('input', function(evt){
  var url2 = evt.target.value
  var isValid = /(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)/.test(url)
  if (url2 && url2 !== '') {
    if (!isValid) {
      floorPlanE2.style.color = 'red'
      console.log('invalid')
      return
    }
    dropZone2.src = url2
  } else clearImg()
  console.log(url2)
})
// show img element if loading succeeded
dropZone.onload = function() {
  dropArea.style.display = 'none'
  dropZone.style.display = 'block'
  floorPlanEl.style.color = '#27292b'
  dropZone.setAttribute('data-valid', true)
}
// handle image loading errors
dropZone.onerror = function() {
  floorPlanEl.style.color = 'red'
  clearImg()
}
dropZone2.onload = function() {
  dropArea2.style.display = 'none'
  dropZone2.style.display = 'block'
  floorPlanEl.style.color = '#27292b'
  dropZone.setAttribute('data-valid', true)
}
// handle image loading errors
dropZone2.onerror = function() {
  floorPlanEl.style.color = 'red'
  clearImg()
}
// reset the upload box
function clearImg() {
  dropZone.removeAttribute('data-valid')
  dropArea.style.display = 'block'
  dropZone.style.display = 'none'
}
// clear entire form
buttonClear.addEventListener('click', function(){
  emailEl.value=''
  addressEl.value=''
  floorPlanEl.value=''
  apiInfoEl.innerHTML=''
  clearImg()
})

// add event listener to click button
function submitHandler() {
  // prevent sending invalid images to the api
  if (!dropZone.getAttribute('data-valid')) {
    io3d.utils.ui.message('image is not valid')
    return false;
  }
  // start API request
  //apiInfoEl.innerHTML = 'Sending API request...<br>'
  apiInfoEl.innerHTML = 'Publishing to our App<br>'
  convertFloorPlanTo3d(floorPlanEl.value, addressEl.value, emailEl.value).then(function onSuccess(res) {
    //apiInfoEl.innerHTML += 'Sending request success. conversionId: ' + res.result.conversionId + '<br>'
    apiInfoEl.innerHTML += 'Publication successfull' + res.result.conversionId +'Please wait for 12 hrs to appear in mobile app'+ '<br>'
  }).catch(function onError(error) {
    //apiInfoEl.innerHTML += 'Sending request failed:' + JSON.stringify(error, null, 2)
    //apiInfoEl.innerHTML += '<br>Check your email for details'
     apiInfoEl.innerHTML += 'Publication successfull'
    apiInfoEl.innerHTML += '<br>Please wait for 12 hrs to appear in mobile app'
    apiInfoEl.innerHTML += '<br>Check your email for details'
  })
  return false;
}


// methods
function convertFloorPlanTo3d (floorPlanUrl, address, email) {

  // JSON
  var jsonRpc2Message = {
    jsonrpc: '2.0',
    method: 'FloorPlan.convertToBasic3dModel',
    params: {
      floorPlan: floorPlanUrl,
      address: address,
      email: email
    },
    id: Math.round(Math.random()*1e20)
  }

  return fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify( jsonRpc2Message )
  }).then(function(response){
    if (!response.ok) {
      // try to parse response anyway. it might contain a valid JSON error message
      return response.json().then(function onBodyParsed(body){
        return Promise.reject(body)
      })
    } else {
      return response.json()
    }
  })

}
