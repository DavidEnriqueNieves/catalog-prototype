import mysql.connector
import json
# Some other example server values are
# server = 'localhost\sqlexpress' # for a named instance
# server = 'myserver,port' # to specify an alternate port

def simplify(text):
        import unicodedata
        try:
            text = unicode(text, 'utf-8')
        except NameError:
            pass
        text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode("utf-8")
        return str(text)


database = 'prototype' 
username = 'debbido' 
password = 'debbido677357' 

table_name = database + "_table"

cnx  = mysql.connector.connect(
          host="localhost",
            user=username,
              passwd=password,
              database="prototype"
              )


cursor = cnx.cursor()

query = ("SELECT DISTINCT Genero FROM " + table_name)


cursor.execute(query)
subgen_Tree = {'1':"Herramientas Mecanicas", '2':"Micelaneos", '3':"Electricidad", '4':"Ebanisteria", '5':"Equipos", '6':"Pintura", '7':"Ferreteria General", '8':"Herramientas Electricas", '9':"Herreria", '10':"Jardineria", '11':"Plomeria", '12' : "Pesca", '0' : "Extra", " ":"??"}
root = {"name" : "03 - Ferreteria", "code" : "3" , "_children" : []}

for genero in cursor:
    print(genero)
    cursor2 = cnx.cursor(buffered=True)
    query = ("SELECT DISTINCT SubGenero FROM " + table_name + " WHERE Genero=\"" + genero[0] + "\"")
    cursor2.execute(query)

    generoArr=[]
    for subGenero in cursor2:
        subGenTree={"name": str(subGenero[0]) + " - " + subgen_Tree[str(subGenero[0])], "code" : str(subGenero[0]), "_children":[]}
        print(subGenero[0])
        cursor3 = cnx.cursor(buffered=True)
        query = ("SELECT DISTINCT Producto FROM " + table_name + " WHERE Genero=\"" + genero[0] + "\" AND SubGenero=\"" + subGenero[0]+ "\"")
        cursor3.execute(query)
        for pIter, prod in enumerate(cursor3):
            subGenTree["_children"].append({"name" : genero[0].zfill(2) + subGenero[0].zfill(2) + str(pIter).zfill(2) + " - " + simplify(prod[0]), "code" : prod[0]})
        cursor3.close()
        generoArr.append(subGenTree)
        print("SubGenTree is " + str(subGenTree))
    root["_children"] = generoArr
    cursor2.close()

print("Genero Arr")
print(generoArr)

print(root)

with open('sql_tree.json', 'w') as outfile:
        json.dump(root, outfile, indent=4)
cursor.close()
cnx.close()
