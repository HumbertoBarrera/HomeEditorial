function abrirContNav(evt, contNombre) {
    var i, links;

    links = document.getElementsByClassName("navCont");
    for (i = 0; i < links.length; i++) {
        links[i].className = links[i].className.replace("active", "");
    }
    abrirCont(evt, contNombre);

    evt.currentTarget.className += " active";
}

function abrirCont(evt, contNombre) {
    evt.preventDefault;

    var page;

    page = document.getElementsByClassName("opEnvio");
    for (i = 0; i < page.length; i++) {
        page[i].style.display = 'none';
    }
    document.getElementById(contNombre).style.display = "block";
}

function confirmarDat(e, cnav, nnav, pag) {
    var val = document.getElementById("opEntrega");

    console.log(document.getElementById("insEntrega"));


    document.getElementById("dirFin").innerHTML = document.getElementById("dirSelecc").innerHTML;
    console.log(document.getElementById("insEntregaFin"))
    if (document.getElementById("insEntrega") != null) {
        document.getElementById("insEnDiv").innerHTML = '<div class="contenido">'+
            '<b> Instrucciones de entrega </b> </div> <div id="insEntregaFin" class="contenido"> '
            + document.getElementById("insEntrega").innerHTML +
            '</div > ';
    }
    document.getElementById("opEnFin").innerHTML = val.options[val.selectedIndex].text;
    document.getElementById("nomTarFin").innerHTML = document.getElementById("nomTar").innerHTML;
    document.getElementById("numTarFin").innerHTML = document.getElementById("numTar").innerHTML;

    navp = document.getElementById(cnav);
    navn = document.getElementById(nnav);

    navp.className = navp.className.replace("active", "");
    navn.className += " active";

    abrirCont(e, pag)
}