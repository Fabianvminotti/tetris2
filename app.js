
//Todo este bloque empieza con la carga de la pagina
document.addEventListener('DOMContentLoaded',(e)=>{
	
	const grid = document.querySelector(".grid");
	let tetris = document.getElementById("tetris");
	let body = document.getElementById("body");
	//aca se seleccionan TODOS los cuadrados y se agrupan en un array (dandole asi un index)
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startButton = document.querySelector('#start-button');
	const ancho = 10; /*numero de cuadrados que tiene de ancho del tablero*/
	let nextRandom = 0
	let timerId;
	const colors = [
    '#034732',
    '#008148',
    '#C6C013',
    '#EF8A17',
    '#EF2917'
  ]
  	let score=0;




//Ahora dentro del bloque se contruyen la fichas con sus rotaciones
	const piezaL = [[1, ancho+1, 2*ancho+1,2],
					[ancho, ancho+1, ancho+2, 2*ancho+2],
					[2*ancho, 1, ancho+1, 2*ancho+1],
					[ancho, 2*ancho, 2*ancho+1, 2*ancho+2],
					];

	const piezaZ = [[2*ancho,ancho+1, 2*ancho+1,ancho+2],
					[0, ancho, ancho+1, 2*ancho+1],
					[2*ancho,ancho+1, 2*ancho+1,ancho+2],
					[0, ancho, ancho+1, 2*ancho+1]
					];

	const piezaT = [[1, ancho, ancho+1, ancho+2],
					[1, ancho+1, 2*ancho+1,ancho+2],
					[ancho, ancho+1, ancho+2, 2*ancho+1],
					[1, ancho, ancho+1, 2*ancho+1]
					];

	const piezaI = [[1, ancho+1, 2*ancho+1,3*ancho+1],
					[ancho, ancho+1, ancho+2, ancho+3],
					[1, ancho+1, 2*ancho+1,3*ancho+1],
					[ancho, ancho+1, ancho+2, ancho+3]
					];

	const piezaO = [[1, 2, ancho+2, ancho+1],
					[1, 2, ancho+2, ancho+1],
					[1, 2, ancho+2, ancho+1],
					[1, 2, ancho+2, ancho+1]
					];

//se arma un array con las piezas y sus posiciobnes
	const piezas = [piezaL, piezaO, piezaT, piezaZ, piezaI ];
//con esto se elige aleatoriamente la pieza que va a aparecer
// random te devuelve un valor entre 0 y 1, este se multiplica por la longitud del array de las piezas (que son cinco piezas) y el floor es para truncar el munero al entero
	let random = Math.floor(Math.random()*piezas.length);
	let current = piezas[random][0]; //current es el tipo y rotacion de la pieza seleccionada

	let currentPosition = 4; //esta es la posicion de la pieza cuando aparece (cuatro piezas desde el margen izquierdo en este caso)
	let currentRotation = 0; 

// con esta parte se dibujan las piezas agregando un tipo de clase a los squareseeccionados

	function draw () {
		current.forEach(index =>{
				squares[currentPosition+index].classList.add('pieza')
			squares[currentPosition + index].style.backgroundColor = colors[random]

		})
			

	}




function undraw () {
		current.forEach(index =>{
			squares[currentPosition+index].classList.remove('pieza')
			squares[currentPosition + index].style.backgroundColor =""});
	}


//aca se define el intervalo de tiempo para que redibuje la pieza un cuadrado mas abajo
//timer ejecura movedown cada 1000 milisegundos
//let timerId = setInterval(moveDown,1000)

//aca se asignan las teclas para moverse y rotar #####################33

function control (e) {
	if(e.keyCode === 37){ //37 es el codigo de JS para la tecla de la izquierda (left arrow)
		moveLeft()
	} else if(e.keyCode === 38){//es el codigo para flecha de arriba
			rotar()
	} else if(e.keyCode === 39){
			moveRigth()
	} else if(e.keyCode === 40){
		moveDown() //esta es la misma funcion que esta en el timer.
	}
}

document.addEventListener('keyup', control)




//move down es la funcion que borra y redibuja ams abajo la pieza
function moveDown(){
	undraw()
	currentPosition += ancho //le suma un ancho entero a las piezas
	draw()
	parar()
}


//se arma una funcion para parar las piezas 


function parar(){
	/*Aca dice que si en los squares que hay una linea por debajo de la pieza
	donde exista la clase que se llama "parar", le agrega a los squeares de la posicion
	actul la clase "parar"
	el comando .some devuelve un true si lo que esta en parentesis es verdadero dentro del array*/

	if(current.some(index => squares[currentPosition + index + ancho].classList.contains('parar'))){
		current.forEach(index=> squares[currentPosition+index].classList.add('parar'))
	//ahora aca se crea una nueva pieza al principio
	//se hace lo mismo que se hizo en el random

			random = nextRandom
      		nextRandom = Math.floor(Math.random() * piezas.length)
			current = piezas[random][currentRotation];
			currentPosition=4
			draw() //y aca se dibuja devuelta
			displayShape() //esto dibuja la siguiente figura
			addScore()
	}
}

//aca se determina el movimiento a la izquierda, siempre y cuando no llegue al margen izquierdo

function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % ancho === 0)
    if(!isAtLeftEdge) currentPosition -=1 //el ! quiere decir que no es igual esa variable
    if(current.some(index => squares[currentPosition + index].classList.contains('parar'))) {
      currentPosition +=1 //esto es para que cuando hay un "parar" al lado se cancele la accion del if anterior sumando (o restando) un valor al current position
    }
    draw()
  }


