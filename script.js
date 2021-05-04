const inputPointNumber = document.getElementById("input_point_number");
const point_poligon = document.getElementById("point_poligon");
const line_poligon = document.getElementById("line_poligon");
const matricSmezDiv = document.getElementById("matric_smez");
const startPvg = document.getElementById("start_pvg");
const tree = document.getElementById("tree");
let points;

let spisokReber = [];
let spiskiSmez = [];
let matricSmez = [];


function create_Points(numberOfPoints) {
    let createPoint = "";
    points = null;
    line_poligon.innerHTML = "";
    spisokReber = [];
    spiskiSmez = [];
    matricSmez = [];
    for (let i = 0; i < numberOfPoints; ++i) {
        createPoint += `<p class="point"><span>${i + 1}</span></p>`;
    }
    point_poligon.innerHTML = createPoint;

    points = [...document.getElementsByClassName("point")];
    let l = 200;
    let r = l / (2 * Math.sin(Math.PI / numberOfPoints));
    console.log()
    for (let i = 0; i < numberOfPoints; ++i) {
        points[i].coordinateX = (l * numberOfPoints / 5 + 15) + r * Math.cos(Math.PI / numberOfPoints * (8 + 2 * i))
        points[i].coordinateY = (l * numberOfPoints / 5 + 15) + r * Math.sin(Math.PI / numberOfPoints * (8 + 2 * i))
        points[i].style.top = points[i].coordinateX + "px";
        points[i].style.left = points[i].coordinateY + "px";
    }
    createMatricSmeznosti(numberOfPoints);
}

function createMatricSmeznosti(lenth) {
    matricSmezDiv.innerHTML = "";
    for (let i = 1; i <= lenth; ++i) {
        let strokMatric = "<div>";
        for (let j = 1; j <= lenth; ++j) {
            strokMatric += `<input type="number" class="koef_matric_smez" placeholder="a${i}${j}" max="1" min="0">`
        }
        strokMatric += "</div>";
        matricSmezDiv.innerHTML += strokMatric;
    }

}

create_Points(6);

function addLine(Start, End) {
    if (Start > points.length || End > points.length) {
        return console.log("Такой точки нет");
    }
    // Start--;
    // End--;
    const line = document.createElement("div");
    line.className = "line";
    line.start = Start;
    line.end = End;
    line.style.top = points[Start].style.top;
    line.style.left = points[Start].style.left;
    let lineWidth = Math.sqrt((points[Start].coordinateX - points[End].coordinateX) * (points[Start].coordinateX - points[End].coordinateX) + (points[Start].coordinateY - points[End].coordinateY) * (points[Start].coordinateY - points[End].coordinateY)) - 8;
    line.style.width = lineWidth + "px";
    const ches = points[End].coordinateX - points[Start].coordinateX;
    const znam = points[End].coordinateY - points[Start].coordinateY;
    if (znam < 0) {
        line.style.transform = `rotate(${Math.PI + Math.atan(ches / znam)}rad)`;
    } else {
        line.style.transform = `rotate(${Math.atan(ches / znam)}rad)`;
    }
    line_poligon.append(line);
    const elem = new Array(0);
    elem.push(Start + 1);
    elem.push(End + 1);
    spisokReber.push(elem);
}

function readMateicSmez(matric) {
    line_poligon.innerHTML = "";
    spisokReber = [];
    spiskiSmez = [];
    matricSmez = [];
    for (let i = 0; i < matric.length; ++i) {
        for (let j = 0; j < matric[i].length; ++j) { // i / 0
            if (matric[i][j] == 1) {
                addLine(i, j)
            }
        }
    }
}

function convertToMateicSmez() {
    const koefMatricSmez = [...document.getElementsByClassName("koef_matric_smez")];
    const matric = [];
    for (let i = 0; i < Math.sqrt(koefMatricSmez.length); ++i) {
        const matricLine = [];
        for (let j = 0; j < Math.sqrt(koefMatricSmez.length); ++j) {
            if (koefMatricSmez[i * Math.sqrt(koefMatricSmez.length) + j].value === "") {
                matricLine.push(0);
            } else {
                matricLine.push(koefMatricSmez[i * Math.sqrt(koefMatricSmez.length) + j].value);
            }
        }
        matric.push(matricLine);
    }
    console.log(matric);
    readMateicSmez(matric);
}
addLine(1, 2)
addLine(1, 3)
addLine(3, 5)

