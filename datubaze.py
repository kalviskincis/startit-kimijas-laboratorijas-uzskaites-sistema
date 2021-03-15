import sqlite3
import requests
import json

conn = sqlite3.connect('Dati.db')
c = conn.cursor()

# Izveido tabulu
c.execute('CREATE TABLE IF NOT EXISTS Inventars (ID INTEGER PRIMARY KEY, NOSAUKUMS TEXT, TIPS TEXT, APAKSTIPS TEXT, SKAITS INTEGER, KOMENTARI TEXT)')

# ieliek vioenu ieraksta
# c.execute("INSERT INTO Inventars (NOSAUKUMS, TIPS, APAKSTIPS, SKAITS, KOMENTARI) VALUES ('Mērkolba','Trauks','Mērtrauks',2,'Trauks ar tiplumu 300ml, kas paredzēts šķidrumu mērīšanai')")

# c.execute("DELETE FROM Inventars WHERE ID > 1")


# Ievelk inventāru no attāla JSON resursa
inventars_api_res = requests.get(
    'https://pytonc.eu.pythonanywhere.com/api/v1/inventars')
inventars = inventars_api_res.json()
# print(inventars)


# ieliek to DB
# for inv in inventars:
#    c.execute("INSERT INTO Inventars (ID, NOSAUKUMS, TIPS, APAKSTIPS, SKAITS, KOMENTARI) values (?, ?, ?, ?, ?, ?)", [inv['id'], inv['nosaukums'], inv['tips'], inv['apakstips'], inv['skaits'], inv['komentari']])

# meklējam un rādām kādus konkrētus ierakstus no DB. Dažadas pieejas.

# t = ('trauks',)
# t = ('%rauks',)
t = ('Trauks', 'trauks',)

# c.execute('SELECT * FROM Inventars WHERE TIPS=?', t)
# c.execute('SELECT * FROM Inventars WHERE TIPS LIKE ?', t)
c.execute('SELECT * FROM Inventars WHERE TIPS IN (?,?)', t)

# beigas atlasītu ierakstu rādīšanai
# c.execute("SELECT * FROM Inventars")


# Ja ieraksts tabulā ir nepareizs un jālabo
c.execute("UPDATE Inventars SET TIPS = 'trauki' WHERE ID = 1")

# Jauna tabula ar lietotājiem. Tie būs no lokāla JSON faila + citādaks kolonu uztaisītājs
# c.execute('CREATE TABLE IF NOT EXISTS Users (id TEXT RIMARY KEY, vards TEXT, uzvards TEXT, loma TEXT, parole TEXT, Komentāri TEXT)')

# users_json = json.load(open('dati/users.json'))

# kolonas = ['id', 'vards', 'uzvards', 'loma', 'parole', 'Komentāri']

# for data in users_json['users']:
#    dati = tuple(data[c] for c in kolonas)
#    c.execute("INSERT INTO  Users values (?,?,?,?,?,?)", dati)


# individ uzdevumi 2

# datu harmonizēšana

# c.execute('SELECT tips FROM Inventars')
# print(c.fetchall())
c.execute("UPDATE Inventars SET TIPS = 'trauki' WHERE ID = 1")
c.execute("SELECT * FROM Inventars")
print(c.fetchall())

# jauna tabula vielas
c.execute('CREATE TABLE IF NOT EXISTS Vielas (ID INTEGER PRIMARY KEY AUTOINCREMENT, NOSAUKUMS TEXT, TIPS TEXT, APAKSTIPS TEXT, SKAITS INTEGER, KOMENTARI TEXT, DAUDZUMS INTEGER, MERVIENIBAS TEXT)')
vielas_api_res = requests.get(
    'https://pytonc.eu.pythonanywhere.com/api/v1/vielas')
vielas = vielas_api_res.json()
print(vielas)

for i in range(len(vielas)):
    v = vielas[i]
    # izmantoju NULL un vērtību rinda vienu lauku mazāk, lai ID pats aizpildītos
    # pirms tam taisīju, ka tur ieliek Python i+1. Es nezinu, kā bija domāts.
    c.execute("INSERT INTO Vielas (ID, NOSAUKUMS, TIPS, APAKSTIPS, SKAITS, KOMENTARI, DAUDZUMS, MERVIENIBAS) values (null, ?, ?, ?, ?, ?, ?, ?)", [v['nosaukums'], v['tips'], v['apakstips'], v['skaits'], v['komentari'], v['daudzums'], v['mervienibas']])

c.execute("SELECT * FROM Vielas")
print(c.fetchall())



conn.commit()

c.close()
conn.close()