function moveRigth() {
    undraw()
    const isAtRigthEdge = current.some(index => (currentPosition + index) % ancho === ancho-1)
    if(!isAtRigthEdge) currentPosition +=1 //el ! quiere decir que no es igual esa variable
    if(current.some(index => squares[currentPosition + index].classList.contains('parar'))) {
      currentPosition -=1
    }
    draw()
  }

//Rotar las piezas

function rotar () {
	undraw()
	currentRotation++ //el ++ es un perador que le sula uno mas a la variables
	if (currentRotation===current.length) {
		currentRotation=0 /*esto es que para q cuando se llegue a las cuatro rotacones, se vuelva a la primera*/
	}
	current=piezas[random][currentRotation] //selecciona los elementos del array rotado con current rotario
	draw()
}


// esot es para programar la visualizacion del roximo bloque 

let displaySquares = document.querySelectorAll('.mini-grid div');
let displayWidth = 4 //ancho del uadradito del display
let displayIndex = 0

// se reescriben las piezas reemplazando ancho por displarAncho (para adaptarse a la nueva pantallita)
  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('pieza')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add("pieza");
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
  }

 

//ahora se le da funcionalidad al boton de inicio pausa

startButton.addEventListener('click', () => {
    if (timerId) {//si esta corriendo lo pausa, si no esta corriendo lo inicia
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*piezas.length)
      displayShape()
      draw() ;
    }
  })

 function addScore() {
    for (let i = 0; i < 199; i +=ancho) { //va revisando todas las filas una por una
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('parar'))) {
        score +=10 //cuando todos los elementos de una fila contienen la clase parar, suma 10 puntos
        scoreDisplay.innerHTML = score
        row.forEach(index => {// saca la clase parar para que no moleste despues
          squares[index].classList.remove('parar')
          squares[index].classList.remove('pieza')// remueve el formato
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, ancho) //quita la fila del conjunto de squares
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell)) //agrega celdas al prncipio, creo
      }
    }
  }


function gameOver() {//si apensas aparece la pieza coincide con squares con clase parar, deja de correr el tiempo y muestra la plabra end
    if(current.some(index => squares[currentPosition + index].classList.contains('parar'))) { 
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }


function changeColorTetris(){
	colorRandom=Math.floor(Math.random()*colors.length);
 	tetris.style.color = colors[colorRandom];
}

timerColorTetris=setInterval(changeColorTetris,3000)

function changeColorFondo(){
	colorRandom=Math.floor(Math.random()*colors.length);
 	body.style.backgroundColor = colors[colorRandom];
}

timerColorFondo=setInterval(changeColorFondo,3000)






})