function task1() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
    const c = document.getElementById("c").value;
    const d = document.getElementById("d").value;

    let numberOfPoints;
    switch (d % 3) {
        case 0:
            numberOfPoints = 10;
            break;
        case 1:
            numberOfPoints = 11;
            break;
        case 2:
            numberOfPoints = 12;
            break;
    }
    create_Points(numberOfPoints);

    for (let i = 0; i < numberOfPoints; ++i) {
        for (let j = 0; j < numberOfPoints; ++j) { //i+1
            if ((((a * i + b * j) / c) % d <= 1) && (i != j)) {
                addLine(i, j);
            }
        }
    }

    console.log("Cписок ребер", spisokReber);
}

function task2(spisok) {
    let spiskiSmezOut = [];
    let matricSmezOut = [];
    for (let i = 0; i < points.length; ++i) {
        matricSmezOut[i] = [];
        for (let j = 0; j < points.length; ++j) {
            matricSmezOut[i][j] = 0;
        }
    }

    spisok.forEach(elem => {
        if (spiskiSmezOut[elem[0]] === undefined) {
            spiskiSmezOut[elem[0]] = [];
        }
        spiskiSmezOut[elem[0]].push(elem[1]);

        matricSmezOut[elem[0] - 1][elem[1] - 1] = 1;
    })

    console.log("Cписок смежности", spiskiSmezOut);
    spiskiSmez = spiskiSmezOut;
    console.log("Матрица смежности(номер = вершина -1)", matricSmezOut);
}


function drowTree(num, ftr) {

    function drowVetka(pointT, parentT) {
        const parent = [...document.getElementsByClassName("parent")];
        const child = [...document.getElementsByClassName("child")];
        if (parentT == 0) {
            tree.innerHTML += `<div class="vetka"><div class="parent">${pointT}</div><div class="child"></div></div>`;
        } else {
            parent.map((elem, index) => {
                if (elem.innerText.substr(0, parentT.toString().length) == parentT) {
                    console.log(pointT, elem.innerText.substr(0, parentT.toString().length))
                    child[index].innerHTML += `<div class="vetka"><div class="parent">${pointT}</div><div class="child"></div></div>`;
                }
            })
        }
        ftr.map((elem, index) => {
            if (elem == pointT) {
                console.log(index, pointT);
                drowVetka(index, pointT);
            }
        })
    }

    tree.innerHTML = "";
    ftr.map((elem, index) => {
        if (elem == 0 && num[index] != 0) {
            drowVetka(index, 0);
        }
    })
}


function pvg(spiski, start) {
    const num = [];
    const ftr = [];
    const tn = [];
    const tk = [];
    let time = 0;
    let k = 1;

    function pvg_(i) {
        time = time + 1;
        tn[i] = time;
        num[i] = k;
        k = k + 1;
        if (spiski[i] !== undefined) {
            spiski[i].forEach(elem => {
                if (num[elem] == 0) {
                    ftr[elem] = i;
                    pvg_(elem);
                }
            })
        }
        time = time + 1;
        tk[i] = time;
    }

    for (let i = 1; i <= points.length; ++i) {
        num[i] = 0;
        ftr[i] = 0;
    }

    if (start == 0) {
        for (let i = 1; i <= points.length; ++i) {
            if (num[i] == 0) {
                pvg_(i);
            }
        }
    } else if (start > 0 && start <= points.length) {
        pvg_(start);
        for (let i = 1; i <= points.length; ++i) {
            if (num[i] == 0) {
                pvg_(i);
            }
        }
    }

    console.log("num", num);
    console.log("ftr", ftr);
    console.log("tn", tn);
    console.log("tk", tk);
    drowTree(num, ftr);
}