function getListPixel(){
	fetch('/listPixels')
    .then( response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err));
}

function splitData(data){
    data.split("*");
    
}