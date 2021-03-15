async function raditNoliktavasDatus(tipsAtlase)
{
 
  let jsonVielas = Array();
  let jsonInventars = Array();

  if(tipsAtlase==undefined)
  {
    let vielasNoServera = await fetch('/api/v2/vielas');
    jsonVielas = await vielasNoServera.json();
    
    let msg1 = jsonVielas[jsonVielas.length-1];
    jsonVielas.pop();
    console.log(msg1);

    jsonVielas = pievienotIerakstuParKategoriju(jsonVielas, 'viela');
    
    let inventarsNoServera = await fetch('/api/v2/inventars');
    jsonInventars = await inventarsNoServera.json();

    let msg = jsonInventars[jsonInventars.length-1];
    jsonInventars.pop();
    console.log(msg);

    jsonInventars = pievienotIerakstuParKategoriju(jsonInventars, 'inventars');
  }
  else if(tipsAtlase=='viela')
  {
    //jsonVielas = await iegutDatusNoApi('/api/v1/vielas');
    let vielasNoServera = await fetch('/api/v2/vielas');
    jsonVielas = await vielasNoServera.json();

    let msg1 = jsonVielas[jsonVielas.length-1];
    jsonVielas.pop();
    console.log(msg1);

    jsonVielas = pievienotIerakstuParKategoriju(jsonVielas, 'viela');
  }
  else if(tipsAtlase=='aprikojums')
  {
    //jsonInventars = await iegutDatusNoApi('/api/v1/inventars');
    let inventarsNoServera = await fetch('/api/v2/inventars');
    jsonInventars = await inventarsNoServera.json();

    let msg = jsonInventars[jsonInventars.length-1];
    jsonInventars.pop();
    console.log(msg);
    
    jsonInventars = pievienotIerakstuParKategoriju(jsonInventars, 'inventars');
  }


  let datiNoliktava = jsonVielas.concat(jsonInventars);
  console.log(datiNoliktava);

  let tabula = document.querySelector('#pub_data tbody');
  tabula.innerHTML = '';

  //datiNoliktava.length - saņemto ierakstu skaits
  //datiNoliktava['0'] - pirmais ieraksts
  //datiNoliktava['0']['Nosaukums'] - pirmā ieraksta nosaukums
  
  for (i = 0; i < datiNoliktava.length; i++)
  {

      kategorija = datiNoliktava[i]['kategorija'];


      tabula.innerHTML = tabula.innerHTML+`
      <tr id="`+kategorija+datiNoliktava[i]['id']+`">
      <td> `+datiNoliktava[i]['id']+` </td>
      <td> `+datiNoliktava[i]['nosaukums']+` </td>
      <td> `+datiNoliktava[i]['tips']+` </td>
      <td> `+datiNoliktava[i]['apakstips']+` </td>
      <td> `+datiNoliktava[i]['skaits']+` </td>
      <td> `+datiNoliktava[i]['daudzums']+ ' ' +datiNoliktava[i]['mervienibas']+` </td>      
      <td> `+datiNoliktava[i]['komentari']+` </td>
      <td onclick="dzestVieluAprikojumu(`+datiNoliktava[i]['id']+`,'`+kategorija+`')"> ❌ </td>
      </tr>`;
      


  }//loop beigas
  


}//beidzas raditNoliktavasDatus(dati)









async function pievienotVieluAprikojumu()
{

let requestBodyJson = {
              "apakstips": document.querySelector('#apakstips').value,
              "daudzums": parseInt(document.querySelector('#daudzums').value),
              "komentari": document.querySelector('#komentari').value,
              "mervienibas": document.querySelector('#mervienibas').value,
              "nosaukums": document.querySelector('#nosaukums').value,
              "skaits": parseInt(document.querySelector('#skaits').value),
              "tips": document.querySelector('#tips').value
              };
let requestBodyString = JSON.stringify(requestBodyJson);


let request = await fetch('/api/v1/'+document.querySelector('#kategorija').value,
         		{
            method:"POST",
  					headers:
  					{
            'X-API-KEY': 'asdf',
            'Content-Type': 'application/json'
            },
            body:requestBodyString
        		});

let atbilde = await request.json();
//console.log(atbilde);
  
document.querySelector('#atbilde').innerHTML=JSON.stringify(atbilde);
  
}//beigas pievienotVieluAprikojumu();







function pievienotIerakstuParKategoriju(json, tips)
{
  for (i = 0; i < json.length; i++)
  {
    json[i]['kategorija']=tips;
  }

  return json;
}







async function dzestVieluAprikojumu(id,kategorija)
{

  
  if (confirm('Dzēst?')) 
  {
    let request = await fetch('/api/v1/'+kategorija+'/'+id+'/dzest',
                {
                method:"POST",
                headers: {
                'X-API-KEY': 'asdf',
                'Content-Type': 'application/json'
                }
            });
    
      let atbilde = await request.json();

      alert('Atbilde no servera: izdzēsts ieraksts `'+kategorija+'` ar id:'+atbilde);

      document.querySelector('#'+kategorija+atbilde).style.display='none';
	}
  
}